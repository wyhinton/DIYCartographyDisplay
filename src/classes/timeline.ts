import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import { TimelineEvent } from "./timeline_event";
// import { groupBy } from "../utils";

export class Timeline {
  national!: TimeSeries[];
  state!: TimeSeries[];
  city!: TimeSeries[];
  international!: TimeSeries[];
  NA!: TimeSeries[];

  constructor() {
    this.national = [];
    this.state = [];
    this.city = [];
    this.international = [];
    this.NA = [];
  }
  set_data(events: TimelineEvent[]) {
    const categorized_events = groupBy(events, "category");
    // const categorized_events = groupBy(events, "category");
    console.log(categorized_events);
    Object.keys(categorized_events).forEach((key) => {
      console.log(key);
      const value: TimelineEvent[] = categorized_events[key];
      const events = event_rows_to_time_range_events(value);
      const series = time_range_events_to_time_series(events);
      categorized_events[key] = series;
      console.log(series);
    });
    this.national = categorized_events.national;
    this.state = categorized_events.state;
    this.city = categorized_events.city;
    this.international = categorized_events.international;
    this.NA = categorized_events.NA;
    // console.log(categorized_events);
  }
}

export interface EventData {
  title: string;
}

function event_rows_to_time_range_events(
  rows: TimelineEvent[]
): TimeRangeEvent[] {
  let all_events: TimeRangeEvent[] = [];
  console.log(rows);
  rows.forEach((event_row: TimelineEvent) => {
    const time_range = new TimeRange(event_row.start, event_row.end);
    const data: EventData = {
      title: event_row.title,
    };
    const time_range_event = new TimeRangeEvent(time_range, [data]);
    all_events.push(time_range_event);
  });
  console.log(all_events);
  return all_events;
}

//sorts events into rows so that rows don't contain overlapping time events
function time_range_events_to_time_series(
  events: TimeRangeEvent[]
): TimeSeries[] {
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
