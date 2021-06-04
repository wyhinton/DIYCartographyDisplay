import {
  Action,
  action,
  thunk,
  Thunk,
  debug,
  Computed,
  computed,
} from "easy-peasy";
import GetSheetDone from "get-sheet-done";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import {
  AuthorDisciplineFilter,
  MapSubTopic,
  ThemeCategoryFilter,
  EventLevel,
  GalleryFilterType,
  FilterGroup,
} from "./enums";
import type {
  RawStudentRowValues,
  GoogleSheet,
  RawEventRowValues,
} from "./sheet_data_models";
import type { FilterOption } from "./types";
import {
  handle_validation,
  lengthAtLeastFour,
  ValidationError,
} from "./validation";
import { arraysEqual, groupBy } from "./utils";
import { StudentClass, SeriesId } from "./student";
import { StudentStats } from "./student_stats";
import { LightBoxData } from "./lightbox";
import { TimelineEvent } from "./timeline_event";
import { Timeline } from "./timeline";
import SHEET_KEY from "./sheet_key";

/**
  tags can not be an object due to the Gallery Image API,
  but it will accept an array of any type. So we get around 
  this by putting our metadata object 
  into an array. There
  will never be more than one metadata object.
*/

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

export interface EventRowValues {
  start: Date;
  end: Date;
  title: string;
  info: string;
  tags: string;
  category: EventLevel;
}

export interface TimelineData {
  national: TimeSeries[];
  state: TimeSeries[];
  city: TimeSeries[];
  international: TimeSeries[];
  NA: TimeSeries[];
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
  timelineSeries: TimelineData;
  timlineData: Timeline;

  //COMPUTED FROM EXTERNAL DATA
  computedActiveImages: Computed<MapDataModel, GalleryImage[]>;
  computed_all_gallery_images: Computed<MapDataModel, GalleryImage[]>;

  //THUNKS - FETCH EXTERNAL
  fetchEventSpreadsheet: Thunk<MapDataModel>;
  fetchStudentSheets: Thunk<MapDataModel>;

  //THUNKS - UI
  thunkSetFilter: Thunk<MapDataModel, FilterOption>;
  processRawStudentSheets: Thunk<MapDataModel, RawStudentRowValues[][]>;
  //STORE RAW GOOGLE SHEETS INFO FOR DEBUGGING
  rawStudentSheets: RawStudentRowValues[][];
  mapSpreadsheet: RawStudentRowValues[];
  eventSpreadsheet: EventRowValues[];
  addStudentSheetRawData: Action<MapDataModel, RawStudentRowValues[]>;
  setEventSpreadsheet: Action<MapDataModel, EventRowValues[]>;

  //VALIDATION
  validationErrors: ValidationError[];

  //SETTERS
  // set_LightBoxData: Action<MapDataModel, StudentClass>;
  add_validation_error: Action<MapDataModel, ValidationError>;
  filter_gallery_2: Action<MapDataModel, FilterResult>;
  set_StudentStats: Action<MapDataModel, StudentStats>;
  set_active_filter: Action<MapDataModel, FilterOption[]>;
  set_all_students: Action<MapDataModel, StudentClass[]>;
  set_filter_function: Action<MapDataModel, any>;
  set_gallery_images: Action<MapDataModel, GalleryImage[]>;
  set_group_filter: Action<MapDataModel, FilterGroup>;
  set_lightboxData: Action<MapDataModel, GalleryImage>;
  set_loaded: Action<MapDataModel, boolean>;
  set_timelineData: Action<MapDataModel, TimelineEvent[]>;
  set_timeline_series: Action<MapDataModel, TimelineData>;
  set_validation_errors: Action<MapDataModel, ValidationError[]>;
}

//______________________

const empty_nat: TimeSeries[] = [];
const empty_state: TimeSeries[] = [];
const empty_city: TimeSeries[] = [];
const empty_international: TimeSeries[] = [];
const empty_NA: TimeSeries[] = [];

