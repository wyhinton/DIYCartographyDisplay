import Grid from '@material-ui/core/Grid';
import {Link, Paragraph, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import React from 'react';
import type {SelectorGroupProps} from './SelectorGroup';
// import '../../../css/SelectorParent.css';
type SelectorParentProps = { 
    children?: JSX.Element|JSX.Element[],
    // children?: (title: string) => React.ReactElement[]
}


const SelectorParent = ({children}: SelectorParentProps) => {
    const theme = useTheme();
    const padding_amount = '.1em';
    const clusterContainer = {
        height: '76%',
        padding: 0,
        // display: 'flex',
    } as React.CSSProperties
    
    const selectorGroup = {
        // paddingTop: '.25em',
        display: 'flex',
        paddingLeft: '.25em',
        paddingRight: '.25em',
        height: "100%",
        borderLeft: `1px dashed ${theme.palette.primary.main}`, 
        borderRight: `1px dashed ${theme.palette.primary.main}`, 
    } as React.CSSProperties

    const noSiblings = {
        display: 'flex',
        // paddingTop: '.25em',
        paddingRight: '.25em',
        paddingLeft: '.25em',
        height: "100%",
    } as React.CSSProperties

    const selectorGroupFirst = {
        // paddingTop: '.25em',
        display: 'flex',
        paddingLeft: 0,
        height: "100%",
        borderRight: `1px dashed ${theme.palette.primary.main}`, 
    } as React.CSSProperties

    const selectorGroupLast = {
        display: 'flex',
        // paddingTop: '.25em',
        paddingLeft: '.25em',
        height: "100%",
        borderLeft: `1px dashed ${theme.palette.primary.main}`, 
    } as React.CSSProperties

    const group_style = (ind: number, chil: JSX.Element|JSX.Element[]) =>{
        if (Array.isArray(chil)){
            if (ind == 0){
                return selectorGroupFirst
            }
            if (ind == chil.length-1){
                return selectorGroupLast
            } else {
                return selectorGroup
            }
        } else {
            return noSiblings
        }
    }

    return (
        <Grid container spacing = {0} direction = "row" style = {clusterContainer}>
            {children ? React.Children.map<React.ReactNode, React.ReactNode>(children, (child, index) => {
                if (React.isValidElement(child)) {
                    return (<Grid style ={group_style(index, children)} item xs = {child.props.size}>{child}</Grid>)
                }
            }): null}

        </Grid>
    )

}

export default SelectorParent;