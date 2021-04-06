import { Action, action, thunk, Thunk, debug } from 'easy-peasy';
import GetSheetDone from 'get-sheet-done';
import { TimeSeries, TimeRangeEvent, TimeRange} from "pondjs";
import { AuthorDisciplineFilter, TopicSubCategoryFilter, ThemeCategoryFilter, EventLevel, GalleryFilterType} from './enums';

export interface GalleryImage{
  src: string,
  thumbnail: string,
  isSelected: boolean,
  caption: string, 
  thumbnailWidth: number,
  thumbnailHeight: number,
  tags: MapMetada[],
  // tags: Tag[],
}
// discipline: map_row.discipline,
// subtopic: map_row.subtopic,
// theme: map_row.theme,
// year: map_row.year,

export interface MapMetada{
  discipline: AuthorDisciplineFilter,
  subtopic: TopicSubCategoryFilter,
  theme: ThemeCategoryFilter, 
  year: any,
} 

export interface Tag{
  value: string, 
  title: string, 
}

export interface LabeledCols<T>{
  data: Array<T>,
  title: string,
  updated: string, 
}



// export enum ClassYear{
//   eighteen,
//   sixteen,
//   twenty, 
// }

export interface MapRow{
  title: string;
  info: string;
  author: string;
  tags: string;
  discipline: string, 
  theme: string,
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  photo5: string;
  thumbnail: string;
  year: string;
  subtopic: string;
}

export interface YearDisciplineStats{
  sixteen: YearGroup,
  eighteen: YearGroup,
}

export interface MapStats{
  year: any,
  tag: any,
  theme: any,
}


export interface TagStats{
  BE: any,
  EE: any,
  NE: any,
  PE: any, 
  SE: any,
}

export interface ThemeStats{
  EQUITY: number,
  ACCESS: number,
  DIVERSITY: number,
}

export interface YearGroup{
  ARTDESIGN: number,
  ARCHITECTURE: number,
  LANDSCAPE: number,
  OTHER: number,
}

export interface LightBoxContent{
  images: PhotoInfo[], 
  description: string,
  author: string, 
  title: string,
}

export interface PhotoInfo{
  source: string, 
  kind: string, 
}
export interface EventRow{
  start: Date,
  end: Date,
  title: string,
  info: string,
  tags: string,
  category: EventLevel, 
}

export interface ExternalData{
  events: EventRow[],
  maps: MapRow[],
}

export interface EventData{
  title: string,
  tags: string[]
}

export interface TimelineData{
  national: TimeSeries[],
  state: TimeSeries[],
  city: TimeSeries[],
}



type FilterOption =  AuthorDisciplineFilter | TopicSubCategoryFilter | ThemeCategoryFilter | null;
export interface FilterObj{
  filter_type: GalleryFilterType,
  filter: FilterOption, 
}

export interface MapDataModel {
  filter: FilterOption;
  // filters: string[];
  map_spreadsheet: MapRow[],
  map_stats: MapStats | undefined,
  event_spreadsheet: EventRow[],
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
  set_active_filter: Action<MapDataModel, FilterOption>;
  thunk_set_filter: Thunk<MapDataModel, FilterOption>;
  reset_gallery: Action<MapDataModel>;
  // thunk_set_filter: Thunk<MapDataModel, string[]>;
  set_active_lightbox: Action<MapDataModel, GalleryImage>;
}

type ImagePromise = Promise<HTMLImageElement>;

const empty_nat: TimeSeries[] = [];
const empty_state: TimeSeries[] = [];
const empty_city: TimeSeries[] = [];
const test_initial: TimelineData = {
  national: empty_nat, 
  state: empty_state, 
  city: empty_city,
}

const empty_photo: PhotoInfo[] = [];

const lb_initial: LightBoxContent = {
  images: empty_photo,
  description: "default",
  title: "string",
  author: "some author",
}

const init_map_stats: MapStats = {
  year: {},
  tag: {},
  theme: {},
}

