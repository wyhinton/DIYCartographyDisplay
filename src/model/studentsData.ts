import {
  Action,
  action,
  thunk,
  Thunk,
  debug,
  Computed,
  computed,
} from "easy-peasy";
import {
  AuthorDisciplineFilter,
  MapSubTopic,
  ThemeCategoryFilter,
  FilterGroup,
  CustomError,
} from "../enums";
import type { GoogleSheet, RawStudentRowValues } from "./sheet_data_models";
import { getSheet } from "./sheet_data_models";
import type { FilterOption } from "./types";
import { ValidationError } from "../validation";
import { arraysEqual } from "../utils";
import { StudentClass, SeriesId } from "../classes/student";
import { StudentStats } from "../classes/student_stats";
import { LightBoxData } from "../classes/lightbox";
import SHEET_KEY from "../static/sheetKey";

export interface GalleryImage {
  src: string;
  thumbnail: string;
  isSelected: boolean;
  caption: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  tags: MapMetadata[];
}

export interface MapMetadata {
  author: string;
  discipline: AuthorDisciplineFilter;
  subtopic: MapSubTopic;
  theme: ThemeCategoryFilter;
  year: any;
}

//TODO: EXPLAIN WHY THIS IS NECESSARY
export interface YearSection {
  years: string[];
  discipline: string[];
}

export interface FilterResult {
  filter_func: (gi: GalleryImage) => boolean;
  filters: FilterOption[];
}

export interface MapDataModel {
  //STATE
  /**Images visible in the image gallery */
  activeImages: GalleryImage[];
  /**Filter function used to derive activeImages as a subset of allImages */
  filter: FilterOption[];
  filterFunction: (gi: GalleryImage) => boolean;
  galleryImages: GalleryImage[];
  /**Active group filter, for filterting a group of related maps */
  groupFilter: FilterGroup;
  /**Data used in the modal image gallery lightbox */
  activeLightBoxData: LightBoxData;
  /**True when all gallery images + google sheets have been loaded */
  loaded: boolean;
  /**Statistic derived from loaded students. Describes how many students fall into the different categories */
  studentStats: StudentStats | undefined;
  /**List of all the students from all course years */
  studentsClass: StudentClass[];
  /** */
  studentGoogleSheets: GoogleSheet<RawStudentRowValues>[];

  //COMPUTED FROM EXTERNAL DATA
  computedActiveImages: Computed<MapDataModel, GalleryImage[]>;
  computedAvailableGalleryImages: Computed<MapDataModel, GalleryImage[]>;

  //THUNKS - FETCH EXTERNAL
  fetchStudentSheets: Thunk<MapDataModel>;

  //THUNKS - UI
  thunkSetFilter: Thunk<MapDataModel, FilterOption>;
  processRawStudentSheets: Thunk<MapDataModel, RawStudentRowValues[][]>;

  //STORE RAW GOOGLE SHEETS INFO FOR DEBUGGING
  setStudentGoogleSheets: Action<
    MapDataModel,
    GoogleSheet<RawStudentRowValues>[]
  >;
  mapSpreadsheet: RawStudentRowValues[];

  //VALIDATION
  validationErrors: ValidationError[];

  //SETTERS
  applyFilter: Action<MapDataModel, FilterResult>;
  setStudentStats: Action<MapDataModel, StudentStats>;
  setActiveFilter: Action<MapDataModel, FilterOption[]>;
  setAllStudents: Action<MapDataModel, StudentClass[]>;
  setFilterFunction: Action<MapDataModel, any>;
  setGalleryImages: Action<MapDataModel, GalleryImage[]>;
  setGroupFiler: Action<MapDataModel, FilterGroup>;
  setLightboxData: Action<MapDataModel, GalleryImage>;
  setLoaded: Action<MapDataModel, boolean>;
  setValidationErrors: Action<MapDataModel, ValidationError[]>;
}
const defaultFilter = (gi: GalleryImage) => {
  return true;
};

