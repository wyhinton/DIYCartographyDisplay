import { Heading, Text } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
import { useStoreActions, useStoreState } from "../../../hooks";
import { useState, useEffect } from "react";
import type { FilterOption } from "../../../model/types";
import { FilterState, FilterGroup } from "../../../enums";

import React from "react";

//Containers a selection of grid units and header
export type SelectorGroupProps = {
  title: string | null;
  size: number;
  children?: JSX.Element | JSX.Element[];
  filter: FilterOption;
};

/**Container for all the selection widgets, i.e 2016/2018/Political/Social/
 * Provides a header text for the widget, that when clicked sets the store's group filter function.
 */
const SelectorGroup = ({
  title,
  children,
  filter,
}: SelectorGroupProps): JSX.Element => {
  const theme = useTheme();
  const setFilterAction = useStoreActions(
    (actions) => actions.studentsModel.thunkSetFilter
  );
  const groupFilterState = useStoreState(
    (state) => state.studentsModel?.groupFilter
  );
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [groupState, setGroupState] = useState(FilterState.DEFAULT);

  useEffect(() => {
    switch (groupFilterState) {
      case filter:
        setGroupState(FilterState.SOLO);
        break;
      case FilterGroup.NONE:
        setGroupState(FilterState.DEFAULT);
        break;
      default:
        setGroupState(FilterState.DEACTIVATED);
        break;
    }
  }, [groupFilterState, isHeaderHovered]);

  const setGroupStyle = (fs: FilterState, hovered: boolean) => {
    const baseStyle = {
      height: "fit-content",
      textDecoration: "underline",
      marginTop: "auto",
      marginBottom: "auto",
      paddingRight: "1em",
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.primary.main,
    };
    switch (fs) {
      case FilterState.SOLO:
        baseStyle.color = theme.palette.primary.light as string;
        break;
      case FilterState.DEACTIVATED:
        baseStyle.color = theme.palette.primary.dark as string;
        break;
      case FilterState.DEFAULT:
        baseStyle.color = theme.palette.primary.main as string;
        break;
    }
    if (hovered) {
      baseStyle.color = theme.palette.divider as string;
    }
    return baseStyle;
  };

  const selectorGroupContainerStyle = {
    height: "fit-content",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;

  return (
    <div
      style={selectorGroupContainerStyle}
      className={"selector group container"}
    >
      <div
        style={{ paddingBottom: ".25em" }}
        className={"selector group header"}
        onMouseUp={() => setFilterAction(filter)}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        <Text>
          <Heading
            size={100}
            style={setGroupStyle(groupState, isHeaderHovered)}
          >
            {title}
          </Heading>
        </Text>
      </div>
      <div className={"selector group child container"}>{children}</div>
    </div>
  );
};

export default SelectorGroup;
