import { Action, action, thunk, Thunk } from "easy-peasy";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import { EventLevel } from "../enums";
import type { GoogleSheet, RawEventRowValues } from "./sheet_data_models";
import { getSheet } from "./sheet_data_models";
// import { groupBy } from "../utils";
import { TimelineEvent } from "../classes/timeline_event";
import { Timeline } from "../classes/timeline";
import SHEET_KEY from "../static/sheetKey";

export interface EventRowValues {
  start: Date;
  end: Date;
  title: string;
  info: string;
  tags: string;
  category: EventLevel;
}

export interface TimelineData {
  national: TimeSeries[];
  state: TimeSeries[];
  city: TimeSeries[];
  international: TimeSeries[];
  NA: TimeSeries[];
}

/**
 * State Model for the Timeline Component
 * @typedef {Object} TimelineModel
 * @property {TimelineData} timelineSeries - Timeline Series to display
 * @property {Thunk<TimelineModel>} fetchEventSpreadsheet - Request to the event data sheet
 */
export interface TimelineModel {
  //STATE
  timelineSeries: TimelineData;
  timelineData: Timeline;
  eventSpreadsheet: EventRowValues[];

  //THUNKS - FETCH EXTERNAL
  fetchEventSpreadsheet: Thunk<TimelineModel>;
  setEventSpreadsheet: Action<TimelineModel, EventRowValues[]>;

  //SETTERS
  setTimelineData: Action<TimelineModel, TimelineEvent[]>;
  setTimelineSeries: Action<TimelineModel, TimelineData>;
}

const empty_nat: TimeSeries[] = [];
const empty_state: TimeSeries[] = [];
const empty_city: TimeSeries[] = [];
const empty_international: TimeSeries[] = [];
const empty_NA: TimeSeries[] = [];

const initialEmptyTimeline: TimelineData = {
  national: empty_nat,
  state: empty_state,
  city: empty_city,
  international: empty_international,
  NA: empty_NA,
};

const timelineModel: TimelineModel = {
  timelineData: new Timeline(),
  timelineSeries: initialEmptyTimeline,
  eventSpreadsheet: [],
  setTimelineSeries: action((state, timelineSeries) => {
    state.timelineSeries = timelineSeries;
  }),
  setEventSpreadsheet: action((state, eventRows) => {
    state.eventSpreadsheet = eventRows;
  }),
  setTimelineData: action((state, payload) => {
    state.timelineData.set_data(payload);
  }),
  fetchEventSpreadsheet: thunk(async (actions) => {
    getSheet<RawEventRowValues>(SHEET_KEY, 1)
      .then((event_sheet: GoogleSheet<RawEventRowValues>) => {
        let timeline_events = event_sheet.data.map((r) => new TimelineEvent(r));
        actions.setTimelineData(timeline_events);
        const typed_event_rows = typeEventRows(event_sheet.data);
        actions.setEventSpreadsheet(typed_event_rows);
        const timeline_series = makeTimeSeries(typed_event_rows);
        actions.setTimelineSeries(timeline_series);
      })
      .catch((err: any) => {
        console.error(`Error fetching DOC_KEY ${SHEET_KEY}`);
      });
  }),
};

export default timelineModel;

function typeEventRows(rows: any[]): EventRowValues[] {
  rows.forEach((r: any, ind: number) => {
    const cat_string: string = rows[ind]["category"];
    const type_cat: EventLevel =
      EventLevel[cat_string as unknown as keyof typeof EventLevel];
    rows[ind]["category"] = type_cat;
    const start_date = new Date(rows[ind]["start"]);
    const end_date = new Date(rows[ind]["end"]);
    rows[ind]["start"] = start_date;
    rows[ind]["end"] = end_date;
  });
  return rows;
}

function makeTimeSeries(rows: EventRowValues[]): TimelineData {
  const categorized_events = groupBy(rows, "category");
  console.log(categorized_events);
  Object.keys(categorized_events).forEach((key) => {
    console.log(key);
    const value: EventRowValues[] = categorized_events[key];
    const events = event_rows_to_time_range_events(value);
    const series = time_range_events_to_time_series(events);
    categorized_events[key] = series;
    console.log(series);
  });
  console.log(categorized_events);
  return categorized_events;
}