const initial_empty_timeline: TimelineData = {
  national: empty_nat,
  state: empty_state,
  city: empty_city,
  international: empty_international,
  NA: empty_NA,
};

const map_data: MapDataModel = {
  filter: [],
  timlineData: new Timeline(),
  studentsClass: [],
  lightBoxData: new LightBoxData(),
  groupFilter: FilterGroup.NONE,
  activeImages: [],
  filterFunction: (gi: GalleryImage) => true,
  computedActiveImages: computed((state) => {
    console.log(state.filterFunction);
    let active = state.computed_all_gallery_images.filter(state.filterFunction);
    console.log(active);
    return active;
  }),
  rawStudentSheets: [],
  galleryImages: [],
  allImages: [],
  timelineSeries: initial_empty_timeline,
  loaded: false,
  mapSpreadsheet: [],
  studentStats: undefined,
  eventSpreadsheet: [],
  validationErrors: [],
  // student_asset_requests: [],
  set_all_students: action((state, payload) => {
    state.studentsClass = payload;
  }),
  addStudentSheetRawData: action((state, payload) => {
    state.rawStudentSheets.push(payload);
  }),
  processRawStudentSheets: thunk(async (actions, payload) => {
    const allRows = payload.flat();
    console.log(allRows);
    const allStudents = allRows.map((r) => new StudentClass(r));
    console.log(allStudents);
    const resizeReq = allStudents.map((s) =>
      s.request_gallery_thumbnail(SeriesId.series0101)
    );
    console.log(resizeReq);
    Promise.all(resizeReq).then((imgs) => {
      const newStudents: StudentClass[] = [];
      imgs.forEach((img, i) => {
        if (img) {
          allStudents[i].create_gallery_image(SeriesId.series0101, img);
          newStudents.push(allStudents[i]);
        }
      });
      console.log(newStudents);
      const studentStats = new StudentStats(newStudents);
      console.log(studentStats);
      actions.set_all_students(newStudents);
      actions.set_StudentStats(studentStats);
    });
  }),
  set_StudentStats: action((state, payload) => {
    state.studentStats = payload;
  }),
  set_filter_function: action((state, payload) => {
    console.log("setting filter func");
    state.filterFunction = payload;
  }),
  computed_all_gallery_images: computed((state) => {
    return state.studentsClass.map((s) => s.get_gallery_images()).flat();
  }),
  add_validation_error: action((state, payload) => {
    state.validationErrors.push(payload);
  }),
  set_validation_errors: action((state, payload) => {
    state.validationErrors = payload;
  }),
  fetchEventSpreadsheet: thunk(async (actions) => {
    get_sheet<RawEventRowValues>(SHEET_KEY, 1)
      .then((event_sheet: GoogleSheet<RawEventRowValues>) => {
        let timeline_events = event_sheet.data.map((r) => new TimelineEvent(r));
        actions.set_timelineData(timeline_events);
        const typed_event_rows = type_event_rows(event_sheet.data);
        actions.setEventSpreadsheet(typed_event_rows);
        const timeline_series = make_time_series(typed_event_rows);
        actions.set_timeline_series(timeline_series);
      })
      .catch((err: any) => {
        console.error(`Error fetching DOC_KEY ${SHEET_KEY}`);
      });
  }),
  set_timelineData: action((state, payload) => {
    state.timlineData.set_data(payload);
  }),
  fetchStudentSheets: thunk(async (actions, _payload, { getState }) => {
    let test_2016 = get_sheet<RawStudentRowValues>(SHEET_KEY, 2);
    let test_2018 = get_sheet<RawStudentRowValues>(SHEET_KEY, 3);
    let student_sheet_requests = [test_2016, test_2018];
    Promise.all(student_sheet_requests).then(
      (student_sheet: (void | GoogleSheet<RawStudentRowValues>)[]) => {
        student_sheet.forEach((sheet_payload) => {
          if (sheet_payload) {
            console.log(sheet_payload);
            const raw_student_values = sheet_payload.data;
            if (Array.isArray(raw_student_values)) {
              console.log(raw_student_values);
              actions.addStudentSheetRawData(
                raw_student_values as RawStudentRowValues[]
              );
            } else {
              console.error("did not get map row array");
            }
          }
        });
        actions.processRawStudentSheets(getState().rawStudentSheets);
      }
    );
  }),
  setEventSpreadsheet: action((state, event_rows) => {
    state.eventSpreadsheet = event_rows;
  }),
  set_gallery_images: action((state, payload) => {
    state.galleryImages = payload;
  }),
  filter_gallery_2: action((state, filter_result) => {
    if (arraysEqual(filter_result.filters, debug(state.filter))) {
      state.filter = [];
      state.activeImages = state.galleryImages;
      console.log("got the same filte ");
    } else {
      state.activeImages = state.galleryImages.filter(
        filter_result.filter_func
      );
      state.filter = filter_result.filters;
    }
  }),
  set_timeline_series: action((state, timeline_series) => {
    state.timelineSeries = timeline_series;
  }),
  set_group_filter: action((state, group_filter) => {
    console.log("setting group filter", group_filter);
    if (state.groupFilter === group_filter) {
      console.log("GOT SAME");
      state.groupFilter = FilterGroup.NONE;
      state.filter = [];
    } else {
      state.groupFilter = group_filter;
    }
  }),
  thunkSetFilter: thunk((actions, filter) => {
    console.log("doing thunk set filter");
    let group_options = Object.values(FilterGroup);

    if (group_options.includes(filter as FilterGroup)) {
      let group_filter = get_group_filter(filter);
      actions.set_filter_function(group_filter.filter_func);
      actions.filter_gallery_2(group_filter);
      actions.set_group_filter(filter as FilterGroup);
    } else {
      let single_filter = get_single_filter(filter);
      actions.set_filter_function(single_filter.filter_func);
      actions.filter_gallery_2(single_filter);
    }
  }),
  set_active_filter: action((state, active_filter) => {
    console.log(active_filter);
    state.filter = active_filter;
  }),
  set_lightboxData: action((state, item) => {
    console.log(item);
    const tag_data: MapMetadata = item.tags[0];
    const selected_student = state.studentsClass.filter(
      (s) => s.author === tag_data.author
    )[0];
    console.log(debug(selected_student));
    state.lightBoxData.set_student(selected_student);
  }),
  set_loaded: action((state, is_loaded) => {
    state.loaded = is_loaded;
  }),
};
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

