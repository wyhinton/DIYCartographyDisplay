import { useEffect } from "react";
import { useTheme, withStyles } from "@material-ui/core/styles";
import { CrossIcon, Heading } from "evergreen-ui";
import Backdrop from "@material-ui/core/Backdrop";
import Grid from "@material-ui/core/Grid";
import { useStoreState } from "../../hooks";
import SideText from "./LightBox/SideText";
import ImageSlider from "./LightBox/ImageSlider";
import Header from "./LightBox/Header";
// https://material-ui.com/components/material-icons/

interface LightBoxProps {
  show: boolean;
  onClick: any;
}

const LightBox = ({ show, onClick }: LightBoxProps) => {
  const active_lightbox = useStoreState((state) => state.map_data.lightBoxData);
  useEffect(() => {
    console.log(active_lightbox);
  }, [active_lightbox.author]);
  // const active_lightbox = useStoreState(state=>state.map_data.active_lightbox);
  const theme = useTheme();

  const galleryStyle = {
    height: "90vh",
  };

  const backDropContainer = {
    width: "100%",
    height: "100%",
    paddingLeft: "2em",
  };
  const mainGrid = {
    height: "100vh",
    width: "100vw",
    spacing: 0,
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
      paddingLeft: "2em",
      paddingTop: "2em",
      opacity: 0.5,
      backgroundColor: "rgb(0 0 0 / 73%)",
    },
  })(Backdrop);

  return (
    <>
      <LimitedBackdrop open={show}>
        <div style={closeButtonContainer} onClick={onClick}>
          <CrossIcon></CrossIcon>
        </div>
        <div style={backDropContainer}>
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
              <ImageSlider images={active_lightbox.images} />
            </Grid>
          </Grid>
        </div>
      </LimitedBackdrop>
    </>
  );
};

export default LightBox;
