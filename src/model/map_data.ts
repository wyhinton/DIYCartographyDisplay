import {
  Action,
  action,
  thunk,
  Thunk,
  debug,
  Computed,
  computed,
} from "easy-peasy";
import { TimeSeries } from "pondjs";
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
import SHEET_KEY from "../static/sheet_key";

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
  filter_func: any;
  filters: FilterOption[];
}

export interface MapDataModel {
  //STATE
  activeImages: GalleryImage[];
  allImages: GalleryImage[];
  filter: FilterOption[];
  filterFunction: any;
  galleryImages: GalleryImage[];
  groupFilter: FilterGroup;
  lightBoxData: LightBoxData;
  loaded: boolean;
  studentStats: StudentStats | undefined;
  studentsClass: StudentClass[];
  studentGoogleSheets: GoogleSheet<RawStudentRowValues>[]; //

  //COMPUTED FROM EXTERNAL DATA
  computedActiveImages: Computed<MapDataModel, GalleryImage[]>;
  computedAvailableGalleryImages: Computed<MapDataModel, GalleryImage[]>;

  //THUNKS - FETCH EXTERNAL
  // fetchEventSpreadsheet: Thunk<MapDataModel>;
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
  addValidationError: Action<MapDataModel, ValidationError>;
  filter_gallery_2: Action<MapDataModel, FilterResult>;
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

const map_data: MapDataModel = {
  filter: [],
  studentsClass: [],
  lightBoxData: new LightBoxData(),
  groupFilter: FilterGroup.NONE,
  activeImages: [],
  filterFunction: (gi: GalleryImage) => true,
  computedActiveImages: computed((state) => {
    if (state.filter.length > 0) {
      return state.computedAvailableGalleryImages.filter(state.filterFunction);
    } else {
      return state.computedAvailableGalleryImages;
    }
    // console.log(active);
    // return active;
  }),
  galleryImages: [],
  allImages: [],
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
    allStudents.forEach((element) => {
      const res = element.requestGalleryThumbnail(SeriesId.series0101);
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
          allStudents[i].createGalleryImage(SeriesId.series0101, img);
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
  addValidationError: action((state, payload) => {
    state.validationErrors.push(payload);
  }),
  setValidationErrors: action((state, payload) => {
    state.validationErrors = payload;
  }),
  fetchStudentSheets: thunk(async (actions, _payload) => {
    const test2016 = getSheet<RawStudentRowValues>(SHEET_KEY, 2);
    const test2018 = getSheet<RawStudentRowValues>(SHEET_KEY, 3);
    const test2020 = getSheet<RawStudentRowValues>(SHEET_KEY, 4);
    const studentSheetRequests = [test2016, test2018, test2020];
    const my_stuff =
      ingestPromises<GoogleSheet<RawStudentRowValues>>(studentSheetRequests);
    my_stuff.then((results) => {
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
  filter_gallery_2: action((state, filterResult) => {
    if (arraysEqual(filterResult.filters, debug(state.filter))) {
      state.filter = [];
      state.activeImages = state.galleryImages;
      console.log("got the same filte ");
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
    let groupOptions = Object.values(FilterGroup);

    if (groupOptions.includes(filter as FilterGroup)) {
      let group_filter = get_group_filter(filter);
      actions.setFilterFunction(group_filter.filter_func);
      actions.filter_gallery_2(group_filter);
      actions.setGroupFiler(filter as FilterGroup);
    } else {
      let single_filter = get_single_filter(filter);
      actions.setFilterFunction(single_filter.filter_func);
      actions.filter_gallery_2(single_filter);
    }
  }),
  setActiveFilter: action((state, active_filter) => {
    console.log(active_filter);
    state.filter = active_filter;
  }),
  setLightboxData: action((state, item) => {
    console.log(item);
    const tag_data: MapMetadata = item.tags[0];
    const selected_student = state.studentsClass.filter(
      (s) => s.author === tag_data.author
    )[0];
    console.log(debug(selected_student));
    state.lightBoxData.set_student(selected_student);
  }),
  setLoaded: action((state, is_loaded) => {
    state.loaded = is_loaded;
  }),
};
function ingestPromises<T>(promises: Promise<T>[]): Promise<{
  results: T[];
  failures: PromiseRejectedResult[];
}> {
  const goodResults: T[] = [];
  const badResults: PromiseRejectedResult[] = [];
  let test = Promise.allSettled(promises).then((values) => {
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
  return test;
}

function get_single_filter(f: FilterOption): FilterResult {
  let filter_func: any;
  if (Object.values(MapSubTopic).includes(f as MapSubTopic)) {
    filter_func = function (val: GalleryImage) {
      return val.tags[0].subtopic === f;
    };
  } else if (
    Object.values(ThemeCategoryFilter).includes(f as ThemeCategoryFilter)
  ) {
    filter_func = function (val: GalleryImage) {
      return val.tags[0].theme === f;
    };
  } else if (
    Object.values(AuthorDisciplineFilter).includes(f as AuthorDisciplineFilter)
  ) {
    f = f as AuthorDisciplineFilter;
    let discipline = f.split("_")[0];
    let year = f.split("_")[1];
    filter_func = function (val: GalleryImage) {
      return val.tags[0].year === year && val.tags[0].discipline === discipline;
    };
  }
  return {
    filter_func: filter_func,
    filters: [f],
  } as FilterResult;
}

///END MODEL
//TODO: RENAME
function quick_get(group: FilterGroup, cat: keyof MapMetadata): FilterResult {
  const filter_set = filter_group_to_set(group);
  if (
    group === FilterGroup.STUDENTS_2016 ||
    group === FilterGroup.STUDENTS_2018 ||
    group === FilterGroup.STUDENTS_2020
  ) {
    let splits = get_year_discipline(filter_set as AuthorDisciplineFilter[]);
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

function get_group_filter(f: FilterOption): FilterResult {
  let final_result = {
    filter_func: "aaa",
    filters: [],
  } as FilterResult;

  switch (f) {
    case FilterGroup.ACCESS_THEME:
      final_result = quick_get(
        FilterGroup.ACCESS_THEME,
        "theme" as keyof MapMetadata
      );
      break;
    case FilterGroup.EQUITY_THEME:
      final_result = quick_get(
        FilterGroup.EQUITY_THEME,
        "theme" as keyof MapMetadata
      );
      break;
    case FilterGroup.DIVERISTY_THEME:
      final_result = quick_get(
        FilterGroup.DIVERISTY_THEME,
        "theme" as keyof MapMetadata
      );
      break;
    case FilterGroup.STUDENTS_2016:
      final_result = quick_get(
        FilterGroup.STUDENTS_2016,
        "year" as keyof MapMetadata
      );
      break;
    case FilterGroup.STUDENTS_2018:
      final_result = quick_get(
        FilterGroup.STUDENTS_2018,
        "year" as keyof MapMetadata
      );
      break;
    case FilterGroup.STUDENTS_2020:
      final_result = quick_get(
        FilterGroup.STUDENTS_2020,
        "year" as keyof MapMetadata
      );
      break;
    case FilterGroup.BUILT_TOPIC:
      final_result = quick_get(
        FilterGroup.BUILT_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
    case FilterGroup.ECONOMIC_TOPIC:
      final_result = quick_get(
        FilterGroup.ECONOMIC_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
    case FilterGroup.NATURAL_TOPIC:
      final_result = quick_get(
        FilterGroup.NATURAL_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
    case FilterGroup.POLITICAL_TOPIC:
      final_result = quick_get(
        FilterGroup.POLITICAL_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
    case FilterGroup.SOCIAL_TOPIC:
      final_result = quick_get(
        FilterGroup.SOCIAL_TOPIC,
        "subtopic" as keyof MapMetadata
      );
      break;
  }
  return final_result;
}

function get_year_discipline(
  author_enum: AuthorDisciplineFilter[]
): YearSection {
  const splits = author_enum.map((a) => a.split("_"));
  let yddata: YearSection = {
    years: [],
    discipline: [],
  };
  splits.forEach((s: string[]) => {
    yddata.discipline.push(s[0]);
    yddata.years.push(s[1]);
  });
  return yddata;
}

function filter_group_to_set(group_enum: FilterGroup): FilterOption[] {
  let my_filters: FilterOption[] = [];
  switch (group_enum) {
    case FilterGroup.STUDENTS_2016:
      my_filters = [
        AuthorDisciplineFilter.ARTDESIGN_2016,
        AuthorDisciplineFilter.ARCHITECTURE_2016,
        AuthorDisciplineFilter.OTHER_2016,
        AuthorDisciplineFilter.LANDSCAPE_2016,
      ];
      break;
    case FilterGroup.STUDENTS_2018:
      my_filters = [
        AuthorDisciplineFilter.ARTDESIGN_2018,
        AuthorDisciplineFilter.ARCHITECTURE_2018,
        AuthorDisciplineFilter.OTHER_2018,
        AuthorDisciplineFilter.LANDSCAPE_2018,
      ];
      break;
    case FilterGroup.STUDENTS_2020:
      my_filters = [
        AuthorDisciplineFilter.ARTDESIGN_2020,
        AuthorDisciplineFilter.ARCHITECTURE_2020,
        AuthorDisciplineFilter.OTHER_2020,
        AuthorDisciplineFilter.LANDSCAPE_2020,
      ];
      break;
    case FilterGroup.BUILT_TOPIC:
      my_filters = [
        MapSubTopic.INFRASTR,
        MapSubTopic.BUILDINGS,
        MapSubTopic.TRANSPORTATION,
      ];
      break;
    case FilterGroup.ECONOMIC_TOPIC:
      my_filters = [
        MapSubTopic.WORK,
        MapSubTopic.PROPERTY,
        MapSubTopic.URBANDEV,
      ];
      break;
    case FilterGroup.NATURAL_TOPIC:
      my_filters = [
        MapSubTopic.GREENSPACE,
        MapSubTopic.POLLUTION,
        MapSubTopic.HYDROLOGY,
      ];
      break;
    case FilterGroup.POLITICAL_TOPIC:
      my_filters = [
        MapSubTopic.CIVICENG,
        MapSubTopic.GOVERMENT,
        MapSubTopic.POLICY,
      ];
      // my_filters = [MapSubTopic.CIVICENG, MapSubTopic.GOV, MapSubTopic.POLICY];
      break;
    case FilterGroup.SOCIAL_TOPIC:
      my_filters = [
        MapSubTopic.EDUCATION,
        MapSubTopic.HEALTHSAFETY,
        MapSubTopic.RACEGEN,
      ];
      break;
    case FilterGroup.EQUITY_THEME:
      my_filters = [ThemeCategoryFilter.EQUITY];
      break;
    case FilterGroup.ACCESS_THEME:
      my_filters = [ThemeCategoryFilter.ACCESS];
      break;
    case FilterGroup.DIVERISTY_THEME:
      my_filters = [ThemeCategoryFilter.DIVERSITY];
      break;
  }
  return my_filters;
}

export default map_data;
