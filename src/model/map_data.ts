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
  tags: MapMetada[];
}

export interface MapMetada {
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
  tags: string[];
}

export interface TimelineData {
  national: TimeSeries[];
  state: TimeSeries[];
  city: TimeSeries[];
}

export interface FilterObj {
  filter_type: GalleryFilterType;
  filter: FilterOption;
}

export interface MapDataModel {
  filter: FilterOption[];
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
  filter_gallery: Action<MapDataModel, FilterObj>;
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
}

//______________________
type ImagePromise = Promise<HTMLImageElement>;

const empty_nat: TimeSeries[] = [];
const empty_state: TimeSeries[] = [];
const empty_city: TimeSeries[] = [];
const test_initial: TimelineData = {
  national: empty_nat,
  state: empty_state,
  city: empty_city,
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

// const resize_thumbnail =(gi: GalleryImage, )

const map_data: MapDataModel = {
  active_images: [],
  filter: [],
  multi_tag: [],
  gallery_images: [],
  timeline_series: test_initial,
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
        console.log(sized_gallery_images);
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
        const timeline_series = make_time_series(typed_event_rows);

        actions.set_event_spreadsheet(typed_event_rows);
        actions.set_timeline_series(timeline_series);
        actions.set_loaded(true);
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
    state.event_spreadsheet = event_rows;
  }),
  set_gallery_images: action((state, payload) => {
    state.gallery_images = payload;
  }),
  set_active_images: action((state, payload) => {
    console.log(debug(payload));
    state.active_images = payload;
  }),
  filter_gallery: action((state, filter_option) => {
    // filter_option.forEach((f: FilterObj)=>{
    // if (filter_option.filter.some(f=>f === FilterGroup.ACCESS_THEME)){
    //   state.active_images = state.gallery_images.filter(im=>im.tags[0].theme === "ACCESS")
    // }
    console.log(debug(state.gallery_images));
    if (filter_option.filter !== null) {
      if (filter_option.filter_type === GalleryFilterType.FILTERGROUP) {
        // const filters =
        const filters = filter_group_to_set(
          filter_option.filter as FilterGroup
        );
        state.filter = filters;

        if (
          filter_option.filter === FilterGroup.STUDENTS_2016 ||
          FilterGroup.STUDENTS_2018 ||
          FilterGroup.STUDENTS_2020
        ) {
          const sets = get_year_discipline(filters as AuthorDisciplineFilter[]);
          console.log(sets);
          state.active_images = state.gallery_images.filter(
            (gi) =>
              (gi.tags[0].year =
                sets.years[0] &&
                sets.discipline.includes(gi.tags[0].discipline))
          );
          console.log(debug(state.gallery_images));
        }
        if (
          filter_option.filter == FilterGroup.BUILT_TOPIC ||
          FilterGroup.NATURAL_TOPIC ||
          FilterGroup.POLITICAL_TOPIC ||
          FilterGroup.ECONOMIC_TOPIC ||
          FilterGroup.SOCIAL_TOPIC
        ) {
          state.active_images = state.gallery_images.filter((gi) =>
            filters.includes(gi.tags[0].subtopic)
          );
        }

        // state.active_images = state.gallery_images.filter(gi=>)
        console.log(filters);
      }
    }

    // })
    // if filter_option.filter[0] == null{}
    // filter_option.filter.forEach((f: FilterOption)=>{
    //     if (f !== null ){
    //       console.log(f.split("_"));
    //     }
    //     // if (filter_option.filter_type === GalleryFilterType.DISCIPLINE){

    //     // let split =  f.split("_");
    //     // if (split){
    //     //   let discipline = split[0];
    //     //   let year = split[1];
    //     //   console.log(year, discipline);
    //     //   const with_discipline_and_year = state.gallery_images.filter(gi=>gi.tags[0].discipline === discipline  && gi.tags[0].year === year)
    //     //   state.active_images = with_discipline_and_year;
    //     //   console.log(debug(with_discipline_and_year));
    //     //   state.filter = filter_option.filter;
    //     // }
    //     // }
    // })

    // if (filter_option.filter === state.filter){
    //   state.filter = null;
    //   state.active_images = state.gallery_images;
    // } else {
    //   if (filter_option.filter_type === GalleryFilterType.TOPIC){
    //     const with_subtopic = state.gallery_images.filter(gi=>gi.tags[0].subtopic === filter_option.filter)
    //     state.active_images = with_subtopic;
    //     state.filter = filter_option.filter;
    //   }
    //   if (filter_option.filter_type === GalleryFilterType.THEME){
    //     const with_theme = state.gallery_images.filter(gi=>gi.tags[0].theme === filter_option.filter)
    //     state.active_images = with_theme;
    //     state.filter = filter_option.filter;
    //   }
    //   if (filter_option.filter_type === GalleryFilterType.DISCIPLINE){
    //     let split =  filter_option.filter?.split("_");
    //     if (split){
    //       let discipline = split[0];
    //       let year = split[1];
    //       console.log(year, discipline);
    //       const with_discipline_and_year = state.gallery_images.filter(gi=>gi.tags[0].discipline === discipline  && gi.tags[0].year === year)
    //       state.active_images = with_discipline_and_year;
    //       console.log(debug(with_discipline_and_year));
    //       state.filter = filter_option.filter;
    //     }
    // }
    // }
  }),
  set_timeline_series: action((state, timeline_series) => {
    //  console.log(timeline_series);
    state.timeline_series = timeline_series;
  }),
  thunk_set_filter: thunk((actions, filter) => {
    if (filter == null) {
      actions.reset_gallery();
    }
    // if (filter.some( f=> f === null)){
    //     actions.reset_gallery();
    // }
    let group_options = Object.values(FilterGroup);
    let from_group_filters: FilterOption[] = [];
    if (group_options.includes(filter as FilterGroup)) {
      console.log(filter);
      from_group_filters =
        filter === FilterGroup.STUDENTS_2016
          ? [
              AuthorDisciplineFilter.ARTDESIGN_2016,
              AuthorDisciplineFilter.OTHER_2016,
              AuthorDisciplineFilter.ARCHITECTURE_2016,
              AuthorDisciplineFilter.LANDSCAPE_2016,
            ]
          : [];
    }
    if (group_options.includes(filter as FilterGroup)) {
      actions.filter_gallery({
        filter_type: GalleryFilterType.FILTERGROUP,
        filter: filter,
      });
    }
    // }
    // filter.forEach(f=>{
    //   actions.filter_gallery({

    //   })
    // })
    // if (filter == null){
    //   actions.reset_gallery();
    // }

    let cat_options = Object.values(TopicSubCategoryFilter);

    if (cat_options.includes(filter as TopicSubCategoryFilter)) {
      actions.filter_gallery({
        filter_type: GalleryFilterType.TOPIC,
        filter: filter,
      });
    }

    // let theme_options = Object.values(ThemeCategoryFilter);
    // if (theme_options.includes(filter as ThemeCategoryFilter)){
    //   actions.filter_gallery({
    //     filter_type: GalleryFilterType.THEME,
    //     filter: filter,
    //   })
    // }

    // let author_options = Object.values(AuthorDisciplineFilter);
    // if (author_options.includes(filter as AuthorDisciplineFilter)){
    //   actions.filter_gallery({
    //     filter_type: GalleryFilterType.DISCIPLINE,
    //     filter: filter,
    //   })
    // }
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
  Object.keys(categorized_events).forEach((key) => {
    const value = categorized_events[key];
    const series = event_row_to_series(value);
    categorized_events[key] = series;
  });
  console.log(categorized_events);
  return categorized_events;
}

function event_row_to_series(rows: EventRow[]): TimeSeries[] {
  // const all_events:  TimeRangeEvent[] = [];
  let all_series: TimeSeries[] = [];
  let all_events: TimeRangeEvent[] = [];
  rows.forEach((event_row: EventRow) => {
    // if (event_row.type === EventType.DATE){
    // console.log("GOT DATE TYPE");
    // const time_range = new TimeRange(event_row.start, event_row.end);
    // const data: EventData = {
    //   title: event_row.title,
    //   // event_type: event_row.type,
    //   tags: event_row.tags.split(',').map(t=>t.trim()),
    // }
    // const time_range_event = new TimeRangeEvent(time_range, [data]);
    // // console.log(time_range_event)
    // all_events.push(time_range_event);
    // all
    // all_events.push(time_range_event);
    // const time_series =  new TimeSeries({
    //   name: "test",
    //   events: [time_range_event]
    // })
    // all_series.push(time_series);
    // return time_series
    // }

    // if (event_row.type === EventType.RANGE){
    // console.log("GOT RANGE TYPE");
    const time_range = new TimeRange(event_row.start, event_row.end);
    const data: EventData = {
      title: event_row.title,
      // event_type: event_row.type,
      tags: event_row.tags.split(",").map((t) => t.trim()),
    };
    const time_range_event = new TimeRangeEvent(time_range, [data]);
    all_events.push(time_range_event);
    // all_events.push(time_range_event);
    // const time_series =  new TimeSeries({
    //   name: "test",
    //   events: [time_range_event]
    // })
    // all_series.push(time_series);
    // return time_series
    // }
  });
  return group_events_to_rows(all_events);
}

function group_events_to_rows(events: TimeRangeEvent[]): TimeSeries[] {
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
            return false;
          } else {
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
      // console.log(test_obj[k])
      new TimeSeries({
        name: "test",
        events: test_obj[k],
      })
  );
  // console.log(row_arrays)
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
    const type_cat: EventLevel =
      EventLevel[(cat_string as unknown) as keyof typeof EventLevel];
    // const type_event: EventType  = EventType[event_type_string as unknown as keyof typeof EventType];
    rows[ind]["category"] = type_cat;
    // rows[ind]["type"] = type_event;

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
  // const split = author_enum.split("_");
  //   if (split){
  //     let discipline = split[0];
  //     let year = split[1];
  // }
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
  }
  return my_filters;
}

export default map_data;
