import { Paragraph } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import { Scrollbars } from "react-custom-scrollbars";

interface MapDescriptionProps {
  description: string;
}

/**
 * Formats map description text for the lightbox. Wraps text in a Scrollbars in case text excedes page height
 */
const MapDescription = ({ description }: MapDescriptionProps): JSX.Element => {
  const theme = useTheme();

  const textStyle = {
    color: "White",
    fontSize: "12pt",
    lineHeight: "15pt",
    // lineHeight: "12pt",
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
export default MapDescription;