const map_data: MapDataModel = {

  active_images: [],
  filter: null,
  gallery_images: [], 
  timeline_series: test_initial, 
  loaded: false, 
  active_lightbox: lb_initial,
  map_spreadsheet: [],
  map_stats: init_map_stats,
  event_spreadsheet: [],
  fetch_map_data: thunk(async actions =>{
    const DOC_KEY = '1-S8EkLYsknYoFWSynVeMQCi6Gf9PoV9A5ezzICXamJA';
    const map_rows: MapRow[] = [];
    const event_rows: EventRow[] = [];

    const map_data: ExternalData = {
      events:  event_rows,
      maps:  map_rows
    };
    //get maps sheet
    let test_2018 = get_map_sheet(DOC_KEY, 3);
    let test_2020 = get_map_sheet(DOC_KEY, 4);
    let map_sheets = [test_2018, test_2020];

    Promise.all(map_sheets).then((sheet_data: (void | MapRow[])[])=>{
      let gallery_image_responses: ImagePromise[] = [];
      let all_unsized_images: GalleryImage[] = [];

      sheet_data.forEach((sheet_payload: void | MapRow[]) => {
        if (Array.isArray(sheet_payload)){
          let succesful_map_rows = sheet_payload as Array<MapRow>
          console.log("got array");
          console.log(succesful_map_rows);
          let unsized_gallery_images = map_rows_to_images(map_data.maps);
          let image_responses: ImagePromise[] = unsized_gallery_images.map((gi: GalleryImage)=>get_image(gi));
          gallery_image_responses.push(...image_responses);
          all_unsized_images.push(...unsized_gallery_images);
          map_data.maps.push(...sheet_payload);
        }
      })
      Promise.all(gallery_image_responses).then((res: HTMLImageElement[])=>{
        let sized_gallery_images = all_unsized_images.map(function(def_img: GalleryImage, i){
            def_img['thumbnailWidth'] =  res[i].width * .05;
            def_img['thumbnailHeight'] =  res[i].height * .05;
            return def_img
        })
        actions.set_gallery_images(sized_gallery_images)
        actions.set_active_images(sized_gallery_images)
      })
      const map_stats= generate_map_stats(map_data.maps);
      actions.set_map_stats(map_stats);
      actions.set_map_spreadsheet(map_data.maps);
    });

    get_sheet<EventRow>(DOC_KEY, 2).then((event_sheet: LabeledCols<EventRow>)=>{
      const typed_event_rows = type_event_rows(event_sheet.data);
      actions.set_event_spreadsheet(typed_event_rows);
      const timeline_series = make_time_series(typed_event_rows);
      actions.set_timeline_series(timeline_series)
    }).catch((err: any)=>{
      console.error(`Error fetching DOC_KEY ${DOC_KEY}`);
    })
  }),
  set_map_spreadsheet: action((state, map_rows)=>{
    state.map_spreadsheet = map_rows
  }),
  set_map_stats: action((state, map_stats_obj)=>{
    state.map_stats = map_stats_obj;
  }),
  set_event_spreadsheet: action((state, event_rows)=>{
    state.event_spreadsheet = event_rows
  }),
  set_gallery_images: action((state, payload)=>{
    console.log("GOT SET GALLERY IMAGES")
    console.log(payload);
    state.gallery_images = payload
  }),
  set_active_images: action((state, payload)=>{
    state.active_images = payload
  }),
  filter_gallery: action((state, filter_option)=>{
    if (filter_option.filter_type === GalleryFilterType.TOPIC){
      const with_subtopic = state.gallery_images.filter(gi=>gi.tags[0].subtopic == filter_option.filter)
      state.active_images = with_subtopic;
      state.filter = filter_option.filter;
    }
    if (filter_option.filter_type === GalleryFilterType.THEME){
      const with_theme = state.gallery_images.filter(gi=>gi.tags[0].theme == filter_option.filter)
      state.active_images = with_theme;
      state.filter = filter_option.filter;
    }
    if (filter_option.filter_type === GalleryFilterType.DISCIPLINE){
      const with_discipline = state.gallery_images.filter(gi=>gi.tags[0].discipline == filter_option.filter)
      state.active_images = with_discipline;
      state.filter = filter_option.filter;
    }
  }),
  set_timeline_series: action((state, timeline_series)=>{
     state.timeline_series =  timeline_series
  }),
  thunk_set_filter: thunk((actions, filter)=>{
    if (filter == null){
      actions.reset_gallery();
    } 
    
    let cat_options = Object.values(TopicSubCategoryFilter);
    if (cat_options.includes(filter as TopicSubCategoryFilter)){
      console.log("CONTAINED IN SUB CAT FILTERS!");
      actions.filter_gallery({
        filter_type: GalleryFilterType.TOPIC,
        filter: filter,
      })
    }

    let theme_options = Object.values(ThemeCategoryFilter);
    if (theme_options.includes(filter as ThemeCategoryFilter)){
      actions.filter_gallery({
        filter_type: GalleryFilterType.THEME,
        filter: filter,
      })
    } 

    let author_options = Object.values(AuthorDisciplineFilter);
    if (author_options.includes(filter as AuthorDisciplineFilter)){
      actions.filter_gallery({
        filter_type: GalleryFilterType.DISCIPLINE,
        filter: filter,
      })
    } 
    
  }),
  reset_gallery: action((state)=>{
    state.active_images = state.gallery_images; 
  }),
  set_active_filter: action((state, active_filter)=>{
    state.filter = active_filter
  }),
  set_active_lightbox: action((state, item)=>{
    console.log(item); 
    let source_row  =  state.map_spreadsheet.filter(r=>r.photo1 === item.src)[0];

    console.log("🚀 ~ file: map_data.ts ~ line 192 ~ set_active_lightbox:action ~ source_row", debug(source_row))
    let photo_sources: PhotoInfo[] = [];
    let photos = Object.keys(source_row).forEach(function(k: string){
      
        if (k.startsWith('photo')){
          const key = k as keyof typeof source_row;
          const photo_info: PhotoInfo = {
            source: source_row[key],
            kind: k
          }
          photo_sources.push(photo_info)
        }
    })
    const info: LightBoxContent = {
      images: photo_sources,
      description: source_row.info,
      title: source_row.title,
      author: source_row.author,
    }
    state.active_lightbox = info
  })  
}

