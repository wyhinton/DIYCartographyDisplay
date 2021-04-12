import { useState, useEffect } from 'react';
import Gallery from 'react-grid-gallery';
import { useTheme, withStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import { useStoreActions, useStoreState } from "../hooks";
import {Link, Icon, CrossIcon, Heading, Paragraph} from 'evergreen-ui';
import '../css/GridGallery.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactSlick from 'react-slick';
// import ReactImageMagnify from 'react-image-magnify';
import "../css/SlickSlide.css";
import { Scrollbars } from 'react-custom-scrollbars';
import {GlassMagnifier} from 'react-image-magnifiers';


const IMAGES =
[
{
        src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 174,
        isSelected: false,
        caption: "After Rain (Jeshu John - designerspics.com)"
},
{
        src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
        caption: "Boats (Jeshu John - designerspics.com)"
},

{
        src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
        thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212
},
{
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    isSelected: false,
    caption: "After Rain (Jeshu John - designerspics.com)"
},
{
    src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
    tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
    caption: "Boats (Jeshu John - designerspics.com)"
},

{
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212
},
{
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    isSelected: false,
    caption: "After Rain (Jeshu John - designerspics.com)"
},
{
    src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
    tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
    caption: "Boats (Jeshu John - designerspics.com)"
},

{
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212
},
{
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    isSelected: false,
    caption: "After Rain (Jeshu John - designerspics.com)"
},
{
    src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
    tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
    caption: "Boats (Jeshu John - designerspics.com)"
},

{
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212
},
{
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    isSelected: false,
    caption: "After Rain (Jeshu John - designerspics.com)"
},
{
    src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
    tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
    caption: "Boats (Jeshu John - designerspics.com)"
},

{
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212
},
{
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    isSelected: false,
    caption: "After Rain (Jeshu John - designerspics.com)"
},
{
    src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
    thumbnailWidth: 320,
    thumbnailHeight: 212,
    tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
    caption: "Boats (Jeshu John - designerspics.com)"
},


]

const images2 = [
    {
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
  ];
  
// https://codesandbox.io/s/react-grid-gallery-ztf4n?file=/src/index.js:358-880
// https://codesandbox.io/s/r48lm1jopq
type GalleryProps = { 
}

const LimitedBackdrop = withStyles({
    root: {
      position: "absolute",
      zIndex: 1,
      boxSizing: "border-box",
    //   zIndex: ,
      paddingLeft: '2em',
      paddingTop: '2em',
      opacity: .5,
      backgroundColor: 'rgb(0 0 0 / 73%)'
    }
})(Backdrop);

const MapGallery = () => {
    const gallery_images = useStoreState(state=>state.map_data.active_images);
    const [showLightbox, setShowLightBox] = useState(false);
    const filter_gallery = useStoreActions(actions=>actions.map_data.filter_gallery);
    // const set_filters = useStoreActions(actions=>actions.map_data.set_filters);
    const set_active_lightbox = useStoreActions(actions=>actions.map_data.set_active_lightbox);
    const active_lightbox = useStoreState(state=>state.map_data.active_lightbox);

    const theme = useTheme();
    const linkStyle = {
        fontSize: "8pt",
        textDecoration: "none",
    }

    useEffect(() =>{

    }, [gallery_images, active_lightbox]);


    const containerStyle = {
        backgroundColor: "white",
        height: '100%',
        margin: 'auto',
        flexDirection: 'column',
    }  as React.CSSProperties
    // const galleryStyle = {
    //     height: '100%',
    //     // display: 'flex',
    // } as React.CSSProperties

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
    const mapImage = {
        width: '100%'
    }
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
        <div>
        <Heading>DIY CARTOGRAPHY: </Heading>
        <Heading>MAPPING THE IMPACT OF URBAN DEVELOPMENT</Heading>
        </div>
        {/* <div style = {{display: 'flex'}}>
            <Link style = {linkStyle} onClick = {()=>{set_filters(["BUILT ENVIRONMENT"])}}>BUILT ENVIRONMENT</Link>
            <Link style = {linkStyle} onClick = {()=>{set_filters(["POLITICAL ENVIRONMENT"])}}>POLITICAL ENVIRONMENT</Link>
            <Link style = {linkStyle} onClick = {()=>{set_filters(["SOCIAL ENVIRONMENT"])}}>SOCIAL ENVIRONMENT</Link>
            <Link style = {linkStyle} onClick = {()=>{set_filters(["ENVIRONMENTAL ENVIRONMENT"])}}>ENVIRONMENTAL ENVIRONMENT</Link>
        </div> */}

            <div style = {{overflow: 'hidden', height: "100%"}}>
            <Scrollbars style={{ width: "100%", height: 300 }}>
                <div style = {{height: '100%', paddingTop: '1em', width: "100%"}}>
                    <Gallery 
                        tagStyle = {{display: 'none'}}
                        renderItem = {test_render_item}
                        images = {(gallery_images[0] == undefined) ? IMAGES:gallery_images}
                        rowHeight = {75}
                        maxRows = {10}
                        enableLightbox = {false}
                        enableImageSelection = {false}
                        onClickThumbnail = {
                            get_lightbox_tb_2
                        }
                    />
                </div>  
            </Scrollbars>
            </div>
        </div>
    )
}

export default MapGallery;
// }