function make_time_series(rows: EventRowValues[]): TimelineData {
  const categorized_events = groupBy(rows, "category");
  console.log(categorized_events);
  Object.keys(categorized_events).forEach((key) => {
    console.log(key);
    const value: EventRowValues[] = categorized_events[key];
    const events = event_rows_to_time_range_events(value);
    const series = time_range_events_to_time_series(events);
    categorized_events[key] = series;
    console.log(series);
  });
  console.log(categorized_events);
  return categorized_events;
}

function event_rows_to_time_range_events(
  rows: EventRowValues[]
): TimeRangeEvent[] {
  let all_events: TimeRangeEvent[] = [];
  console.log(rows);
  rows.forEach((event_row: EventRowValues) => {
    const time_range = new TimeRange(event_row.start, event_row.end);
    const time_range_event = new TimeRangeEvent(time_range, [
      { title: event_row.title },
    ]);
    all_events.push(time_range_event);
  });
  console.log(all_events);
  return all_events;
}

//sorts events into rows so that rows don't contain overlapping time events
function time_range_events_to_time_series(
  events: TimeRangeEvent[]
): TimeSeries[] {
  // let array_set: { [key: string]: any[] } = {};
  // let row_count = 0;
  // for (let index = 0; index < events.length; index++) {
  //   console.log(index);
  //   const element = events[index];
  //   if (Array.isArray(array_set[`row_${row_count}`]) == false) {
  //     array_set[`row_${row_count}`] = [];
  //   }
  //   let test = array_set[`row_${row_count}`].every(
  //     (d: TimeRangeEvent) =>
  //       date_range_overlaps(
  //         d.begin(),
  //         d.end(),
  //         element.begin(),
  //         element.end()
  //       ) == false
  //   );
  //   if (test) {
  //     if (row_count > 0) {
  //       array_set[`row_${row_count - 1}`].push(element);
  //       // }
  //     } else {
  //       array_set[`row_${row_count}`].push(element);
  //     }
  //   } else {
  //     row_count += 1;
  //     array_set[`row_${row_count}`].push(element);
  //   }
  //   console.log(test);
  //   console.log(array_set);
  //   // if (
  //   //   array_set[`row_${row_count}`].every(
  //   //     (d: TimeRangeEvent) =>
  //   //       date_range_overlaps(
  //   //         d.begin(),
  //   //         d.end(),
  //   //         element.begin(),
  //   //         element.end()
  //   //       ) == false
  //   //   )
  //   // ) {
  //   //   console.log("no overlap, going to push");
  //   //   array_set[`row_${row_count}`].push(element);
  //   //   console.log(array_set);
  //   // } else {
  //   //   // console.log("GOT overlap, MAKE NEW ROW");
  //   //   // row_count += 1;
  //   //   // array_set[`row_${row_count}`].push(element);
  //   // }
  //   // }
  // }
  // console.log(array_set);
  let test_obj: any = {};
  test_obj[0] = [];
  (events as TimeRangeEvent[]).forEach(
    (ev2: TimeRangeEvent, ind: number, array: TimeRangeEvent[]) => {
      let row_count = 0;
      if (
        array.every((e3) => {
          if (ev2 === e3) {
            return true;
          }
          if (
            date_range_overlaps(e3.begin(), e3.end(), ev2.begin(), ev2.end())
          ) {
            // console.log("ranges do overlap");
            return false;
          } else {
            // console.log("ranges do not overlap");
            return true;
          }
        })
      ) {
        test_obj[row_count].push(ev2);
      } else {
        row_count = row_count + 1;
        test_obj[ind] = [ev2];
      }
    }
  );
  const sorted_events = Object.keys(test_obj).map((k) => {
    test_obj[k] = test_obj[k].sort((a: any, b: any) => a.begin() - b.begin());
  });
  const row_arrays = Object.keys(sorted_events).map(
    (k) =>
      new TimeSeries({
        name: "test",
        events: test_obj[k],
      })
  );
  return row_arrays;
}

function date_range_overlaps(
  a_start: Date,
  a_end: Date,
  b_start: Date,
  b_end: Date
) {
  if (a_start < b_start && b_start < a_end) return true; // b starts in a
  if (a_start < b_end && b_end < a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
}

function type_event_rows(rows: any[]): EventRowValues[] {
  rows.forEach((r: any, ind: number) => {
    const cat_string: string = rows[ind]["category"];
    const type_cat: EventLevel =
      EventLevel[cat_string as unknown as keyof typeof EventLevel];
    rows[ind]["category"] = type_cat;
    const start_date = new Date(rows[ind]["start"]);
    const end_date = new Date(rows[ind]["end"]);
    rows[ind]["start"] = start_date;
    rows[ind]["end"] = end_date;
  });
  return rows;
}

function get_sheet<T>(key: string, sheet_num: number): Promise<GoogleSheet<T>> {
  const promise = new Promise<GoogleSheet<T>>(function (resolve, reject) {
    GetSheetDone.labeledCols(key, sheet_num)
      .then((sheet: any) => {
        resolve(sheet);
      })
      .catch((err: any) => {
        console.error(
          `Error fetching DOC_KEY ${key}, sheet number ${sheet_num}`
        );
      });
  });
  return promise;
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