function event_rows_to_time_range_events(
  rows: EventRowValues[]
): TimeRangeEvent[] {
  let all_events: TimeRangeEvent[] = [];
  console.log(rows);
  rows.forEach((event_row: EventRowValues) => {
    const time_range = new TimeRange(event_row.start, event_row.end);
    const time_range_event = new TimeRangeEvent(time_range, [
      { title: event_row.title },
    ]);
    all_events.push(time_range_event);
  });
  console.log(all_events);
  return all_events;
}

function time_range_events_to_time_series(
  events: TimeRangeEvent[]
): TimeSeries[] {
  // let array_set: { [key: string]: any[] } = {};
  // let row_count = 0;
  // for (let index = 0; index < events.length; index++) {
  //   console.log(index);
  //   const element = events[index];
  //   if (Array.isArray(array_set[`row_${row_count}`]) == false) {
  //     array_set[`row_${row_count}`] = [];
  //   }
  //   let test = array_set[`row_${row_count}`].every(
  //     (d: TimeRangeEvent) =>
  //       date_range_overlaps(
  //         d.begin(),
  //         d.end(),
  //         element.begin(),
  //         element.end()
  //       ) == false
  //   );
  //   if (test) {
  //     if (row_count > 0) {
  //       array_set[`row_${row_count - 1}`].push(element);
  //       // }
  //     } else {
  //       array_set[`row_${row_count}`].push(element);
  //     }
  //   } else {
  //     row_count += 1;
  //     array_set[`row_${row_count}`].push(element);
  //   }
  //   console.log(test);
  //   console.log(array_set);
  //   // if (
  //   //   array_set[`row_${row_count}`].every(
  //   //     (d: TimeRangeEvent) =>
  //   //       date_range_overlaps(
  //   //         d.begin(),
  //   //         d.end(),
  //   //         element.begin(),
  //   //         element.end()
  //   //       ) == false
  //   //   )
  //   // ) {
  //   //   console.log("no overlap, going to push");
  //   //   array_set[`row_${row_count}`].push(element);
  //   //   console.log(array_set);
  //   // } else {
  //   //   // console.log("GOT overlap, MAKE NEW ROW");
  //   //   // row_count += 1;
  //   //   // array_set[`row_${row_count}`].push(element);
  //   // }
  //   // }
  // }
  // console.log(array_set);
  let test_obj: any = {};
  test_obj[0] = [];
  (events as TimeRangeEvent[]).forEach(
    (ev2: TimeRangeEvent, ind: number, array: TimeRangeEvent[]) => {
      let row_count = 0;
      if (
        array.every((e3) => {
          if (ev2 === e3) {
            return true;
          }
          if (
            date_range_overlaps(e3.begin(), e3.end(), ev2.begin(), ev2.end())
          ) {
            // console.log("ranges do overlap");
            return false;
          } else {
            // console.log("ranges do not overlap");
            return true;
          }
        })
      ) {
        test_obj[row_count].push(ev2);
      } else {
        row_count = row_count + 1;
        test_obj[ind] = [ev2];
      }
    }
  );
  const sorted_events = Object.keys(test_obj).map((k) => {
    test_obj[k] = test_obj[k].sort((a: any, b: any) => a.begin() - b.begin());
  });
  const row_arrays = Object.keys(sorted_events).map(
    (k) =>
      new TimeSeries({
        name: "test",
        events: test_obj[k],
      })
  );
  return row_arrays;
}

function date_range_overlaps(
  a_start: Date,
  a_end: Date,
  b_start: Date,
  b_end: Date
) {
  if (a_start < b_start && b_start < a_end) return true; // b starts in a
  if (a_start < b_end && b_end < a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
}

export function groupBy(arr: any[], property: any) {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...(acc[cur[property]] || []), cur];
    return acc;
  }, {});
}
