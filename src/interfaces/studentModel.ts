import { EventLevel } from "../enums";
import GetSheetDone from "get-sheet-done";

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
  sheetNumber: number
): Promise<GoogleSheet<T>> {
  return new Promise<GoogleSheet<T>>(function (resolve, reject) {
    var options = {
      // method: "post",
      // contentType: "application/json",
      // payload: JSON.stringify(ObjectToSend),
      muteHttpExceptions: true,
    };

    const test = fetch(
      "https://spreadsheets.google.com/feeds/list/" +
        key +
        "/od6/public/values?alt=json"
      // options
    );
    const url =
      "https://spreadsheets.google.com/feeds/list/" +
      key +
      "/od6/public/values?alt=json";
    const fffff = fetchRetry(url, 10, 300);
    console.log(fffff);
    console.log(test);
    GetSheetDone.labeledCols(key, sheetNumber)
      .then((sheet: any) => {
        resolve(sheet);
      })
      .catch((err: any) => {
        console.error(
          `Error fetching DOC_KEY ${key}, sheet number ${sheetNumber}, ${err}`
        );
      });
  });
}

// const fetchRetry = async (url: string, n: number): Promise<Response> => {
//   try {
//     return await fetch(url);
//   } catch (err) {
//     console.log("got fetch retry error");
//     if (n === 1) throw err;
//     return await setTimeout(()=>PfetchRetry(url, n - 1);
//   }
// };
const fetchRetry = async (
  url: string,
  retries: number,
  backoff: number
): Promise<Response> => {
  /* 1 */
  const retryCodes = [408, 400, 404, 500, 502, 503, 504, 522, 524];
  return fetch(url)
    .then((res) => {
      if (res.ok) return res.json();

      if (retries > 0 && retryCodes.includes(res.status)) {
        setTimeout(() => {
          /* 2 */
          return fetchRetry(url, retries - 1, backoff * 2); /* 3 */
        }, backoff); /* 2 */
      } else {
        throw new Error(JSON.stringify(res));
      }
    })
    .catch(console.error);
};

// const fetchRetry = async (url: string, n: number): Promise<Response> => {
//   try {
//       const response = await fetch(url, options);

//       if(!response.ok) {
//           throw new Error("Invalid response.");
//       }
//       return response;

//   } catch (error) {
//       if (attempt <= 1) {
//           throw error;
//       }
//       await sleep(2000);
//       return fetchRetry(url, attempt - 1);
//   }
// };
