import React from 'react'; // we need this to make JSX compile
import { useTheme, withStyles } from "@material-ui/core/styles";
import {Heading} from 'evergreen-ui';
type SelectorSectionProps = { 
    title: string, 
    children: JSX.Element,
}



export const SelectorSection = ({title, children}: SelectorSectionProps) => {
    const theme = useTheme();

    const container = {
        height: "100%",
        paddingLeft: '.25em',
        paddingRight: '.25em',
    } as React.CSSProperties

    const headerContainer = {
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        paddingBottom: '.1em',
        height: "20%",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
    } as React.CSSProperties

    const header = {
        color: theme.palette.primary.main,
        marginTop: 0,
        marginBottom: 'auto',
        fontFamily: theme.typography.fontFamily,
    } as React.CSSProperties

    return (
    <div style = {container}>
        <div style = {headerContainer}>
            <Heading size = {300} style = {header}>{title}</Heading>
        </div>
        {children}
    </div> 
    )
}

export default SelectorSection