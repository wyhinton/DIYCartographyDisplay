import studentsData, { MapDataModel } from "./studentsData";
import timelineModel, { TimelineModel } from "./timelineModel";
// https://codesandbox.io/s/easy-peasy-typescript-v3-riqbl?file=/src/model/todos.ts
// for info on using GoogleSheets for JSON see https://www.freecodecamp.org/news/cjn-google-sheets-as-json-endpoint/
export interface StoreModel {
  studentsModel: MapDataModel;
  timeline: TimelineModel;
  //   notification: NotificationModel;
}

const model: StoreModel = {
  studentsModel: studentsData,
  timeline: timelineModel,
};

export default model;
