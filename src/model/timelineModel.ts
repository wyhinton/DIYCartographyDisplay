import { Action, action, thunkOn, ThunkOn } from "easy-peasy";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import { EventLevel } from "../enums";
import type { RawEventRowValues } from "../interfaces/RawEventRowValues";
import { TimelineEvent } from "../classes/timelineEvent";
import { Timeline } from "../classes/timeline";
import type { StoreModel } from "./index";
export interface EventRowValues {
  /**Start of the timeline event */
  start: Date;
  /**End of the timeline event */
  end: Date;
  /**Display title of the event*/
  title: string;
  /**Additional display text to show when clicking on the event in the timeline*/
  info: string;
  /**Geographic scale of the event */
  eventScale: EventLevel;
}

export interface TimelineData {
  national: TimeSeries[];
  state: TimeSeries[];
  city: TimeSeries[];
  international: TimeSeries[];
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
  // fetchEventSpreadsheet: Thunk<TimelineModel>;
  setEventSpreadsheet: Action<TimelineModel, EventRowValues[]>;
  onGoogleSheetLoaded: ThunkOn<TimelineModel, never, StoreModel>;
  //SETTERS
  setTimelineData: Action<TimelineModel, TimelineEvent[]>;
  setTimelineSeries: Action<TimelineModel, TimelineData>;
}

// const empty_NA: TimeSeries[] = [];

const initialEmptyTimeline: TimelineData = {
  national: [] as TimeSeries[],
  state: [] as TimeSeries[],
  city: [] as TimeSeries[],
  international: [] as TimeSeries[],
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
    state.timelineData.setData(payload);
  }),
  onGoogleSheetLoaded: thunkOn(
    (actions, storeActions) =>
      storeActions.studentsModel.setStudentGoogleSheets,
    (actions, payload) => {
      const loadedRows = payload.payload.getSheetRows(0);
      const rawEventRowValues = loadedRows.map((r) => {
        return {
          start: r.start,
          end: r.end,
          title: r.title,
          info: r.info,
          tags: r.tags,
          category: r.category,
        } as RawEventRowValues;
      });
      const timelineEvents = rawEventRowValues.map((r) => new TimelineEvent(r));
      actions.setTimelineData(timelineEvents);
      const typedEventRows = typeEventRows(timelineEvents);
      actions.setEventSpreadsheet(typedEventRows);
      const timelineSeries = makeTimelineTimeSeries(typedEventRows);
      actions.setTimelineSeries(timelineSeries);
      console.log(rawEventRowValues);
    }
  ),
};

export default timelineModel;

/**Transform the start/end fields from a event row in Date objects, and convert the category field into an EventLevel enum */
function typeEventRows(rows: any[]): EventRowValues[] {
  rows.forEach((r: any, ind: number) => {
    const categoryString: string = rows[ind]["category"];
    const type_cat: EventLevel =
      EventLevel[categoryString as unknown as keyof typeof EventLevel];
    rows[ind]["category"] = type_cat;
    const startDate = new Date(rows[ind]["start"]);
    const endDate = new Date(rows[ind]["end"]);
    rows[ind]["start"] = startDate;
    rows[ind]["end"] = endDate;
  });
  return rows;
}

/**Create all the Timeseries events to be used in the timeline, sorting them into National, State, and City categories */
function makeTimelineTimeSeries(rows: EventRowValues[]): TimelineData {
  const categorizedEvents = groupBy(rows, "category");
  Object.keys(categorizedEvents).forEach((key) => {
    const value: EventRowValues[] = categorizedEvents[key];
    const events = eventRowsToTimeRangeEvents(value);
    const series = timeRangeEventsToTimeSeries(events);
    categorizedEvents[key] = series;
  });
  return categorizedEvents;
}

/**Turn an event row into a TimeRangeEvent with title prop */
function eventRowsToTimeRangeEvents(rows: EventRowValues[]): TimeRangeEvent[] {
  const allEvents: TimeRangeEvent[] = [];
  rows.forEach((eventRow: EventRowValues) => {
    const timeRange = new TimeRange(eventRow.start, eventRow.end);
    const timeRangeEvent = new TimeRangeEvent(timeRange, [
      { title: eventRow.title },
    ]);
    allEvents.push(timeRangeEvent);
  });
  return allEvents;
}

/**Sort all the TimeRangeEvents into a set of TimeSeries, grouping multiple events into a single series while avoiding overlapping events */
function timeRangeEventsToTimeSeries(events: TimeRangeEvent[]): TimeSeries[] {
  const timeRangeData: any = {};
  timeRangeData[0] = [];
  (events as TimeRangeEvent[]).forEach(
    (ev2: TimeRangeEvent, ind: number, array: TimeRangeEvent[]) => {
      let row_count = 0;
      if (
        array.every((e3) => {
          if (ev2 === e3) {
            return true;
          }
          if (dateRangeOverlaps(e3.begin(), e3.end(), ev2.begin(), ev2.end())) {
            // console.log("ranges do overlap");
            return false;
          } else {
            // console.log("ranges do not overlap");
            return true;
          }
        })
      ) {
        timeRangeData[row_count].push(ev2);
      } else {
        row_count = row_count + 1;
        timeRangeData[ind] = [ev2];
      }
    }
  );
  const sortedEvents = Object.keys(timeRangeData).map((k) => {
    timeRangeData[k] = timeRangeData[k].sort(
      (a: any, b: any) => a.begin() - b.begin()
    );
  });
  return Object.keys(sortedEvents).map(
    (k) =>
      new TimeSeries({
        name: "test",
        events: timeRangeData[k],
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
