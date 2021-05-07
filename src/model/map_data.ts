import { GitHub } from "@material-ui/icons";
import { Action, action, thunk, Thunk, debug } from "easy-peasy";
import GetSheetDone from "get-sheet-done";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import {
  AuthorDisciplineFilter,
  TopicSubCategoryFilter,
  ThemeCategoryFilter,
  EventLevel,
  GalleryFilterType,
  EventType,
  FilterGroup,
} from "./enums";
import type { FilterOption } from "./types";

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
  subtopic: TopicSubCategoryFilter;
  theme: ThemeCategoryFilter;
  year: any;
}

export interface YearSection {
  years: string[];
  discipline: string[];
}
export interface Tag {
  value: string;
  title: string;
}

export interface LabeledCols<T> {
  data: Array<T>;
  title: string;
  updated: string;
}

export interface MapRow {
  title: string;
  info: string;
  author: string;
  tags: string;
  discipline: string;
  theme: string;
  // series0101: string,
  // series0102: string,
  // series0201: string,
  // series0202: string,
  // series0301: string,
  // series0302: string,
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  photo5: string;
  thumbnail: string;
  year: string;
  subtopic: string;
}

// export interface Student{
//   maps:
// }

export interface YearDisciplineStats {
  sixteen: YearGroup;
  eighteen: YearGroup;
}

export interface MapStats {
  year: any;
  tag: any;
  theme: any;
}

export interface TagStats {
  BE: any;
  EE: any;
  NE: any;
  PE: any;
  SE: any;
}

export interface ThemeStats {
  EQUITY: number;
  ACCESS: number;
  DIVERSITY: number;
}

