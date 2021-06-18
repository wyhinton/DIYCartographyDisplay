// https://codesandbox.io/s/l28vmvp2n9?from-embed
import "../../css/timeline.css";
import ChartContainer from "./TimeSeries/components/ChartContainer";
import ChartRow from "./TimeSeries/components/ChartRow";
import Charts from "./TimeSeries/components/Charts";
import EventChart from "./TimeSeries/components/EventChart";
import EventInfoDisplay from "./EventInfoDisplay";
import Grid from "@material-ui/core/Grid";
import Resizable from "./TimeSeries/components/Resizable";
import type { EventRowValues } from "../../model/timeline_model";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Text } from "evergreen-ui";
import { TimeSeries, TimeRange } from "pondjs";
import { useState, useEffect, useRef } from "react";
import { useStoreState } from "../../hooks";
import { useTheme, Theme } from "@material-ui/core/styles";

interface Seperator {
  pos: number;
  name: string;
}

const Timeline = function () {
  const theme = useTheme();
  const is_sm = useMediaQuery(theme.breakpoints.up("sm"));

  const timeline_offset = "6em";
  const initial_width = 2000;

  const time_series = useStoreState((state) => state.timeline.timelineSeries);
  // const time_series = useStoreState((state) => state.timeline.timelineSeries);
  const event_rows: EventRowValues[] = useStoreState(
    (state) => state.timeline.eventSpreadsheet
  );

  const [eventInfo, setEventInfo] =
    useState<EventRowValues | undefined>(undefined);
  const [resizeWidth, setResizeWidth] = useState(initial_width);
  const [selectedEvent, setSelectedEvent] =
    useState<TimeSeries | undefined>(undefined);
  const [seperators, setSeperators] = useState<Seperator[]>([]);
  const timeline_container = useRef<HTMLDivElement | null>(null);

  const row_height = 15;

  //defines the range of the timeline
  const start_date = new Date(1763, 0, 1);
  const end_date = new Date(2020, 0, 1);

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
    height: "10%",
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
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.primary.main,
    textAlilgn: "right",
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
  let props: any[] = [];
  let obj = toCheck;
  do {
    props = props.concat(Object.getOwnPropertyNames(obj));
  } while ((obj = Object.getPrototypeOf(obj)));

  return props.sort().filter(function (e, i, arr) {
    if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
  });
}

// {
//   /* {make_series(time_series.international, theme, row_height)} */
// }
// {
//   /* {make_series(time_series.NA, theme, row_height)} */
// }
