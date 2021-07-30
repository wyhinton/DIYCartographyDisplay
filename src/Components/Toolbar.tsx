import Grid from "@material-ui/core/Grid";
import SelectorSection from "./SelectorSection";
import { Paragraph, Text } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import YearSelector from "./Selectors/YearSelector";
import ThemeSelector from "./Selectors/ThemeSelector";
import MapLens from "./Selectors/TopicSelector";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const Toolbar = (): JSX.Element => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const toolbarContainer = {
    height: "fit-content",
    minHeight: "6rem",
    maxHeight: "17rem",
    display: isMd ? "inline-flex" : "none",
  } as React.CSSProperties;

  const instructionsParagraph = {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.primary.main,
    fontSize: "9pt",
    lineHeight: "12pt",
    paddingTop: "0.75em",
  } as React.CSSProperties;

  const firstContainer = {
    height: "auto",
    paddingLeft: ".25em",
    paddingRight: ".25em",
    minHeight: "6rem",
    border: `1px solid ${theme.palette.primary.main}`,
    marginRight: "1em",
    maxWidth: "15vw",
    // minWidth: "fit-content",
  } as React.CSSProperties;

  const selectorContainer = {
    height: "auto",
    paddingLeft: ".25em",
    paddingRight: ".25em",
    minHeight: "6rem",
    border: `1px solid ${theme.palette.primary.main}`,
    marginRight: "1em",
    overflow: "hidden",
    minWidth: "fit-content",
  } as React.CSSProperties;

  return (
    <Grid container spacing={0} style={toolbarContainer}>
      <SelectorSection title="SELECT & FILTER" style={firstContainer}>
        <Text style={instructionsParagraph}>
          <Paragraph size={300} style={instructionsParagraph}>
            Click on titles to view main categories. Click on rectangle blocks
            to filter by subcategories.
          </Paragraph>
        </Text>
      </SelectorSection>
      <SelectorSection title="YEAR & DISCIPLINE" style={selectorContainer}>
        <YearSelector></YearSelector>
      </SelectorSection>
      <SelectorSection title="TOPICS" style={selectorContainer}>
        <MapLens></MapLens>
      </SelectorSection>
      <SelectorSection title="THEMES" style={selectorContainer}>
        <ThemeSelector></ThemeSelector>
      </SelectorSection>
    </Grid>
  );
};

export default Toolbar;
