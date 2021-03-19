import React, { useState } from 'react'; // we need this to make JSX compile
import { useTheme } from "@material-ui/core/styles";

type UnitProps = { 
    color: any, 
}


export const GridUnit = ({ color}: UnitProps) => {
    const theme = useTheme();
    const size = 8; 

    const [hover, setHover] = useState(false);

    
    
    const boxStyle = {
        width: `${size}px`, 
        height: `${size}px`,
        margin: theme.spacing(.2),
        backgroundColor: hover?'black':color,
    };
    // const set_hover()
    return (
    <div style = {boxStyle} onMouseEnter={()=>setHover(true)} onMouseLeave = {()=>setHover(false)}>
        
    </div> 
    )
}

export default GridUnit