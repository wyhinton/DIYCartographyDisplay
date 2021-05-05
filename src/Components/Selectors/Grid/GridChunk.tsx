// import Grid from '@material-ui/core/Grid';
// import { useTheme, withStyles } from "@material-ui/core/styles";
import GridUnit from './GridUnit';
import { useStoreActions, useStoreState } from "../../../hooks";
import {useState, useEffect} from 'react';
import {AuthorDisciplineFilter, TopicSubCategoryFilter, ThemeCategoryFilter} from '../../../model/enums';
import {FilterOption} from '../../../model/types'
import { FilterSharp } from '@material-ui/icons';
interface GridChunkProps{
  count: number,
  filter: FilterOption,
  // filter: FilterOption,
  base_color: number,
}

function roundToStep(value: number, step:number) {
  const val = Math.round(value / step) * step;
  let num_cols = val/step;
  const max_num_rows = step;

  if (value !== undefined && value !==null){
    let test_arrs = Array.from(Array(num_cols).keys()).map((k: number, i:number)=>{
      let num_units = 0;
      if (i==num_cols-1){
        num_units = max_num_rows - Math.abs((value-val))
        // num_units = max_num_rows + (value-val)
      } else {
        num_units = step; 
      }
      const col_data: any = {
        count: num_units
      };
      return col_data
    })
    // console.log(test_arrs);
    return test_arrs
  }

}

const GridChunk = ({count, filter, base_color}: GridChunkProps) =>{
  const rowContainer = {
    // marginTop: '.25em',
    // width: ''
    // width: '14px',
    // position: 'absolute',
    // bottom: 0,
    // backgroundColor: 'red',
    // width: '12%',
  } as React.CSSProperties
  
  const chunkContainer = {
    height: '100%',
    display: 'flex',
    position: 'relative',
    // j
    // width: 15,
    // bottom: 0,
  } as React.CSSProperties

  const cur_state_filters = useStoreState(state=>state.map_data.filter);
  const set_filter = useStoreActions(actions=>actions.map_data.thunk_set_filter);
  const set_row_color = (cur_filters: FilterOption[], is_hovered: boolean, base_color: number) => {
    if (cur_filters.some(f=>f===filter)) {
    // if (cur_filter_val === filter) {
      return 4
    } 
    if (cur_filters.some(f=>f===null)){
      return base_color;
    }
    // if (cur_filters !== null && cur_filters != filter){
    //   return -2
    // }
    else {
      return is_hovered?-1:base_color
    }
}
  const [hovered, setHovered] = useState(false);
    useEffect(()=>{
    }, [cur_state_filters])

    useEffect(()=>{
    }, [hovered])
  
  const adjust_width = (base_style: React.CSSProperties, num_cols: number) =>{
    base_style.width = 15*num_cols;
    return base_style
  }

  let group_columns: any = roundToStep(count, 3)
  const to_chunk = (col_list?: any[])=>{
    if (col_list){
      return (  
        <div style = {chunkContainer} 
        onMouseUp = {()=>set_filter(filter)}
        // onMouseUp = {()=>set_filter(filter)}
        onMouseEnter = {()=>setHovered(!hovered)}
        onMouseLeave ={()=>setHovered(!hovered)}
        >
          {      
            Array.from(Array(col_list.length).keys()).map((r: number)=>{
              console.log(col_list);
              let cur_col: any = col_list[r];
              return (
                <div style = {rowContainer} key = {r}>
                {            
                  Array.from(Array(cur_col.count).keys()).map((i: number, c: any)=>{
                    // console.log(cur_col.count);
                    return (<GridUnit color = {set_row_color(cur_state_filters, hovered, base_color)} is_active_filter = {cur_state_filters.some(f=>f===filter)} key = {i}/>)
                  })
                }
                </div>
              )
            })
          }
          </div>
      )
    }
  }
  return (  
      <>
        { to_chunk(group_columns)}
      </>
  )
}

export default GridChunk