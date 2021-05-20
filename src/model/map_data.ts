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
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import { pipe } from "fp-ts/lib/function";
import { Either, mapLeft } from "fp-ts/lib/Either";
import {
  AuthorDisciplineFilter,
  MapSubTopic,
  ThemeCategoryFilter,
  EventLevel,
  GalleryFilterType,
  FilterGroup,
  Topic,
} from "./enums";
import type { MapStats } from "./sub_models/student_stats";
import type { RawStudentRowValues } from "./sub_models/sheet_data_models";
import type { FilterOption } from "./types";
import {
  handle_validation,
  lengthAtLeastFour,
  ValidationError,
} from "./validation";

/**
  tags can not be an object due to the Gallery Image API,
  but it will accept an array of any type. So we get around 
  this by putting our metadata object 
  into an array. There
  will never be more than one metadata object.
*/

// seperate out time range events from single date events

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

/**
 * Generic GoogleSheet with type argument 
   which we use only when fetching our sheets.
   Currently te
 */
//TODO: FILLOUT TYPES
export interface GoolgeSheet<T> {
  data: Array<T>;
  title: string;
  updated: string;
}

export interface Student {
  author: string;
  year: string;
  title: string;
  info: string;
  discipline: AuthorDisciplineFilter;
  topic: Topic;
  subtopic: MapSubTopic;
  theme: ThemeCategoryFilter;
  gallery_images: GalleryImage[];
  lightbox_images: GalleryImage[];
}

export interface LightBoxContent {
  images: PhotoInfo[];
  description: string;
  author: string;
  title: string;
}

export interface PhotoInfo {
  source: string;
  kind: string;
}

export interface EventRowValues {
  start: Date;
  end: Date;
  title: string;
  info: string;
  tags: string;
  category: EventLevel;
}
//TODO: REMOVE THIS
export interface EventData {
  title: string;
}

export interface TimelineData {
  national: TimeSeries[];
  state: TimeSeries[];
  city: TimeSeries[];
  international: TimeSeries[];
  NA: TimeSeries[];
}

//TODO: REMOVE
export interface FilterObj {
  filter_type: GalleryFilterType;
  filter: FilterOption;
}

export interface FilterResult {
  filter_func: any;
  filters: FilterOption[];
}

export interface MapDataModel {
  //STATEFUL UI DATA (TOOLBAR)
  doc_key: string;
  filter: FilterOption[];
  group_filter: FilterGroup;
  filter_function: any;
  loaded: boolean;
  active_lightbox: LightBoxContent;
  students: Student[];

  //TIMELINE
  timeline_series: TimelineData;

  //GALLERY
  all_images: GalleryImage[];
  active_images: GalleryImage[];
  gallery_images: GalleryImage[];

  //COMPUTED FROM EXTERNAL DATA
  computed_active_images: Computed<MapDataModel, GalleryImage[]>;
  test_gallery_images: Computed<MapDataModel, GalleryImage[]>;
  computed_student_stats: Computed<MapDataModel, MapStats>;
  map_stats: MapStats | undefined;

  //THUNKS - FETCH EXTERNAL
  fetch_event_spreadsheet: Thunk<MapDataModel>;
  fetch_student_sheets: Thunk<MapDataModel>;
  request_all_spreadsheets: Thunk<MapDataModel>;

  //THUNKS - UI
  thunk_set_filter: Thunk<MapDataModel, FilterOption>;
  process_student: Thunk<MapDataModel, RawStudentRowValues>;
  process_raw_student_sheets: Thunk<MapDataModel, RawStudentRowValues[][]>;

  //STORE RAW GOOGLE SHEETS INFO FOR DEBUGGING
  raw_student_sheets: RawStudentRowValues[][];
  map_spreadsheet: RawStudentRowValues[];
  event_spreadsheet: EventRowValues[];
  add_student_sheet_raw_data: Action<MapDataModel, RawStudentRowValues[]>;
  set_event_spreadsheet: Action<MapDataModel, EventRowValues[]>;

  //VALIDATION
  validation_errors: ValidationError[];

