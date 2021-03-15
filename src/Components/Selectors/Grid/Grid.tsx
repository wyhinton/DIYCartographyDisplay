import React from 'react'; // we need this to make JSX compile
import GridUnit from './GridUnit';
import { useTheme } from "@material-ui/core/styles";


type GridProps = { 
    rows: number, 
    cols: number,
}



export const Grid = ({rows, cols}: GridProps) => {
    
const theme = useTheme();
 
function create_elements(rows: number, cols: number){
    const arr = Array.from(Array(cols), (e,i)=>{
        return <div>
            { Array.from(Array(rows), (e,i)=>{
                return <GridUnit color = {theme.palette.primary.main}/>
            })}
        </div>
        // <div style = {{backgroundColor: 'white'}}></div>
    })
    console.log(arr);
    const fin = arr.map((r,i)=>i)
    console.log(fin);
    return arr
}

return(
    <div style = {{width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
        {   
            create_elements(rows, cols)
        }
    </div>
)
}

export default Grid