const studentsData: MapDataModel = {
  filter: [],
  studentsClass: [],
  activeLightBoxData: new LightBoxData(),
  groupFilter: FilterGroup.NONE,
  activeImages: [],
  filterFunction: defaultFilter,
  computedActiveImages: computed((state) => {
    if (state.filter.length > 0) {
      return state.computedAvailableGalleryImages.filter(state.filterFunction);
    } else {
      return state.computedAvailableGalleryImages;
    }
  }),
  galleryImages: [],
  loaded: false,
  mapSpreadsheet: [],
  studentStats: undefined,
  validationErrors: [],
  studentGoogleSheets: [],
  setAllStudents: action((state, payload) => {
    state.studentsClass = payload;
  }),
  processRawStudentSheets: thunk(async (actions, payload) => {
    const allRows = payload.flat();
    const allStudents = allRows.map((r) => new StudentClass(r));
    const goodConversions: Promise<HTMLImageElement>[] = [];

    // function generateGalleryImage ()
    allStudents.forEach((element) => {
      const res = element.requestGalleryThumbnail(SeriesId.series0101);
      // const res2 = element.requestGalleryThumbnail(SeriesId.series0102);
      // console.log(res2);
      if (
        !(Object.values(CustomError) as string[]).includes(
          res as keyof typeof CustomError
        )
      ) {
        goodConversions.push(res as Promise<HTMLImageElement>);
      }
    });
    const requestResults = ingestPromises<HTMLImageElement>(goodConversions);
    requestResults.then((value) => {
      const imgs = value.results;
      const newStudents: StudentClass[] = [];
      imgs.forEach((img, i) => {
        if (img) {
          allStudents[i].createGalleryImage(
            [SeriesId.series0101, SeriesId.series0201],
            img
          );
          // allStudents[i].createGalleryImage(SeriesId.series0201, )
          newStudents.push(allStudents[i]);
        }
      });
      console.log(newStudents);
      const studentStats = new StudentStats(newStudents);
      console.log(studentStats);
      actions.setAllStudents(newStudents);
      actions.setLoaded(true);
      actions.setStudentStats(studentStats);
    });
  }),
  setStudentStats: action((state, payload) => {
    state.studentStats = payload;
  }),
  setFilterFunction: action((state, payload) => {
    console.log("setting filter func");
    state.filterFunction = payload;
  }),
  computedAvailableGalleryImages: computed((state) => {
    return state.studentsClass.map((s) => s.getGalleryImages()).flat();
  }),
  setValidationErrors: action((state, payload) => {
    state.validationErrors = payload;
  }),
  fetchStudentSheets: thunk(async (actions, _payload) => {
    const test2016 = getSheet<RawStudentRowValues>(SHEET_KEY, 2);
    const test2018 = getSheet<RawStudentRowValues>(SHEET_KEY, 3);
    const test2020 = getSheet<RawStudentRowValues>(SHEET_KEY, 4);
    const studentSheetRequests = [test2016, test2018, test2020];
    const sheetRequestResults =
      ingestPromises<GoogleSheet<RawStudentRowValues>>(studentSheetRequests);
    sheetRequestResults.then((results) => {
      const succesfulSheets = results.results;
      const studentRowValues = results.results.map((r) => r.data);
      actions.setStudentGoogleSheets(succesfulSheets);
      actions.processRawStudentSheets(studentRowValues);
    });
  }),
  setStudentGoogleSheets: action((state, sheets) => {
    state.studentGoogleSheets = sheets;
  }),
  setGalleryImages: action((state, payload) => {
    state.galleryImages = payload;
  }),
  applyFilter: action((state, filterResult) => {
    //if the current active filter is the same as filterResult
    if (arraysEqual(filterResult.filters, debug(state.filter))) {
      //then reset the fitler
      state.filter = [];
      state.activeImages = state.galleryImages;
      console.log("supplied filter twice, removing filter");
    } else {
      state.activeImages = state.galleryImages.filter(filterResult.filter_func);
      state.filter = filterResult.filters;
    }
  }),
  setGroupFiler: action((state, groupFilter) => {
    console.log("setting group filter", groupFilter);
    if (state.groupFilter === groupFilter) {
      console.log("GOT SAME");
      state.groupFilter = FilterGroup.NONE;
      state.filter = [];
    } else {
      state.groupFilter = groupFilter;
    }
  }),
  thunkSetFilter: thunk((actions, filter) => {
    console.log("doing thunk set filter");
    const groupOptions = Object.values(FilterGroup);
    //if we click on a FilterGroup selector, like Built, Economic, Natural, that will need to filter for multiple sub-categories
    if (groupOptions.includes(filter as FilterGroup)) {
      const groupFilter = getGroupFilter(filter);
      actions.setFilterFunction(groupFilter.filter_func);
      actions.applyFilter(groupFilter);
      actions.setGroupFiler(filter as FilterGroup);
      //else get a filter function for just a single property
    } else {
      const singleFilter = getSingleFilter(filter);
      actions.setFilterFunction(singleFilter.filter_func);
      actions.applyFilter(singleFilter);
    }
  }),
  setActiveFilter: action((state, activeFilter) => {
    console.log(activeFilter);
    state.filter = activeFilter;
  }),
  setLightboxData: action((state, item) => {
    console.log(item);
    const tagData: MapMetadata = item.tags[0];
    const selectedStudent = state.studentsClass.filter(
      (s) => s.author === tagData.author
    )[0];
    console.log(debug(selectedStudent));
    state.activeLightBoxData.set_student(selectedStudent);
  }),
  setLoaded: action((state, contentIsLoaded) => {
    state.loaded = contentIsLoaded;
  }),
};

