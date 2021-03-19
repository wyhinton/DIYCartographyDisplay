import { useState, useEffect } from 'react';
import {Heading, Paragraph} from 'evergreen-ui';
import Gallery from 'react-grid-gallery';
import { useTheme, withStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import { useStoreActions, useStoreState } from "../hooks";
import {Link} from 'evergreen-ui';


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

// https://codesandbox.io/s/react-grid-gallery-ztf4n?file=/src/index.js:358-880
// https://codesandbox.io/s/r48lm1jopq
type GalleryProps = { 
}

const LimitedBackdrop = withStyles({
    root: {
      position: "absolute",
      zIndex: 1,
      paddingLeft: '2em',
      paddingTop: '3em',
      opacity: .5,
      backgroundColor: 'rgb(0 0 0 / 73%)'
    }
})(Backdrop);

const MapGallery = () => {
    const gallery_images = useStoreState(state=>state.map_data.active_images);
    const [showLightbox, setShowLightBox] = useState(false);
    const filter_gallery = useStoreActions(actions=>actions.map_data.filter_gallery);
    const set_filters = useStoreActions(actions=>actions.map_data.set_filters);
    const theme = useTheme();
    const linkStyle = {
        fontSize: "8pt",
        textDecoration: "none",
    }

    useEffect(() =>{

    }, [gallery_images]);
    // useEffect(() )


    const containerStyle = {
        // border: `1px solid ${theme.palette.primary.main}`,
        overflow: "hidden",
        backgroundColor: "white",
    }

    function get_lightbox_tb_2(this: any) {
        console.log(this.props);
        setShowLightBox(showLightbox=>!showLightbox);
        console.log(showLightbox);
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
        color: 'White'
    }
    const headingStyle = {
        color: 'white',
        paddingBottom: '3em',
    }
    const backDropContainer = {
        width: '100%', 
        height: '100%',
        padding: '5em',
    }

    return(
    <div style = {containerStyle}>
    <Link style = {linkStyle} onClick = {()=>{set_filters(["BUILT ENVIRONMENT"])}}>BUILT ENVIRONMENT</Link>
    <Link style = {linkStyle} onClick = {()=>{set_filters(["POLITICAL ENVIRONMENT"])}}>POLITICAL ENVIRONMENT</Link>
    <Link style = {linkStyle} onClick = {()=>{set_filters(["SOCIAL ENVIRONMENT"])}}>SOCIAL ENVIRONMENT</Link>
    <Link style = {linkStyle} onClick = {()=>{set_filters(["ENVIRONMENTAL ENVIRONMENT"])}}>ENVIRONMENTAL ENVIRONMENT</Link>
        <div >
            <LimitedBackdrop open={showLightbox} onClick={()=>setShowLightBox(false)}>
            <div style = {backDropContainer}>
                <div style = {headingStyle}>
                    <Heading size = {800} color = {'white'} >IM A MAP NAME</Heading>
                </div>
                <Grid container spacing = {3} style = {mainGrid}>
                    <Grid item xs = {3}>
                        <Paragraph style = {textStyle}>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
                        </Paragraph>
                        <Paragraph style = {textStyle}>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
                        </Paragraph>
                    </Grid>
                    <Grid item xs = {3}>
                        <img style = {mapImage} src = "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg"/>
                        left
                    </Grid>
                    <Grid item xs = {3}>
                    <img style = {mapImage} src = "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg"/>
                        middle
                    </Grid>
                    <Grid item xs = {3}>
                    <img style = {mapImage} src = "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg"/>
                        right
                    </Grid>
                </Grid>
    
            </div>
            </LimitedBackdrop>
            <Gallery 
                images = {(gallery_images[0] == undefined) ? IMAGES:gallery_images}
                rowHeight = {100}
                // images = {gallery_images[0].src??IMAGES}
                // images = {IMAGES}

                enableLightbox = {false}
                onClickThumbnail = {
                    get_lightbox_tb_2
                }
            />
        </div>
    </div>
    )
}

export default MapGallery;
// }