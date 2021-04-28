// import Grid from '@material-ui/core/Grid';
import { useTheme, withStyles } from "@material-ui/core/styles";
import SelectorGroup from './Containers/SelectorGroup';
import SelectorParent from './Containers/SelectorParent';
import GridRow from './Grid/GridRow';
import {useEffect} from 'react';
import {TopicSubCategoryFilter} from '../../model/enums';
// import {}
// https://material-ui.com/components/material-icons/

import {
  LightbulbIcon,
  HomeIcon,
  ChartIcon,
  BriefcaseIcon,
  TreeIcon,
  SymbolCrossIcon,
  PeopleIcon, 
} from 'evergreen-ui';

import {
  DirectionsBus, 
  Apartment,
  Opacity,
  Gavel,
  AccountBalance,
  VolumeUp,
  School,
} from  '@material-ui/icons';

import {useStoreState } from "../../hooks";

const built_filters = [
  TopicSubCategoryFilter.BE_ENERGY,
  TopicSubCategoryFilter.BE_HOUSING,
  TopicSubCategoryFilter.BE_TRANSPORTATION,
]

const economic_filters = [
  TopicSubCategoryFilter.EE_COSTOFLIVING,
  TopicSubCategoryFilter.EE_HOUSINGMARKET,
  TopicSubCategoryFilter.EE_COMMERCE,
]

const natural_filters  = [
  TopicSubCategoryFilter.NE_GREENSPACE,
  TopicSubCategoryFilter.NE_POLLUTION,
  TopicSubCategoryFilter.NE_WATER,
]
const political_filters  = [
  TopicSubCategoryFilter.PE_GOVERMENT,
  TopicSubCategoryFilter.PE_LEGISLATION,
  TopicSubCategoryFilter.PE_ACTIVISM,
]

const social_filters= [
  TopicSubCategoryFilter.SE_EDUCATION,
  TopicSubCategoryFilter.SE_HEALTH,
  TopicSubCategoryFilter.SE_POPULATION,
]

const MapLens = () => {
    const theme = useTheme();
    const tag_stats = useStoreState(state=>state.map_data?.map_stats?.tag);
    const active_filter = useStoreState(state=>state.map_data.filter);
    // console.log(tag_stats);

    return (
       <>
        <SelectorParent columns = {5}>
            <SelectorGroup title = {"Built"} size = {2} filters = {built_filters}>
              <GridRow tooltip = {"Energy"} active_filter = {active_filter} filter = {TopicSubCategoryFilter.BE_ENERGY} count = {tag_stats.BE?.ENERGY} icon = {<LightbulbIcon color = {theme.palette.primary.main} size = {12} />}></GridRow>
              <GridRow tooltip = {"Housing"} active_filter = {active_filter} filter = {TopicSubCategoryFilter.BE_HOUSING} count = {tag_stats.BE?.HOUSING} icon = {<Apartment color = {"primary"} style ={{fontSize: "12pt"}}/>}  ></GridRow>
              <GridRow tooltip = {"Transportation"} active_filter = {active_filter} filter = {TopicSubCategoryFilter.BE_TRANSPORTATION} count = {tag_stats.BE?.TRANSPORTATION} icon = {<DirectionsBus fontSize = "small" color = {"primary"} style ={{fontSize: "12pt"}}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Economic"} size = {3} filters = {economic_filters}>
              <GridRow tooltip = {"Cost of Living"} active_filter = {active_filter}  filter = {TopicSubCategoryFilter.EE_COSTOFLIVING} count = {tag_stats.EE?.COSTOFLIVING} icon = {<HomeIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Housing Market"} active_filter = {active_filter}  filter = {TopicSubCategoryFilter.EE_HOUSINGMARKET} count = {tag_stats.EE?.HOUSINGMARKET} icon = {<ChartIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Commerce"} active_filter = {active_filter}  filter = {TopicSubCategoryFilter.EE_COMMERCE} count = {tag_stats.EE?.COMMERCE} icon = {<BriefcaseIcon color = {theme.palette.primary.main} size = {12}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Natural"} size = {2} filters = {natural_filters}>
              <GridRow tooltip = {"Greenspace"} active_filter = {active_filter}  filter = {TopicSubCategoryFilter.NE_GREENSPACE} count = {tag_stats.NE?.GREENSPACE} icon = {<TreeIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Pollution"} active_filter = {active_filter}  filter = {TopicSubCategoryFilter.NE_POLLUTION} count = {tag_stats.NE?.POLLUTION} icon = {<ChartIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Hydrology"} active_filter = {active_filter}  filter = {TopicSubCategoryFilter.NE_WATER} count = {tag_stats.NE?.WATER} icon = {<Opacity color = {"primary"} style ={{fontSize: "12pt"}}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Political"} size = {3} filters = {political_filters}>
              <GridRow tooltip = {"Goverment"} active_filter = {active_filter}  filter = {TopicSubCategoryFilter.PE_GOVERMENT} count = {tag_stats.PE?.GOVERMENT} icon = {<AccountBalance color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow tooltip = {"Legislation"} active_filter = {active_filter}  filter = {TopicSubCategoryFilter.PE_LEGISLATION} count = {tag_stats.PE?.LEGISLATION} icon = {<Gavel color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow tooltip = {"Activism"} active_filter = {active_filter}  filter = {TopicSubCategoryFilter.PE_ACTIVISM} count = {tag_stats.PE?.ACTIVISM} icon = {<VolumeUp color = {"primary"} style ={{fontSize: "12pt"}}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Social"} size = {2} filters = {social_filters}>
              <GridRow tooltip = {"Education"} active_filter = {active_filter} filter = {TopicSubCategoryFilter.SE_EDUCATION} count = {tag_stats.SE?.EDUCATION} icon = {<School color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow tooltip = {"Health"} active_filter = {active_filter} filter = {TopicSubCategoryFilter.SE_HEALTH} count = {tag_stats.SE?.HEALTH} icon = {<SymbolCrossIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Population"} active_filter = {active_filter} filter = {TopicSubCategoryFilter.SE_POPULATION} count = {tag_stats.SE?.POPULATION} icon = {<PeopleIcon color = {theme.palette.primary.main} size = {12}/>}/>
            </SelectorGroup>
        </SelectorParent>
      </>
    )

}

export default MapLens;