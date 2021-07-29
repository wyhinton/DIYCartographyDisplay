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

const SelectorGroup = ({ title, children, filter }: SelectorGroupProps) => {
  const theme = useTheme();
  const set_filter = useStoreActions(
    (actions) => actions.studentsModel.thunkSetFilter
  );
  const active_group_filter = useStoreState(
    (state) => state.studentsModel?.groupFilter
  );
  const [hovered, SetHovered] = useState(false);
  const [active, setActive] = useState(FilterState.DEFAULT);

  useEffect(() => {
    // console.log(active_group_filter);
    // dbb!()
    // console.log(active_group_filter === filter);
    if (active_group_filter === filter) {
      setActive(FilterState.SOLO);
    }
    if (active_group_filter === FilterGroup.NONE) {
      setActive(FilterState.DEFAULT);
    }
    // if (active_group_filter )
    switch (active_group_filter) {
      case filter:
        setActive(FilterState.SOLO);
        break;
      case FilterGroup.NONE:
        setActive(FilterState.DEFAULT);
        break;
      default:
        setActive(FilterState.DEACTIVATED);
        break;
    }
    // console.log(active);
  }, [active_group_filter, hovered]);

  const set_style = (fs: FilterState, hovered: boolean) => {
    const base_style = {
      height: "fit-content",
      textDecoration: "underline",
      marginTop: "auto",
      marginBottom: "auto",
      paddingRight: "1em",
      fontFamily: theme.typography.fontFamily,
      // color: theme.colorShades.main_0,
      color: theme.palette.primary.main,
    };
    switch (fs) {
      case FilterState.SOLO:
        base_style.color = theme.palette.primary.light;
        break;
      case FilterState.DEACTIVATED:
        base_style.color = theme.palette.primary.dark;
        // base_style.color = "yellow";
        break;
      case FilterState.DEFAULT:
        base_style.color = theme.palette.primary.main;

        // base_style.color = "green";
        break;
    }
    if (hovered) {
      base_style.color = theme.palette.primary.light;
    }
    return base_style;
  };

  // const groupStyle = {
  //   fontFamily: theme.typography.fontFamily,
  //   textDecoration: "underline",
  //   color: hovered ? theme.palette.primary.light : theme.palette.primary.main,
  // } as React.CSSProperties;

  const headerAndChild = {
    height: "fit-content",
    // paddingLeft: "0.5em",
    // paddingRight: "0.5em",
    // marginTop: "auto",
    // marginBottom: "auto",
    // paddingRight: "1em",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;
  return (
    <div style={headerAndChild} className={"selector group container"}>
      <div
        className={"selector group text container"}
        onMouseUp={() => set_filter(filter)}
        onMouseEnter={() => SetHovered(true)}
        onMouseLeave={() => SetHovered(false)}
      >
        <Text>
          <Heading size={100} style={set_style(active, hovered)}>
            {title}
          </Heading>
        </Text>
      </div>
      <div className={"selector group child container"}>{children}</div>
    </div>
  );
};

export default SelectorGroup;
