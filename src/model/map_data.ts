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

export interface EventRow{
  start: string,
  end: string,
  title: string,
  info: string,
  tags: string,
}
export interface ExternalData{
  events: EventRow[],
  maps: MapRow[],
}

export interface EventData{
  title: string,
  tags: string[]
}

export interface MapDataModel {
  filters: string[];
  active_images: GalleryImage[];
  gallery_images: GalleryImage[];
  timeline_series: TimeSeries[];
  loaded: boolean;
  fetch_map_data: Thunk<MapDataModel>;
  filter_gallery: Action<MapDataModel, string>;
  set_gallery_images: Action<MapDataModel, GalleryImage[]>;
  set_active_images: Action<MapDataModel, GalleryImage[]>;
  set_timeline_series: Action<MapDataModel, TimeSeries[]>;
  set_active_filters: Action<MapDataModel, any[]>;
  set_filters: Thunk<MapDataModel, string[]>;
}

type ImagePromise = Promise<HTMLImageElement>;

const map_data: MapDataModel = {

  active_images: [],
  filters: [],
  gallery_images: [], 
  timeline_series: [], 
  loaded: false, 
  fetch_map_data: thunk(async actions =>{
    const DOC_KEY = '1-S8EkLYsknYoFWSynVeMQCi6Gf9PoV9A5ezzICXamJA';
    const map_rows: MapRow[] = [];
    const event_rows: EventRow[] = [];

    const map_data: ExternalData = {
      events:  event_rows,
      maps:  map_rows
    };
    //get maps sheet
    get_sheet<MapRow>(DOC_KEY, 1).then((sheet: LabeledCols<MapRow>)=>{
      map_data.maps = sheet.data;
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

    get_sheet<EventRow>(DOC_KEY, 2).then((sheet: LabeledCols<EventRow>)=>{
      map_data.events = sheet.data;
      const timeline_series = map_data.events.map(function(ev: EventRow){
        const time_range = new TimeRange(new Date(ev.start), new Date(ev.end));
        const data: EventData = {
          title: ev.title,
          tags: ev.tags.split(',').map(t=>t.trim()),
        }
        console.log(data);
        const time_range_event = new TimeRangeEvent(time_range, [data]);
        // console.log(getAllFuncs(time_range_event));
        const time_series =  new TimeSeries({
          name: "test",
          events: [time_range_event]
        })
        return time_series
      })
      actions.set_timeline_series(timeline_series)
      
    }).catch((err: any)=>{
      console.log(`Error fetching DOC_KEY ${DOC_KEY}`);
    })
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
  })
}

const arrayIncludesInObj = (arr: any[], key: string, valueToCheck: string): boolean => {
  const has_tag = arr.some(value => value["title"] === valueToCheck);
  return has_tag
}

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
