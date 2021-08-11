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
  const clearSingleFiltersAction = useStoreActions(
    (actions) => actions.studentsModel.clearSingleFilters
  );
  const theme = useTheme();
  const groupFilterState = useStoreState(
    (state) => state.studentsModel?.groupFilter
  );
  const activeFilterState = useStoreState(
    (state) => state.studentsModel.filter
  );
  const [iconColor, setIconColor] = useState(theme.palette.primary.main);
  const [iconOpacity, setIconOpacity] = useState(1);
  useEffect(() => {
    if (
      activeFilterState.length == 0 ||
      activeFilterState[0] == filterCode
      // groupFilterState == FilterGroup.NONE ||
      // (groupFilterState == filterCode && activeFilterState.length == 0)
    ) {
      setIconOpacity(1);
    } else {
      setIconOpacity(0.5);
    }
  }, [activeFilterState, iconOpacity, groupFilterState]);
  const iconSize = 40;
  return (
    <div
      onClick={(e) => {
        // clearSingleFiltersAction(undefined);
        setFilterAction(filterCode);
        setIconColor(theme.palette.primary.main);
      }}
      style={{
        opacity: iconOpacity,
      }}
      onMouseEnter={() => setIconColor(theme.palette.divider)}
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
