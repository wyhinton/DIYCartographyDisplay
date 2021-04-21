import React, { useState, useEffect } from 'react';
import Gallery from 'react-grid-gallery';
import { useTheme, withStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import { useStoreActions, useStoreState } from "../hooks";
import {CrossIcon, Heading, Paragraph} from 'evergreen-ui';
import '../css/GridGallery.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactSlick from 'react-slick';
import "../css/SlickSlide.css";
import { Scrollbars } from 'react-custom-scrollbars';
import {GlassMagnifier} from 'react-image-magnifiers';
import {thumbnailStyle} from 'react-grid-gallery';



// https://codesandbox.io/s/react-grid-gallery-ztf4n?file=/src/index.js:358-880
// https://codesandbox.io/s/r48lm1jopq


const LimitedBackdrop = withStyles({
    root: {
      position: "absolute",
      zIndex: 1,
      boxSizing: "border-box",
      paddingLeft: '2em',
      paddingTop: '2em',
      opacity: .5,
      backgroundColor: 'rgb(0 0 0 / 73%)'
    }
})(Backdrop);

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
    const [animation_finished, setAnimationFinished] = useState(false);

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

    const mainGrid = {
        height: '100vh',
        width: '100vw',
        spacing: 0,
        justify: 'space-around',
    };

    const textStyle = {
        color: 'White',
        fontSize: '12pt',
        lineHeight: '12pt',
    }
    const headingStyle = {
        color: 'white',
        paddingBottom: '3em',
    }
    const backDropContainer = {
        width: '100%', 
        height: '100%',
        paddingLeft: '2em',
        // padding: '5em',
    }
    const closeButtonContainer = {
        position: 'absolute',
        top: 0,
        left: 0,
        color: 'white'
    } as React.CSSProperties

    const slickSlide = {
      height: '500px',
    //   width: '500px',  
      width: '100vh',  
    } as React.CSSProperties

    const galleryStyle = {
        height: '90vh'
        // height: '100%'
    }
    const test_render_item = (item: any) =>{
        return (
            <div>
                hello
            </div>
        )
    }
    const slick_props= {
        // adaptiveHeight: false, 
        // adaptiveHeight: true, 
        variableWidth: true,
        // centerMode: true, 
        slidesToShow: 1,
        // adaptiveHeight: false, 
    }
    function thumbnail_style(props: any, z: any, q: any){
        const duration = getRandomNumber(0.5, 4);
        console.log(duration);

        if (data_loaded){
            return {
                backgroundColor: "red",
                animation: `fadein ${duration}s normal`,
                animationIterationCound: 1,
            }
        }
    }
    return(
    <div style = {containerStyle}>
                <div >
            <LimitedBackdrop open={showLightbox}>
                <div style = {closeButtonContainer}  onClick={()=>setShowLightBox(false)}>
                <CrossIcon></CrossIcon>
                </div>

            {/* <LimitedBackdrop open={showLightbox} onClick={()=>setShowLightBox(false)}> */}
                <div style = {backDropContainer}>
                    <Grid container spacing = {3} style = {mainGrid}>
                 
                        <Grid item xs = {3}>
                        <Heading size = {400} color = {'white'} >{active_lightbox.title}</Heading>
                            <Paragraph>
                                {active_lightbox.author}
                            </Paragraph>
                            <Paragraph style = {textStyle}>
                            {active_lightbox.description.replace("___", "")}
                            </Paragraph>
                            <Paragraph style = {textStyle}>
                            {/* Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure */}
                            </Paragraph>
                        </Grid>
                        <Grid item xs = {9} style = {galleryStyle}>
                        <ReactSlick
                            {...{
                                dots: true,
                                infinite: true,
                                speed: 500,
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }}
                            {...slick_props}
                            // {...rsProps}
                        >
                            {active_lightbox.images.map((src: any, index) => (
                                <div key={index} style = {slickSlide}>
                                    <GlassMagnifier
                                        imageSrc = {src.source}
                                        allowOverflow = {true}
                                        magnifierSize = {"40%"}
                                        
                                    />
                                
                                </div>
                            ))}
                        </ReactSlick>

                        </Grid>
                    </Grid>
        
                </div>
            </LimitedBackdrop>
        </div>


            <div style = {{overflow: 'hidden', height: "100%"}}>
            <Scrollbars style={{ width: "100%", height: "100%", position: "fixed"}}>
            {/* <Scrollbars style={{ width: "100%", height: "100%", position: "fixed"}}> */}
                <div style = {{height: '100%', paddingTop: '0', width: "100%"}}>
                    <Gallery 
                        tagStyle = {{display: 'none'}}
                        renderItem = {test_render_item}
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
// }