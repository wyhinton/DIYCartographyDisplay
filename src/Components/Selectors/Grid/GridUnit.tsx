import React from "react"; // we need this to make JSX compile
import { useTheme } from "@material-ui/core/styles";
import "../../../css/App.css";
import { getRandomNumber } from "../../../utils";
import { useStoreState } from "../../../hooks";

type UnitProps = {
  colorCode: number;
  isActiveFilter?: boolean;
};
//**Basic unit for creating grids for the grids in the selector widgets*/
export const GridUnit = ({
  colorCode,
  isActiveFilter,
}: UnitProps): JSX.Element => {
  const theme = useTheme();
  //size of the grid unit (pixels)
  const size = 12;
  const dataLoadedState = useStoreState((state) => state.studentsModel.loaded);
  const duration = getRandomNumber(0.5, 4);
  //provides a fade in animation for the grid units on load
  const containerStyle = {
    display: "block",
    animation: dataLoadedState ? `fadein ${duration}s normal` : "",
    animationIterationCount: 1,
    marginTop: "auto",
  } as React.CSSProperties;

  /**Match the grid units number code to a theme color */
  const matchNumberToThemeColor = (ind: number) => {
    let col = "";
    switch (ind) {
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
    const sharedStyle = {
      width: `${size}px`,
      height: `${size}px`,
      marginTop: "auto",
    };
    if (isActiveFiler) {
      return {
        ...sharedStyle,
        backgroundColor: matchNumberToThemeColor(colInd),
        opacity: 1,
      } as React.CSSProperties;
    } else {
      if (colInd == -2) {
        return {
          ...sharedStyle,
          backgroundColor: matchNumberToThemeColor(colInd),
          opacity: 0.5,
        } as React.CSSProperties;
      } else {
        return {
          ...sharedStyle,
          backgroundColor: matchNumberToThemeColor(colInd),
          opacity: 1.0,
        } as React.CSSProperties;
      }
    }
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
