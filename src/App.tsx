import { useEffect } from "react";
import "./css/App.css";
import Grid from "@material-ui/core/Grid";
import Sidebar from "./Components/Sidebar";
import MapGallery from "./Components/MapGallery";
import Timeline from "./Components/Timeline";
import { useStoreActions } from "./hooks";
import Toolbar from "./Components/Toolbar";
import Title from "./Components/Title";
import { defaultTheme } from "evergreen-ui";
import { ThemeProvider } from "evergreen-ui";
import { merge } from "lodash";

// const My

// const test_data =
// https://docs.google.com/spreadsheets/d/1-S8EkLYsknYoFWSynVeMQCi6Gf9PoV9A5ezzICXamJA/edit?usp=sharing
// https://docs.google.com/spreadsheets/d/e/2PACX-1vShkIFNo43AJw8tdtdq4vsa40okE7v4IJbbXUOuIsLpnCYZMaQnPH9k3_YFhm814s2oa9VrVkQbzPNa/pubhtml
function App() {
  const test_thunk = useStoreActions(
    (actions) => actions.map_data.fetch_map_data
  );
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
    test_thunk();
    console.log(defaultTheme);
  }, []);

  return (
    <ThemeProvider value={myCustomTheme}>
      <Grid container spacing={0}>
        <Grid item md={12} lg={12}>
          <Toolbar />
        </Grid>
        <Grid
          container
          spacing={0}
          style={{ paddingTop: "1em", paddingBottom: "2em" }}
        >
          <Grid item md={12} lg={12}>
            <Title />
          </Grid>
          <Grid item md={12} lg={2}>
            <Sidebar />
          </Grid>
          <Grid item md={12} lg={10}>
            <MapGallery />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ height: "25%", padding: 0 }}>
          <Timeline />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