const arrayIncludesInObj = (arr: any[], key: string, valueToCheck: string): boolean => {
  const has_tag = arr.some(value => value["title"] === valueToCheck);
  return has_tag
}
const getKeyValue = <T extends object, U extends keyof T>(key: U) => (obj: T) =>
      obj[key];

function get_tag(category: string): string{
  let tag = "";
  console.log(category);
  console.log(category == "POLITICAL ENVIRONMENT")
  if (category == "BUILT ENVIRONMENT"){
    tag = "BE";
  } 
  if (category == "POLITICAL ENVIRONMENT"){
    tag = "PE"
  } 
  if (category == "SOCIAL ENVIRONMENT"){
    tag = "SE"
  } 
  if (category == "ENVIRONMENTAL ENVIRONMENT"){
    tag = "EE"
  } 
  console.log(tag)
  return tag
}
// const is_in_enum(the_enum: any, val: any): bool{
//   const enum_values: string[] = Object.values(the_enum);
//   return enum_values.contains(val);
// }
function generate_map_stats(map_rows: MapRow[]): MapStats{
  const yd = generate_year_discpline_stats(map_rows)
  console.log(yd);
  const td = generate_topic_stats(map_rows)
  console.log(td);
  const theme_stats = generate_theme_stats(map_rows)
  const map_stats: MapStats = {
    year: yd,
    tag: td,
    theme: theme_stats,
  }
  console.log(map_stats);
  return map_stats
  // year: YearGroup,
  // tag: TagStats,
  // theme: ThemeStats,
}

function generate_year_discpline_stats(map_rows: MapRow[]): YearDisciplineStats{
  const year_groups = groupBy(map_rows, "year");
  const yg_keys = Object.keys(year_groups);
  const max_unit_count = 21;

  const year_group = yg_keys.map((k: any, i: number )=>{
    const year_breakdown = groupBy(year_groups[k], "discipline");
    let cats = Object.keys(year_breakdown);
    let final_data: any = {};
    // console.log(year_groups[yg_keys[k]].length); 
    // let year_group_lenght = year_group[].length;
    cats.forEach(c=>{
      console.log(year_groups[k]);
      console.log(year_breakdown[c]);
      console.log(year_groups[k].length);
      console.log(year_groups[k].length);
      final_data[c] = Math.round((year_breakdown[c].length/year_groups[yg_keys[i]].length)*max_unit_count);
    });
    return final_data
  })
  const final_data: any = {};
  console.log(year_group);
  year_group.forEach((s, ind)=>{
      console.log(s);
      final_data[yg_keys[ind]] = s    
  })
  console.log(final_data);
  let fomratted_data = final_data as YearDisciplineStats;
  return fomratted_data
}

function generate_topic_stats(map_rows: MapRow[]): TagStats {
  const total_cat_blocks = 75;
  const topic_groups = groupBy(map_rows, "tags")
  let empty_cont: any = {}
  let keys = Object.keys(topic_groups);
  keys.forEach(k=>{
    // console.log(topic_groups[k].length);
    const topic_group_count = topic_groups[k].length;
    const sub_groups = groupBy(topic_groups[k], "subtopic");
    const cat_percent = topic_groups[k].length/map_rows.length;
    const portioned_cat_blocks = cat_percent*total_cat_blocks;
    let empty_sg: any = {
      cat_percent: topic_groups[k].length/map_rows.length,
      cat_blocks: portioned_cat_blocks,
    };
    const sub_keys = Object.keys(sub_groups);
    sub_keys.forEach(sk=>{
      empty_sg[sk] = Math.round(((Math.ceil(((sub_groups[sk].length/topic_group_count)*100)/20)*20)/100)*5)
    })
    empty_cont[k] = empty_sg
  });
  
  return empty_cont as TagStats
  
}