  //SETTERS
  add_valid_student: Action<MapDataModel, Student>;
  set_group_filter: Action<MapDataModel, FilterGroup>;
  set_filter_function: Action<MapDataModel, any>;
  set_map_spreadsheet: Action<MapDataModel, RawStudentRowValues[]>;
  set_map_stats: Action<MapDataModel, MapStats>;
  set_all_images: Action<MapDataModel, GalleryImage[]>;
  set_gallery_images: Action<MapDataModel, GalleryImage[]>;
  set_active_images: Action<MapDataModel, GalleryImage[]>;
  set_timeline_series: Action<MapDataModel, TimelineData>;
  set_active_filter: Action<MapDataModel, FilterOption[]>;
  reset_gallery: Action<MapDataModel>;
  set_lightbox_content: Action<MapDataModel, GalleryImage>;
  set_loaded: Action<MapDataModel, boolean>;
  filter_gallery_2: Action<MapDataModel, FilterResult>;
  set_validation_errors: Action<MapDataModel, ValidationError[]>;
  add_validation_error: Action<MapDataModel, ValidationError>;
}

//______________________
type ImagePromise = Promise<HTMLImageElement>;

const empty_nat: TimeSeries[] = [];
const empty_state: TimeSeries[] = [];
const empty_city: TimeSeries[] = [];
const empty_international: TimeSeries[] = [];
const empty_NA: TimeSeries[] = [];
const DOC_KEY = "1-S8EkLYsknYoFWSynVeMQCi6Gf9PoV9A5ezzICXamJA";

const initial_empty_timeline: TimelineData = {
  national: empty_nat,
  state: empty_state,
  city: empty_city,
  international: empty_international,
  NA: empty_NA,
};

const empty_photo: PhotoInfo[] = [];

const lb_initial: LightBoxContent = {
  images: empty_photo,
  description: "default",
  title: "string",
  author: "some author",
};

const init_map_stats: MapStats = {
  year: {},
  subtopic: {},
  theme: {},
};

const row_to_student = (
  row: RawStudentRowValues,
  gallery_images: GalleryImage[]
): Student => {
  let student: Student = {
    author: row.author,
    year: row.year,
    title: row.title,
    info: row.info,
    discipline:
      AuthorDisciplineFilter[
        row.discipline as unknown as keyof typeof AuthorDisciplineFilter
      ],
    topic: Topic[row.topic as unknown as keyof typeof Topic],
    theme:
      ThemeCategoryFilter[
        row.theme as unknown as keyof typeof ThemeCategoryFilter
      ],
    subtopic: MapSubTopic[row.subtopic as unknown as keyof typeof MapSubTopic],
    gallery_images: gallery_images,
    lightbox_images: gallery_images,
  };
  console.log(student.subtopic);
  return student;
};

function create_gallery_images_for_student(
  single_row: RawStudentRowValues,
  series_number: string
): GalleryImage {
  const keyTyped = series_number as keyof typeof single_row;
  let gallery_image = {
    src: single_row[keyTyped],
    // src: single_row.series0101,
    thumbnail: single_row[keyTyped],
    // thumbnail: single_row.thumbnail,
    isSelected: false,
    //TODO: SET UP CAPTIONS
    caption: "Im in this other file",
    thumbnailWidth: 95,
    thumbnailHeight: 174,
    tags: [
      {
        discipline:
          AuthorDisciplineFilter[
            single_row.discipline as unknown as keyof typeof AuthorDisciplineFilter
          ],
        subtopic:
          MapSubTopic[
            // (single_row.tags + "_" +
            single_row.subtopic as unknown as keyof typeof MapSubTopic
          ],
        theme:
          ThemeCategoryFilter[
            single_row.theme as unknown as keyof typeof ThemeCategoryFilter
          ],
        year: single_row.year,
      },
    ],
  };
  // );
  return gallery_image;
}

