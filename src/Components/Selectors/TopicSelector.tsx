// https://material-ui.com/components/material-icons/
import SelectorGroup from "./Containers/SelectorGroup";
import SelectorParent from "./Containers/SelectorParent";
import GridRow from "./Grid/GridRow";
import { MapSubTopic, FilterGroup } from "../../enums";
import { useTheme } from "@material-ui/core/styles";

import {
  LightbulbIcon,
  HomeIcon,
  ChartIcon,
  BriefcaseIcon,
  TreeIcon,
  SymbolCrossIcon,
  PeopleIcon,
} from "evergreen-ui";

import {
  DirectionsBus,
  Apartment,
  Opacity,
  Gavel,
  AccountBalance,
  VolumeUp,
  School,
} from "@material-ui/icons";

import { useStoreState } from "../../hooks";

const TopicSelector = (): JSX.Element => {
  const theme = useTheme();
  const tagStats = useStoreState(
    (state) => state.studentsModel?.studentStats?.subtopic
  );

  //TODO: FIX REDUNDANT FILTER/TOPIC
  return (
    <>
      <SelectorParent>
        <SelectorGroup
          title={"Built"}
          size={2}
          filter={FilterGroup.BUILT_TOPIC}
        >
          <GridRow
            filterCode={MapSubTopic.INFRASTR}
            count={tagStats?.BE?.ENERGY}
            icon={
              <LightbulbIcon color={theme.palette.primary.main} size={12} />
            }
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.BUILDINGS}
            count={tagStats?.BE?.HOUSING}
            icon={<Apartment color={"primary"} style={{ fontSize: "12pt" }} />}
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.TRANS}
            count={tagStats?.BE?.TRANSPORTATION}
            icon={
              <DirectionsBus
                fontSize="small"
                color={"primary"}
                style={{ fontSize: "12pt" }}
              />
            }
          />
        </SelectorGroup>
        <SelectorGroup
          title={"Economic"}
          size={3}
          filter={FilterGroup.ECONOMIC_TOPIC}
        >
          <GridRow
            filterCode={MapSubTopic.PROPERTY}
            count={tagStats?.EE?.COSTOFLIVING}
            icon={<HomeIcon color={theme.palette.primary.main} size={12} />}
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.URBANDEV}
            count={tagStats?.EE?.URBANDEV}
            icon={<ChartIcon color={theme.palette.primary.main} size={12} />}
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.WORK}
            count={tagStats?.EE?.WORK}
            icon={
              <BriefcaseIcon color={theme.palette.primary.main} size={12} />
            }
          />
        </SelectorGroup>
        <SelectorGroup
          title={"Natural"}
          size={2}
          filter={FilterGroup.NATURAL_TOPIC}
        >
          <GridRow
            filterCode={MapSubTopic.GREENSPACE}
            count={tagStats?.NE?.GREENSPACE}
            icon={<TreeIcon color={theme.palette.primary.main} size={12} />}
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.POLLUTION}
            count={tagStats?.NE?.POLLUTION}
            icon={<ChartIcon color={theme.palette.primary.main} size={12} />}
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.HYDROLOGY}
            count={tagStats?.NE?.HYDROLOGY}
            icon={<Opacity color={"primary"} style={{ fontSize: "12pt" }} />}
          />
        </SelectorGroup>
        <SelectorGroup
          title={"Political"}
          size={3}
          filter={FilterGroup.POLITICAL_TOPIC}
        >
          <GridRow
            filterCode={MapSubTopic.GOVERMENT}
            count={tagStats?.PE?.GOVERMENT}
            icon={
              <AccountBalance color={"primary"} style={{ fontSize: "12pt" }} />
            }
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.POLICY}
            count={tagStats?.PE?.POLICY}
            icon={<Gavel color={"primary"} style={{ fontSize: "12pt" }} />}
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.CIVICENG}
            count={tagStats?.PE?.CIVICENG}
            icon={<VolumeUp color={"primary"} style={{ fontSize: "12pt" }} />}
          />
        </SelectorGroup>
        <SelectorGroup
          title={"Social"}
          size={2}
          filter={FilterGroup.SOCIAL_TOPIC}
        >
          <GridRow
            filterCode={MapSubTopic.EDUCATION}
            count={tagStats?.SE?.EDUCATION}
            icon={<School color={"primary"} style={{ fontSize: "12pt" }} />}
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.HEALTHSAFETY}
            count={tagStats?.SE?.HEALTHSAFETY}
            icon={
              <SymbolCrossIcon color={theme.palette.primary.main} size={12} />
            }
          ></GridRow>
          <GridRow
            filterCode={MapSubTopic.RACEGEN}
            count={tagStats?.SE?.RACEGEN}
            icon={<PeopleIcon color={theme.palette.primary.main} size={12} />}
          />
        </SelectorGroup>
      </SelectorParent>
    </>
  );
};

export default TopicSelector;
