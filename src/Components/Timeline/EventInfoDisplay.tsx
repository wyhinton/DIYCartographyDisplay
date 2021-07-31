import { Paragraph, Text } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import type { EventRowValues } from "../../model/timelineModel";
import { EventLevel } from "../../enums";
import { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";

type EventInfoDisplayProps = {
  info: EventRowValues | undefined;
};

const EventInfoDisplay = ({ info }: EventInfoDisplayProps): JSX.Element => {
  const theme = useTheme();
  const infoContainerStyle = {
    // height: "100%",
    height: "fit-content",
  } as React.CSSProperties;

  const infoHeaderStyle = {
    color: theme.palette.primary.main,
    fontSize: "12pt",
    lineHeight: "12pt",
    fontFamily: theme.typography.fontFamily,
    textDecoration: "underline",
  } as React.CSSProperties;

  const infoParagraphStyle = {
    animation: "TextColor 1s linear",
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    fontSize: "9pt",
    lineHeight: "15pt",
  } as React.CSSProperties;

  const default_val: EventRowValues = {
    start: new Date(1 / 1 / 1900),
    end: new Date(1 / 1 / 1900),
    title: "",
    info: "",
    tags: "",
    eventScale: EventLevel.national,
  };
  const data = info ?? default_val;
  useEffect(() => {}, [info]);

  return (
    <div style={infoContainerStyle} className="event-info-container">
      <Scrollbars style={{ width: "100%", height: "100%" }}>
        <Text style={infoHeaderStyle}>
          <Paragraph
            key={data.title}
            style={infoHeaderStyle}
            className={"event-info-text"}
          >
            {data.title}
          </Paragraph>
        </Text>
        <Text style={infoParagraphStyle}>
          <Paragraph
            key={data.info}
            style={infoParagraphStyle}
            className={"event-info-text"}
          >
            {data.info}
          </Paragraph>
        </Text>
      </Scrollbars>
    </div>
  );
};

export default EventInfoDisplay;
