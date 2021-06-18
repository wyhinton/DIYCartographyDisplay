import { Paragraph } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import { Scrollbars } from "react-custom-scrollbars";
const SideText = ({
  author,
  description,
}: {
  author: string;
  description: string;
}) => {
  const theme = useTheme();

  const textStyle = {
    color: "White",
    fontSize: "12pt",
    lineHeight: "12pt",
    fontFamily: theme.typography.fontFamily,
  };
  const scrollBarStyle = {
    maxHeight: "90vh",
  };
  return (
    <>
      <Scrollbars style={scrollBarStyle}>
        <Paragraph style={textStyle}>{description}</Paragraph>
        <Paragraph style={textStyle}></Paragraph>
      </Scrollbars>
    </>
  );
};
export default SideText;
