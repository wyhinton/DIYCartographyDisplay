import { useStoreActions, useStoreState } from "../../../hooks";
import { useTheme } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import GridUnit from "./GridUnit";
import { MapSubTopic } from "../../../enums";
import { FilterOption } from "../../../model/types";
import Tooltip from "@material-ui/core/Tooltip";

interface GridRowProps {
  count: number;
  filterCode: FilterOption;
  icon: JSX.Element;
}

const GridRow = ({ count, icon, filterCode }: GridRowProps) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);
  const activeFilterState = useStoreState(
    (state) => state.studentsModel.filter
  );
  // const activeGroupFilterState = useStoreState(
  //   (state) => state.studentsModel.groupFilterp
  // );
  const setFilterAction = useStoreActions(
    (actions) => actions.studentsModel.thunkSetFilter
  );

  useEffect(() => {}, [activeFilterState]);
  const setRowColor = (
    currentFilter: FilterOption[],
    rowIsHovered: boolean
  ) => {
    if (currentFilter.some((f) => f == filterCode)) {
      return 4;
    } else {
      return rowIsHovered ? -1 : 0;
    }
  };

  const rowGridStyle = {
    width: "100%",
    display: "flex",
  } as React.CSSProperties;
  // style={{
  //   opacity:
  //     activeFilterState.includes(filterCode) ||
  //     activeFilterState.length == 0
  //       ? 1
  //       : 0.5,
  // }}
  return (
    <Tooltip title={filterToToolTip(filterCode)}>
      <div
        style={{
          ...rowGridStyle,
          opacity:
            activeFilterState.includes(filterCode) ||
            activeFilterState.length == 0
              ? 1
              : 0.5,
        }}
        onMouseEnter={() => setHovered(!hovered)}
        onMouseLeave={() => setHovered(!hovered)}
        onMouseUp={() => {
          setFilterAction(filterCode);
        }}
      >
        {Array.from(Array(count)).map((r, i) => {
          return (
            <div
              style={{ paddingRight: "0.25em", paddingBottom: "0.25em" }}
              key={i}
            >
              <GridUnit
                key={i}
                colorCode={0}
                isActiveFilter={activeFilterState.some((f) => f == filterCode)}
              ></GridUnit>
            </div>
          );
        })}

        <div
          style={{
            height: 15,
            opacity:
              activeFilterState.includes(filterCode) ||
              activeFilterState.length == 0
                ? 1
                : 0.5,
          }}
        >
          {icon}
        </div>
      </div>
    </Tooltip>
  );
};

export default GridRow;

function filterToToolTip(filter: FilterOption): string {
  let tooltipText;
  switch (filter) {
    case MapSubTopic.BUILDINGS:
      tooltipText = "Buildings";
      break;
    case MapSubTopic.TRANS:
      tooltipText = "Transportation";
      break;
    case MapSubTopic.INFRASTR:
      tooltipText = "Infrastructure";
      break;
    case MapSubTopic.PROPERTY:
      tooltipText = "Property";
      break;
    case MapSubTopic.URBANDEV:
      tooltipText = "Urban Development";
      break;
    case MapSubTopic.WORK:
      tooltipText = "Work";
      break;
    case MapSubTopic.GREENSPACE:
      tooltipText = "Greenspace";
      break;
    case MapSubTopic.POLLUTION:
      tooltipText = "Pollution";
      break;
    case MapSubTopic.HYDROLOGY:
      tooltipText = "Hydrology";
      break;
    case MapSubTopic.GOVERMENT:
      tooltipText = "Government";
      break;
    case MapSubTopic.POLICY:
      tooltipText = "Policy";
      break;
    case MapSubTopic.CIVICENG:
      tooltipText = "Civic Engagment";
      break;
    case MapSubTopic.EDUCATION:
      tooltipText = "Education";
      break;
    case MapSubTopic.HEALTHSAFETY:
      tooltipText = "Health";
      break;
    case MapSubTopic.RACEGEN:
      tooltipText = "Race and Gender";
      break;
    default:
      tooltipText = "Default";
  }
  return tooltipText;
}
