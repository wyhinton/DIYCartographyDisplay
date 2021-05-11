import { useStoreActions, useStoreState } from "../../../hooks";
import { useTheme } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import GridUnit from "./GridUnit";
import { MapSubTopic } from "../../../model/enums";
import { FilterOption } from "../../../model/types";
import blue from "@material-ui/core/colors/blue";
import Tooltip from "@material-ui/core/Tooltip";

interface GridRowProps {
  count: number;
  filter: FilterOption;
  icon: JSX.Element;
  // tooltip: string;
}
function filterToToolTip(filter: FilterOption): string {
  let tooltip_title;
  switch (filter) {
    case MapSubTopic.BE_BUILDINGS:
      tooltip_title = "Buildings";
      break;
    case MapSubTopic.BE_TRANSPORTATION:
      tooltip_title = "Transportation";
      break;
    case MapSubTopic.BE_INFRASTR:
      tooltip_title = "Infrastructure";
      break;
    case MapSubTopic.EE_PROPERTY:
      tooltip_title = "Property";
      break;
    case MapSubTopic.EE_URBANDEV:
      tooltip_title = "Urban Development";
      break;
    case MapSubTopic.EE_WORK:
      tooltip_title = "Work";
      break;
    case MapSubTopic.NE_GREENSPACE:
      tooltip_title = "Greenspace";
      break;
    case MapSubTopic.NE_POLLUTION:
      tooltip_title = "Pollution";
      break;
    case MapSubTopic.NE_HYDROLOGY:
      tooltip_title = "Hydrology";
      break;
    case MapSubTopic.PE_GOV:
      tooltip_title = "Government";
      break;
    case MapSubTopic.PE_POLICY:
      tooltip_title = "Policy";
      break;
    case MapSubTopic.PE_CIVICENG:
      tooltip_title = "Civic Engagment";
      break;
    case MapSubTopic.SE_EDUCATION:
      tooltip_title = "Education";
      break;
    case MapSubTopic.SE_HEALTH:
      tooltip_title = "Health";
      break;
    case MapSubTopic.SE_RACEGEN:
      tooltip_title = "Race and Gender";
      break;
    default:
      tooltip_title = "Default";
  }
  return tooltip_title;
}
const GridRow = ({ count, icon, filter }: GridRowProps) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);
  const real_filter = useStoreState((state) => state.map_data.filter);
  const set_filter = useStoreActions(
    (actions) => actions.map_data.thunk_set_filter
  );
  useEffect(() => {}, [real_filter]);
  useEffect(() => {}, [hovered]);

  const set_row_color = (cur_filters: FilterOption[], is_hovered: boolean) => {
    if (cur_filters.some((f) => f == filter)) {
      return 4;
    } else {
      return is_hovered ? 4 : 0;
    }
  };
  //T:SET ICON COLOR ON HOVER
  const set_icon_color = (is_active_filter: boolean, is_hovered: boolean) => {
    return is_hovered ? blue[100] : theme.palette.primary;
  };

  const rowGrid = {
    width: "100%",
    display: "flex",
  } as React.CSSProperties;

  return (
    <div
      style={rowGrid}
      onMouseEnter={() => setHovered(!hovered)}
      onMouseLeave={() => setHovered(!hovered)}
      onMouseUp={() => {
        set_filter(filter);
      }}
    >
      {Array.from(Array(count)).map((r, i) => {
        return (
          <GridUnit
            key={i}
            color={set_row_color(real_filter, hovered)}
            is_active_filter={real_filter.some((f) => f == filter)}
          ></GridUnit>
        );
      })}
      {<Tooltip title={filterToToolTip(filter)}>{icon}</Tooltip>}
    </div>
  );
};

export default GridRow;
