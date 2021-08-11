import React, { useState, useEffect, useRef } from "react";
import Gallery from "./GridGallery/Gallery";
import { useTheme } from "@material-ui/core/styles";
import { useStoreActions, useStoreState } from "../hooks";
import { Scrollbars } from "react-custom-scrollbars";
import LightBox from "./LightBox";
import LoadingBar from "./LoadingBar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "../css/GridGallery.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BarLoader from "react-spinners/BarLoader";
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

  return (
    <div
      style={containerStyle}
      className="Map Gallery Container"
      onKeyUp={(e) => {
        if (e.key === "Escape") {
          setShowLightBox(false);
        }
      }}
    >
      <BarLoader loading={true}></BarLoader>
      <LoadingBar visible={!dataLoaded} />
      <div>
        <LightBox show={showLightbox} onClick={() => setShowLightBox(false)} />
      </div>
      <div style={scrollContainer}>
        <Scrollbars
          style={{ height: "100%", overflowY: "hidden" }}
          // style={{ width: "100%", height: "100%", overflowY: "hidden" }}
        >
          <div style={{ height: "100%", paddingTop: "0", width: "100%" }}>
            <Gallery
              tagStyle={{ display: "none" }}
              images={dataLoaded ? galleryImages : []}
              rowHeight={180}
              enableLightbox={false}
              enableImageSelection={false}
              onClickThumbnail={loadLightbox}
            ></Gallery>
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default React.memo(MapGallery);
