import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import { TimelineEvent } from "./timeline_event";

/**Contains all data related to the event timeline*/
export class Timeline {
  national!: TimeSeries[];
  state!: TimeSeries[];
  city!: TimeSeries[];
  international!: TimeSeries[];

  constructor() {
    this.national = [];
    this.state = [];
    this.city = [];
    this.international = [];
  }
  setData(events: TimelineEvent[]): void {
    const categorizedEvents = groupBy(events, "category");
    Object.keys(categorizedEvents).forEach((key) => {
      console.log(key);
      const value: TimelineEvent[] = categorizedEvents[key];
      const events = eventRowsToTimeRangeEvents(value);
      const series = timeRangeEventsToTimeSeries(events);
      categorizedEvents[key] = series;
    });
    this.national = categorizedEvents.national;
    this.state = categorizedEvents.state;
    this.city = categorizedEvents.city;
    this.international = categorizedEvents.international;
  }
}

export interface EventData {
  title: string;
}

function eventRowsToTimeRangeEvents(rows: TimelineEvent[]): TimeRangeEvent[] {
  const allEvents: TimeRangeEvent[] = [];
  rows.forEach((eventRow: TimelineEvent) => {
    const timeRange = new TimeRange(eventRow.start, eventRow.end);
    const data: EventData = {
      title: eventRow.title,
    };
    const timeRangeEvent = new TimeRangeEvent(timeRange, [data]);
    allEvents.push(timeRangeEvent);
  });
  return allEvents;
}

//sorts events into rows so that rows don't contain overlapping time events
function timeRangeEventsToTimeSeries(events: TimeRangeEvent[]): TimeSeries[] {
  const eventSeriesContainer: any = {};
  eventSeriesContainer[0] = [];
  (events as TimeRangeEvent[]).forEach(
    (ev2: TimeRangeEvent, ind: number, array: TimeRangeEvent[]) => {
      let row_count = 0;
      if (
        array.every((e3, i) => {
          if (ev2 === e3) {
            return true;
          }
          if (dateRangeOverlaps(e3.begin(), e3.end(), ev2.begin(), ev2.end())) {
            return false;
          }
          return true;
        })
      ) {
        eventSeriesContainer[row_count].push(ev2);
      } else {
        row_count = row_count + 1;
        eventSeriesContainer[ind] = [ev2];
      }
    }
  );
  const sortedEvents = Object.keys(eventSeriesContainer).map((k) => {
    eventSeriesContainer[k] = eventSeriesContainer[k].sort(
      (a: any, b: any) => a.begin() - b.begin()
    );
  });
  return Object.keys(sortedEvents).map(
    (k) =>
      new TimeSeries({
        name: "test",
        events: eventSeriesContainer[k],
      })
  );
}

function dateRangeOverlaps(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  if (aStart < bStart && bStart < aEnd) return true; // b starts in a
  if (aStart < bEnd && bEnd < aEnd) return true; // b ends in a
  if (bStart < aStart && aEnd < bEnd) return true; // a in b
  return false;
}

export function groupBy(arr: any[], property: any) {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...(acc[cur[property]] || []), cur];
    return acc;
  }, {});
}
