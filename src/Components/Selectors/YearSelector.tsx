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
  console.log(filterString);
  return AuthorDisciplineFilter[
    filterString as unknown as keyof typeof AuthorDisciplineFilter
  ];
}

const YearSelector = (): JSX.Element => {
  const yearDataState = useStoreState(
    (state) => state.studentsModel?.studentStats?.year
  );
  const chunksContainer = {
    display: "flex",
    height: "100%",
  } as React.CSSProperties;

  /**For each year create a GridChunk which reflects the number of students in a given discipline */
  const makeYearChunks = (year: string, yearBreakdown?: any): JSX.Element => {
    if (yearBreakdown) {
      return (
        <div className={"chunks Container"} style={chunksContainer}>
          <GridChunk
            baseColor={0}
            count={yearBreakdown.ARCHITECTURE}
            filter={toAuthorEnum("ARCHITECTURE", year)}
          />
          <GridChunk
            baseColor={1}
            count={yearBreakdown.ARTDESIGN}
            filter={toAuthorEnum("ARTDESIGN", year)}
          />
          <GridChunk
            baseColor={2}
            count={yearBreakdown.LANDSCAPE}
            filter={toAuthorEnum("LANDSCAPE", year)}
          />
          <GridChunk
            baseColor={3}
            count={yearBreakdown.OTHER}
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
          <LegendEntry title={"ARCHITECTURE"} gridUnitColorCode={0} />
          <LegendEntry title={"ART + DESIGN"} gridUnitColorCode={1} />
          <LegendEntry title={"LANDSCAPE"} gridUnitColorCode={2} />
          <LegendEntry title={"OTHER"} gridUnitColorCode={3} />
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

export default YearSelector;

const LegendEntry = ({
  title,
  gridUnitColorCode,
}: {
  title: string;
  gridUnitColorCode: number;
}): JSX.Element => {
  const theme = useTheme();

  const disciplineStyle = {
    color: theme.palette.primary.main,
    fontSize: "8pt",
    justifyContent: "space-between",
    paddingLeft: ".25em",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;

  const rowContainer = {
    display: "flex",
    fontSize: "8pt",
    height: 20,
    marginTop: -4,
  } as React.CSSProperties;

  return (
    <div style={rowContainer} className={"legend item container"}>
      <div style={{ height: "100%", paddingTop: 4 }}>
        <GridUnit colorCode={gridUnitColorCode} isLegendKey={true} />
      </div>
      <Text style={disciplineStyle}>
        <Paragraph style={disciplineStyle}>{title}</Paragraph>
      </Text>
    </div>
  );
};
