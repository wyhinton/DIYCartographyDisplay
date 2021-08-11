import { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import SelectorGroup from "./Containers/SelectorGroup";
import SelectorParent from "./Containers/SelectorParent";
import { useStoreState, useStoreActions } from "../../hooks";
import { FilterGroup } from "../../enums";
import { FlowReviewBranchIcon, RouteIcon, ShapesIcon } from "evergreen-ui";
import { FilterOption } from "model/types";
/**Selector widget for filtering by map theme (equity, access, or diversity) */
const ThemeSelector = (): JSX.Element => {
  return (
    <>
      <SelectorParent>
        <SelectorGroup
          title={"Equity"}
          size={4}
          filter={FilterGroup.EQUITY_THEME}
        >
          <ClickableIcon filterCode={FilterGroup.EQUITY_THEME} />
        </SelectorGroup>
        <SelectorGroup
          title={"Access"}
          size={4}
          filter={FilterGroup.ACCESS_THEME}
        >
          <ClickableIcon filterCode={FilterGroup.ACCESS_THEME} />
        </SelectorGroup>
        <SelectorGroup
          title={"Diversity"}
          size={4}
          filter={FilterGroup.DIVERSITY_THEME}
        >
          <ClickableIcon filterCode={FilterGroup.DIVERSITY_THEME} />
        </SelectorGroup>
      </SelectorParent>
    </>
  );
};

export default ThemeSelector;

const ClickableIcon = ({
  filterCode,
}: {
  filterCode: FilterOption;
}): JSX.Element => {
  const setFilterAction = useStoreActions(
    (actions) => actions.studentsModel.thunkSetFilter
  );
  const theme = useTheme();
  const groupFilterState = useStoreState(
    (state) => state.studentsModel?.groupFilter
  );
  const activeFilterState = useStoreState(
    (state) => state.studentsModel.filter
  );
  const [hovered, setHovered] = useState(false);
  const [iconColor, setIconColor] = useState(theme.palette.primary.main);
  const [iconOpacity, setIconOpacity] = useState(1);
  useEffect(() => {
    if (activeFilterState.length == 0 || groupFilterState == filterCode) {
      setIconOpacity(1);
      // setIconColor(theme.palette.primary.main);
    } else {
      setIconOpacity(0.5);
    }
  }, [activeFilterState]);
  // useEffect(() => {
  //   console.log("got hovered");
  //   if (!hovered) {
  //     setIconColor(theme.palette.primary.main);
  //   } else {
  //     setIconColor(theme.palette.divider);
  //   }
  // }, [hovered]);
  const iconSize = 40;
  return (
    <div
      onClick={(e) => {
        setFilterAction(filterCode);
        setHovered(false);
        setIconColor(theme.palette.primary.main);
      }}
      style={{
        opacity: iconOpacity,
      }}
      onMouseEnter={() => setIconColor(theme.palette.divider)}
      // onMouseEnter={() => setHovered(!hovered)}
      className={"theme icon container"}
      onMouseLeave={() => setIconColor(theme.palette.primary.main)}
    >
      {filterCode === FilterGroup.EQUITY_THEME ? (
        <FlowReviewBranchIcon color={iconColor} size={iconSize} />
      ) : filterCode === FilterGroup.ACCESS_THEME ? (
        <RouteIcon color={iconColor} size={iconSize} />
      ) : filterCode === FilterGroup.DIVERSITY_THEME ? (
        <ShapesIcon color={iconColor} size={iconSize} />
      ) : (
        <></>
      )}
    </div>
  );
};
