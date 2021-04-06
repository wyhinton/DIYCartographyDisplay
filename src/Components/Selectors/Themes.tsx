// import Grid from '@material-ui/core/Grid';
import {Link, Paragraph, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import SelectorGroup from './Containers/SelectorGroup';
import SelectorParent from './Containers/SelectorParent';
import { useStoreActions, useStoreState } from "../../hooks";
import GridChunk from './Grid/GridChunk';
import {AuthorDisciplineFilter, TopicSubCategoryFilter, ThemeCategoryFilter} from '../../model/enums';

interface GridChunkProps{
  count: number,
  rows: number,
  cols: number, 
  filter: TopicSubCategoryFilter | AuthorDisciplineFilter | ThemeCategoryFilter | null,
}


const Themes = () => {
    const theme = useTheme();
    const total_count = 35;
    const theme_stats = useStoreState(state=>state.map_data?.map_stats?.theme);
    // const theme_stats = map_stats.theme;
    return (
       <>
        <SelectorParent>
            <SelectorGroup title = {"Equity"} size = {4}>
              <GridChunk count = {theme_stats.EQUITY} filter = {ThemeCategoryFilter.EQUITY} base_color = {0}/>
            </SelectorGroup>
            <SelectorGroup title = {"Access"} size = {4}>
              <GridChunk count = {theme_stats.ACCESS} filter = {ThemeCategoryFilter.ACCESS}  base_color = {0}/>
            </SelectorGroup>
            <SelectorGroup title = {"Diversity"} size = {4}>
              <GridChunk count = {theme_stats.DIVERSITY} filter = {ThemeCategoryFilter.DIVERSITY}  base_color = {0}/>
            </SelectorGroup>
        </SelectorParent>
      </>
    )

}

export default Themes;