import {Heading, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import { useStoreActions } from "../../../hooks";
import {useState} from 'react';
import {AuthorDisciplineFilter, TopicSubCategoryFilter, ThemeCategoryFilter} from '../../../model/enums';
import type {FilterOption} from '../../../model/types';

import React from 'react';
//haa
export type SelectorGroupProps = { 
    title: string | null, 
    size: number, 
    children?: JSX.Element|JSX.Element[],
    filter: FilterOption,
}

// const defaultProps: 

const SelectorGroup = ({title, children, filter}: SelectorGroupProps) => {
    // const set_multi_filter = useStoreActions(actions=>actions.map_data.thunk_set_multi_filter);
    const set_filter = useStoreActions(actions=>actions.map_data.thunk_set_filter);
    const [hovered, SetHovered] = useState(false);
    const theme = useTheme();
    const groupStyle = {
        fontFamily: theme.typography.fontFamily,
        textDecoration: 'underline',
        color: hovered?theme.palette.primary.light:theme.palette.primary.main,
    } as React.CSSProperties;
    
    const childContainer = {
        marginTop: (title !== null)?'.25em':0,
    } as React.CSSProperties;
    
    const headerAndChild = {
        height: 'fit-content',
        marginTop: 'auto',
        marginBottom: 'auto',
        fontFamily: theme.typography.fontFamily,
        
    }
    return (
        <div style = {headerAndChild}>
            <div 
                // onMouseUp={()=>set_multi_filter(filters??[])}
                // onMouseUp={()=>set_filter([...[filter]??[]}
                // onMouseUp = 
                // onMouseUp={()=>filter?set_filter(filter):set_filter(null)}
                    // onMouseUp={()=>filter?set_filter(filter):set_filter(null)}
                onMouseUp={()=>set_filter(filter)}
                onMouseEnter = {()=>SetHovered(true)}
                onMouseLeave = {()=>SetHovered(false)}
            >
            <Text >
                <Heading size = {100} style = {groupStyle}>
                    {title}
                </Heading>
            </Text> 
            </div>
            <div style = {childContainer}>
                {children}
            </div>
        </div>
    )

}

export default SelectorGroup;