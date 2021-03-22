// import {v4 as uuid} from 'uuid';
import { useTheme, Theme } from "@material-ui/core/styles";
import { useStoreState } from "../hooks";
import { useEffect } from 'react';
import {Text} from 'evergreen-ui';

// https://codesandbox.io/s/react-timeseries-charts-axis-color-forked-060kt
// https://codesandbox.io/s/l28vmvp2n9?from-embed

import {
  ChartContainer,
  ChartRow,
  Charts,
  EventChart,
  Resizable,
  YAxis,
} from "react-timeseries-charts";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import { isExternalModuleNameRelative } from "typescript";

interface Seperator{
  pos: number, 
  name: string, 
}

const Timeline = function() {
  const active_filters = useStoreState(state=>state.map_data.filters);
  const time_series = useStoreState(state=>state.map_data.timeline_series);
  const theme = useTheme();
  const row_height = 20;
  const start_date= new Date(1792,0,1);
  const end_date = new Date(2020,0,1)

  const timelineSection = {
    height: '100px', 
    width: '100%',
    borderTop: `1px solid ${theme.palette.primary.main}`,
  }

  const testChart = {
    width: "100%", 
    height: "80%",
    margin: 'auto',
    marginTop: '1em',
    borderTop: `1px solid ${theme.palette.primary.main}`,
  }
  const testLine = {
    position: 'relative',
    height: '10px',
    borderTop: `1px solid ${theme.palette.primary.main}`,
  } as React.CSSProperties

  const linesContainer= {
    position: 'absolute',
    width: "100%", 
    height: "100%",
    top: 0, 
  } as React.CSSProperties

  const seriesCategoryLabel= {
    position: 'absolute',
    width: "100%", 
    height: "100%",
    top: 0, 
  } as React.CSSProperties

  const seperatorText = {
    fontSize: '9px',
    position: 'absolute',
    color: 'lightgrey',
  } as React.CSSProperties

  useEffect(()=>{
    console.log("ACTIVE FILTERS CHANGE ")
  }, active_filters)

  let timerange = new TimeRange(start_date, end_date);

  return (
    <div style = {{position: 'relative'}}>
    <div style = {linesContainer}>
      { 
        Array.from([{pos: 0, name: "NATIONAL"},{pos: 1, name: "STATE"},{pos: 2, name: "LOCAL"}]).map(function(f: Seperator){
          const testtest = {
            top: `${f.pos*33}%`,
            position: 'relative',
            height: '0px',
            opacity: 0.5,
            // color: 
            borderTop: `1px solid lightgrey`,
            // borderTop: `1px solid ${theme.palette.primary.main}`,
          } as React.CSSProperties
        
          return(
            <div style = {testtest}>
              <Text style ={seperatorText}>{f.name}</Text>
              {/* <Small size = {100}>test</Small> */}
            </div>
          )
        })
      }

    </div>
    <Resizable style = {testChart}>
        <ChartContainer
        timeRange={timerange}
        enablePanZoom={false}
        width = {1000}
        >
        { make_series(time_series.national, theme, active_filters, row_height )}

        { make_series(time_series.state, theme, active_filters, row_height )}

        { make_series(time_series.city, theme, active_filters, row_height )}
        </ChartContainer>
    </Resizable>
    </div>
  );
};

const make_series = (series: TimeSeries[], theme: Theme, active_filters: any[], row_height: number) => {
  console.log("🚀 ~ file: Timeline.tsx ~ line 224 ~ active_filters", active_filters)
    
    let test = series.map(function(ev, i){
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
    
  })
  return test
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

