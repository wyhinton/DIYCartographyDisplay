// import {v4 as uuid} from 'uuid';
import { useState, useEffect, useRef } from "react";
import { useTheme, Theme } from "@material-ui/core/styles";
import { useStoreState } from "../hooks";
import { Text } from "evergreen-ui";
import Grid from "@material-ui/core/Grid";
import EventInfoDisplay from "./Timeline/EventInfoDisplay";
import type { EventRow } from "../model/map_data";
// https://codesandbox.io/s/l28vmvp2n9?from-embed

import ChartContainer from "./TimeSeries/components/ChartContainer";
// import ChartContainer from  "react-timeseries-charts";
import Charts from "./TimeSeries/components/Charts";
import Resizable from "./TimeSeries/components/Resizable";
// import { Resizable } from "react-timeseries-charts";
import ChartRow from "./TimeSeries/components/ChartRow";
import YAxis from "./TimeSeries/components/YAxis";
import EventChart from "./TimeSeries/components/EventChart";
import Baseline from "./TimeSeries/components/Baseline";
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { EventLevel } from "../model/enums";
import "../css/timeline.css";
import { convertTypeAcquisitionFromJson } from "typescript";
interface Seperator {
  pos: number;
  // pos: string;
  name: string;
  // count: number;
}

const Timeline = function () {
  const time_series = useStoreState((state) => state.map_data.timeline_series);
  const timeline_offset = "6em";
  const event_rows: EventRow[] = useStoreState(
    (state) => state.map_data.event_spreadsheet
  );
  const initial_width = 2000;
  const timeline_container = useRef<HTMLDivElement | null>(null);
  const [eventInfo, setEventInfo] = useState<EventRow | undefined>(undefined);
  const [resizeWidth, setResizeWidth] = useState(initial_width);
  const [selectedEvent, setSelectedEvent] = useState<TimeSeries | undefined>(
    undefined
  );
  // const [timeSeriesCount, setTimeSeriesCount] = useState(0);
  const [seperators, setSeperators] = useState<Seperator[]>([]);
  const theme = useTheme();
  const row_height = 15;
  // const row_height = 20;
  const start_date = new Date(1763, 0, 1);
  const end_date = new Date(2020, 0, 1);
  const is_sm = useMediaQuery(theme.breakpoints.up("sm"));
  // const data_loaded = useStoreState((state) => state.map_data.loaded);
  // const [width, setWidth] = useState(window.innerWidth);
  function sum(acc: number, val: number) {
    return acc + val;
  }

  useEffect(() => {
    let tot = 0;
    Object.values(time_series).forEach((f) => {
      tot += f.length;
    });
    console.log(tot);
    let seperators: Seperator[] = [];
    let keys = Object.keys(time_series);

    let test = 0;
    if (tot > 0) {
      let top = 1.0;
      Object.values(time_series).forEach((f, i) => {
        console.log(f.length / tot);
        top -= f.length / tot;
        console.log(top);
        test += f.length / tot;
        let sep = {
          pos: top,
          name: keys[i],
        } as Seperator;
        seperators.push(sep);
      });
      setSeperators(seperators);
      console.log(seperators);
      console.log(test);
    }
  }, [time_series]);
  useEffect(() => {}, [seperators]);
  const timelineSection = {
    // height: 'fit-content',
    height: 200,
    // height
    width: "100%",
    borderTop: `1px solid ${theme.palette.primary.main}`,
    display: is_sm ? "inline-flex" : "none",
  } as React.CSSProperties;

  useEffect(() => {
    let test = timeline_container?.current?.style?.width;
    console.log(test);
    let test_number = parseInt(test ?? "2000");
    console.log(test_number);
    setResizeWidth(parseInt(test ?? "2000"));
  }, [timeline_container]);
  const linesContainer = {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    zIndex: -1,
    opacity: 1.0,
    textAlign: "right",
  } as React.CSSProperties;

  const seperatorText = {
    fontSize: "12px",
    position: "absolute",
    // color: "lightgrey",
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.primary.main,
    textAlilgn: "right",
  } as React.CSSProperties;

  const historicalEventsText = {
    fontSize: "9px",
    position: "absolute",
    color: theme.palette.primary.main,
  } as React.CSSProperties;

  const timeAxis = {
    axis: {
      stroke: theme.palette.primary.main,
    },
  };

  let timerange = new TimeRange(start_date, end_date);
  const make_series = (
    series: TimeSeries[],
    theme: Theme,
    row_height: number
  ) => {
    let test = series.map(function (ev, i) {
      let base_style = {
        fill: theme.palette.primary.main,
        opacity: 1.0,
      };

      function style_func(s: any, state: any) {
        // console.log(state);
        let style: any;

        switch (state) {
          case "hover":
            style = {
              fill: theme.palette.primary.light,
              opacity: 1.0,
              fontFamily: theme.typography.fontFamily,
            };
            break;
          case "selected":
            style = {
              fill: theme.palette.primary.dark,
              opacity: 1.0,
              fontFamily: theme.typography.fontFamily,
            };
            break;
          default:
            style = base_style;
        }
        // e.data().first().get("title"));
        if (s.data().first().get("title") === selectedEvent) {
          console.log("got selected");
          style = {
            fill: theme.palette.primary.light,
            opacity: 1.0,
            fontFamily: theme.typography.fontFamily,
          };
        }
        return style;
      }
      function label_func(e: any) {
        return e.data().first().get("title");
      }
      function handle_click(e: any) {
        console.log(e.data().first().get("title"));
        let title = e.data().first().get("title");
        let found_row = event_rows.filter((r) => r.title === title)[0];

        setEventInfo(found_row);
        setSelectedEvent(title);
        console.log(getAllFuncs(e));
      }
      return (
        <ChartRow
          height={`${row_height}`}
          style={{ fill: "#f1a340" }}
          key={i}
          axisMargin={1}
        >
          <Charts>
            <EventChart
              series={ev}
              size={row_height}
              label={(e: any) => label_func(e)}
              onSelectionChange={(e: any) => handle_click(e)}
              textOffsetY={-5}
              style={style_func}
            ></EventChart>
          </Charts>
        </ChartRow>
      );
    });
    return test;
  };

  return (
    <Grid container spacing={0} style={timelineSection}>
      <Grid item xs={2}>
        {/* <div></div> */}
        {/* <Text style={historicalEventsText}>
          <span> HISTORICAL EVENTS</span>
        </Text>
        <EventInfoDisplay info={eventInfo}></EventInfoDisplay> */}
        <EventInfoDisplay info={eventInfo}></EventInfoDisplay>
      </Grid>
      <Grid item xs={10} style={{ paddingTop: ".25em" }}>
        <div style={{ position: "relative", height: "200px" }}>
          <div style={linesContainer}>
            {seperators.map((sep, i) => {
              return (
                <div
                  key={i}
                  style={{
                    // borderTop: `1px solid ${theme.palette.primary.main}`,
                    textAlign: "right",
                    top: `${sep.pos * 100}%`,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      borderTop: `1px solid ${theme.palette.primary.main}`,
                      top: `${sep.pos * 100}%`,
                      position: "relative",
                      marginLeft: timeline_offset,
                    }}
                  ></div>
                  <div
                    style={{
                      width: 100,
                      marginLeft: "-6em",
                    }}
                  >
                    {/* <div style={{ width: 100, marginLeft: timeline_offset }}> */}
                    <Text key={i} style={seperatorText}>
                      {sep.name.toUpperCase()}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{ height: "100%", width: "1000", marginLeft: "6em" }}
            ref={timeline_container}
          >
            <Resizable width={resizeWidth}>
              <ChartContainer
                timeRange={timerange}
                enablePanZoom={false}
                showGrid={true}
                timeAxisStyle={timeAxis}
                timeAxisTickCount={5}
              >
                {make_series(time_series.national, theme, row_height)}
                {make_series(time_series.state, theme, row_height)}
                {make_series(time_series.city, theme, row_height)}
                {make_series(time_series.international, theme, row_height)}
                {make_series(time_series.NA, theme, row_height)}
              </ChartContainer>
            </Resizable>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default Timeline;

function getAllFuncs(toCheck: any) {
  var props: any[] = [];
  var obj = toCheck;
  do {
    props = props.concat(Object.getOwnPropertyNames(obj));
  } while ((obj = Object.getPrototypeOf(obj)));

  return props.sort().filter(function (e, i, arr) {
    if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
  });
}
