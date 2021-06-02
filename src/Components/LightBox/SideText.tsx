import { Paragraph } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";

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

  return (
    <>
      <Paragraph style={textStyle}>{description}</Paragraph>
      <Paragraph style={textStyle}></Paragraph>
    </>
  );
};
export default SideText;
