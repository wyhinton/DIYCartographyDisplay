// https://codesandbox.io/s/react-grid-gallery-ztf4n?file=/src/index.js:358-880
// https://codesandbox.io/s/r48lm1jopq

import React, { useState, useEffect, useMemo, useRef } from "react";
import Gallery from "./GridGallery/Gallery";
// import Gallery from "react-grid-gallery";
import { useTheme } from "@material-ui/core/styles";
import { useStoreActions, useStoreState } from "../hooks";
import { Scrollbars } from "react-custom-scrollbars";
import LightBox from "./LightBox";
import { getRandomNumber } from "../utils";
import LoadingBar from "./LoadingBar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "../css/GridGallery.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BarLoader from "react-spinners/BarLoader";
// import MyGallery from "react-photo-gallery";
import SmoothImage from "react-smooth-image";
/**
 * Gallery of the student maps. Wraps around a react-grid-gallery Gallery, providing a means for scrolling the gallery via a react-custom-scrollbars.
 * Clicking on an image brings up a LightBox.
 * Accesses the list of computedActiveImages, and can set activeLightBox
 * a list of our current active
 *
 */
const MapGallery = (): JSX.Element => {
  const theme = useTheme();
  const galleryImages = useStoreState(
    (state) => state.studentsModel?.computedActiveImages
  );
  const setActiveLightbox = useStoreActions(
    (actions) => actions.studentsModel.setLightboxData
  );
  const [showLightbox, setShowLightBox] = useState(false);
  const modalElement = useRef<null | HTMLElement>(null);
  const dataLoaded = useStoreState((state) => state.studentsModel.loaded);
  const isNotLarge = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    modalElement.current = document.getElementById("overlay");
    if (modalElement.current) {
      const modalDisplayStyle = showLightbox ? "block" : "none";
      modalElement.current.style.display = modalDisplayStyle;
    }
    console.log(galleryImages);
  }, [galleryImages, showLightbox]);

  const containerStyle = {
    backgroundColor: "white",
    height: isNotLarge ? "500px" : "50vh",
    pointerEvents: "all",
    margin: "auto",
    flexDirection: "column",
    position: "relative",
    overflowX: "hidden",
  } as React.CSSProperties;

  const scrollContainer = {
    overflow: "hidden",
    height: "100%",
    minWidth: "100%",
    minHeight: "200px",
  } as React.CSSProperties;

  /**Set the active lightbox to the clicked gallery image */
  function loadLightbox(this: any) {
    //disable lightbox for mobile
    if (!isSmall) {
      setShowLightBox((showLightbox) => !showLightbox);
      setActiveLightbox(this.props.item);
    }
  }
  function setImage(this: any) {
    console.log(this.props);
    const { imageProps } = this.props;
    const { src, alt, style } = imageProps;
    console.log(src, alt, style);
    // return <div>a</div>;
    return <img {...this.props.imageProps}></img>;
    // return <SmoothImage src={src} alt={alt} style={style}></SmoothImage>;
  }

  // handleKeyDown: function(event) {
  //   if (event.keyCode == 13 /*enter*/) {
  //     this.okAction();
  //   }
  //   if (event.keyCode == 27 /*esc*/) {
  //     this.cancelAction();
  //   }
  // },
  function testTb() {}
  let animationOffset = 0;
  function thumbnailStyle(this: any) {
    console.log(this);
    const duration = getRandomNumber(0.5, 1.0) + animationOffset * 0.1;
    animationOffset = animationOffset + 1;
    return {
      // animation: `fadein ${duration}s normal`,
      // animationTimingFunction: "cubic-bezier(.03,.91,.53,.92)",
      // animationIterationCount: 1,
    };
  }
  return (
    <div
      style={containerStyle}
      className="Map Gallery Container"
      onKeyUp={(e) => {
        console.log(e);
        console.log(e.key);
        if (e.key === "Escape") {
          console.log("got escape key");
          setShowLightBox(false);
        }
      }}
    >
      {/* <div style={containerStyle}> */}
      <BarLoader loading={true}></BarLoader>
      {/* </div> */}

      <LoadingBar visible={!dataLoaded} />
      <div>
        <LightBox show={showLightbox} onClick={() => setShowLightBox(false)} />
      </div>
      <div style={scrollContainer}>
        <Scrollbars style={{ width: "100%", height: "100%" }}>
          <div style={{ height: "100%", paddingTop: "0", width: "100%" }}>
            <Gallery
              tagStyle={{ display: "none" }}
              images={dataLoaded ? galleryImages : []}
              rowHeight={180}
              enableLightbox={false}
              enableImageSelection={false}
              onClickThumbnail={loadLightbox}
              tileViewportStyle={dataLoaded ? thumbnailStyle : undefined}
            ></Gallery>
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default React.memo(MapGallery);

const MyComp = (imageProps: any, src: any): JSX.Element => {
  return <div>hello</div>;
};
