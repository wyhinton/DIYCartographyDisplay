import Grid from "@material-ui/core/Grid";
import { Text } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import "../css/App.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";

/**
 * Simple staic container for the pages title text.
 * @returns
 */

const Title = (): JSX.Element => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("lg"));
  const titleHeader = {
    fontSize: "xxx-large",
    fontFamily: theme.typography.fontFamily,
    color: "#3b6470",
    lineHeight: "normal",
  } as React.CSSProperties;

  const titleSubHeader = {
    fontSize: "xx-large",
    fontFamily: theme.typography.fontFamily,
    paddingBottom: "1em",
    paddingTop: "1em",
    color: "#3b6470",
  } as React.CSSProperties;
  const titleContainer = {
    paddingBottom: "1em",
    paddingTop: ".5em",
    color: theme.palette.primary.main,
  };

  return (
    <Grid container spacing={0} style={titleContainer}>
      <Grid
        item
        xs={2}
        style={
          //div acts as a margin on the left side of the text, in order to keep the text lerf aligned with the image gallery
          //below a mD display size we remove this paddign
          { display: isMd ? "flex" : "none" }
        }
      >
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
};

export default Title;
