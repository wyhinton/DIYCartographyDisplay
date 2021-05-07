import Grid from "@material-ui/core/Grid";
import { useTheme, withStyles } from "@material-ui/core/styles";
import React from "react";

type SelectorParentProps = {
  columns?: number;
  children?: JSX.Element | JSX.Element[];
  // children?: (title: string) => React.ReactElement[]
};

//places grid unit selectors into a grid layout
const SelectorParent = ({ children, columns }: SelectorParentProps) => {
  const test = "ddd  ";
  const theme = useTheme();
  const padding = "0.25em 0em 0em .25em";
  const selectorGroup = {
    padding: padding,
    height: "100%",
    borderRight: `1px dashed ${theme.palette.primary.main}`,
    maxWidth: "fit-content",
  } as React.CSSProperties;

  //if only has 1 group add no borders
  const noSiblings = {
    padding: padding,
    height: "100%",
    maxWidth: "fit-content",
  } as React.CSSProperties;

  //1px dashed border for first widget group
  const selectorGroupFirst = {
    padding: padding,
    height: "100%",
    borderRight: `1px dashed ${theme.palette.primary.main}`,
    maxWidth: "fit-content",
  } as React.CSSProperties;

  //1px dashes border right for last widget group
  const selectorGroupLast = {
    padding: padding,
    height: "100%",
    maxWidth: "fit-content",
    // borderLeft: `1px dashed ${theme.palette.primary.main}`,
  } as React.CSSProperties;

  const child_count = Array.isArray(children) ? children.length : 1;

  const gridContainer = {
    display: "grid",
    gridTemplateColumns: "1fr ".repeat(child_count),
    maxWidth: "fit-content",
  } as React.CSSProperties;

  //assign style based on index
  const group_style = (ind: number, chil: JSX.Element | JSX.Element[]) => {
    if (Array.isArray(chil)) {
      if (ind == 0) {
        return selectorGroupFirst;
      }
      if (ind == chil.length - 1) {
        return selectorGroupLast;
      } else {
        return selectorGroup;
      }
    } else {
      return noSiblings;
    }
  };

  return (
    // <Grid container spacing={0} direction="row" style={clusterContainer}>
    <div style={gridContainer}>
      {children
        ? React.Children.map<React.ReactNode, React.ReactNode>(
            children,
            (child, index) => {
              if (React.isValidElement(child)) {
                return <div style={group_style(index, children)}>{child}</div>;
              }
            }
          )
        : null}
      {/* </Grid> */}
    </div>
  );
};

export default SelectorParent;
