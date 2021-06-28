// https://material-ui.com/components/material-icons/
import SelectorGroup from "./Containers/SelectorGroup";
import SelectorParent from "./Containers/SelectorParent";
import GridRow from "./Grid/GridRow";
import { useEffect } from "react";
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

const MapLens = () => {
  const theme = useTheme();
  const tag_stats = useStoreState(
    (state) => state.studentsModel?.studentStats?.subtopic
  );
  useEffect(() => {
    console.log(tag_stats);
  }, [tag_stats]);
  //TODO: FIX REDUNDANT FILTER/TOPIC
  return (
    <>
      <SelectorParent columns={5}>
        <SelectorGroup
          title={"Built"}
          size={2}
          filter={FilterGroup.BUILT_TOPIC}
        >
          <GridRow
            filter={MapSubTopic.INFRASTR}
            count={tag_stats?.BE?.ENERGY}
            icon={
              <LightbulbIcon color={theme.palette.primary.main} size={12} />
            }
          ></GridRow>
          <GridRow
            filter={MapSubTopic.BUILDINGS}
            count={tag_stats?.BE?.HOUSING}
            icon={<Apartment color={"primary"} style={{ fontSize: "12pt" }} />}
          ></GridRow>
          <GridRow
            filter={MapSubTopic.TRANSPORTATION}
            count={tag_stats?.BE?.TRANSPORTATION}
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
            filter={MapSubTopic.PROPERTY}
            count={tag_stats?.EE?.COSTOFLIVING}
            icon={<HomeIcon color={theme.palette.primary.main} size={12} />}
          ></GridRow>
          <GridRow
            filter={MapSubTopic.URBANDEV}
            count={tag_stats?.EE?.URBANDEV}
            icon={<ChartIcon color={theme.palette.primary.main} size={12} />}
          ></GridRow>
          <GridRow
            filter={MapSubTopic.WORK}
            count={tag_stats?.EE?.WORK}
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
            filter={MapSubTopic.GREENSPACE}
            count={tag_stats?.NE?.GREENSPACE}
            icon={<TreeIcon color={theme.palette.primary.main} size={12} />}
          ></GridRow>
          <GridRow
            filter={MapSubTopic.POLLUTION}
            count={tag_stats?.NE?.POLLUTION}
            icon={<ChartIcon color={theme.palette.primary.main} size={12} />}
          ></GridRow>
          <GridRow
            filter={MapSubTopic.HYDROLOGY}
            count={tag_stats?.NE?.HYDROLOGY}
            icon={<Opacity color={"primary"} style={{ fontSize: "12pt" }} />}
          />
        </SelectorGroup>
        <SelectorGroup
          title={"Political"}
          size={3}
          filter={FilterGroup.POLITICAL_TOPIC}
        >
          <GridRow
            filter={MapSubTopic.GOVERMENT}
            count={tag_stats?.PE?.GOVERMENT}
            icon={
              <AccountBalance color={"primary"} style={{ fontSize: "12pt" }} />
            }
          ></GridRow>
          <GridRow
            filter={MapSubTopic.POLICY}
            count={tag_stats?.PE?.POLICY}
            icon={<Gavel color={"primary"} style={{ fontSize: "12pt" }} />}
          ></GridRow>
          <GridRow
            filter={MapSubTopic.CIVICENG}
            count={tag_stats?.PE?.CIVICENG}
            icon={<VolumeUp color={"primary"} style={{ fontSize: "12pt" }} />}
          />
        </SelectorGroup>
        <SelectorGroup
          title={"Social"}
          size={2}
          filter={FilterGroup.SOCIAL_TOPIC}
        >
          <GridRow
            filter={MapSubTopic.EDUCATION}
            count={tag_stats?.SE?.EDUCATION}
            icon={<School color={"primary"} style={{ fontSize: "12pt" }} />}
          ></GridRow>
          <GridRow
            filter={MapSubTopic.HEALTHSAFETY}
            count={tag_stats?.SE?.HEALTHSAFETY}
            icon={
              <SymbolCrossIcon color={theme.palette.primary.main} size={12} />
            }
          ></GridRow>
          <GridRow
            filter={MapSubTopic.RACEGEN}
            count={tag_stats?.SE?.RACEGEN}
            icon={<PeopleIcon color={theme.palette.primary.main} size={12} />}
          />
        </SelectorGroup>
      </SelectorParent>
    </>
  );
};

export default MapLens;
