import { createMuiTheme } from "@material-ui/core";
export const theme = createMuiTheme({
  palette: {
    primary: {
      //architecture
      dark: "#335761",
      //landscape
      main: "#5794a5",
      //art design
      light: "#8ab4c0",
    },
    //light
    secondary: {
      dark: "#bcd4db",
      main: "#ddeaed",
    },
    //used for hover color
    divider: "hsl(193deg 31% 19%)",
  },
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
