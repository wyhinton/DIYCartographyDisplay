// import Grid from '@material-ui/core/Grid';
import { useTheme } from "@material-ui/core/styles";
import SelectorGroup from "./Containers/SelectorGroup";
import SelectorParent from "./Containers/SelectorParent";
import { useStoreState } from "../../hooks";
import GridChunk from "./Grid/GridChunk";
import { ThemeCategoryFilter, FilterGroup } from "../../enums";

const Themes = () => {
  const theme = useTheme();
  const theme_stats = useStoreState(
    (state) => state.studentsModel?.studentStats?.theme
  );
  return (
    <>
      <SelectorParent>
        <SelectorGroup
          title={"Equity"}
          size={4}
          filter={FilterGroup.EQUITY_THEME}
        >
          <GridChunk
            count={theme_stats?.EQUITY}
            filter={ThemeCategoryFilter.EQUITY}
            base_color={0}
          />
        </SelectorGroup>
        <SelectorGroup
          title={"Access"}
          size={4}
          filter={FilterGroup.ACCESS_THEME}
        >
          <GridChunk
            count={theme_stats?.ACCESS}
            filter={ThemeCategoryFilter.ACCESS}
            base_color={0}
          />
        </SelectorGroup>
        <SelectorGroup
          title={"Diversity"}
          size={4}
          filter={FilterGroup.DIVERISTY_THEME}
        >
          <GridChunk
            count={theme_stats?.DIVERSITY}
            filter={ThemeCategoryFilter.DIVERSITY}
            base_color={0}
          />
        </SelectorGroup>
      </SelectorParent>
    </>
  );
};

export default Themes;
