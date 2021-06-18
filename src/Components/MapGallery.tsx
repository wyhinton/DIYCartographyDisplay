// https://codesandbox.io/s/react-grid-gallery-ztf4n?file=/src/index.js:358-880
// https://codesandbox.io/s/r48lm1jopq

import React, { useState, useEffect } from "react";
import Gallery from "react-grid-gallery";
import { useTheme } from "@material-ui/core/styles";
import { useStoreActions, useStoreState } from "../hooks";
import { Scrollbars } from "react-custom-scrollbars";
import LightBox from "./LightBox";
import type { GalleryImage } from "../model/map_data";
import "../css/GridGallery.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getRandomNumber } from "../utils";
import LoadingBar from "./LoadingBar";

const MapGallery = () => {
  const galleryImages = useStoreState(
    (state) => state.map_data?.computedActiveImages
  );
  const [showLightbox, setShowLightBox] = useState(false);
  const setActiveLightbox = useStoreActions(
    (actions) => actions.map_data.setLightboxData
  );
  const dataLoaded = useStoreState((state) => state.map_data.loaded);
  const theme = useTheme();

  useEffect(() => {
    console.log(galleryImages);
  }, [galleryImages]);

  const containerStyle = {
    backgroundColor: "white",
    height: "100%",
    margin: "auto",
    flexDirection: "column",
    position: "relative",
  } as React.CSSProperties;

  /**Set the active lightbox to the clicked gallery image */
  function getLightboxTb2(this: any) {
    setShowLightBox((showLightbox) => !showLightbox);
    setActiveLightbox(this.props.item);
  }

  const scrollContainer = {
    overflow: "hidden",
    height: "100%",
    border: `1px solid ${theme.palette.primary.main}`,
    minWidth: "100%",
    minHeight: "200px",
  };
  let test = 0;
  function thumbnailStyle() {
    const duration = getRandomNumber(0.5, 1.0) + test * 0.1;
    test = test + 1;
    return {
      animation: `fadein ${duration}s normal`,
      aniamtionTimingFunction: "cubic-bezier(.03,.91,.53,.92)",
      // aniamtionTimingFunction: "cubic-bezier(0.1, 0.7, 1.0, 0.1);",
      animationIterationCound: 1,
    };
  }
  return (
    <div style={containerStyle}>
      <LoadingBar visible={!dataLoaded} />
      <div>
        <LightBox show={showLightbox} onClick={() => setShowLightBox(false)} />
      </div>
      <div style={scrollContainer}>
        <Scrollbars style={{ width: "100%", height: "100%" }}>
          <div style={{ height: "100%", paddingTop: "0", width: "100%" }}>
            <Gallery
              tagStyle={{ display: "none" }}
              images={galleryImages}
              customOverlay={<div style={{ backgroundColor: "red" }}></div>}
              rowHeight={120}
              maxRows={10}
              enableLightbox={false}
              enableImageSelection={false}
              onClickThumbnail={getLightboxTb2}
              tileViewportStyle={dataLoaded ? thumbnailStyle : undefined}
            ></Gallery>
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default MapGallery;
