import { createMuiTheme } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
export const theme = createMuiTheme({
  //   myColor: {
  //     fourth: orange[500],
  //     light: "#8ab4c0",
  //     main: "#739eae",
  //     dark: "#ddeaed",
  //   },
  palette: {
    primary: {
      light: blue[100],
      // light: blue[100],
      main: "#739eae",
      dark: "#335761",
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
