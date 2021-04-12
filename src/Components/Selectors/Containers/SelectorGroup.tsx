import Grid from '@material-ui/core/Grid';
import {Link, Heading, Paragraph, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import React from 'react';
//haa
export type SelectorGroupProps = { 
    title: string | null, 
    size: number, 
    // cols: number,
    children?: JSX.Element|JSX.Element[],
}



const SelectorGroup = ({title, children}: SelectorGroupProps) => {
    const theme = useTheme();
    const groupStyle = {
        textDecoration: 'underline',
        color: theme.palette.primary.main,
    } as React.CSSProperties;
    const childContainer = {
        marginTop: (title !== null)?'.25em':0,
        // height: 'fit-content',
        // margin: 'auto',
    } as React.CSSProperties;
    
    const headerAndChild = {
        height: 'fit-content',
        marginTop: 'auto',
        marginBottom: 'auto',
    }
    return (
        <div style = {headerAndChild}>
            <div >
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