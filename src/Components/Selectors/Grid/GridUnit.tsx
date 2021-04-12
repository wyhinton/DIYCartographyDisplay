import React, { useState, useEffect } from 'react'; // we need this to make JSX compile
import { useTheme } from "@material-ui/core/styles";
import blue from '@material-ui/core/colors/blue';
type UnitProps = { 
    color: number, 
    is_active_filter?: boolean,
}


export const GridUnit = ({ color, is_active_filter}: UnitProps) => {
    const theme = useTheme();
    const size = 12; 
    // const outline = is_active_filter??"";
    // useEffect(()=>{

    // }, [color])
    const [hover, setHover] = useState(false);
    const match_color = (ind: number) =>{
        if (ind == -1){
            return blue[100]
        }
        if (ind == 0){
            return theme.palette.primary.main
        };
        if (ind == 1){
            return blue[300]
        };
        if (ind == 2){
            return blue[400]
        };
        if (ind == 3){
            return blue[500]
        };
        if (ind == 4){
            return theme.palette.primary.dark
        } else {
            return "red"
        }
    }
    let col_keys = Object.keys(theme.palette.primary);
    
    // let bg_color = theme.palette.primary[]
    // const boxStyle = {
    //     width: `${size}px`, 
    //     height: `${size}px`,
    //     backgroundColor: match_color(color),
    //     marginTop: 'auto',
    //     marginBottom: '3px',
    //     marginRight: '3px'
    // } as React.CSSProperties;
    const boxStyle = (is_active_filter?: boolean) => {
        if (is_active_filter){
            console.log("GOT ACTIVE FILTER~~");
            return {
            width: `${size}px`, 
            height: `${size}px`,
            backgroundColor: match_color(color),
            marginTop: 'auto',
            marginBottom: '3px',
            marginRight: '3px',
            outline: '1px solid #ffcb06'
            } as React.CSSProperties;

        } else {
            return {
            width: `${size}px`, 
            height: `${size}px`,
            backgroundColor: match_color(color),
            marginTop: 'auto',
            marginBottom: '3px',
            marginRight: '3px',
        } as React.CSSProperties;
        }

    } 
    // if (is_active_filter){
    //     boxStyle.outline = "1px solid white",
    // }
    return (
    <div style = {boxStyle(is_active_filter)} onMouseEnter={()=>setHover(true)} onMouseLeave = {()=>setHover(false)}>
        
    </div> 
    )
}


export default GridUnit