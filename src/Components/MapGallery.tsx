import React, { useState, useEffect } from 'react';
import Gallery from 'react-grid-gallery';
import { useTheme, withStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import { useStoreActions, useStoreState } from "../hooks";

import '../css/GridGallery.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactSlick from 'react-slick';
import "../css/SlickSlide.css";
import { Scrollbars } from 'react-custom-scrollbars';
import {GlassMagnifier} from 'react-image-magnifiers';
import {thumbnailStyle} from 'react-grid-gallery';
import LightBox from './ImageGallery/LightBox';


// https://codesandbox.io/s/react-grid-gallery-ztf4n?file=/src/index.js:358-880
// https://codesandbox.io/s/r48lm1jopq


function getRandomNumber(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
  }

const MapGallery = () => {
    // var shuffleClassName = this.state.toggleActive ? "player-control-icon active" : "player-control-icon"
    const gallery_images = useStoreState(state=>state.map_data?.active_images);
    const [showLightbox, setShowLightBox] = useState(false);
    const set_active_lightbox = useStoreActions(actions=>actions.map_data.set_active_lightbox);
    const active_lightbox = useStoreState(state=>state.map_data.active_lightbox);
    const data_loaded = useStoreState(state=>state.map_data.loaded);
    const theme = useTheme();

    useEffect(() =>{

    }, [gallery_images, active_lightbox]);

    useEffect(()=>{
        console.log("data loaded changd, val is", data_loaded);
    }, [data_loaded]);

    const containerStyle = {
        backgroundColor: "white",
        height: '100%',
        margin: 'auto',
        flexDirection: 'column',
    }  as React.CSSProperties

    function get_lightbox_tb_2(this: any) {
        console.log(this.props);
        setShowLightBox(showLightbox=>!showLightbox);
        console.log(showLightbox);
        set_active_lightbox(this.props.item)
    }  

    const scrollContainer = {
        overflow: 'hidden',
        height: "100%",
        border: `1px solid ${theme.palette.primary.main}`
    }

    function thumbnail_style(props: any, z: any, q: any){
        const duration = getRandomNumber(0.5, 4);
        if (data_loaded){
            return {
                animation: `fadein ${duration}s normal`,
                animationIterationCound: 1,
            }
        }
    }
    return(
    <div style = {containerStyle}>
        <div >
            <LightBox show = {showLightbox} onClick = {()=>setShowLightBox(false)}/>
        </div>
            <div style = {scrollContainer}>
            <Scrollbars style={{ width: "100%", height: "100%"}}>
                <div style = {{height: '100%', paddingTop: '0', width: "100%"}}>
                    <Gallery 
                        tagStyle = {{display: 'none'}}
                        // renderItem = {test_render_item}
                        images = {(gallery_images)}
                        customOverlay = {<div style = {{backgroundColor:"red"}}></div>}
                        rowHeight = {75}
                        maxRows = {10}
                        enableLightbox = {false}
                        enableImageSelection = {false}
                        onClickThumbnail = {
                            get_lightbox_tb_2
                        }
                        tileViewportStyle = {thumbnail_style}
                    >
                    </Gallery>
                </div>  
            </Scrollbars>
            </div>
        </div>
    )
}

export default MapGallery;