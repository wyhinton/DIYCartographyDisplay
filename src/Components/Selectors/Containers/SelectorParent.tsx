import { useTheme } from "@material-ui/core/styles";
import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
type SelectorParentProps = {
  children?: JSX.Element | JSX.Element[];
};

//places grid unit selectors into a grid layout
const SelectorParent = ({ children }: SelectorParentProps): JSX.Element => {
  const theme = useTheme();
  const padding = "0.5em";
  const isBelowMedium = useMediaQuery(theme.breakpoints.down("md"));
  const sharedStyle = {
    paddingLeft: ".5em",
    paddingRight: ".5em",
    display: "flex",
    height: "auto",
    boxSizing: "border-box",
    padding: padding,
  };
  const selectorGroup = {
    ...sharedStyle,
    borderRight: `1px dashed ${theme.palette.primary.main}`,
  } as React.CSSProperties;

  //if only has 1 group add no borders
  const noSiblings = {
    ...sharedStyle,
  } as React.CSSProperties;

  //1px dashed border for first widget group
  const selectorGroupFirst = {
    ...sharedStyle,
    borderRight: `1px dashed ${theme.palette.primary.main}`,
  } as React.CSSProperties;

  const childCount = Array.isArray(children) ? children.length : 1;

  const gridContainer = {
    display: "grid",
    gridTemplateColumns: "1fr ".repeat(childCount),
    maxWidth: "fit-content",
    // marginBottom: isBelowMedium ? "1em" : 0,
    // paddingBottom: isBelowMedium ? "1em" : 0,
  } as React.CSSProperties;

  //assign style based on index
  const getSectionStyle = (ind: number, chil: JSX.Element | JSX.Element[]) => {
    if (Array.isArray(chil)) {
      if (ind == 0) {
        return selectorGroupFirst;
      }
      if (ind == chil.length - 1) {
        return noSiblings;
      } else {
        return selectorGroup;
      }
    } else {
      return noSiblings;
    }
  };

  return (
    // <Grid container spacing={0} direction="row" style={clusterContainer}>
    <div style={gridContainer} className={"selector parent container"}>
      {children
        ? React.Children.map<React.ReactNode, React.ReactNode>(
            children,
            (child, index) => {
              if (React.isValidElement(child)) {
                return (
                  <div
                    className={"selector section container"}
                    style={getSectionStyle(index, children)}
                  >
                    {child}
                  </div>
                );
              }
            }
          )
        : null}
    </div>
  );
};

export default SelectorParent;
