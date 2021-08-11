import React, { useState, useEffect } from "react"; // we need this to make JSX compile
import { useTheme } from "@material-ui/core/styles";
import "../../../css/App.css";
import { useStoreState } from "../../../hooks";

type UnitProps = {
  colorCode: number;
  isActiveFilter?: boolean;
  isLegendKey?: boolean;
};
//**Basic unit for creating grids for the grids in the selector widgets*/
export const GridUnit = ({
  colorCode,
  isActiveFilter,
  isLegendKey,
}: UnitProps): JSX.Element => {
  const theme = useTheme();
  //size of the grid unit (pixels)
  const size = 12;
  //provides a fade in animation for the grid units on load
  const containerStyle = {
    display: "block",
    marginTop: "auto",
  } as React.CSSProperties;
  const activeFilterState = useStoreState(
    (state) => state.studentsModel.filter
  );
  useEffect(() => {
    if (!isLegendKey) {
      if (activeFilterState.length == 0) {
        setOpacity(1);
      } else if (isActiveFilter) {
        setOpacity(1);
      } else if (!isActiveFilter) {
        setOpacity(0.5);
      }
    } else {
      setOpacity(1);
    }
  }, [activeFilterState]);
  const [opacity, setOpacity] = useState(0);
  /**Match the grid units number code to a theme color */
  const matchNumberToThemeColor = (ind: number) => {
    let col = "";
    switch (ind) {
      case -1:
        // col = theme.palette.action.hover;
        col = theme.palette.divider;
        // col = "red";
        break;
      case 0:
        col = theme.palette.primary.main;
        break;
      case 1:
        col = theme.palette.primary.light;
        break;
      case 2:
        col = theme.palette.secondary.dark;
        break;
      case 3:
        col = theme.palette.secondary.main;
        break;
      case 4:
        col = theme.palette.secondary.dark;
        break;
    }
    return col;
  };

  const colorizeGridUnit = (colInd: number, isActiveFiler?: boolean) => {
    return {
      width: `${size}px`,
      height: `${size}px`,
      marginTop: "auto",
      opacity: opacity,
      // opacity: isActiveFilter ? 1 : 0.5,
      backgroundColor: matchNumberToThemeColor(colInd),
    };
  };
  return (
    <div style={containerStyle}>
      <div
        className={"grid unit"}
        style={colorizeGridUnit(colorCode, isActiveFilter)}
      ></div>
    </div>
  );
};

export default GridUnit;
