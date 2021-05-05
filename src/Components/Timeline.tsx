// import {v4 as uuid} from 'uuid';
import {useState, useEffect} from 'react'
import { useTheme, Theme } from "@material-ui/core/styles";
import { useStoreState } from "../hooks";
import {Text} from 'evergreen-ui';
import Grid from '@material-ui/core/Grid';
import EventInfoDisplay from './Timeline/EventInfoDisplay';
import type {EventRow} from '../model/map_data';
// https://codesandbox.io/s/l28vmvp2n9?from-embed

import ChartContainer from  "./TimeSeries/components/ChartContainer";
// import ChartContainer from  "react-timeseries-charts";
import Charts from  "./TimeSeries/components/Charts";
import Resizable from  "./TimeSeries/components/Resizable";
import ChartRow from  "./TimeSeries/components/ChartRow";
import YAxis from  "./TimeSeries/components/YAxis";
import EventChart from  "./TimeSeries/components/EventChart";
import Baseline from  "./TimeSeries/components/Baseline";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {EventLevel} from '../model/enums'

interface Seperator{
  pos: number, 
  name: string, 
  count: number,
}

const Timeline = function() {
  const active_filter = useStoreState(state=>state.map_data?.filter);
  const time_series = useStoreState(state=>state.map_data.timeline_series);

  const event_rows: EventRow[] = useStoreState(state=>state.map_data.event_spreadsheet);
  const [eventInfo, setEventInfo] = useState<EventRow | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<TimeSeries | undefined>(undefined);
  const [chartHeight, setChartHeight] = useState(0);
  const [timeSeriesCount, setTimeSeriesCount] = useState(0);
  const [seperators, setSeperators] = useState([      
    {pos: 0, name: EventLevel.national.toUpperCase(), count: time_series.national.length},
    {pos: 1, name: EventLevel.state.toUpperCase(), count: time_series.state.length},
    {pos: 2, name: EventLevel.city.toUpperCase(), count: time_series.city.length}]);
  const theme = useTheme();
  const row_height = 40;
  // const row_height = 20;
  const start_date= new Date(1792,0,1);
  const end_date = new Date(2020,0,1)
  const is_sm = useMediaQuery(theme.breakpoints.up("sm"));
  const data_loaded = useStoreState(state=>state.map_data.loaded);
  const [width, setWidth] = useState(window.innerWidth);
  function sum(acc: number,val: number){ return acc+val;} 

  useEffect(()=>{
      const time_series_count = time_series.state.length + time_series.city.length + time_series.national.length
      
      console.log(event_rows)
      console.log(time_series)
      console.log(time_series_count)
      setChartHeight(row_height*time_series_count)
      setTimeSeriesCount(time_series_count)
      const lengths = [time_series.state.length, time_series.city.length, time_series.national.length]
      const heights = lengths.map(l=>l/timeSeriesCount)
      // console.log(heights)
      // const poss = heights.map((h,i,a)=>a.slice(0,i).reduce(sum))
      console.log(heights[2])
      const poss = [heights[0], heights[0+1]]
      poss.push(poss[0]+poss[1]);
      poss.forEach((p: number, i: number)=>{
          // sc = Object.assign()
          seperators[i].pos = p
          // seperators[i].pos = 1 - p
      })
      setSeperators(seperators)
      console.log(seperators)
      console.log(seperators.length)
      // const poss = [heights[0], heights[0+1], heights[0+1+2]]

      console.log(poss)
      console.log(lengths, heights, poss)
      // lengths.reduce((acc: number[], cv: number)){
      //   acc
      // }

  // },[data_loaded, seperators]);
  },[data_loaded, event_rows, time_series]);
  useEffect(()=>{

  }, [seperators])
  const timelineSection = {
    // height: 'fit-content', 
    height: 200,
    // height
    width: '100%',
    borderTop: `1px solid ${theme.palette.primary.main}`,
    display: is_sm?"inline-flex":"none",
  } as React.CSSProperties

  const testChart = {
    // width: "100%", 
    // height: "200px",
    // margin: 'auto',
    // marginTop: '1em',
  } as React.CSSProperties

  const linesContainer= {
    position: 'absolute',
    width: "100%", 
    height: "100%",
    top: 0, 
    zIndex: -1,
    opacity: 0.5,
  } as React.CSSProperties

  const seperatorText = {
    fontSize: '9px',
    position: 'absolute',
    color: 'lightgrey',
  } as React.CSSProperties

  const historicalEventsText = {
    fontSize: '9px',
    position: 'absolute',
    color: theme.palette.primary.main,
  } as React.CSSProperties

  const timeAxis = {
    axis: {
      stroke: theme.palette.primary.main,
    }
  }



  let timerange = new TimeRange(start_date, end_date);
  const make_series = (series: TimeSeries[], theme: Theme, active_filter: any, row_height: number) => {
      let test = series.map(function(ev, i){
        let base_style = {
          fill: theme.palette.primary.main,
          opacity: 1.0
        }
        
        function style_func(s: any, state: any){
          if (state == "hover"){
            console.log("got hover");
            return {
              fill:theme.palette.primary.light,
              opacity: 1.0
            }

          } 
          if (state == "selected"){
            return {
              fill:theme.palette.primary.dark,
              opacity: 1.0
            }
          } 
          return base_style
  
        }
        function label_func(e: any){
          return e.data().first().get("title")
        }
        function handle_click(e: any){
          console.log(e.data().first().get("title"))
          let title = e.data().first().get("title");
          let found_row = event_rows.filter(r=>r.title === title)[0];
          
          setEventInfo(found_row);
          setSelectedEvent(e)
          console.log(found_row);
          console.log(getAllFuncs(e));
        }
      return (
  
        <ChartRow 
        height = {`${row_height}`} 
        style = {{fill: "#f1a340"}} key = {i} axisMargin = {1}
        >
          {/* <YAxis
            id="y"
            label="Price ($)"
            min={0.5}
            max={1.5}
            width="60"
            type="linear"
            format="$,.2f"
        /> */}
          <Charts>
          {/* <Baseline
                axis="y"
                value={1.0}
                label="USD Baseline"
                position="right"
            /> */}
            <EventChart
              series = {ev}
              size = {row_height}
              label = {(e: any)=>label_func(e)}
              onSelectionChange = {(e: any)=>handle_click(e)}
              textOffsetY  = {-5}
              // label = {(e: any)=>e.data().frist().get("title")}
              style={style_func}
            ></EventChart>
          </Charts>
        </ChartRow>
        )
      
    })
    return test
  }

  return (
    <Grid container spacing = {0} style = {timelineSection}>
      <Grid item xs = {2}>
        {/* <div></div> */}
        <Text style = {historicalEventsText}>
          <span> HISTORICAL EVENTS</span>
        </Text>
        <EventInfoDisplay info = {eventInfo}></EventInfoDisplay>
      </Grid>
        <Grid item xs = {10} style = {{height: data_loaded?'100%':"101%"}}>
            <div style = {{position: 'relative', height: '200px'}}>
            <div style = {linesContainer}>
              { 
                seperators.map(function(f: Seperator, i: number){
                    let tf: string = parseFloat(`${f.pos}`).toFixed(2);
                    console.log(tf)
                    if (Math.floor(f.pos) === f.pos){
                      
                    console.log(i)
                    console.log(f)
                    console.log(f.pos*100);
                    let test_top: string = `${parseFloat(tf)*100}%`;
                    
                    // conosol
                    const testtest = {
                      paddingTop: test_top,
                      position: 'relative',
                      height: '0px',
                      borderTop: `1px solid lightgrey`,
                    } as React.CSSProperties
                    
                    return(
                      <div key = {f.pos} style = {testtest}>
                        <Text key = {f.pos} style ={seperatorText}>{f.name}</Text>
                      </div>
                    )
                  }
                })
              }

            </div>
            <Resizable>
            <ChartContainer
                timeRange={timerange}
                enablePanZoom={false}
                width = {width*.75}
                // width = {data_loaded?1000:1005}
                showGrid = {true}
                timeAxisStyle = {timeAxis}
                timeAxisTickCount = {5}
                >
                { make_series(time_series.national, theme, active_filter, row_height )}

                { make_series(time_series.state, theme, active_filter, row_height )}

                { make_series(time_series.city, theme, active_filter, row_height )}
              </ChartContainer>
              </Resizable>

        </div>

      </Grid>

    </Grid>
  );
};


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

