import React from 'react';
import ReactDOM from 'react-dom';
import {Heading, Paragraph, Link, Strong, Small, Text, Icon, Pane, ArrowRightIcon} from 'evergreen-ui';
import { useTheme } from "@material-ui/core/styles";
import { useStoreActions, useStoreState } from "../hooks";
function Sidebar(){
    const theme = useTheme();

    const container = {
        height: "100%",
        width: "100%",
        // paddingRight: "2em",
        // marginTop: "18px",
        paddingBottom: "1em",
        paddingRight: "2em",
        textAlign: "left" as const,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-evenly",
        // borderTop: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
    };
    const instructions_paragraph ={
        // : "left"
        color: theme.palette.primary.main,
        fontSize: "9pt",
        lineHeight: "12pt",
    };

    const paragraph ={
        // : "left"
        color: theme.palette.primary.main,
        fontSize: "9pt",
        lineHeight: "15pt",
    };

    const linkStyle = {
        fontSize: "8pt",
        textDecoration: "none",
    }

    const quoteStyle = {
        textStyle: "italic"
    }

    return(
        <Pane style = {container}>
            {/* <Text>
 
                <Link style = {linkStyle} >WAYS TO EXPEREINCE THIS 
                    <Icon icon = {ArrowRightIcon} size  = {9}/>
                </Link>
                <Paragraph style = {instructions_paragraph}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 
                    making it over 2000 years old. 
                </Paragraph>
            </Text> */}
            <Text style = {{lineHeight: '15pt'}}>
                <Heading size = {700} color = {theme.palette.primary.main}> Intro</Heading>
                    <Paragraph style = {paragraph}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 
                        making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 
                        making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure 
                    </Paragraph>
            </Text>
            <Text style = {{lineHeight: '9pt'}}>
            <Paragraph>
                    <Strong size = {300} color = {theme.palette.primary.main}>
                        "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Contrary to popular belief, Lorem Ipsum is not simply random text.
                    </Strong>
                </Paragraph>
            </Text>
        </Pane>

    )
}

export default Sidebar;