const map_data: MapDataModel = {
  doc_key: "1-S8EkLYsknYoFWSynVeMQCi6Gf9PoV9A5ezzICXamJA",
  filter: [],
  students: [],
  group_filter: FilterGroup.NONE,
  active_images: [],
  filter_function: (gi: GalleryImage) => true,
  computed_active_images: computed((state) => {
    console.log(state.filter_function);
    let active = state.test_gallery_images.filter(state.filter_function);
    console.log(active);
    return active;
  }),
  raw_student_sheets: [],
  gallery_images: [],
  all_images: [],
  timeline_series: initial_empty_timeline,
  loaded: false,
  active_lightbox: lb_initial,
  map_spreadsheet: [],
  map_stats: init_map_stats,
  event_spreadsheet: [],
  validation_errors: [],
  //creates a new student
  add_valid_student: action((state, payload) => {
    state.students.push(payload);
  }),
  add_student_sheet_raw_data: action((state, payload) => {
    state.raw_student_sheets.push(payload);
  }),
  computed_student_stats: computed((state) => {
    function topic_to_array_of_subtopics(topic: Topic): MapSubTopic[] {
      let topic_subtopics: MapSubTopic[] = [];
      switch (topic) {
        case Topic.BE:
          topic_subtopics = [
            MapSubTopic.INFRASTR,
            MapSubTopic.BUILDINGS,
            MapSubTopic.TRANSPORTATION,
          ];
          break;
        case Topic.EE:
          topic_subtopics = [
            MapSubTopic.WORK,
            MapSubTopic.PROPERTY,
            MapSubTopic.URBANDEV,
          ];
          break;
        case Topic.NE:
          topic_subtopics = [
            MapSubTopic.GREENSPACE,
            MapSubTopic.POLLUTION,
            MapSubTopic.HYDROLOGY,
          ];
          break;
        case Topic.PE:
          topic_subtopics = [
            MapSubTopic.CIVICENG,
            MapSubTopic.GOVERMENT,
            MapSubTopic.POLICY,
          ];
          // topic_subtopics = [MapSubTopic.CIVICENG, MapSubTopic.GOV, MapSubTopic.POLICY];
          break;
        case Topic.SE:
          topic_subtopics = [
            MapSubTopic.EDUCATION,
            MapSubTopic.HEALTHSAFETY,
            MapSubTopic.RACEGEN,
          ];
          break;
      }
      return topic_subtopics;
    }
    function object_values_to_array_lengths(obj: any): any {
      let keys = Object.keys(obj);
      keys.forEach((key) => {
        obj[key] = obj[key].length;
      });
      return obj;
    }
    function get_year_breakdown(students: Student[]) {
      let year_groups = groupBy(state.students, "year");
      var new_obj = {};
      for (const [key, value] of Object.entries(year_groups)) {
        let test = groupBy(value as Student[], "discipline");
        test = object_values_to_array_lengths(test);
        (new_obj as any)[key] = test;
        console.log(new_obj);
      }
      return new_obj;
    }
    const discipline_stats = get_year_breakdown(state.students);
    const theme_stats = object_values_to_array_lengths(
      groupBy(state.students, "theme")
    );
    function get_topic_breakdown(students: Student[]) {
      let topic_groups = groupBy(state.students, "topic");
      var student_map_stats = {};
      for (const [key, value] of Object.entries(topic_groups)) {
        let subtopic_group = groupBy(value as Student[], "subtopic");
        let all_subtopics = topic_to_array_of_subtopics(
          Topic[key as unknown as keyof typeof Topic]
        );

        subtopic_group = object_values_to_array_lengths(subtopic_group);
        all_subtopics.forEach((st) => {
          if (!(st in subtopic_group)) {
            (subtopic_group as any)[st] = 0;
          }
        });
        (student_map_stats as any)[key] = subtopic_group;
      }
      return student_map_stats;
    }

    const subtopic_stats = get_topic_breakdown(state.students);
    // console.log(test);
    const final_obj = {
      year: discipline_stats,
      subtopic: subtopic_stats,
      theme: theme_stats,
    };

    console.log(final_obj);
    let year_groups = groupBy(state.students, "year");
    console.log(year_groups);

    // console.log(test_res);
    // // let theme_stats = test_res as ThemeStats;
    // let map_stats: MapStats = {
    //   year: test_res,
    //   tag: test_res,
    //   theme: test_res,
    // };
    return final_obj;
  }),
  // async (actions, payload, { getState, getStoreState }) => {
  process_student: thunk(async (actions, payload, { getState }) => {
    let first_image = create_gallery_images_for_student(payload, "series0101");
    let image_request = get_image(first_image);
    image_request.then((res: HTMLImageElement) => {
      first_image.thumbnailWidth = res.width * 0.1;
      first_image.thumbnailHeight = res.height * 0.1;
      let student = row_to_student(payload, [first_image]);
      actions.add_valid_student(student);
    });
  }),
  process_raw_student_sheets: thunk(async (actions, payload, { getState }) => {
    const validations = [lengthAtLeastFour];
    payload.forEach((sheet: RawStudentRowValues[]) => {
      sheet.forEach((row: RawStudentRowValues) => {
        handle_validation(
          row,
          validations,
          actions.add_validation_error,
          actions.process_student
        );
      });
    });
  }),
  set_filter_function: action((state, payload) => {
    console.log("setting filter func");
    state.filter_function = payload;
  }),
  test_gallery_images: computed((state) => {
    let all_images: GalleryImage[] = [];
    state.students.forEach((student) => {
      all_images.push(...student.gallery_images);
    });
    return all_images;
  }),
  // add_validation_error: action(())
  add_validation_error: action((state, payload) => {
    state.validation_errors.push(payload);
  }),
  set_validation_errors: action((state, payload) => {
    state.validation_errors = payload;
  }),
  request_all_spreadsheets: thunk(async (actions) => {
    console.log("requesting all my spreadhsheets");
  }),
  // resolve_event_spreadsheet: action((state, payload){
  fetch_event_spreadsheet: thunk(async (actions) => {
    get_sheet<EventRowValues>(DOC_KEY, 1)
      .then((event_sheet: GoolgeSheet<EventRowValues>) => {
        const typed_event_rows = type_event_rows(event_sheet.data);
        actions.set_event_spreadsheet(typed_event_rows);
        const timeline_series = make_time_series(typed_event_rows);
        actions.set_timeline_series(timeline_series);
      })
      .catch((err: any) => {
        console.error(`Error fetching DOC_KEY ${DOC_KEY}`);
      });
  }),
  fetch_student_sheets: thunk(async (actions, _payload, { getState }) => {
    let test_2016 = get_map_sheet(DOC_KEY, 2);
    let student_sheet_requests = [test_2016];
    // let student_sheet_requests = [test_2018, test_2020, test_2016];
    Promise.all(student_sheet_requests).then(
      (raw_student_rows: (void | RawStudentRowValues[])[]) => {
        raw_student_rows.forEach((sheet_payload) => {
          if (Array.isArray(sheet_payload)) {
            actions.add_student_sheet_raw_data(
              sheet_payload as RawStudentRowValues[]
            );
          } else {
            console.error("did not get map row array");
          }
        });
        // const map_stats = generate_map_stats(map_data.maps);
        // actions.set_map_stats(map_stats);
        // actions.set_map_spreadsheet(map_data.maps);
        // actions.set_loaded(true);
        actions.process_raw_student_sheets(getState().raw_student_sheets);
      }
    );
  }),
  set_map_spreadsheet: action((state, map_rows) => {
    state.map_spreadsheet = map_rows;
  }),
  set_map_stats: action((state, map_stats_obj) => {
    state.map_stats = map_stats_obj;
  }),
  set_event_spreadsheet: action((state, event_rows) => {
    state.event_spreadsheet = event_rows;
  }),
  set_all_images: action((state, payload) => {
    state.all_images = payload;
  }),
  set_gallery_images: action((state, payload) => {
    state.gallery_images = payload;
  }),
  set_active_images: action((state, payload) => {
    state.active_images = payload;
  }),
  filter_gallery_2: action((state, filter_result) => {
    if (arraysEqual(filter_result.filters, debug(state.filter))) {
      state.filter = [];
      state.active_images = state.gallery_images;
      console.log("got the same filte ");
    } else {
      state.active_images = state.gallery_images.filter(
        filter_result.filter_func
      );
      state.filter = filter_result.filters;
    }
  }),
  set_timeline_series: action((state, timeline_series) => {
    state.timeline_series = timeline_series;
  }),
  set_group_filter: action((state, group_filter) => {
    console.log("setting group filter", group_filter);
    if (state.group_filter === group_filter) {
      console.log("GOT SAME");
      state.group_filter = FilterGroup.NONE;
      state.filter = [];
    } else {
      state.group_filter = group_filter;
    }
  }),
  thunk_set_filter: thunk((actions, filter) => {
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
  reset_gallery: action((state) => {
    state.active_images = state.gallery_images;
  }),
  set_active_filter: action((state, active_filter) => {
    console.log(active_filter);
    state.filter = active_filter;
  }),
  set_lightbox_content: action((state, item) => {
    let source_row = state.map_spreadsheet.filter(
      (r) => r.series0101 === item.src
    )[0];

    console.log(item);
    let photo_sources: PhotoInfo[] = [];
    Object.keys(source_row).forEach(function (k: string) {
      if (k.startsWith("photo")) {
        const key = k as keyof typeof source_row;
        const photo_info: PhotoInfo = {
          source: source_row[key],
          kind: k,
        };
        photo_sources.push(photo_info);
      }
    });
    const info: LightBoxContent = {
      images: photo_sources,
      description: source_row.info,
      title: source_row.title,
      author: source_row.author,
    };
    state.active_lightbox = info;
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
      return val.tags[0].year === year && val.tags[0].discipline == discipline;
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
    // group instanceof
    group == FilterGroup.STUDENTS_2016 ||
    group == FilterGroup.STUDENTS_2018 ||
    group == FilterGroup.STUDENTS_2020
  ) {
    let splits = get_year_discipline(filter_set as AuthorDisciplineFilter[]);
    const filter_func = function (val: GalleryImage) {
      return splits.years.includes(val.tags[0].year);
      // splits.discipline.includes(val.tags[0].discipline)
    };
    return {
      filter_func: filter_func,
      filters: filter_set,
    } as FilterResult;
  } else {
    const filter_func = function (val: GalleryImage) {
      console.log(cat);
      console.log(filter_set);
      console.log(val.tags[0]);
      console.log(val.tags[0][cat]);
      console.log(filter_set.includes(val.tags[0][cat]));
      return filter_set.includes(val.tags[0][cat]);
      // return filter_set.includes(val.tags[0][cat]);
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
  console.log(final_result);
  return final_result;
}

// function generate_map_stats(map_rows: RawStudentRowValues[]): MapStats {
//   const yd = generate_year_discpline_stats(map_rows);
//   const td = generate_topic_stats(map_rows);
//   const theme_stats = generate_theme_stats(map_rows);
//   const map_stats: MapStats = {
//     year: yd,
//     tag: td,
//     theme: theme_stats,
//   };
//   return map_stats;
// }

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
    const data: EventData = {
      title: event_row.title,
    };
    const time_range_event = new TimeRangeEvent(time_range, [data]);
    all_events.push(time_range_event);
  });
  console.log(all_events);
  return all_events;
}

//sorts events into rows so that rows don't contain overlapping time events
function time_range_events_to_time_series(
  events: TimeRangeEvent[]
): TimeSeries[] {
  let array_set: { [key: string]: any[] } = {};
  let row_count = 0;
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

// interface BaseImage{
//   src: string,
//   author: string,

// }
// function get_all_images(rows: MapRow[]):

//maprow-> student
//student-> gallery image and normal images

function map_rows_to_images(rows: RawStudentRowValues[]): GalleryImage[] {
  let unsized_gallery_images: GalleryImage[] = rows.map(
    (map_row: RawStudentRowValues) => ({
      src: map_row.series0101,
      thumbnail: map_row.series0101,
      // thumbnail: map_row.thumbnail,
      isSelected: false,
      //TODO: SET UP CAPTIONS
      caption: "Im in this other file",
      thumbnailWidth: 95,
      thumbnailHeight: 174,
      tags: [
        {
          discipline:
            AuthorDisciplineFilter[
              map_row.discipline as unknown as keyof typeof AuthorDisciplineFilter
            ],
          subtopic:
            MapSubTopic[
              (map_row.topic +
                // (map_row.tags +
                "_" +
                map_row.subtopic) as unknown as keyof typeof MapSubTopic
            ],
          theme:
            ThemeCategoryFilter[
              map_row.theme as unknown as keyof typeof ThemeCategoryFilter
            ],
          year: map_row.year,
        },
      ],
    })
  );
  return unsized_gallery_images;
}

function groupBy(arr: any[], property: any) {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...(acc[cur[property]] || []), cur];
    return acc;
  }, {});
}
// function groupByCount(arr: any[], property: any) {
//   return arr.reduce((acc, cur) => {
//     acc[cur[property]] = [...(acc[cur[property]] || []), cur];
//     return acc;
//   }, {});
// }

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

