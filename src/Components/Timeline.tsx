import React, { useState } from "react";
import ReactDOM from "react-dom";
import {v4 as uuid} from 'uuid';
import { useTheme } from "@material-ui/core/styles";

import {
  ChartContainer,
  ChartRow,
  Charts,
  EventChart,
  Resizable,
} from "react-timeseries-charts";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
// import type {TimeSeriesEvent} from "pondjs";

const periods = [
  {
    since: "2015-03-08T09:00:00Z",
    till: "2015-03-22T14:00:00Z",
    title: "ANL Scheduled Maintenance"
  },
  {
    since: "2015-04-01T03:30:00Z",
    till: "2015-04-02T16:50:00Z",
    title: "Whatever"
  }
];

// interface 
const events: TimeRangeEvent[] = periods.map(({ since, till, ...data }) => {
  let range = new TimeRange(new Date(since), new Date(till));
  return new TimeRangeEvent(range, data);
});
const series = new TimeSeries({
    name: "test",
    events: events,
});

const container = {
    width: "100%", 
    height: "100%",
}


// https://codesandbox.io/s/react-timeseries-charts-axis-color-forked-060kt

function random_events(start: Date, end:Date, count: number) {
  // let start = new Date(start.)
  let events: TimeRangeEvent[] = [];
  for (var i = 0; i < count; i++){
    const random_date_1 =  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const random_date_2 = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    let time_range = new TimeRange(new Date(0,0,0), new Date(0,0,0));
    if (random_date_1 < random_date_2){
      time_range = new TimeRange(random_date_1, random_date_2);
    } else {
      time_range = new TimeRange(random_date_1, random_date_2);
    }
    let data = {
      title: uuid(),
      category: "some category",
    };
  
    let event = new TimeRangeEvent(time_range, data);
    events.push(event)
  }
  let splits = randSplit(events, 2, 5);
  // const sorted_splits = splits.map(group=>group.sort((a,b)=>a.since-b.since));
  // console.log(splits);
  // const series = splits.map(group=>new TimeSeries({ 
  //   name: "test",
  //   events: group,
  // }));
  const series = events.map(group=>new TimeSeries({ 
    name: "test",
    events: [group],
  }));
  return series
}


// const series = new TimeSeries({ events });


//example
// https://codesandbox.io/s/l28vmvp2n9?from-embed
const Timeline = function() {
  const theme = useTheme();
  const row_height = 20;
  const start_date= new Date(1792,0,1);
  const end_date = new Date(2020,0,1)
  const events = random_events(start_date, end_date, 10);
  console.log(events)
  const testChart = {
    width: "100%", 
    height: "80%",
    margin: 'auto',
    marginTop: '1em',
    // paddingTop: '1em',
    borderTop: `1px solid ${theme.palette.primary.main}`,
    // padding: "3em",
}

  let timerange = new TimeRange(start_date, end_date);
  // let [timerange, setTimerange] = useState(series.timerange());

  function outageEventStyleFunc(event: any, state: any) {

    // const color = event.get("type") === "Planned" ? "#998ec3" : "#f1a340";
    let COLOR = "#998ec3";
    switch (state) {
      case "normal":
        return {
          fill: theme.palette.primary.main
        };
      case "hover":
        return {
          fill: theme.palette.primary.light,
          opacity: 0.4
        };
      default:
        return {
          fill: COLOR,
          opacity: 0.4
        };
      //pass
    }
  }
  return (
    // <div style = {testChart}>
    <Resizable style = {testChart}>
        <ChartContainer
        timeRange={timerange}
        enablePanZoom={false}
        // onTimeRangeChanged={setTimerange}
        // style = {container}
        width = {1000}
        // height = {100}
        >
        {
          events.map(ev=>(
            <ChartRow height = {`${row_height}`} style = {{fill: "#f1a340"}}>
              <Charts>
                <EventChart
                  series = {ev}
                  size = {row_height}
                  label = {(e: any)=>e.get("title")}
                  // label = {(e: any)=>console.log(e)}
                  // style =  {{fill: "#998ec3", opacity: 1.0}}
                  style={outageEventStyleFunc}
                ></EventChart>
              </Charts>
            </ChartRow>
          ))
        }
        {/* <ChartRow height="30">
            <Charts>
            <EventChart
                series={series}
                size={45}
                // style={outageEventStyleFunc}
                // style={testChart}
                // label={e => e.get("title")}
            />
            </Charts>
        </ChartRow> */}
        </ChartContainer>
    </Resizable>
    // </div>
  );
};

export default Timeline


function randSplit(arr: TimeRangeEvent[], minimum: number, max: number): TimeRangeEvent[][] {
  if (minimum > arr.length || max <= minimum)
      return [arr];

  let res = [], i = 0, rnd;

  while (i < arr.length)
  {        
      rnd = Math.floor(Math.random() * (max - minimum)) + minimum;
      res.push(arr.slice(i, i + rnd));
      i += rnd;
  }

  if (res.some(x => x.length < minimum)){
    return randSplit(arr, minimum, max)
  } else {
    return res;
  }
}
