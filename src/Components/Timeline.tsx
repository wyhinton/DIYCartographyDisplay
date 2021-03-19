import {v4 as uuid} from 'uuid';
import { useTheme } from "@material-ui/core/styles";
import { useStoreActions, useStoreState } from "../hooks";
import { useState, useEffect } from 'react';
// https://codesandbox.io/s/react-timeseries-charts-axis-color-forked-060kt
// https://codesandbox.io/s/l28vmvp2n9?from-embed

import {
  ChartContainer,
  ChartRow,
  Charts,
  EventChart,
  Resizable,
} from "react-timeseries-charts";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";


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

const Timeline = function() {
  const active_filters = useStoreState(state=>state.map_data.filters);
  const time_series = useStoreState(state=>state.map_data.timeline_series);
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
    borderTop: `1px solid ${theme.palette.primary.main}`,
}
useEffect(()=>{
  console.log("ACTIVE FILTERS CHANGE ")
}, active_filters)

  let timerange = new TimeRange(start_date, end_date);

  function eventStyles(filters: string[], state: any){
    let COLOR = "#998ec3";
    // console.log(state);
    switch (state) {
      case "normal":
        // console.log(state);
        return {
          fill: theme.palette.primary.main
        };
      case "hover":
        console.log(state);
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
            time_series.map(function(ev, i){
              let my_style = {
                fill: theme.palette.primary.main,
                opacity: 0.4
              }
              
              for (let event of ev.events()) { 
                let real_key = Array.from(event.data().get(0).keys())[1]
                const tags = Array.from(event.data().get(0).get(real_key))
                console.log(tags)
                console.log(active_filters[0])
 
                if (tags.some(t=>t == active_filters[0])){
                  console.log("had active filter");
                } else {
                  my_style.opacity = 0.1; 
                  console.log("no active filter");
                }
              }
              function style_func(s: any, e: any){
                // my_still.fill, 
                return my_style

              }
              // let ev_test = ev.events();
              // console.log(ev_test);
            return (
              <ChartRow height = {`${row_height}`} style = {{fill: "#f1a340"}} key = {i} >
                <Charts>
                  <EventChart
                    series = {ev}
                    size = {row_height}
                    label = {(e: any)=>e.get("title")}
                    style={style_func}
                    // style={my_style}
                    // style={eventStyles}
                  ></EventChart>
                </Charts>
              </ChartRow>
              )
            
            // time_series.map((ev, i)=>(
            //   <ChartRow height = {`${row_height}`} style = {{fill: "#f1a340"}} key = {i} >
            //     <Charts>
            //       <EventChart
            //         series = {ev}
            //         size = {row_height}
            //         label = {(e: any)=>e.get("title")}

            //         // label = {(e: any)=>console.log(e)}
            //         // style =  {{fill: "#998ec3", opacity: 1.0}}
            //         style={eventStyles(active_filters, ev)}
            //       ></EventChart>
            //     </Charts>
            //   </ChartRow>
            // ))
          })
        }
        
       
        </ChartContainer>
    </Resizable>
    // </div>
  );
};

const arrayIncludesInObj = (arr: any[], key: string, valueToCheck: string): boolean => {
  const has_tag = arr.some(value => value["title"] === valueToCheck);
  return has_tag
}


export default Timeline

function getAllFuncs(toCheck: any) {
  var props: any[] = [];
  var obj = toCheck;
  do {
      props = props.concat(Object.getOwnPropertyNames(obj));
  } while (obj = Object.getPrototypeOf(obj));

  return props.sort().filter(function(e, i, arr) { 
     if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
  });
}

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
