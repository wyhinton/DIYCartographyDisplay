import { useStoreActions, useStoreState } from "../../../hooks";
import {Link, Paragraph, Text, Icon,} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import {useState, useEffect} from 'react';
import GridUnit from './GridUnit';
import {AuthorDisciplineFilter, TopicSubCategoryFilter, ThemeCategoryFilter} from '../../../model/enums';


interface GridRowProps{
    count: number,
    filter: TopicSubCategoryFilter | TopicSubCategoryFilter | ThemeCategoryFilter,
    icon: JSX.Element,
}

const GridRow =({count, icon, filter}: GridRowProps) => {
    const theme = useTheme();
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);

    const set_filter = useStoreActions(actions=>actions.map_data.thunk_set_filter);
    const hover_style = (is_active: boolean, is_hovered: boolean) => {
        if (is_active){
          return 4
        }
        else {
          return is_hovered?4:0
        }
    }
    useEffect(()=>{

    }, [hovered])
    // const 
    const rowGrid = {
      width: '100%', 
      height: '100%',
      display: 'flex',
      marginTop: '.25em',
    } as React.CSSProperties;

    return (
      <div style = {rowGrid} 
       onMouseEnter = {()=>setHovered(!hovered)}
       onMouseLeave ={()=>setHovered(!hovered)}
       onMouseUp = {()=>{
        setActive(!active);
        if (active){
          set_filter(filter);
        } else {
          set_filter(null)
        }
        }}
      >
        {
          Array.from(Array(count)).map(r=>{
            return(
              <GridUnit color = {hover_style(active, hovered)}></GridUnit>
              // <GridUnit color = {hovered?4:0}></GridUnit>
            )

          })
          
        }
        {icon}
      </div>
    )
} 

export default GridRow