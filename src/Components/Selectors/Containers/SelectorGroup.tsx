import {Heading, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import { useStoreActions } from "../../../hooks";
import {useState} from 'react';
import {AuthorDisciplineFilter, TopicSubCategoryFilter, ThemeCategoryFilter} from '../../../model/enums';

import React from 'react';
//haa
export type SelectorGroupProps = { 
    title: string | null, 
    size: number, 
    children?: JSX.Element|JSX.Element[],
    filters?: (TopicSubCategoryFilter | AuthorDisciplineFilter | ThemeCategoryFilter )[]
}

const SelectorGroup = ({title, children, filters}: SelectorGroupProps) => {
    const set_multi_filter = useStoreActions(actions=>actions.map_data.thunk_set_multi_filter);
    const dummy_filters = [TopicSubCategoryFilter.EE_COMMERCE, AuthorDisciplineFilter.ARCHITECTURE, ThemeCategoryFilter.DIVERSITY];
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
                onMouseUp={()=>set_multi_filter(filters??[])}
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