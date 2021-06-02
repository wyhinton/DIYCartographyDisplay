import Grid from "@material-ui/core/Grid";
import { Text } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import "../css/App.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function Title() {
  const theme = useTheme();
  const is_md = useMediaQuery(theme.breakpoints.up("lg"));
  const titleHeader = {
    fontSize: "xxx-large",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;

  const titleSubHeader = {
    fontSize: "xx-large",
    fontFamily: theme.typography.fontFamily,
    paddingBottom: "1em",
    paddingTop: "1em",
  } as React.CSSProperties;
  const titleContainer = {
    paddingBottom: "1em",
    paddingTop: ".5em",
  };

  return (
    <Grid container spacing={0} style={titleContainer}>
      <Grid item xs={2} style={{ display: is_md ? "flex" : "none" }}>
        <div></div>
      </Grid>
      <Grid item xs={10}>
        <div style={titleContainer}>
          <Text style={titleHeader}>DIY CARTOGRAPHY: </Text>
        </div>
        <div>
          <Text style={titleSubHeader}>
            MAPPING THE IMPACT OF URBAN DEVELOPMENT
          </Text>
        </div>
      </Grid>
    </Grid>
  );
}

export default Title;
