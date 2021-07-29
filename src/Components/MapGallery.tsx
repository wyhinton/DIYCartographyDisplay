// https://codesandbox.io/s/react-grid-gallery-ztf4n?file=/src/index.js:358-880
// https://codesandbox.io/s/r48lm1jopq

import React, { useState, useEffect, useMemo } from "react";
import Gallery from "react-grid-gallery";
import { useTheme } from "@material-ui/core/styles";
import { useStoreActions, useStoreState } from "../hooks";
import { Scrollbars } from "react-custom-scrollbars";
import LightBox from "./LightBox";
import "../css/GridGallery.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getRandomNumber } from "../utils";
import LoadingBar from "./LoadingBar";
import type { GalleryImage } from "../model/studentsData";

// interface GalleryEvent{
//   caption: string,
//   isSelected: boolean,
//   marginLeft: number,
//   scaletwidth: number,
//   src: string,
//   tags: L
// }
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

  const dataLoaded = useStoreState((state) => state.studentsModel.loaded);

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

  const scrollContainer = {
    overflow: "hidden",
    height: "100%",
    border: `1px solid ${theme.palette.primary.main}`,
    minWidth: "100%",
    minHeight: "200px",
  } as React.CSSProperties;

  /**Set the active lightbox to the clicked gallery image */
  function loadLightbox(this: any) {
    setShowLightBox((showLightbox) => !showLightbox);
    // console.log(this.props.item);
    setActiveLightbox(this.props.item);
  }

  let animationOffset = 0;
  function thumbnailStyle() {
    const duration = getRandomNumber(0.5, 1.0) + animationOffset * 0.1;
    animationOffset = animationOffset + 1;
    return {
      animation: `fadein ${duration}s normal`,
      aniamtionTimingFunction: "cubic-bezier(.03,.91,.53,.92)",
      animationIterationCount: 1,
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
              images={dataLoaded ? galleryImages : []}
              customOverlay={<div style={{ backgroundColor: "red" }}></div>}
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
