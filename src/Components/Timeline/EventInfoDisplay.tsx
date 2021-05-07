import {
  Heading,
  Paragraph,
  Link,
  Strong,
  Small,
  Text,
  Icon,
  Pane,
  ArrowRightIcon,
} from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import type { EventRow } from "../../model/map_data";
import { EventLevel, EventType } from "../../model/enums";
import { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";

type EventInfoDisplayProps = {
  info: EventRow | undefined;
};

function EventInfoDisplay({ info }: EventInfoDisplayProps) {
  const theme = useTheme();
  const infoContainer = {
    height: "100%",
    // fontFamily: theme.typography.fontFamily,
    // border: `1px solid ${theme.palette.primary.main}`,
  } as React.CSSProperties;
  const infoBody = {
    color: theme.palette.primary.main,
    fontSize: "medium",
    // lineHeight: "9pt",
    paddingTop: ".5em",
  } as React.CSSProperties;

  const infoHeader = {
    color: theme.palette.primary.main,
    fontSize: "9pt",
    lineHeight: "5pt",
    fontFamily: theme.typography.fontFamily,
    textDecoration: "underline",
  } as React.CSSProperties;

  const paragraph = {
    // : "left"
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    fontSize: "9pt",
    lineHeight: "15pt",
  } as React.CSSProperties;

  const default_val: EventRow = {
    start: new Date(1 / 1 / 1900),
    end: new Date(1 / 1 / 1900),
    title: "",
    info: "",
    tags: "",
    // type: EventType.DATE,
    category: EventLevel.national,
  };
  const data = info ?? default_val;
  useEffect(() => {}, [info]);

  return (
    <div style={infoContainer}>
      <Scrollbars style={{ width: "100%", height: "100%" }}>
        <Text style={infoHeader}>
          <Paragraph style={infoHeader}>{data.title}</Paragraph>
        </Text>
        <Text style={paragraph}>
          <Paragraph style={paragraph}>{data.info}</Paragraph>
        </Text>
      </Scrollbars>
    </div>
  );
}

export default EventInfoDisplay;