export interface YearGroup {
  ARTDESIGN: number;
  ARCHITECTURE: number;
  LANDSCAPE: number;
  OTHER: number;
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
export interface EventRow {
  start: Date;
  end: Date;
  title: string;
  info: string;
  tags: string;
  category: EventLevel;
  // type: EventType,
}

export interface ExternalData {
  events: EventRow[];
  maps: MapRow[];
}

export interface EventData {
  title: string;
  // event_type: EventType,
  // tags: string[];
}

export interface TimelineData {
  national: TimeSeries[];
  state: TimeSeries[];
  city: TimeSeries[];
  international: TimeSeries[];
  NA: TimeSeries[];
}

export interface FilterObj {
  filter_type: GalleryFilterType;
  filter: FilterOption;
}

export interface FilterResult {
  filter_func: any;
  filters: FilterOption[];
}

export interface MapDataModel {
  filter: FilterOption[];
  group_filter: FilterGroup;
  multi_tag: FilterOption[];
  map_spreadsheet: MapRow[];
  map_stats: MapStats | undefined;
  event_spreadsheet: EventRow[];
  active_images: GalleryImage[];
  gallery_images: GalleryImage[];
  timeline_series: TimelineData;
  loaded: boolean;
  active_lightbox: LightBoxContent;
  fetch_map_data: Thunk<MapDataModel>;
  // filter_gallery: Action<MapDataModel, FilterObj>;
  set_group_filter: Action<MapDataModel, FilterGroup>;
  set_map_spreadsheet: Action<MapDataModel, MapRow[]>;
  set_map_stats: Action<MapDataModel, MapStats>;
  set_event_spreadsheet: Action<MapDataModel, EventRow[]>;
  set_gallery_images: Action<MapDataModel, GalleryImage[]>;
  set_active_images: Action<MapDataModel, GalleryImage[]>;
  set_timeline_series: Action<MapDataModel, TimelineData>;
  set_active_filter: Action<MapDataModel, FilterOption[]>;
  thunk_set_filter: Thunk<MapDataModel, FilterOption>;
  reset_gallery: Action<MapDataModel>;
  set_active_lightbox: Action<MapDataModel, GalleryImage>;
  set_loaded: Action<MapDataModel, boolean>;
  thunk_set_multi_filter: Thunk<MapDataModel, FilterOption[]>;
  set_multi_filter: Action<MapDataModel, FilterOption[]>;
  filter_gallery_2: Action<MapDataModel, FilterResult>;
}

//______________________
type ImagePromise = Promise<HTMLImageElement>;

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

const empty_photo: PhotoInfo[] = [];

const lb_initial: LightBoxContent = {
  images: empty_photo,
  description: "default",
  title: "string",
  author: "some author",
};

const init_map_stats: MapStats = {
  year: {},
  tag: {},
  theme: {},
};

const map_data: MapDataModel = {
  active_images: [],
  filter: [],
  group_filter: FilterGroup.NONE,
  multi_tag: [],
  gallery_images: [],
  timeline_series: initial_empty_timeline,
  loaded: false,
  active_lightbox: lb_initial,
  map_spreadsheet: [],
  map_stats: init_map_stats,
  event_spreadsheet: [],
  fetch_map_data: thunk(async (actions) => {
    const DOC_KEY = "1-S8EkLYsknYoFWSynVeMQCi6Gf9PoV9A5ezzICXamJA";
    const map_rows: MapRow[] = [];
    const event_rows: EventRow[] = [];

    const map_data: ExternalData = {
      events: event_rows,
      maps: map_rows,
    };
    //get maps sheet
    let test_2018 = get_map_sheet(DOC_KEY, 3);
    let test_2020 = get_map_sheet(DOC_KEY, 4);
    let test_2016 = get_map_sheet(DOC_KEY, 5);
    let map_sheets = [test_2018, test_2020, test_2016];

    Promise.all(map_sheets).then((sheet_data: (void | MapRow[])[]) => {
      let gallery_image_responses: ImagePromise[] = [];
      let all_unsized_images: GalleryImage[] = [];

      sheet_data.forEach((sheet_payload: void | MapRow[]) => {
        if (Array.isArray(sheet_payload)) {
          let succesful_map_rows = sheet_payload as Array<MapRow>;
          let unsized_gallery_images = map_rows_to_images(succesful_map_rows);
          let image_responses: ImagePromise[] = unsized_gallery_images.map(
            (gi: GalleryImage) => get_image(gi)
          );
          gallery_image_responses.push(...image_responses);
          all_unsized_images.push(...unsized_gallery_images);
          map_data.maps.push(...sheet_payload);
        } else {
          console.error("did not get map row array");
        }
      });
      Promise.all(gallery_image_responses).then((res: HTMLImageElement[]) => {
        let sized_gallery_images = all_unsized_images.map(function (
          def_img: GalleryImage,
          i
        ) {
          def_img["thumbnailWidth"] = res[i].width * 0.05;
          def_img["thumbnailHeight"] = res[i].height * 0.05;
          return def_img;
        });
        // console.log(sized_gallery_images);
        actions.set_gallery_images(sized_gallery_images);
        actions.set_active_images(sized_gallery_images);
      });
      const map_stats = generate_map_stats(map_data.maps);
      // console.log(map_stats);
      actions.set_map_stats(map_stats);
      actions.set_map_spreadsheet(map_data.maps);
      actions.set_loaded(true);
    });

    get_sheet<EventRow>(DOC_KEY, 2)
      .then((event_sheet: LabeledCols<EventRow>) => {
        const typed_event_rows = type_event_rows(event_sheet.data);
        actions.set_event_spreadsheet(typed_event_rows);
        console.log(typed_event_rows);
        const timeline_series = make_time_series(typed_event_rows);
        console.log(timeline_series);

        actions.set_timeline_series(timeline_series);
        actions.set_loaded(true);
        // } catch (error) {
        // console.error("error generating time series");
        // }
      })
      .catch((err: any) => {
        console.error(`Error fetching DOC_KEY ${DOC_KEY}`);
      });
  }),
  set_map_spreadsheet: action((state, map_rows) => {
    state.map_spreadsheet = map_rows;
  }),
  set_map_stats: action((state, map_stats_obj) => {
    state.map_stats = map_stats_obj;
  }),
  set_event_spreadsheet: action((state, event_rows) => {
    console.log(event_rows);
    state.event_spreadsheet = event_rows;
  }),
  set_gallery_images: action((state, payload) => {
    state.gallery_images = payload;
  }),
  set_active_images: action((state, payload) => {
    state.active_images = payload;
  }),
  filter_gallery_2: action((state, filter_result) => {
    console.log(filter_result.filters, state.filter);
    console.log(filter_result.filters, debug(state.filter));
    if (arraysEqual(filter_result.filters, debug(state.filter))) {
      state.filter = [];
      state.active_images = state.gallery_images;
      console.log("got the same filte ");
    } else {
      state.active_images = state.gallery_images.filter(
        filter_result.filter_func
      );
      console.log(state.gallery_images.filter(filter_result.filter_func));
      state.filter = filter_result.filters;
    }
  }),
  set_timeline_series: action((state, timeline_series) => {
    console.log(timeline_series);
    console.log(Object.values(timeline_series));
    Object.values(timeline_series).forEach((ar: TimeSeries[]) => {
      console.log(ar);
      ar.forEach((ts) => {
        console.log(ts.events());
      });
    });
    // timeline_series.forEach(ts=>{
    //   console.log(ts.events());
    // })
    state.timeline_series = timeline_series;
  }),
  set_group_filter: action((state, group_filter) => {
    console.log("setting group filter", group_filter);
    // console.log(debug(state.group_filter), group_filter);
    // console.log(debug(state.group_filter), group_filter);
    if (state.group_filter === group_filter) {
      console.log("GOT SAME");
      state.group_filter = FilterGroup.NONE;
      state.filter = [];
    } else {
      state.group_filter = group_filter;
    }
  }),
  thunk_set_filter: thunk((actions, filter) => {
    function quick_get(
      group: FilterGroup,
      cat: keyof MapMetadata
    ): FilterResult {
      const filter_set = filter_group_to_set(group);
      if (
        // group instanceof
        group == FilterGroup.STUDENTS_2016 ||
        group == FilterGroup.STUDENTS_2018 ||
        group == FilterGroup.STUDENTS_2020
      ) {
        let splits = get_year_discipline(
          filter_set as AuthorDisciplineFilter[]
        );
        const filter_func = function (val: GalleryImage) {
          return splits.years.includes(val.tags[0].year);
          // splits.discipline.includes(val.tags[0].discipline)
        };
        return {
          filter_func: filter_func,
          filters: filter_set,
        } as FilterResult;
      } else {
        console.log("GOT TO NON YEAR");
        const filter_func = function (val: GalleryImage) {
          console.log(filter_set);
          console.log(val.tags[0][cat]);
          console.log(filter_set.includes(val.tags[0][cat]));
          return filter_set.includes(val.tags[0][cat]);
        };
        return {
          filter_func: filter_func,
          filters: filter_set,
        } as FilterResult;
      }
    }

    function get_group_filter(f: FilterOption): FilterResult {
      let filter_func: any;
      let filters: FilterOption[] = [];
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

    function get_single_filter(f: FilterOption): FilterResult {
      let filter_func: any;
      let filters: FilterOption[] = [];
      if (
        Object.values(TopicSubCategoryFilter).includes(
          f as TopicSubCategoryFilter
        )
      ) {
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
        Object.values(AuthorDisciplineFilter).includes(
          f as AuthorDisciplineFilter
        )
      ) {
        f = f as AuthorDisciplineFilter;
        let discipline = f.split("_")[0];
        let year = f.split("_")[1];
        filter_func = function (val: GalleryImage) {
          return (
            val.tags[0].year === year && val.tags[0].discipline == discipline
          );
        };
      }
      return {
        filter_func: filter_func,
        filters: [f],
      } as FilterResult;
    }

    let group_options = Object.values(FilterGroup);

    if (group_options.includes(filter as FilterGroup)) {
      let group_filter = get_group_filter(filter);
      actions.filter_gallery_2(group_filter);
      actions.set_group_filter(filter as FilterGroup);
    } else {
      let single_filter = get_single_filter(filter);
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
  set_active_lightbox: action((state, item) => {
    let source_row = state.map_spreadsheet.filter(
      (r) => r.photo1 === item.src
    )[0];
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
  thunk_set_multi_filter: thunk((actions, filters) => {
    console.log(filters);
    actions.set_multi_filter(filters);
  }),
  set_multi_filter: action((state, filters) => {
    state.multi_tag = filters;
  }),
};

function generate_map_stats(map_rows: MapRow[]): MapStats {
  const yd = generate_year_discpline_stats(map_rows);
  const td = generate_topic_stats(map_rows);
  const theme_stats = generate_theme_stats(map_rows);
  const map_stats: MapStats = {
    year: yd,
    tag: td,
    theme: theme_stats,
  };
  return map_stats;
}

function generate_year_discpline_stats(
  map_rows: MapRow[]
): YearDisciplineStats {
  const year_groups = groupBy(map_rows, "year");
  const yg_keys = Object.keys(year_groups);
  const max_unit_count = 10;

  const year_group = yg_keys.map((k: any, i: number) => {
    const year_breakdown = groupBy(year_groups[k], "discipline");
    let cats = Object.keys(year_breakdown);
    let final_data: any = {};
    cats.forEach((c) => {
      // console.log(year_groups[k]);
      // console.log(year_breakdown[c]);
      // console.log(year_groups[k].length);
      // console.log(year_groups[k].length);
      final_data[c] = Math.round(
        (year_breakdown[c].length / year_groups[yg_keys[i]].length) *
          max_unit_count
      );
    });
    return final_data;
  });
  const final_data: any = {};
  console.log(year_group);
  year_group.forEach((s, ind) => {
    final_data[yg_keys[ind]] = s;
  });
  let fomratted_data = final_data as YearDisciplineStats;
  return fomratted_data;
}

function generate_topic_stats(map_rows: MapRow[]): TagStats {
  const total_cat_blocks = 75;
  const topic_groups = groupBy(map_rows, "tags");
  let empty_cont: any = {};
  let keys = Object.keys(topic_groups);
  keys.forEach((k) => {
    const topic_group_count = topic_groups[k].length;
    const sub_groups = groupBy(topic_groups[k], "subtopic");
    const cat_percent = topic_groups[k].length / map_rows.length;
    const portioned_cat_blocks = cat_percent * total_cat_blocks;
    let empty_sg: any = {
      cat_percent: topic_groups[k].length / map_rows.length,
      cat_blocks: portioned_cat_blocks,
    };
    const sub_keys = Object.keys(sub_groups);
    sub_keys.forEach((sk) => {
      empty_sg[sk] = Math.round(
        ((Math.ceil(((sub_groups[sk].length / topic_group_count) * 100) / 20) *
          20) /
          100) *
          5
      );
    });
    empty_cont[k] = empty_sg;
  });

  return empty_cont as TagStats;
}

function generate_theme_stats(map_rows: MapRow[]): any {
  const num_theme_blocks = 25;
  //max number of blocks is 45
  const theme_groups = groupBy(map_rows, "theme");
  const theme_keys = Object.keys(theme_groups);
  let empty_theme_data: any = {};

  theme_keys.forEach((k) => {
    empty_theme_data[k] = Math.round(
      (theme_groups[k].length / map_rows.length) * num_theme_blocks
    );
    // empty_theme_data[k] = theme_groups[k].length/map_rows.length
  });
  return empty_theme_data as ThemeStats;
}

function make_time_series(rows: EventRow[]): TimelineData {
  const categorized_events = groupBy(rows, "category");
  console.log(categorized_events);
  Object.keys(categorized_events).forEach((key) => {
    console.log(key);
    const value: EventRow[] = categorized_events[key];
    const events = event_rows_to_time_range_events(value);
    const series = time_range_events_to_time_series(events);
    categorized_events[key] = series;
    console.log(series);
  });
  console.log(categorized_events);
  return categorized_events;
}

function event_rows_to_time_range_events(rows: EventRow[]): TimeRangeEvent[] {
  let all_events: TimeRangeEvent[] = [];
  console.log(rows);
  rows.forEach((event_row: EventRow) => {
    const time_range = new TimeRange(event_row.start, event_row.end);
    const data: EventData = {
      title: event_row.title,
    };
    console.log(data);
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
        console.log(row_count);
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
      // console.log(test_obj[k])
      new TimeSeries({
        name: "test",
        events: test_obj[k],
      })
  );
  console.log(row_arrays);
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

function map_rows_to_images(rows: MapRow[]): GalleryImage[] {
  let unsized_gallery_images: GalleryImage[] = rows.map((map_row: MapRow) => ({
    src: map_row.photo1,
    thumbnail: map_row.thumbnail,
    isSelected: false,
    caption: "Im in this other file",
    thumbnailWidth: 95,
    thumbnailHeight: 174,
    tags: [
      {
        discipline:
          AuthorDisciplineFilter[
            (map_row.discipline as unknown) as keyof typeof AuthorDisciplineFilter
          ],
        subtopic:
          TopicSubCategoryFilter[
            ((map_row.tags +
              "_" +
              map_row.subtopic) as unknown) as keyof typeof TopicSubCategoryFilter
          ],
        theme:
          ThemeCategoryFilter[
            (map_row.theme as unknown) as keyof typeof ThemeCategoryFilter
          ],
        year: map_row.year,
      },
    ],
  }));
  return unsized_gallery_images;
}

function groupBy(arr: any[], property: any) {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...(acc[cur[property]] || []), cur];
    return acc;
  }, {});
}

function type_event_rows(rows: any[]): EventRow[] {
  rows.forEach((r: any, ind: number) => {
    const cat_string: string = rows[ind]["category"];
    console.log(cat_string);
    const type_cat: EventLevel =
      EventLevel[(cat_string as unknown) as keyof typeof EventLevel];
    console.log(type_cat);
    rows[ind]["category"] = type_cat;
    const start_date = new Date(rows[ind]["start"]);
    const end_date = new Date(rows[ind]["end"]);
    rows[ind]["start"] = start_date;
    rows[ind]["end"] = end_date;
  });
  return rows;
}

function type_map_rows(rows: any[]): MapRow[] {
  rows.forEach((r: any, ind: number) => {
    const discipline_string: string = rows[ind]["discipline"];
    const type_cat: AuthorDisciplineFilter =
      AuthorDisciplineFilter[
        (discipline_string as unknown) as keyof typeof AuthorDisciplineFilter
      ];
    rows[ind]["discipline"] = type_cat;
    // console.log(rows[ind]["catedisciplinegory"])
  });
  return rows;
}

function get_image(image: GalleryImage): Promise<HTMLImageElement> {
  const promise = new Promise<HTMLImageElement>(function (resolve, reject) {
    let img = new Image();
    img.src = image.thumbnail;
    img.onload = () => {
      image.thumbnailHeight = img.height;
      image.thumbnailWidth = img.width;
      resolve(img);
    };
  });
  return promise;
}

function get_sheet<T>(key: string, sheet_num: number): Promise<LabeledCols<T>> {
  const promise = new Promise<LabeledCols<T>>(function (resolve, reject) {
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
): Promise<void | MapRow[]> {
  // function get_map_sheet(key: string, sheet_index: number): Promise<LabeledCols<MapRow[]>>{
  var to_get = get_sheet<MapRow>(key, sheet_index)
    .then((map_sheet: LabeledCols<MapRow>) => {
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
        TopicSubCategoryFilter.BE_ENERGY,
        TopicSubCategoryFilter.BE_HOUSING,
        TopicSubCategoryFilter.BE_TRANSPORTATION,
      ];
      break;
    case FilterGroup.ECONOMIC_TOPIC:
      my_filters = [
        TopicSubCategoryFilter.EE_COMMERCE,
        TopicSubCategoryFilter.EE_COSTOFLIVING,
        TopicSubCategoryFilter.EE_HOUSINGMARKET,
      ];
      break;
    case FilterGroup.NATURAL_TOPIC:
      my_filters = [
        TopicSubCategoryFilter.NE_GREENSPACE,
        TopicSubCategoryFilter.NE_POLLUTION,
        TopicSubCategoryFilter.NE_WATER,
      ];
      break;
    case FilterGroup.POLITICAL_TOPIC:
      my_filters = [
        TopicSubCategoryFilter.PE_ACTIVISM,
        TopicSubCategoryFilter.PE_GOVERMENT,
        TopicSubCategoryFilter.PE_LEGISLATION,
      ];
      break;
    case FilterGroup.SOCIAL_TOPIC:
      my_filters = [
        TopicSubCategoryFilter.SE_EDUCATION,
        TopicSubCategoryFilter.SE_HEALTH,
        TopicSubCategoryFilter.SE_POPULATION,
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
