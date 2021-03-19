import { Action, action, thunk, Thunk } from 'easy-peasy';
import GetSheetDone from 'get-sheet-done';

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

export interface MapDataModel {
  events: any[];
  maps: any[];
  gallery_images: GalleryImage[];
  timeline_events: any[];
  images: any[];
  loaded: boolean;
  fetch_map_data: Thunk<MapDataModel>;
  add: Action<MapDataModel, any>;
  test_action: Action<MapDataModel, any>;
  filter_maps: Action<MapDataModel, any>;
}

const map_data: MapDataModel = {
  fetch_map_data: thunk(async actions =>{
        const DOC_KEY = '1-S8EkLYsknYoFWSynVeMQCi6Gf9PoV9A5ezzICXamJA';
        // let test_prom = get_sheet(DOC_KEY, 1);
        const map_data = {
          events: [],
          maps: [],
        };
    
        const maps_res = get_sheet(DOC_KEY, 1).then((sheet: any)=>{
          map_data.maps = sheet.data
        }).catch((err: any)=>{
          console.log(`Error fetching DOC_KEY ${DOC_KEY}`);
        })
        const events_res = get_sheet(DOC_KEY, 2).then((sheet: any)=>{
          map_data.events = sheet.data
          console.log(map_data);
          actions.add(map_data);
        }).catch((err: any)=>{
          console.log(`Error fetching DOC_KEY ${DOC_KEY}`);
        })

  }),
  test_action: action((state, payload) => {
    console.log("got a test action");
    console.log(`paylod is: ${payload}`)
  }),
  events: [],
  maps: [],
  gallery_images: [], 
  timeline_events: [], 
  images: [],
  loaded: false, 
  
  // load: action((state, payload)=>{
  //   state.loaded = payload
  // }),
  add: action((state, payload) => {
    state.events.push(payload.events);
    state.maps.push(payload.maps);
    
    state.gallery_images = payload.maps.map((map_row: any)=>(
        {
            src: map_row.photo1,
            thumbnail: map_row.thumbnail,
            isSelected: false,
            caption: "Im in this other file",
            thumbnailWidth: 95,
            thumbnailHeight: 174,
            tags: make_tags(map_row.tags)
        }
    ));
    state.images = state.gallery_images.map((gi: GalleryImage)=>get_image(gi));
    let test = state.gallery_images.map((gi: GalleryImage)=>get_image(gi));
    Promise.all(test).then(
      result=>{
        
        // state.loaded = true;
        console.log("ALL IMAGES LOADED")
      },
      function(error){
        console.log(error)
      }
    )
    console.log(test);
    console.log(state.images);
    console.log(state.gallery_images)
  }),
  filter_maps: action((state, filter_function)=>{
      const filtered = state.gallery_images.filter(filter_function);
      console.log(filtered);
  })
}

function make_tags(tag_data: string): Tag[]{
    let split_tag_values = tag_data.split(',');
    let tags = split_tag_values.map(tag=>({value: tag, title: tag}));
    return tags
}

function get_image(image: GalleryImage){
  const promise = new Promise(function(resolve, reject) {
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
      resolve("ok");
    };
  });
  return promise
}

function get_sheet(key: string, sheet_num: number){
  const promise = new Promise(function(resolve, reject) {
    console.log("inside promise");
    GetSheetDone.labeledCols(key, sheet_num).then((sheet: any) => {
        //  map_data.events = sheet.data;
        //  set_store_data(map_data);
        resolve(sheet)
         console.log(sheet)
       }).catch((err: any )=> {
         console.log(`Error fetching DOC_KEY ${key}`);
         console.error(err);
    });
    //   image.thumbnailWidth = img.width;
    //   resolve("ok");
    // };
  });
  return promise
}

export default map_data;
