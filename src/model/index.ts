import map_data, { MapDataModel } from './map_data';
// https://codesandbox.io/s/easy-peasy-typescript-v3-riqbl?file=/src/model/todos.ts

export interface StoreModel {
  map_data: MapDataModel;
//   notification: NotificationModel;
}

const model: StoreModel = {
  map_data,
//   notification,
};

export default model;
