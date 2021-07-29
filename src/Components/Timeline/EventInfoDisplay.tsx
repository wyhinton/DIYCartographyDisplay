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
  const infoContainer = {
    height: "100%",
  } as React.CSSProperties;

  const infoHeader = {
    color: theme.palette.primary.main,
    fontSize: "12pt",
    lineHeight: "12pt",
    fontFamily: theme.typography.fontFamily,
    textDecoration: "underline",
  } as React.CSSProperties;

  const paragraph = {
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
    <div style={infoContainer}>
      <Scrollbars style={{ width: "100%", height: "100%" }}>
        <Text style={infoHeader}>
          <Paragraph
            key={data.title}
            style={infoHeader}
            className={"info-text"}
          >
            {data.title}
          </Paragraph>
        </Text>
        <Text style={paragraph}>
          <Paragraph key={data.info} style={paragraph} className={"info-text"}>
            {data.info}
          </Paragraph>
        </Text>
      </Scrollbars>
    </div>
  );
};

export default EventInfoDisplay;
