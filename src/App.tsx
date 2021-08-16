// https://docs.google.com/spreadsheets/d/1-S8EkLYsknYoFWSynVeMQCi6Gf9PoV9A5ezzICXamJA/edit?usp=sharing
// https://docs.google.com/spreadsheets/d/e/2PACX-1vShkIFNo43AJw8tdtdq4vsa40okE7v4IJbbXUOuIsLpnCYZMaQnPH9k3_YFhm814s2oa9VrVkQbzPNa/pubhtml
import "./css/App.css";
import Grid from "@material-ui/core/Grid";
import MapGallery from "./Components/MapGallery";
import Sidebar from "./Components/Sidebar";
import Timeline from "./Components/Timeline";
import Title from "./Components/Title";
import Toolbar from "./Components/Toolbar";
import { ThemeProvider, defaultTheme } from "evergreen-ui";
import { merge } from "lodash";
import { useEffect } from "react";
import { useStoreActions, useStoreState } from "./hooks";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const App = (): JSX.Element => {
  const theme = useTheme();
  const fetchStudentSpreadsheet = useStoreActions(
    (actions) => actions.studentsModel.fetchStudentSheets
  );
  const dataLoaded = useStoreState((state) => state.studentsModel.loaded);
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));
  const myCustomTheme = merge({}, defaultTheme, {
    typography: {
      fontFamilies: {
        display: "Audimat",
        ui: "Audimat",
        mono: "Audimat",
      },
    },
  });
  useEffect(() => {
    fetchStudentSpreadsheet();
  });

  return (
    <ThemeProvider value={myCustomTheme}>
      <Grid container spacing={0}>
        <Grid
          item
          md={12}
          lg={12}
          className={"toolbar-grid-container"}
          style={
            dataLoaded
              ? {
                  animation: "fadeIn 1s ease-out",
                  animationIterationCount: 1,
                }
              : { opacity: 0 }
          }
        >
          <Toolbar />
        </Grid>
        <Grid
          container
          spacing={0}
          // style={{ paddingTop: "1em", paddingBottom: "0em" }}
        >
          <Grid item md={12} lg={12}>
            <Title />
          </Grid>
          <Grid item md={12} lg={2}>
            <Sidebar />
          </Grid>
          <Grid
            item
            md={12}
            lg={10}
            style={{
              width: "100%",
            }}
          >
            <MapGallery />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          style={
            dataLoaded
              ? {
                  animation: "fadeIn 1.5s ease-out",
                  animationIterationCount: 1,
                  display: isBelowMedium ? "none" : "flex",
                  paddingTop: ".5em",
                }
              : { opacity: 0 }
          }
        >
          <Timeline />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
