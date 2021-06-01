import ReactSlick from "react-slick";
import { GlassMagnifier } from "react-image-magnifiers";
import type { LightboxImage } from "model/lightbox";

const ImageSlider = ({ images }: { images: LightboxImage[] }) => {
  const slickSlide = {
    height: "500px",
    width: "100vh",
  } as React.CSSProperties;

  const slick_props = {
    variableWidth: true,
    slidesToShow: 1,
  };

  return (
    <>
      <ReactSlick
        {...{
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
        }}
        {...slick_props}
        // {...rsProps}
      >
        {images.map((img, i) => (
          <div key={i} style={slickSlide}>
            <GlassMagnifier
              imageSrc={img.src}
              allowOverflow={true}
              magnifierSize={"40%"}
            />
          </div>
        ))}
      </ReactSlick>
    </>
  );
};
export default ImageSlider;