function generate_theme_stats(map_rows: MapRow[]): any{
  const num_theme_blocks = 25
  //max number of blocks is 45
  const theme_groups = groupBy(map_rows, "theme");
  const theme_keys = Object.keys(theme_groups);
  let empty_theme_data: any = {};
  
  theme_keys.forEach(k=>{
    empty_theme_data[k] = Math.round((theme_groups[k].length/map_rows.length)*num_theme_blocks)
    // empty_theme_data[k] = theme_groups[k].length/map_rows.length
  })
  console.log(empty_theme_data);
  return empty_theme_data as ThemeStats
}

function make_tags(tag_data: string): Tag[]{
    let split_tag_values = tag_data.split(',');
    let tags = split_tag_values.map(tag=>({value: tag.trim(), title: tag.trim()}));
    return tags
}

function make_time_series(rows: EventRow[]): TimelineData{
  const categorized_events = groupBy(rows, "category");
  Object.keys(categorized_events).forEach(key => {
    const value = categorized_events[key];
    const series = event_row_to_series(value);
    console.log("🚀 ~ file: map_data.ts ~ line 277 ~ Object.keys ~ series", series)
    const sorted_events = series.sort();
    // console.log("🚀 ~ file: map_data.ts ~ line 279 ~ Object.keys ~ sorted_events", sorted_events)
    categorized_events[key] = series;
    
  });
  console.log(categorized_events);
  return categorized_events
}

function event_row_to_series(rows: EventRow[]): TimeSeries[]{
  const all_events:  TimeRangeEvent[] = [];
  const timeline_series = rows.map(function(ev: EventRow){
    const time_range = new TimeRange(ev.start, ev.end);
    const data: EventData = {
      title: ev.title,
      tags: ev.tags.split(',').map(t=>t.trim()),
    }
    // console.log(data);
    const time_range_event = new TimeRangeEvent(time_range, [data]);

    // console.log(getAllFuncs(time_range_event));
    all_events.push(time_range_event);
    const time_series =  new TimeSeries({
      name: "test",
      events: [time_range_event]
    })
    return time_series
  })
  console.log(all_events);
  try{
    let test_sect = group_events_to_rows(all_events);
    return test_sect
  } catch (error){
    console.error(`error grouping events into rows ${error}`)
  }

  return timeline_series
  return timeline_series
}

function group_events_to_rows(events: TimeRangeEvent[]): TimeSeries[] {
  // let all_rows : TimeRangeEvent[][] = [];
  let test_obj: any = {};
  test_obj[0] = [];
      var cur_row: TimeRangeEvent[] = [];
      (events as TimeRangeEvent[]).forEach((ev2: TimeRangeEvent, ind: number, array: TimeRangeEvent[])=>{
        let row_count = 0;
        
        if (array.every((e3)=>{
          if (ev2 == e3){
            console.log("FOUND SELF");
            return true
          }
          if (date_range_overlaps(e3.begin(), e3.end(), ev2.begin(), ev2.end())){
              return false
          } else {
            return true
          }
        })){
          test_obj[row_count].push(ev2)
          console.log("CAN PUSH!!!");
          console.log("splicing ind", ind);
          console.log(cur_row);
        } else {
          row_count = row_count + 1;
          test_obj[ind] = [ev2]
          console.log(cur_row);
          console.log("CANT PUSH!!!");
        }
      })
      const sorted_events= Object.keys(test_obj).map(k=>{
        test_obj[k] = test_obj[k].sort((a: any,b: any)=>a.begin()-b.begin());
      })
      const row_arrays = Object.keys(sorted_events).map(k=>(
        
        new TimeSeries({
          name: "test",
          events: test_obj[k],
          })
      ))
      console.log(row_arrays);
      return row_arrays
}

function date_range_overlaps(a_start: Date, a_end: Date, b_start: Date, b_end: Date) {
  if (a_start < b_start && b_start < a_end) return true; // b starts in a
  if (a_start < b_end   && b_end   < a_end) return true; // b ends in a
  if (b_start <  a_start && a_end   <  b_end) return true; // a in b
  return false;
}

