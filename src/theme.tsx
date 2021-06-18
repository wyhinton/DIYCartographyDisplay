import { createMuiTheme } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
// import createMuiTheme from "./custom_theme";

// export const theme = createMuiTheme;
// main_0: "#335761",
// main_1: "#5794a5",
// main_2: "#8ab4c0",
// main_3: "#bcd4db",
// main_4: "#ddeaed",

export const theme = createMuiTheme({
  palette: {
    primary: {
      dark: "#335761",
      main: "#5794a5",
      light: "#bcd4db",
    },
    //light
    secondary: {
      dark: "#bcd4db",
      main: "#ddeaed",
    },
  },
  //   cu
  spacing: (factor) => `${0.25 * factor}rem`,
  overrides: {
    MuiGrid: {
      root: {
        margin: "0px",
        // display: 'flex',
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: "#5794a5",
      },
    },
  },
  typography: {
    fontFamily: "Audimat",
  },
});
// #8ab4c0 medium dark
// #8ab4c0 medium dark
// #bcd4db medium light
// #ddeaed light

// import { createMuiTheme } from "@material-ui/core";
// export const theme = createMuiTheme({
//     palette:{
//         primary: {
//             light: blue[100],
//             //medium_light?
//             main: blue[300],
//             //medium_dark?
//             dark: blue[700],
//         }
//     },
//     }
// })
