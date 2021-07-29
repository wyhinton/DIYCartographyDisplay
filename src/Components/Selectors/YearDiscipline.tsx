// import Grid from '@material-ui/core/Grid';
import { Paragraph, Text } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import SelectorGroup from "./Containers/SelectorGroup";
import SelectorParent from "./Containers/SelectorParent";
import GridChunk from "./Grid/GridChunk";
import GridUnit from "./Grid/GridUnit";
import { useStoreState } from "../../hooks";
import { AuthorDisciplineFilter, FilterGroup } from "../../enums";

function toAuthorEnum(
  discipline: string,
  year: string
): AuthorDisciplineFilter {
  const filterString = discipline + "_" + year;
  return AuthorDisciplineFilter[
    filterString as unknown as keyof typeof AuthorDisciplineFilter
  ];
}

const YearDiscipline = (): JSX.Element => {
  const theme = useTheme();
  const yearDataState = useStoreState(
    (state) => state.studentsModel?.studentStats?.year
  );
  console.log(yearDataState);
  const chunksContainer = {
    display: "flex",
    height: "100%",
  } as React.CSSProperties;

  const disciplineStyle = {
    color: theme.palette.primary.main,
    fontSize: "8pt",
    justifyContent: "space-between",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;
  const rowContainer = {
    display: "flex",
    fontSize: "8pt",
    height: 20,
    marginTop: -4,
  } as React.CSSProperties;
  const legendContainer = {
    display: "flex",
    fontSize: "8pt",
    height: 20,
    marginTop: -4,
    paddingTop: ".25em",
  } as React.CSSProperties;
  /**For each year create a GridChunk which reflects the number of students in a given discipline */
  const makeYearChunks = (year: string, year_breakdown?: any): JSX.Element => {
    console.log(year_breakdown);
    if (year_breakdown) {
      return (
        <div className={"chunks Container"} style={chunksContainer}>
          <GridChunk
            baseColor={0}
            count={year_breakdown.ARCHITECTURE}
            filter={toAuthorEnum("ARCHITECTURE", year)}
          />
          <GridChunk
            baseColor={1}
            count={year_breakdown.ARTDESIGN}
            filter={toAuthorEnum("ARTDESIGN", year)}
          />
          <GridChunk
            baseColor={2}
            count={year_breakdown.LANDSCAPE}
            filter={toAuthorEnum("LANDSCAPE", year)}
          />
          <GridChunk
            baseColor={3}
            count={year_breakdown.OTHER}
            filter={toAuthorEnum("OTHER", year)}
          />
        </div>
      );
    }
    return <></>;
  };
  return (
    <>
      <SelectorParent>
        <SelectorGroup title={null} size={3} filter={FilterGroup.NONE}>
          <div style={legendContainer}>
            <GridUnit color={0} />
            <Paragraph style={disciplineStyle}>ARCHITECTURE</Paragraph>
          </div>
          <div style={rowContainer}>
            <GridUnit color={1} />
            <Text style={disciplineStyle}>
              <Paragraph style={disciplineStyle}>LANDSCAPE </Paragraph>
            </Text>
          </div>
          <div style={rowContainer}>
            <GridUnit color={2} />
            <Paragraph style={disciplineStyle}>ART + DESIGN</Paragraph>
          </div>
          <div style={rowContainer}>
            <GridUnit color={3} />
            <Paragraph style={disciplineStyle}>OTHER</Paragraph>
          </div>
        </SelectorGroup>
        <SelectorGroup
          title={"2016"}
          size={3}
          filter={FilterGroup.STUDENTS_2016}
        >
          {makeYearChunks("2016", yearDataState?.["2016"])}
        </SelectorGroup>
        <SelectorGroup
          title={"2018"}
          size={3}
          filter={FilterGroup.STUDENTS_2018}
        >
          {makeYearChunks("2018", yearDataState?.["2018"])}
        </SelectorGroup>
        <SelectorGroup
          title={"2020"}
          size={3}
          filter={FilterGroup.STUDENTS_2020}
        >
          {makeYearChunks("2020", yearDataState?.["2020"])}
        </SelectorGroup>
      </SelectorParent>
    </>
  );
};

export default YearDiscipline;