function ingestPromises<T>(promises: Promise<T>[]): Promise<{
  results: T[];
  failures: PromiseRejectedResult[];
}> {
  const goodResults: T[] = [];
  const badResults: PromiseRejectedResult[] = [];
  return Promise.allSettled(promises).then((values) => {
    values.forEach((v) => {
      if (v.status == "rejected") {
        badResults.push(v);
      } else {
        if (v.value) {
          console.log(v.value);
          goodResults.push(v.value);
        }
      }
    });
    return {
      results: goodResults,
      failures: badResults,
    };
  });
}

function getSingleFilter(f: FilterOption): FilterResult {
  let filterFunc = (_gi: GalleryImage) => {
    true;
  };

  if (Object.values(MapSubTopic).includes(f as MapSubTopic)) {
    filterFunc = function (val: GalleryImage) {
      return val.tags[0].subtopic === f;
    };
  } else if (
    Object.values(ThemeCategoryFilter).includes(f as ThemeCategoryFilter)
  ) {
    filterFunc = function (val: GalleryImage) {
      return val.tags[0].theme === f;
    };
  } else if (
    Object.values(AuthorDisciplineFilter).includes(f as AuthorDisciplineFilter)
  ) {
    f = f as AuthorDisciplineFilter;
    const discipline = f.split("_")[0];
    const year = f.split("_")[1];
    filterFunc = function (val: GalleryImage) {
      return val.tags[0].year === year && val.tags[0].discipline === discipline;
    };
  }
  return {
    filter_func: filterFunc,
    filters: [f],
  } as FilterResult;
}

///END MODEL
//TODO: RENAME
function quickGet(group: FilterGroup, cat: keyof MapMetadata): FilterResult {
  const filter_set = filterGroupToSet(group);
  if (
    group === FilterGroup.STUDENTS_2016 ||
    group === FilterGroup.STUDENTS_2018 ||
    group === FilterGroup.STUDENTS_2020
  ) {
    const splits = getYearDiscipline(filter_set as AuthorDisciplineFilter[]);
    const filter_func = function (val: GalleryImage) {
      return splits.years.includes(val.tags[0].year);
    };
    return {
      filter_func: filter_func,
      filters: filter_set,
    } as FilterResult;
  } else {
    const filter_func = function (val: GalleryImage) {
      return filter_set.includes(val.tags[0][cat]);
    };
    return {
      filter_func: filter_func,
      filters: filter_set,
    } as FilterResult;
  }
}

