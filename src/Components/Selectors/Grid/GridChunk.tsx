import GridUnit from "./GridUnit";
import { useStoreActions, useStoreState } from "../../../hooks";
import { useState, useEffect } from "react";
import { FilterOption } from "../../../model/types";

interface GridChunkProps {
  count: number;
  filter: FilterOption;
  baseColor: number;
}

const GridChunk = ({
  count,
  filter,
  baseColor,
}: GridChunkProps): JSX.Element => {
  const filterState = useStoreState((state) => state.studentsModel.filter);
  const setFilterAction = useStoreActions(
    (actions) => actions.studentsModel.thunkSetFilter
  );
  const [colorIndex, setColorIndex] = useState(baseColor);
  const chunkContainerStyle = {
    height: "100%",
    display: "grid",
    position: "relative",
    gridTemplateColumns: `repeat(${Math.ceil(count / 3)}, 1fr)`,
    gridTemplateRows: "repeat(3, 1fr)",
    gridAutoRows: 15,
    gridAutoColumns: 15,
    gap: 3,
    transform: "scaleY(-1.0)",
    paddingRight: ".25em",
    gridAutoFlow: "column",
  } as React.CSSProperties;

  const setRowColor = (
    curFilters: FilterOption[],
    isHovered: boolean,
    baseColor: number
  ) => {
    if (curFilters.some((f) => f === null)) {
      return baseColor;
    } else {
      return isHovered ? -1 : baseColor;
    }
  };

  const [hovered, setHovered] = useState(false);
  useEffect(() => {}, [filterState]);
  useEffect(() => {
    setColorIndex(setRowColor(filterState, hovered, baseColor));
  }, [hovered]);

  return (
    <div className={"grid chunk container"} style={{ position: "relative" }}>
      {count > 0 ? (
        <div
          style={chunkContainerStyle}
          onMouseUp={() => setFilterAction(filter)}
          onMouseEnter={() => {
            setHovered(true);
          }}
          onMouseLeave={() => setHovered(false)}
        >
          {Array.from(Array(count).keys()).map((r: number) => {
            return (
              <GridUnit
                colorCode={colorIndex}
                isActiveFilter={filterState.some((f) => f === filter)}
                key={r}
              />
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GridChunk;
