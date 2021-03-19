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
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        // paddingBottom: '1em',
        height: "100%",

        // display: 'flex',
    }
    const headerContainer = {
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        paddingBottom: '.1em'
    }
    const header = {
        paddingLeft: '1em',
        color: theme.palette.primary.main,
    }



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