import { useTheme, withStyles } from "@material-ui/core/styles";
import {CrossIcon, Heading, Paragraph} from 'evergreen-ui';
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import ReactSlick from 'react-slick';
import {GlassMagnifier} from 'react-image-magnifiers';
import { useStoreState } from "../../hooks";
// https://material-ui.com/components/material-icons/


interface LightBoxProps{
    show: boolean,
    onClick: any,
};

const LightBox = ({show, onClick}: LightBoxProps) => {
    const active_lightbox = useStoreState(state=>state.map_data.active_lightbox);
    const theme = useTheme();
    const slickSlide = {
        height: '500px',
      //   width: '500px',  
        width: '100vh',  
      } as React.CSSProperties

      
    const galleryStyle = {
        height: '90vh'
        // height: '100%'
    }

    const backDropContainer = {
        width: '100%', 
        height: '100%',
        paddingLeft: '2em',
        // padding: '5em',
    }
    const mainGrid = {
        height: '100vh',
        width: '100vw',
        spacing: 0,
        justify: 'space-around',
    };

    const closeButtonContainer = {
        position: 'absolute',
        top: 0,
        left: 0,
        color: 'white'
    } as React.CSSProperties

    const textStyle = {
        color: 'White',
        fontSize: '12pt',
        lineHeight: '12pt',
    }

    const slick_props= {
        // adaptiveHeight: false, 
        // adaptiveHeight: true, 
        variableWidth: true,
        // centerMode: true, 
        slidesToShow: 1,
        // adaptiveHeight: false, 
    }

    // console.log(tag_stats);
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

    return (
    <>
     <LimitedBackdrop open={show}>
                <div style = {closeButtonContainer}  onClick={onClick}>
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
      </>
    )

}

export default LightBox;