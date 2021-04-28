import { useStoreActions, useStoreState } from "../../../hooks";
import {Link, Paragraph, Text, Icon,} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import {useState, useEffect, cloneElement} from 'react';
import GridUnit from './GridUnit';
import {AuthorDisciplineFilter, TopicSubCategoryFilter, ThemeCategoryFilter} from '../../../model/enums';
import blue from '@material-ui/core/colors/blue';
import Tooltip from '@material-ui/core/Tooltip';

interface GridRowProps{
    count: number,
    active_filter: TopicSubCategoryFilter | AuthorDisciplineFilter | ThemeCategoryFilter | null,
    filter: TopicSubCategoryFilter | AuthorDisciplineFilter | ThemeCategoryFilter,
    icon: JSX.Element,
    tooltip: string, 
}

const GridRow =({count, icon, filter, active_filter, tooltip}: GridRowProps) => {
    const theme = useTheme();
    const [hovered, setHovered] = useState(false);
    const real_filter = useStoreState(state=>state.map_data.filter);
    const set_filter = useStoreActions(actions=>actions.map_data.thunk_set_filter);

    const set_row_color = (cur_filter: TopicSubCategoryFilter | AuthorDisciplineFilter | ThemeCategoryFilter | null, is_hovered: boolean) => {
        if (cur_filter == filter) {
          return 4
        } 
        if (cur_filter !==  filter && cur_filter !== null){
          console.log("not");
          return -2
        }
        else {
          return is_hovered?4:0
        }
    }
    const set_icon_color = (is_active_filter: boolean, is_hovered: boolean) => {
        return is_hovered?blue[100]:theme.palette.primary;
    }
    useEffect(()=>{
        console.log(filter === real_filter);
        // console.log(filter, real_filter)
    }, [real_filter])

    useEffect(()=>{
    }, [hovered])

    const rowGrid = {
      width: '100%', 
      // height: '100%',
      display: 'flex',
      // height: 12,
      // marginTop: '.25em',
    } as React.CSSProperties;

    return (
      <div style = {rowGrid} 
       onMouseEnter = {()=>setHovered(!hovered)}
       onMouseLeave ={()=>setHovered(!hovered)}
       onMouseUp = {()=>{set_filter(filter);}}
      >
        {
          Array.from(Array(count)).map((r, i)=>{
            return(
              <GridUnit key = {i} color = {set_row_color(real_filter, hovered)} is_active_filter = {real_filter === filter}></GridUnit>
            )

          })
          
        }
        {
        <Tooltip title = {tooltip}>
          {icon}
        </Tooltip>
        }
      </div>
    )
} 

export default GridRow