import GridUnit from "./GridUnit";
import { useStoreActions, useStoreState } from "../../../hooks";
import { useState, useEffect } from "react";
import { FilterOption } from "../../../model/types";
interface GridChunkProps {
  count: number;
  filter: FilterOption;
  base_color: number;
}

function roundToStep(value: number, step: number) {
  const val = Math.round(value / step) * step;
  const num_cols = val / step;
  const max_num_rows = step;

  if (value !== undefined && value !== null) {
    return Array.from(Array(num_cols).keys()).map((k: number, i: number) => {
      let num_units = 0;
      if (i == num_cols - 1) {
        num_units = max_num_rows - Math.abs(value - val);
      } else {
        num_units = step;
      }
      return {
        count: num_units,
      };
    });
  }
}

const GridChunk = ({ count, filter, base_color }: GridChunkProps) => {
  const rowContainer = {} as React.CSSProperties;

  const chunkContainer = {
    height: "100%",
    display: "flex",
    position: "relative",
  } as React.CSSProperties;

  const cur_state_filters = useStoreState(
    (state) => state.studentsModel.filter
  );
  const set_filter = useStoreActions(
    (actions) => actions.studentsModel.thunkSetFilter
  );
  const setRowColor = (
    curFilters: FilterOption[],
    isHovered: boolean,
    baseColor: number
  ) => {
    if (curFilters.some((f) => f === filter)) {
      // if (cur_filter_val === filter) {
      return 4;
    }
    if (curFilters.some((f) => f === null)) {
      return baseColor;
    } else {
      return isHovered ? -1 : baseColor;
    }
  };
  const [hovered, setHovered] = useState(false);
  useEffect(() => {}, [cur_state_filters]);
  // useEffect(() => {_}, [cur_state_filters]);

  useEffect(() => {}, [hovered]);

  const adjust_width = (base_style: React.CSSProperties, num_cols: number) => {
    base_style.width = 15 * num_cols;
    return base_style;
  };

  const group_columns: any = roundToStep(count, 3);
  const to_chunk = (col_list?: any[]) => {
    if (col_list) {
      return (
        <div
          style={chunkContainer}
          onMouseUp={() => set_filter(filter)}
          // onMouseUp = {()=>set_filter(filter)}
          onMouseEnter={() => setHovered(!hovered)}
          onMouseLeave={() => setHovered(!hovered)}
        >
          {Array.from(Array(col_list.length).keys()).map((r: number) => {
            // console.log(col_list);
            const cur_col: any = col_list[r];
            return (
              <div style={rowContainer} key={r}>
                {Array.from(Array(cur_col.count).keys()).map(
                  (i: number, c: any) => {
                    // console.log(cur_col.count);
                    return (
                      <GridUnit
                        color={setRowColor(
                          cur_state_filters,
                          hovered,
                          base_color
                        )}
                        is_active_filter={cur_state_filters.some(
                          (f) => f === filter
                        )}
                        key={i}
                      />
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };
  return <>{to_chunk(group_columns)}</>;
};

export default GridChunk;
