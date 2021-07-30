import { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import SelectorGroup from "./Containers/SelectorGroup";
import SelectorParent from "./Containers/SelectorParent";
import { useStoreState, useStoreActions } from "../../hooks";
import { FilterGroup } from "../../enums";
import { EqualsIcon } from "evergreen-ui";
import { FilterOption } from "model/types";
/**Selector widget for filtering by map theme (equity, access, or diversity) */
const ThemeSelector = (): JSX.Element => {
  // const theme = useTheme();
  // const theme_stats = useStoreState(
  //   (state) => state.studentsModel?.studentStats?.theme
  // );
  return (
    <>
      <SelectorParent>
        <SelectorGroup
          title={"Equity"}
          size={4}
          filter={FilterGroup.EQUITY_THEME}
        >
          {/* <GridChunk
            count={theme_stats?.EQUITY}
            filter={ThemeCategoryFilter.EQUITY}
            baseColor={0}
          /> */}
          <ClickableIcon filterCode={FilterGroup.EQUITY_THEME} />
        </SelectorGroup>
        <SelectorGroup
          title={"Access"}
          size={4}
          filter={FilterGroup.ACCESS_THEME}
        >
          <ClickableIcon filterCode={FilterGroup.ACCESS_THEME} />
          {/* <GridChunk
            count={theme_stats?.ACCESS}
            filter={ThemeCategoryFilter.ACCESS}
            baseColor={0}
          /> */}
        </SelectorGroup>
        <SelectorGroup
          title={"Diversity"}
          size={4}
          filter={FilterGroup.DIVERISTY_THEME}
        >
          <ClickableIcon filterCode={FilterGroup.DIVERISTY_THEME} />
          {/* <GridChunk
            count={theme_stats?.DIVERSITY}
            filter={ThemeCategoryFilter.DIVERSITY}
            baseColor={0}
          /> */}
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

  useEffect(() => {}, [activeFilterState]);
  useEffect(() => {
    console.log("got hovered");
    if (hovered) {
      if (activeFilterState.includes(filterCode)) {
        setIconColor(theme.palette.primary.dark);
      } else {
        console.log("setting ot light");
        setIconColor(theme.palette.secondary.light);
      }
    } else {
      setIconColor(theme.palette.primary.main);
    }
  }, [hovered]);
  // useEffect(()=>{
  // },[activeFilterState]);
  // const setIconColor = (
  //   currentFilter: FilterOption[],
  //   rowIsHovered: boolean
  // ) => {
  //   if (currentFilter.some((f) => f == filterCode)) {
  //     return 4;
  //   } else {
  //     return rowIsHovered ? 4 : 0;
  //   }
  // };

  return (
    <div
      onClick={(e) => {
        setFilterAction(filterCode);
      }}
      onMouseEnter={() => setHovered(!hovered)}
      className={"theme icon container"}
      onMouseLeave={() => setHovered(!hovered)}
    >
      <EqualsIcon color={iconColor} size={50} />
    </div>
  );
};
