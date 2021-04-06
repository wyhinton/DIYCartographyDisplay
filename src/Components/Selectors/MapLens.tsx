// import Grid from '@material-ui/core/Grid';
import { useTheme, withStyles } from "@material-ui/core/styles";
import SelectorGroup from './Containers/SelectorGroup';
import SelectorParent from './Containers/SelectorParent';
import GridRow from './Grid/GridRow';
import {useEffect} from 'react';
import {TopicSubCategoryFilter} from '../../model/enums';
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


const MapLens = () => {
    const theme = useTheme();
    const testStyle = {
      fill: theme.palette.primary.main,
    };
    
    const tag_stats = useStoreState(state=>state.map_data?.map_stats?.tag);
    const active_filter = useStoreState(state=>state.map_data.filter);
    // const tag_stats = map_stats?.tag;
    console.log(tag_stats);


    return (
       <>
        <SelectorParent>
            <SelectorGroup title = {"Built"} size = {2}>
              <GridRow active_filter = {active_filter} filter = {TopicSubCategoryFilter.BE_ENERGY} count = {tag_stats.BE?.ENERGY} icon = {<LightbulbIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow active_filter = {active_filter} filter = {TopicSubCategoryFilter.BE_HOUSING} count = {tag_stats.BE?.HOUSING} icon = {<Apartment color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow active_filter = {active_filter} filter = {TopicSubCategoryFilter.BE_TRANSPORTATION} count = {tag_stats.BE?.TRANSPORTATION} icon = {<DirectionsBus fontSize = "small" color = {"primary"} style ={{fontSize: "12pt"}}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Economic"} size = {3}>
              <GridRow active_filter = {active_filter}  filter = {TopicSubCategoryFilter.EE_COSTOFLIVING} count = {tag_stats.EE?.COSTOFLIVING} icon = {<HomeIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow active_filter = {active_filter}  filter = {TopicSubCategoryFilter.EE_HOUSINGMARKET} count = {tag_stats.EE?.HOUSINGMARKET} icon = {<ChartIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow active_filter = {active_filter}  filter = {TopicSubCategoryFilter.EE_COMMERCE} count = {tag_stats.EE?.COMMERCE} icon = {<BriefcaseIcon color = {theme.palette.primary.main} size = {12}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Natural"} size = {2}>
              <GridRow active_filter = {active_filter}  filter = {TopicSubCategoryFilter.NE_GREENSPACE} count = {tag_stats.NE?.GREENSPACE} icon = {<TreeIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow active_filter = {active_filter}  filter = {TopicSubCategoryFilter.NE_POLLUTION} count = {tag_stats.NE?.POLLUTION} icon = {<ChartIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow active_filter = {active_filter}  filter = {TopicSubCategoryFilter.NE_WATER} count = {tag_stats.NE?.WATER} icon = {<Opacity color = {"primary"} style ={{fontSize: "12pt"}}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Political"} size = {3}>
              <GridRow active_filter = {active_filter}  filter = {TopicSubCategoryFilter.PE_GOVERMENT} count = {tag_stats.PE?.GOVERMENT} icon = {<AccountBalance color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow active_filter = {active_filter}  filter = {TopicSubCategoryFilter.PE_LEGISLATION} count = {tag_stats.PE?.LEGISLATION} icon = {<Gavel color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow active_filter = {active_filter}  filter = {TopicSubCategoryFilter.PE_ACTIVISM} count = {tag_stats.PE?.ACTIVISM} icon = {<VolumeUp color = {"primary"} style ={{fontSize: "12pt"}}/>}/>
            </SelectorGroup>
            <SelectorGroup title = {"Social"} size = {2}>
              <GridRow active_filter = {active_filter} filter = {TopicSubCategoryFilter.SE_EDUCATION} count = {tag_stats.SE?.EDUCATION} icon = {<School color = {"primary"} style ={{fontSize: "12pt"}}/>}></GridRow>
              <GridRow active_filter = {active_filter} filter = {TopicSubCategoryFilter.SE_HEALTH} count = {tag_stats.SE?.HEALTH} icon = {<SymbolCrossIcon color = {theme.palette.primary.main} size = {12}/>}></GridRow>
              <GridRow active_filter = {active_filter} filter = {TopicSubCategoryFilter.SE_POPULATION} count = {tag_stats.SE?.POPULATION} icon = {<PeopleIcon color = {theme.palette.primary.main} size = {12}/>}/>
            </SelectorGroup>
        </SelectorParent>
      </>
    )

}

export default MapLens;