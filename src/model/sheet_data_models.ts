import { EventLevel } from "../enums";
import GetSheetDone from "get-sheet-done";

export interface RawStudentRowValues {
  author: string;
  year: string;
  title: string;
  info: string;
  topic: string;
  discipline: string;
  theme: string;
  series0101: string;
  series0102: string;
  series0201: string;
  series0202: string;
  series0301: string;
  series0302: string;
  thumbnail: string;
  subtopic: string;
}

export interface RawEventRowValues {
  start: string;
  end: string;
  title: string;
  info: string;
  tags: string;
  category: string;
}

export interface EventRowValues {
  start: Date;
  end: Date;
  title: string;
  info: string;
  tags: string;
  category: EventLevel;
}

/**
 * Generic GoogleSheet with type argument 
   which we use only when fetching our sheets.
   Currently te
 */
export interface GoogleSheet<T> {
  data: Array<T>;
  title: string;
  updated: string;
}

export function getSheet<T>(
  key: string,
  sheet_num: number
): Promise<GoogleSheet<T>> {
  return new Promise<GoogleSheet<T>>(function (resolve, reject) {
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
}
