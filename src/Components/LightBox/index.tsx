import { useEffect, useState, useRef, useImperativeHandle, Ref } from "react";
import ReactDom from "react-dom";
import { useTheme, withStyles } from "@material-ui/core/styles";
import { CrossIcon } from "evergreen-ui";
import Backdrop from "@material-ui/core/Backdrop";
import Grid from "@material-ui/core/Grid";
import { useStoreState } from "../../hooks";
import SideText from "./SideText";
import ImageSlider from "./ImageSlider";
import Header from "./Header";
// https://material-ui.com/components/material-icons/

interface LightBoxProps {
  show: boolean;
  onClick: () => void;
}

const LightBox = ({ show, onClick }: LightBoxProps) => {
  const theme = useTheme();
  const activeLightbox = useStoreState((state) => state.map_data.lightBoxData);
  useEffect(() => {
    console.log(activeLightbox);
  }, [activeLightbox.author]);

  const galleryStyle = {
    // height: "100vh",
    height: "100%",
  };
  // const [open, setOpen] = useState(false);

  const backDropContainer = {
    // width: "100%",
    height: "100%",
    paddingLeft: "2em",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    maxHeight: "100vh",
    overflow: "hidden",
    paddingTop: "1em",
  } as React.CSSProperties;

  const mainGrid = {
    height: "90vh",
    width: "100vw",
    spacing: 0,
    paddingTop: "1em",
    justify: "space-around",
  };

  const closeButtonContainer = {
    position: "absolute",
    top: 0,
    left: 0,
    color: "white",
  } as React.CSSProperties;

  // console.log(tag_stats);
  const LimitedBackdrop = withStyles({
    root: {
      position: "absolute",
      zIndex: 1,
      boxSizing: "border-box",
      opacity: 0.5,
      backgroundColor: "rgb(0 0 0 / 73%)",
      overflow: "hidden",
      transition: "opacity 1s",
      // display: open ? "block" : "none",
      // top: open ? -100 : 0,
    },
  })(Backdrop);

  return ReactDom.createPortal(
    <>
      <LimitedBackdrop open={show} transitionDuration={1000}>
        {/* <div style={closeButtonContainer} onClick={onClick}>
          <CrossIcon></CrossIcon>
        </div> */}
        <div
          style={backDropContainer}
          onMouseUp={() => {
            console.log("got click");
            // setOpen(false);
            onClick;
          }}
        >
          <Header
            author={activeLightbox.author}
            title={activeLightbox.title}
            discipline={activeLightbox.discipline}
            year={activeLightbox.year}
            onClick={onClick}
          />
          <Grid container spacing={3} style={mainGrid}>
            <Grid item xs={3} onClick={onClick}>
              <SideText
                author={activeLightbox.author}
                description={activeLightbox.description}
              />
            </Grid>
            <Grid item xs={9} style={galleryStyle}>
              <ImageSlider images={activeLightbox.images} />
            </Grid>
          </Grid>
        </div>
      </LimitedBackdrop>
    </>,
    document.getElementById("overlay") as HTMLImageElement
  );
};

export default LightBox;
