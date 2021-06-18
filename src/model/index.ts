import map_data, { MapDataModel } from "./map_data";
import timelineModel, { TimelineModel } from "./timeline_model";
// https://codesandbox.io/s/easy-peasy-typescript-v3-riqbl?file=/src/model/todos.ts

export interface StoreModel {
  map_data: MapDataModel;
  timeline: TimelineModel;
  //   notification: NotificationModel;
}

const model: StoreModel = {
  map_data: map_data,
  timeline: timelineModel,
};

export default model;
