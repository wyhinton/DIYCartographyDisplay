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
  onClick: any;
}

export interface RefObject {
  SayHi: () => void;
}

const LightBox = ({ show, onClick }: LightBoxProps) => {
  const theme = useTheme();

  const theDiv = useRef<RefObject>(null);
  // const
  const active_lightbox = useStoreState((state) => state.map_data.lightBoxData);
  useEffect(() => {
    console.log(active_lightbox);
  }, [active_lightbox.author]);

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
      <LimitedBackdrop open={show}>
        <div style={closeButtonContainer} onClick={onClick}>
          <CrossIcon></CrossIcon>
        </div>
        <div
          style={backDropContainer}
          onMouseUp={() => {
            console.log("got click");
            // setOpen(false);
            onClick;
          }}
        >
          <Header
            author={active_lightbox.author}
            title={active_lightbox.title}
            discipline={active_lightbox.discipline}
            year={active_lightbox.year}
          />
          <Grid container spacing={3} style={mainGrid}>
            <Grid item xs={3}>
              <SideText
                author={active_lightbox.author}
                description={active_lightbox.description}
              />
            </Grid>
            <Grid item xs={9} style={galleryStyle}>
              <ImageSlider images={active_lightbox.images} ref={theDiv} />
            </Grid>
          </Grid>
        </div>
      </LimitedBackdrop>
    </>,
    document.getElementById("overlay") as HTMLImageElement
  );
};

export default LightBox;