function type_map_rows(rows: any[]): RawStudentRowValues[] {
  rows.forEach((r: any, ind: number) => {
    const discipline_string: string = rows[ind]["discipline"];
    const type_cat: AuthorDisciplineFilter =
      AuthorDisciplineFilter[
        discipline_string as unknown as keyof typeof AuthorDisciplineFilter
      ];
    rows[ind]["discipline"] = type_cat;
  });
  return rows;
}

// const oneCapitalV = lift(oneCapital)
// const oneNumberV = lift(oneNumber)

// define a combinator that converts a check outputting an Either<E, A> into a check outputting a Either<NonEmptyArray<E>, A>
function lift<E, A>(
  check: (a: A) => Either<E, A>
): (a: A) => Either<NonEmptyArray<E>, A> {
  return (a) =>
    pipe(
      check(a),
      mapLeft((a) => [a])
    );
}
// const applicativeValidation = getValidation(getSemigroup<string>());
// https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja

// function validateStudentRow(s: string): Either<NonEmptyArray<string>, string> {
//   return pipe(
//     sequenceT(getApplicativeValidation(getSemigroup<string>()))(
//       minLengthV(s)
//       // oneCapitalV(s),
//       // oneNumberV(s)
//     ),
//     map(() => s)
//   );
// }

