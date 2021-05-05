// import Grid from '@material-ui/core/Grid';
import { useTheme, withStyles } from "@material-ui/core/styles";
import SelectorGroup from './Containers/SelectorGroup';
import SelectorParent from './Containers/SelectorParent';
import GridRow from './Grid/GridRow';
import {useEffect} from 'react';
import {TopicSubCategoryFilter, FilterGroup} from '../../model/enums';

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
    const state_active_filters = useStoreState(state=>state.map_data.filter);
    // console.log(tag_stats);

    return (
       <>
        <SelectorParent columns = {5}>
            <SelectorGroup title = {"Built"} size = {2} filter = {FilterGroup.BUILT_TOPIC}>
              <GridRow tooltip = {"Energy"} state_active_filters = {state_active_filters} filter = {TopicSubCategoryFilter.BE_ENERGY} count = {tag_stats.BE?.ENERGY} icon = {<LightbulbIcon color = {theme.palette.primary.main} size = {12} />}></GridRow>
              <GridRow tooltip = {"Housing"} state_active_filters = {state_active_filters} filter = {TopicSubCategoryFilter.BE_HOUSING} count = {tag_stats.BE?.HOUSING} icon = {<Apartment color = {"primary"} style ={{fontSize: "12pt"}}/>}  ></GridRow>
              <GridRow tooltip = {"Transportation"} state_active_filters = {state_active_filters} filter = {TopicSubCategoryFilter.BE_TRANSPORTATION} count = {tag_stats.BE?.TRANSPORTATION} icon = {<DirectionsBus fontSize = "small" color = {"primary"} style ={{fontSize: "12pt"}}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Economic"} size = {3} filter = {FilterGroup.ECONOMIC_TOPIC}>
              <GridRow tooltip = {"Cost of Living"} state_active_filters = {state_active_filters}  filter = {TopicSubCategoryFilter.EE_COSTOFLIVING} count = {tag_stats.EE?.COSTOFLIVING} icon = {<HomeIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Housing Market"} state_active_filters = {state_active_filters}  filter = {TopicSubCategoryFilter.EE_HOUSINGMARKET} count = {tag_stats.EE?.HOUSINGMARKET} icon = {<ChartIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Commerce"} state_active_filters = {state_active_filters}  filter = {TopicSubCategoryFilter.EE_COMMERCE} count = {tag_stats.EE?.COMMERCE} icon = {<BriefcaseIcon color = {theme.palette.primary.main} size = {12}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Natural"} size = {2} filter = {FilterGroup.NATURAL_TOPIC}>
              <GridRow tooltip = {"Greenspace"} state_active_filters = {state_active_filters}  filter = {TopicSubCategoryFilter.NE_GREENSPACE} count = {tag_stats.NE?.GREENSPACE} icon = {<TreeIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Pollution"} state_active_filters = {state_active_filters}  filter = {TopicSubCategoryFilter.NE_POLLUTION} count = {tag_stats.NE?.POLLUTION} icon = {<ChartIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Hydrology"} state_active_filters = {state_active_filters}  filter = {TopicSubCategoryFilter.NE_WATER} count = {tag_stats.NE?.WATER} icon = {<Opacity color = {"primary"} style ={{fontSize: "12pt"}}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Political"} size = {3} filter = {FilterGroup.POLITICAL_TOPIC}>
              <GridRow tooltip = {"Goverment"} state_active_filters = {state_active_filters}  filter = {TopicSubCategoryFilter.PE_GOVERMENT} count = {tag_stats.PE?.GOVERMENT} icon = {<AccountBalance color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow tooltip = {"Legislation"} state_active_filters = {state_active_filters}  filter = {TopicSubCategoryFilter.PE_LEGISLATION} count = {tag_stats.PE?.LEGISLATION} icon = {<Gavel color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow tooltip = {"Activism"} state_active_filters = {state_active_filters}  filter = {TopicSubCategoryFilter.PE_ACTIVISM} count = {tag_stats.PE?.ACTIVISM} icon = {<VolumeUp color = {"primary"} style ={{fontSize: "12pt"}}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Social"} size = {2} filter = {FilterGroup.SOCIAL_TOPIC}>
              <GridRow tooltip = {"Education"} state_active_filters = {state_active_filters} filter = {TopicSubCategoryFilter.SE_EDUCATION} count = {tag_stats.SE?.EDUCATION} icon = {<School color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow tooltip = {"Health"} state_active_filters = {state_active_filters} filter = {TopicSubCategoryFilter.SE_HEALTH} count = {tag_stats.SE?.HEALTH} icon = {<SymbolCrossIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow tooltip = {"Population"} state_active_filters = {state_active_filters} filter = {TopicSubCategoryFilter.SE_POPULATION} count = {tag_stats.SE?.POPULATION} icon = {<PeopleIcon color = {theme.palette.primary.main} size = {12}/>}/>
            </SelectorGroup>
        </SelectorParent>
      </>
    )

}

export default MapLens;