import Grid from "@material-ui/core/Grid";
import SelectorSection from "./SelectorSection";
import { Paragraph, Text } from "evergreen-ui";
import { useTheme, withStyles } from "@material-ui/core/styles";
import YearDiscipline from "./Selectors/YearDiscipline";
import Themes from "./Selectors/Themes";
import MapLens from "./Selectors/MapLens";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const Toolbar = () => {
  const theme = useTheme();
  const is_sm = useMediaQuery(theme.breakpoints.up("md"));

  const toolbarContainer = {
    height: "fit-content",
    minHeight: "6rem",
    maxHeight: "17rem",
    display: is_sm ? "inline-flex" : "none",
  } as React.CSSProperties;

  const instructions_paragraph = {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.primary.main,
    fontSize: "9pt",
    lineHeight: "12pt",
  };

  const container = {
    height: "100%",
    paddingLeft: ".25em",
    paddingRight: ".25em",
    minHeight: "6rem",
    border: `1px solid ${theme.palette.primary.main}`,
    marginRight: "1em",
    maxWidth: "fit-content",
    minWidth: "fit-content",
  } as React.CSSProperties;

  const firstContainer = {
    height: "100%",
    paddingLeft: ".25em",
    paddingRight: ".25em",
    minHeight: "6rem",
    border: `1px solid ${theme.palette.primary.main}`,
    marginRight: "1em",
    maxWidth: "15vw",
    // minWidth: "fit-content",
  } as React.CSSProperties;

  const selectorContainer = {
    height: "100%",
    paddingLeft: ".25em",
    paddingRight: ".25em",
    minHeight: "6rem",
    border: `1px solid ${theme.palette.primary.main}`,
    marginRight: "1em",
    // maxWidth: "12vw",
    minWidth: "fit-content",
    // minWidth: "fit-content",
  } as React.CSSProperties;

  const SelectorContainer = withStyles({
    root: {
      height: "100%",
      paddingRight: ".1em",
    },
  })(Grid);

  return (
    <Grid container spacing={0} style={toolbarContainer}>
      {/* <SelectorContainer item xs={12} sm={12} md={6} lg={2} xl={2}> */}
      <SelectorSection title="SELECT & FILTER" style={firstContainer}>
        <Text style={instructions_paragraph}>
          <Paragraph size={300} style={instructions_paragraph}>
            Click on titles to view main categories. Click on rectangle blocks
            to filter by subcategories.
          </Paragraph>
        </Text>
      </SelectorSection>
      {/* </SelectorContainer> */}
      {/* <SelectorContainer item xs={12} sm={12} md={6} lg={3} xl={3}> */}
      <SelectorSection title="YEAR & DISCIPLINE" style={selectorContainer}>
        <YearDiscipline></YearDiscipline>
      </SelectorSection>
      {/* </SelectorContainer> */}
      {/* <SelectorContainer item xs={12} sm={12} md={6} lg={4} xl={4}> */}
      <SelectorSection title="TOPICS" style={selectorContainer}>
        <MapLens></MapLens>
      </SelectorSection>
      {/* </SelectorContainer> */}
      {/* <SelectorContainer item xs={12} sm={12} md={6} lg={3} xl={2}> */}
      <SelectorSection title="THEMES" style={selectorContainer}>
        <Themes></Themes>
      </SelectorSection>
      {/* </SelectorContainer> */}
    </Grid>
  );
};

export default Toolbar;
