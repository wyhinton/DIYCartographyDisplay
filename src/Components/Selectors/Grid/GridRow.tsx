import { useStoreActions, useStoreState } from "../../../hooks";
import {Link, Paragraph, Text, Icon,} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import {useState, useEffect, cloneElement} from 'react';
import GridUnit from './GridUnit';
import {AuthorDisciplineFilter, TopicSubCategoryFilter, ThemeCategoryFilter} from '../../../model/enums';
import blue from '@material-ui/core/colors/blue';


interface GridRowProps{
    count: number,
    active_filter: TopicSubCategoryFilter | AuthorDisciplineFilter | ThemeCategoryFilter | null,
    filter: TopicSubCategoryFilter | AuthorDisciplineFilter | ThemeCategoryFilter,
    icon: JSX.Element,
}

const GridRow =({count, icon, filter, active_filter}: GridRowProps) => {
    const theme = useTheme();
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    const real_filter = useStoreState(state=>state.map_data.filter);
    const set_filter = useStoreActions(actions=>actions.map_data.thunk_set_filter);
    const hover_style = (is_active: boolean, is_hovered: boolean) => {
        if (real_filter === filter){
        // if (is_active){
          return 4
        }
        else {
          return is_hovered?4:0
        }
    }
    const set_row_color = (is_active_filter: boolean, is_hovered: boolean) => {
        if (is_active_filter) {
          return 4
        } else {
          return is_hovered?4:0
        }
    }
    const set_icon_color = (is_active_filter: boolean, is_hovered: boolean) => {
        return is_hovered?blue[100]:theme.palette.primary;
    }
    useEffect(()=>{
        console.log(filter === real_filter);
        console.log(filter, real_filter)
        // setActive(filter===real_filter);
    }, [real_filter])

    useEffect(()=>{
        // setActive(filter===real_filter);
    }, [hovered])
    // }, [hovered, real_filter])
    // const 
    const rowGrid = {
      width: '100%', 
      height: '100%',
      display: 'flex',
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
              <GridUnit key = {i} color = {set_row_color((real_filter === filter), hovered)}></GridUnit>
            )

          })
          
        }
        {icon}
      </div>
    )
} 

export default GridRow