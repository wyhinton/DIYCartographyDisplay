import { Paragraph, Text, Pane } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import sideBarText from "../static/sideBarText";

const Sidebar = (): JSX.Element => {
  const theme = useTheme();

  const sidebarContainer = {
    height: "100%",
    width: "100%",
    paddingBottom: "1em",
    paddingRight: "2em",
    textAlign: "left" as const,
    fontWeight: 200,
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;

  const sidebarBold = {
    color: theme.palette.primary.main,
    fontSize: "11pt",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 200,
    lineHeight: "16pt",
  } as React.CSSProperties;

  return (
    <Pane style={sidebarContainer}>
      <Text>
        <Paragraph style={sidebarBold}>{sideBarText}</Paragraph>
      </Text>
    </Pane>
  );
};

export default Sidebar;