function getGroupFilter(f: FilterOption): FilterResult {
  let filterResult = {
    filter_func: function (gi: GalleryImage) {
      return true;
    },
    filters: [],
  } as FilterResult;

  switch (f) {
    case FilterGroup.ACCESS_THEME:
      filterResult = quickGet(
        FilterGroup.ACCESS_THEME,
        "theme" as keyof MapMetadata
      );
      break;
    case FilterGroup.EQUITY_THEME:
      filterResult = quickGet(
        FilterGroup.EQUITY_THEME,
        "theme" as keyof MapMetadata
      );
      break;
    case FilterGroup.DIVERISTY_THEME:
      filterResult = quickGet(
        FilterGroup.DIVERISTY_THEME,
        "theme" as keyof MapMetadata
      );
      break;
    case FilterGroup.STUDENTS_2016:
      filterResult = quickGet(
        FilterGroup.STUDENTS_2016,
        "year" as keyof MapMetadata
      );
      break;
    case FilterGroup.STUDENTS_2018:
      filterResult = quickGet(
        FilterGroup.STUDENTS_2018,
        "year" as keyof MapMetadata
      );
      break;
    case FilterGroup.STUDENTS_2020:
      filterResult = quickGet(
        FilterGroup.STUDENTS_2020,
        "year" as keyof MapMetadata
      );
      break;
    case FilterGroup.BUILT_TOPIC:
      filterResult = quickGet(
        FilterGroup.BUILT_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
    case FilterGroup.ECONOMIC_TOPIC:
      filterResult = quickGet(
        FilterGroup.ECONOMIC_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
    case FilterGroup.NATURAL_TOPIC:
      filterResult = quickGet(
        FilterGroup.NATURAL_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
    case FilterGroup.POLITICAL_TOPIC:
      filterResult = quickGet(
        FilterGroup.POLITICAL_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
    case FilterGroup.SOCIAL_TOPIC:
      filterResult = quickGet(
        FilterGroup.SOCIAL_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
  }
  return filterResult;
}

function getYearDiscipline(author_enum: AuthorDisciplineFilter[]): YearSection {
  const splits = author_enum.map((a) => a.split("_"));
  const yddata: YearSection = {
    years: [],
    discipline: [],
  };
  splits.forEach((s: string[]) => {
    yddata.discipline.push(s[0]);
    yddata.years.push(s[1]);
  });
  return yddata;
}

function filterGroupToSet(groupEnum: FilterGroup): FilterOption[] {
  let subFilters: FilterOption[] = [];
  switch (groupEnum) {
    case FilterGroup.STUDENTS_2016:
      subFilters = [
        AuthorDisciplineFilter.ARTDESIGN_2016,
        AuthorDisciplineFilter.ARCHITECTURE_2016,
        AuthorDisciplineFilter.OTHER_2016,
        AuthorDisciplineFilter.LANDSCAPE_2016,
      ];
      break;
    case FilterGroup.STUDENTS_2018:
      subFilters = [
        AuthorDisciplineFilter.ARTDESIGN_2018,
        AuthorDisciplineFilter.ARCHITECTURE_2018,
        AuthorDisciplineFilter.OTHER_2018,
        AuthorDisciplineFilter.LANDSCAPE_2018,
      ];
      break;
    case FilterGroup.STUDENTS_2020:
      subFilters = [
        AuthorDisciplineFilter.ARTDESIGN_2020,
        AuthorDisciplineFilter.ARCHITECTURE_2020,
        AuthorDisciplineFilter.OTHER_2020,
        AuthorDisciplineFilter.LANDSCAPE_2020,
      ];
      break;
    case FilterGroup.BUILT_TOPIC:
      subFilters = [
        MapSubTopic.INFRASTR,
        MapSubTopic.BUILDINGS,
        MapSubTopic.TRANSPORTATION,
      ];
      break;
    case FilterGroup.ECONOMIC_TOPIC:
      subFilters = [
        MapSubTopic.WORK,
        MapSubTopic.PROPERTY,
        MapSubTopic.URBANDEV,
      ];
      break;
    case FilterGroup.NATURAL_TOPIC:
      subFilters = [
        MapSubTopic.GREENSPACE,
        MapSubTopic.POLLUTION,
        MapSubTopic.HYDROLOGY,
      ];
      break;
    case FilterGroup.POLITICAL_TOPIC:
      subFilters = [
        MapSubTopic.CIVICENG,
        MapSubTopic.GOVERMENT,
        MapSubTopic.POLICY,
      ];
      // my_filters = [MapSubTopic.CIVICENG, MapSubTopic.GOV, MapSubTopic.POLICY];
      break;
    case FilterGroup.SOCIAL_TOPIC:
      subFilters = [
        MapSubTopic.EDUCATION,
        MapSubTopic.HEALTHSAFETY,
        MapSubTopic.RACEGEN,
      ];
      break;
    case FilterGroup.EQUITY_THEME:
      subFilters = [ThemeCategoryFilter.EQUITY];
      break;
    case FilterGroup.ACCESS_THEME:
      subFilters = [ThemeCategoryFilter.ACCESS];
      break;
    case FilterGroup.DIVERISTY_THEME:
      subFilters = [ThemeCategoryFilter.DIVERSITY];
      break;
  }
  return subFilters;
}

export default studentsData;
