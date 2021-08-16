import { info } from "fp-ts/lib/Console";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

export default class GoogleSheetData {
  title!: string;
  sheetId!: string;
  sheets!: GoogleSpreadsheetRow[][];

  constructor(
    title: string,
    sheetId: string,
    sheets: GoogleSpreadsheetRow[][]
  ) {
    this.title = title;
    this.sheetId = sheetId;
    this.sheets = sheets;
  }
  getSheetRows(sheetIndex: number): GoogleSpreadsheetRow[] {
    return this.sheets[sheetIndex];
  }
  loadSheets(
    sheetId: string,
    apikey: string
  ): Promise<Promise<GoogleSpreadsheetRow[]>[]> {
    const doc = new GoogleSpreadsheet(sheetId);
    doc.useApiKey(apikey);
    const sheetPromisesArr: Promise<GoogleSpreadsheetRow[]>[] = [];
    return doc.loadInfo().then(() => {
      doc.sheetsByIndex.forEach((element) => {
        const myTest = element.getRows();
        sheetPromisesArr.push(myTest);
      });
      return sheetPromisesArr;
    });
  }
}
