import React from "react"; // we need this to make JSX compile
import { useTheme } from "@material-ui/core/styles";
import { Heading } from "evergreen-ui";
type SelectorSectionProps = {
  title: string;
  children: JSX.Element;
  style?: React.CSSProperties;
};

//wraps header and selection widgets
export const SelectorSection = ({
  title,
  children,
  style,
}: SelectorSectionProps): JSX.Element => {
  const theme = useTheme();

  const headerContainer = {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    paddingBottom: ".1em",
    height: "20%",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
  } as React.CSSProperties;

  const header = {
    color: theme.palette.primary.main,
    marginTop: 4,
    margin: "auto",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;

  return (
    <div style={style}>
      <div style={headerContainer}>
        <Heading size={300} style={header}>
          {title}
        </Heading>
      </div>
      {children}
    </div>
  );
};

export default SelectorSection;
