import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import {Heading, Paragraph, Link, Strong, Small, Text, Icon, Pane, ArrowRightIcon} from 'evergreen-ui';
import Gallery from 'react-grid-gallery';
import { useTheme } from "@material-ui/core/styles";

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



const MapGallery = ({title}) => {
    const theme = useTheme();

    const containerStyle = {
        border: `1px solid ${theme.palette.primary.main}`,
        padding: '1em',
        overflow: "hidden",
        backgroundColor: "white",
    }
    return(
    <div style = {containerStyle}>
        <div>
         <Gallery images = {IMAGES}/>
        </div>
    </div>
    )
}

export default MapGallery;
// }