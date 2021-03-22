import { Action, action, thunk, Thunk, debug } from 'easy-peasy';
import GetSheetDone from 'get-sheet-done';
import { TimeSeries, TimeRangeEvent, TimeRange} from "pondjs";

export interface GalleryImage{
  src: string,
  thumbnail: string,
  isSelected: boolean,
  caption: string, 
  thumbnailWidth: number,
  thumbnailHeight: number,
  tags: Tag[],
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

enum EventLevel{
  national = "national",
  state = "state", 
  city = "city",
}
export interface MapRow{
  title: string;
  info: string;
  author: string;
  tags: string;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  photo5: string;
  thumbnail: string;
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

export interface MapDataModel {
  filters: string[];
  map_spreadsheet: MapRow[],
  event_spreadsheet: EventRow[],
  active_images: GalleryImage[];
  gallery_images: GalleryImage[];
  timeline_series: TimelineData;
  loaded: boolean;
  active_lightbox: LightBoxContent;
  fetch_map_data: Thunk<MapDataModel>;
  filter_gallery: Action<MapDataModel, string>;
  set_map_spreadsheet: Action<MapDataModel, MapRow[]>;
  set_event_spreadsheet: Action<MapDataModel, EventRow[]>;
  set_gallery_images: Action<MapDataModel, GalleryImage[]>;
  set_active_images: Action<MapDataModel, GalleryImage[]>;
  set_timeline_series: Action<MapDataModel, TimelineData>;
  set_active_filters: Action<MapDataModel, any[]>;
  set_filters: Thunk<MapDataModel, string[]>;
  set_active_lightbox: Action<MapDataModel, GalleryImage>;
}

type ImagePromise = Promise<HTMLImageElement>;

const empty_nat: TimeSeries[] = [];
const empty_state: TimeSeries[] = [];
const empty_city: TimeSeries[] = [];
const test_initial: TimelineData = {
  national: empty_nat, 
  // national: [], 
  state: empty_state, 
  // state: [], 
  city: empty_city,
  // city:[],
}

// images: PhotoInfo[], 
// description: string,
// title: string,
const empty_photo: PhotoInfo[] = [];

const lb_initial: LightBoxContent = {
  images: empty_photo,
  description: "default",
  title: "string",
  author: "some author",
}
const map_data: MapDataModel = {

  active_images: [],
  filters: [],
  gallery_images: [], 
  timeline_series: test_initial, 
  loaded: false, 
  active_lightbox: lb_initial,
  map_spreadsheet: [],
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
    get_sheet<MapRow>(DOC_KEY, 1).then((map_sheet: LabeledCols<MapRow>)=>{
      map_data.maps = map_sheet.data;
      actions.set_map_spreadsheet(map_sheet.data);
      let unsized_gallery_images = map_rows_to_images(map_data.maps);
      let image_responses: ImagePromise[] = unsized_gallery_images.map((gi: GalleryImage)=>get_image(gi));
      
      Promise.all(image_responses).then((res: HTMLImageElement[])=>{
        let all_gallery_images = unsized_gallery_images.map(function(def_img: GalleryImage, i){
            def_img['thumbnailWidth'] =  res[i].width * .1;
            def_img['thumbnailHeight'] =  res[i].height * .1;
            return def_img
        })
        actions.set_gallery_images(all_gallery_images)
        actions.set_active_images(all_gallery_images)
      })
    }).catch((err: any)=>{
      console.log(`Error fetching DOC_KEY ${DOC_KEY}`);
    })

    get_sheet<EventRow>(DOC_KEY, 2).then((event_sheet: LabeledCols<EventRow>)=>{
      const typed_event_rows = type_event_rows(event_sheet.data);
      actions.set_event_spreadsheet(typed_event_rows);
      const timeline_series = make_time_series(typed_event_rows);
      actions.set_timeline_series(timeline_series)
    }).catch((err: any)=>{
      console.log(`Error fetching DOC_KEY ${DOC_KEY}`);
    })
  }),
  set_map_spreadsheet: action((state, map_rows)=>{
    state.map_spreadsheet = map_rows
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
  filter_gallery: action((state, full_tag_name)=>{
      const tag = get_tag(full_tag_name);
      let test_set: any[] = []
      state.gallery_images.forEach(function(gi: GalleryImage){
        if (arrayIncludesInObj(gi.tags, tag, tag)){
          test_set.push(gi)
        }
      })
      state.active_images = test_set;
  }),
  set_timeline_series: action((state, timeline_series)=>{
     state.timeline_series =  timeline_series
  }),
  set_filters: thunk((actions, filters)=>{
    console.log(filters);
    actions.filter_gallery(filters[0]);
    let real_tags = filters.map(f=>get_tag(f))
    actions.set_active_filters(real_tags);
  }),
  set_active_filters: action((state, active_filters)=>{
    state.filters = active_filters
    console.log(`ACTIVE FILTERS ARE ${debug(state.filters)}`)
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
    categorized_events[key] = series;
    
  });
  console.log(categorized_events);
  return categorized_events
}

function event_row_to_series(rows: EventRow[]): TimeSeries[]{
  const timeline_series = rows.map(function(ev: EventRow){
    const time_range = new TimeRange(ev.start, ev.end);
    const data: EventData = {
      title: ev.title,
      tags: ev.tags.split(',').map(t=>t.trim()),
    }
    // console.log(data);
    const time_range_event = new TimeRangeEvent(time_range, [data]);
    // console.log(getAllFuncs(time_range_event));
    const time_series =  new TimeSeries({
      name: "test",
      events: [time_range_event]
    })
    return time_series
  })
  return timeline_series
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
        tags: make_tags(map_row.tags)
  }))
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
    // console.log("inside promise");
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

// function getAllFuncs(toCheck: any) {
//   var props: any[] = [];
//   var obj = toCheck;
//   do {
//       props = props.concat(Object.getOwnPropertyNames(obj));
//   } while (obj = Object.getPrototypeOf(obj));

//   return props.sort().filter(function(e, i, arr) { 
//      if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
//   });
// }


export default map_data;
