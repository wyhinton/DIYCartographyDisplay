import React from 'react'; // we need this to make JSX compile
import { useTheme } from "@material-ui/core/styles";

type UnitProps = { 
    color: any, 
}


export const GridUnit = ({ color}: UnitProps) => {
    const theme = useTheme();
    const size = 8; 

    // function create_elements(rows: number, cols: number){
    //     // const arr = Array.from(Array(cols), (e,i)=>{
    //     //     Array.from(Array(rows)
    //     //     return <GridUnit color = {theme.palette.primary.light}></GridUnit>
    //     //     // <div style = {{backgroundColor: 'white'}}></div>
    //     // })
    //     console.log(arr);
    //     const fin = arr.map((r,i)=>i)
    //     console.log(fin);
    //     return arr
    // }
    
    // const boxStyle = {
    //     width: "20px", 
    //     height: "20px",
    //     backgroundColor: "blue",
    //     paddingTop: theme.spacing(2),
    // };

    return (
    <div style = {{width: `${size}px`, height: `${size}px`, margin: theme.spacing(.2), backgroundColor: color}}>
        
    </div> 
    )
}

export default GridUnit