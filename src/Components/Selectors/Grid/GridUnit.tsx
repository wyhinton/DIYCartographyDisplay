import React, { useState, useEffect } from 'react'; // we need this to make JSX compile
import { useTheme } from "@material-ui/core/styles";
import blue from '@material-ui/core/colors/blue';
type UnitProps = { 
    color: number, 
}


export const GridUnit = ({ color}: UnitProps) => {
    const theme = useTheme();
    const size = 12; 
    // useEffect(()=>{

    // }, [color])
    const [hover, setHover] = useState(false);
    const match_color = (ind: number) =>{
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
    console.log("🚀 ~ file: GridUnit.tsx ~ line 16 ~ GridUnit ~ col_keys", col_keys)
    
    // let bg_color = theme.palette.primary[]
    const boxStyle = {
        width: `${size}px`, 
        height: `${size}px`,
        // margin: theme.spacing(.2),
        // backgroundColor: hover? theme.palette.primary.dark:match_color(color),
        // backgroundColor: hover?'black':theme.palette.primary.main,
        backgroundColor: match_color(color),
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: '3px'
        // margin: '2px'
        // backgroundColor: hover?'black':color,
    } as React.CSSProperties;
    // const set_hover()
    return (
    <div style = {boxStyle} onMouseEnter={()=>setHover(true)} onMouseLeave = {()=>setHover(false)}>
        
    </div> 
    )
}


export default GridUnit