function map_rows_to_images(rows: MapRow[]): GalleryImage[]{
  let unsized_gallery_images: GalleryImage[] = rows.map((map_row: MapRow)=>(
    {
        src: map_row.photo1,
        thumbnail: map_row.thumbnail,
        isSelected: false,
        caption: "Im in this other file",
        thumbnailWidth: 95,
        thumbnailHeight: 174,
        tags: [{
          discipline: AuthorDisciplineFilter[map_row.discipline as unknown as keyof typeof AuthorDisciplineFilter],
          subtopic: TopicSubCategoryFilter[map_row.tags + "_" + map_row.subtopic as unknown as keyof typeof TopicSubCategoryFilter],
          theme: ThemeCategoryFilter[map_row.theme as unknown as keyof typeof ThemeCategoryFilter],
          year: map_row.year,
        }]
  }))
    console.log(unsized_gallery_images);
    return unsized_gallery_images
}

function groupBy(arr: any[], property: any) {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...acc[cur[property]] || [], cur];
    return acc;
  }, {});
}

function type_event_rows(rows: any[]): EventRow[]{
  rows.forEach((r: any, ind: number)=>{
    const cat_string: string = rows[ind]["category"];
    const type_cat: EventLevel  = EventLevel[cat_string as unknown as keyof typeof EventLevel];
    rows[ind]["category"] = type_cat;
    const start_date = new Date(rows[ind]["start"]);
    const end_date = new Date(rows[ind]["end"]);
    rows[ind]["start"] = start_date;
    rows[ind]["end"] = end_date;
    console.log(rows[ind]["category"])
  })
  return rows
}

function type_map_rows(rows: any[]): MapRow[]{
  rows.forEach((r: any, ind: number)=>{
    const discipline_string: string = rows[ind]["discipline"];
    const type_cat: AuthorDisciplineFilter  = AuthorDisciplineFilter[discipline_string as unknown as keyof typeof AuthorDisciplineFilter];
    rows[ind]["discipline"] = type_cat;
    console.log(rows[ind]["catedisciplinegory"])
  })
  return rows
}

function get_image(image: GalleryImage): Promise<HTMLImageElement>{
  const promise = new Promise<HTMLImageElement>(function(resolve, reject) {
    console.log("inside promise");
    let img = new Image();
    img.src = image.thumbnail;
    img.onload = () => {
      console.log(
        "imge src",
        img.src,
        "width ",
        img.width,
        "height",
        img.height
      );
      image.thumbnailHeight = img.height;
      image.thumbnailWidth = img.width;
      resolve(img);
    };
  });
  return promise
}

function get_sheet <T>(key: string, sheet_num: number): Promise<LabeledCols<T>>{
  const promise = new Promise<LabeledCols<T>>(function(resolve, reject) {
    GetSheetDone.labeledCols(key, sheet_num).then((sheet: any) => {
        resolve(sheet)
         console.log(sheet)
       }).catch((err: any )=> {
         console.log(`Error fetching DOC_KEY ${key}, sheet number ${sheet_num}`);
         console.error(err);
    });
  });
  return promise
}

function get_map_sheet(key: string, sheet_index: number): Promise<void | MapRow[]>{
// function get_map_sheet(key: string, sheet_index: number): Promise<LabeledCols<MapRow[]>>{
  var to_get =  get_sheet<MapRow>(key, sheet_index).then((map_sheet: LabeledCols<MapRow>)=>{
    const typed_map_rows = type_map_rows(map_sheet.data);
    // let unsized_gallery_images = map_rows_to_images(typed_map_rows);
    // let image_responses: ImagePromise[] = unsized_gallery_images.map((gi: GalleryImage)=>get_image(gi));
    
    // Promise.all(image_responses).then((res: HTMLImageElement[])=>{
    //   let sized_gallery_images = unsized_gallery_images.map(function(def_img: GalleryImage, i){
    //       def_img['thumbnailWidth'] =  res[i].width * .05;
    //       def_img['thumbnailHeight'] =  res[i].height * .05;
    //       return def_img
    //   })
    // })
   return typed_map_rows
  }).
  catch((err: any)=>{
    console.error(`Error fetching DOC_KEY ${key}`);
  })
return to_get
}

function getAllFuncs(toCheck: any) {
  var props: any[] = [];
  var obj = toCheck;
  do {
      props = props.concat(Object.getOwnPropertyNames(obj));
  } while (obj = Object.getPrototypeOf(obj));

  return props.sort().filter(function(e, i, arr) { 
     if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
  });
}


export default map_data;