// const row_to_student = (row: RawStudentRowValues): Student => {
//   let student: Student = {
//     title: row.title,
//     info: row.info,
//     discipline:
//       AuthorDisciplineFilter[
//         row.discipline as unknown as keyof typeof AuthorDisciplineFilter
//       ],
//     author: row.author,
//     topic: Topic[row.topic as unknown as keyof typeof Topic],
//     theme:
//       ThemeCategoryFilter[
//         row.theme as unknown as keyof typeof ThemeCategoryFilter
//       ],
//     subtopic: MapSubTopic[row.topic as unknown as keyof typeof MapSubTopic],
//     series0101: row.series0101,
//     series0102: row.series0102,
//     series0201: row.series0201,
//     series0202: row.series0202,
//     series0301: row.series0301,
//     series0302: row.series0302,
//     //thumbnails: []
//     //
//   };
//   return student;
// };

function get_image(image: GalleryImage): Promise<HTMLImageElement> {
  const promise = new Promise<HTMLImageElement>(function (resolve, reject) {
    let img = new Image();
    img.src = image.thumbnail;
    // img.src = image.thumbnail;
    img.onload = () => {
      image.thumbnailHeight = img.height;
      image.thumbnailWidth = img.width;
      resolve(img);
    };
  });
  return promise;
}

