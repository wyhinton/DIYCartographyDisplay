import ReactSlick from "react-slick";
import type { LightboxImage } from "classes/lightbox";
import Magnifier from "../Magnifier/Magnifier";
// import Magnifier from "react-magnifier";
import { useTheme } from "@material-ui/core/styles";

interface ImagerSliderProps {
  images: LightboxImage[];
  startImageIndex: number;
}
const ImageSlider = ({ images, startImageIndex }: ImagerSliderProps) => {
  const theme = useTheme();

  const slickSlide = {
    height: "100%",
  } as React.CSSProperties;

  const slickProps = {
    variableWidth: false,
    adaptiveHeight: false,
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
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: 0,
          initialSlide: startImageIndex + 1,
        }}
        {...slickProps}
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
