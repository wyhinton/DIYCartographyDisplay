import React, { useState, useEffect } from 'react'; // we need this to make JSX compile
import { useTheme } from "@material-ui/core/styles";
import blue from '@material-ui/core/colors/blue';
import "../../../css/App.css";
import {getRandomNumber} from "../../../utils";
import {useStoreState } from "../../../hooks";
type UnitProps = { 
    color: number, 
    is_active_filter?: boolean,
}



export const GridUnit = ({ color, is_active_filter}: UnitProps) => {
    const theme = useTheme();
    const size = 12; 
    const [hover, setHover] = useState(false);
    const mounted = true;
    const data_loaded = useStoreState(state=>state.map_data.loaded);
    const duration = getRandomNumber(0.5, 4);
    const containerStyle = {
        display: data_loaded? 'block':'none',
        animation: data_loaded?`fadein ${duration}s normal`:'',
        animationIterationCound: 1,
        marginTop: 'auto',
    } as React.CSSProperties

    useEffect(()=>{
    },[mounted]);

    const match_color = (ind: number) =>{
        if (ind === -2){
            return blue[500]
        }
        if (ind === -1){
            return blue[100]
        }
        if (ind === 0){
            return theme.palette.primary.main
        };
        if (ind === 1){
            return blue[300]
        };
        if (ind === 2){
            return blue[400]
        };
        if (ind === 3){
            return blue[500]
        };
        if (ind === 4){
            return theme.palette.primary.dark
        } else {
            return "red"
        }
    }

    const boxStyle = (is_active_filter?: boolean) => {
        if (is_active_filter){
            // console.log("GOT ACTIVE FILTER~~");
            return {
            width: `${size}px`, 
            height: `${size}px`,
            backgroundColor: match_color(color),
            marginTop: 'auto',
            marginBottom: '3px',
            marginRight: '3px',
            outline: '1px solid #ffcb06',
            opacity: 1,
            } as React.CSSProperties;

        } else {
            if (color == -2){
                return {
                    width: `${size}px`, 
                    height: `${size}px`,
                    backgroundColor: match_color(color),
                    marginTop: 'auto',
                    marginBottom: '3px',
                    marginRight: '3px',
                    opacity: 0.5,
                } as React.CSSProperties;
            } else {
                return {
                    width: `${size}px`, 
                    height: `${size}px`,
                    backgroundColor: match_color(color),
                    marginTop: 'auto',
                    marginBottom: '3px',
                    marginRight: '3px',
                    opacity: 1.0,
                } as React.CSSProperties;
            }
        } 
    } 
    return (
    <div style = {containerStyle}>
        <div style = {boxStyle(is_active_filter)} onMouseEnter={()=>setHover(true)} onMouseLeave = {()=>setHover(false)}>
            
        </div> 
    </div>
    )
}


export default GridUnit