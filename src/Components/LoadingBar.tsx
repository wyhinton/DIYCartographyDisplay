import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import "../css/loading_bar.css";
const LoadingBar = ({ visible }: { visible: boolean }) => {
  //   visible = true;
  const theme = useTheme();
  //   const loadingBarContainer = {
  //     position: "absolute",
  //     width: "100%",
  //     backgroundColor: "red",
  //     height: "2em",
  //     left: 0,
  //     top: "40%",
  //     zIndex: 1,
  //   } as React.CSSProperties;

  return <div className={visible ? "loading-bar" : "loading-bar-hidden"}></div>;
};

export default LoadingBar;
