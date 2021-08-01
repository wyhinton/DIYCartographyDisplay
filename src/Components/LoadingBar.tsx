// import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import "../css/loading_bar.css";
import BeatLoader from "react-spinners/BeatLoader";
const LoadingBar = ({ visible }: { visible: boolean }) => {
  //   visible = true;
  const theme = useTheme();
  return (
    <div className={visible ? "loading-bar" : "loading-bar-hidden"}>
      <BeatLoader
        color={theme.palette.primary.main}
        loading={visible}
      ></BeatLoader>
    </div>
  );
};

export default LoadingBar;
