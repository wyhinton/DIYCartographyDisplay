import ReactSlick from "react-slick";
// import { Ref } from "react";
import {
  GlassMagnifier,
  MagnifierContainer,
  MagnifierZoom,
} from "react-image-magnifiers";
import type { LightboxImage } from "classes/lightbox";
import Magnifier from "react-magnifier";
import { useTheme } from "@material-ui/core/styles";
// import type { RefObject } from "./index";

interface ImagerSliderProps {
  images: LightboxImage[];
}
const ImageSlider = ({ images }: ImagerSliderProps) => {
  const theme = useTheme();

  const slickSlide = {
    height: "100%",
  } as React.CSSProperties;

  const slick_props = {
    variableWidth: false,
    // variableWidth: true,
    adaptiveHeight: false,
    // slidesToShow: 2,
  };

  const imageTitle = {
    textAlign: "center",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;

  return (
    <>
      <ReactSlick
        {...{
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: 0,
        }}
        {...slick_props}
        // {...rsProps}
      >
        {images.map((img, i) => (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div key={i} style={slickSlide}>
                {/* <GlassMagnifier
                  imageSrc={img.src}
                  allowOverflow={true}
                  magnifierSize={"40%"}
                  // style={slickSlide}
                  key={i}
                /> */}
                <Magnifier src={img.src} />
                <div style={imageTitle}>{img.title}</div>
              </div>
            </div>
          </>
        ))}
      </ReactSlick>
    </>
  );
};
export default ImageSlider;

// {images.map((img, i) => (
//   <MagnifierContainer key={i}>
//     <div key={i} style={slickSlide}>
//       <MagnifierZoom style={{ height: "400px" }} imageSrc={img.src} />
//       {/* <GlassMagnifier
//       imageSrc={img.src}
//       allowOverflow={true}
//       magnifierSize={"40%"}
//     /> */}
//     </div>
//   </MagnifierContainer>
// ))}
