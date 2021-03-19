import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {Heading, Paragraph} from 'evergreen-ui';
import Gallery from 'react-grid-gallery';
import { useTheme, withStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import { useStoreActions, useStoreState } from "../hooks";

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

// imageThumbnails = image => {
//     const promise = new Promise(function(resolve, reject) {
//       console.log("inside promise");
//       let img = new Image();
//       img.src = image.thumbnail;
//       img.onload = () => {
//         console.log(
//           "imge src",
//           img.src,
//           "width ",
//           img.width,
//           "height",
//           img.height
//         );
//         image.thumbnailHeight = img.height;
//         image.thumbnailWidth = img.width;
//         resolve("ok");
//       };
//     });
//     return promise;
//   };
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
    const items = useStoreState(state=>state.map_data.maps);
    const gallery_images = useStoreState(state=>state.map_data.gallery_images);
    const [showLightbox, setShowLightBox] = useState(false);
    const [images, setImages] = useState([] as any);

    const theme = useTheme();
    
    // useEffect(() )


    const containerStyle = {
        border: `1px solid ${theme.palette.primary.main}`,
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