function get_sheet<T>(key: string, sheet_num: number): Promise<GoolgeSheet<T>> {
  const promise = new Promise<GoolgeSheet<T>>(function (resolve, reject) {
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

function get_map_sheet(
  key: string,
  sheet_index: number
): Promise<void | RawStudentRowValues[]> {
  // function get_map_sheet(key: string, sheet_index: number): Promise<LabeledCols<MapRow[]>>{
  var to_get = get_sheet<RawStudentRowValues>(key, sheet_index)
    .then((map_sheet: GoolgeSheet<RawStudentRowValues>) => {
      const typed_map_rows = type_map_rows(map_sheet.data);
      return typed_map_rows;
    })
    .catch((err: any) => {
      console.error(`Error fetching DOC_KEY ${key}`);
    });
  return to_get;
}

function getAllFuncs(toCheck: any) {
  var props: any[] = [];
  var obj = toCheck;
  do {
    props = props.concat(Object.getOwnPropertyNames(obj));
  } while ((obj = Object.getPrototypeOf(obj)));

  return props.sort().filter(function (e, i, arr) {
    if (e !== arr[i + 1] && typeof toCheck[e] == "function") return true;
  });
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

function arraysEqual(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default map_data;

// Promise.all(gallery_image_responses).then(
//   (res: HTMLImageElement[]) => {
//     let sized_gallery_images = all_unsized_images.map(function (
//       def_img: GalleryImage,
//       i
//     ) {
//       def_img["thumbnailWidth"] = res[i].width * 0.05;
//       def_img["thumbnailHeight"] = res[i].height * 0.05;
//       return def_img;
//     });
//     // console.log(sized_gallery_images);
//     actions.set_gallery_images(sized_gallery_images);
//     actions.set_active_images(sized_gallery_images);
//   }
// );

// let unsized_gallery_images =
//   map_rows_to_images(succesful_map_rows);
// let image_responses: ImagePromise[] = unsized_gallery_images.map(
//   (gi: GalleryImage) => get_image(gi)
// );
// console.log(unsized_gallery_images);
// gallery_image_responses.push(...image_responses);
// all_unsized_images.push(...unsized_gallery_images);
// map_data.maps.push(...sheet_payload);
