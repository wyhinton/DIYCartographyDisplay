import React from 'react';
import ReactDOM from 'react-dom';
import {Heading, Paragraph, Link, Strong, Small, Text, Icon, Pane, ArrowRightIcon} from 'evergreen-ui';
import { useTheme } from "@material-ui/core/styles";

function Sidebar(){
    const theme = useTheme();

    const container = {
        height: "100%",
        width: "100%",
        paddingRight: "2em",
        marginTop: "18px",
        paddingBottom: "1em",
        textAlign: "left" as const,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-evenly",
        borderTop: `1px solid ${theme.palette.primary.main}`,
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
        lineHeight: "9pt",
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
            <Text>
                <Link style = {linkStyle} >WAYS TO EXPEREINCE THIS 
                    <Icon icon = {ArrowRightIcon} size  = {9}/>
                </Link>
                <Paragraph style = {instructions_paragraph}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 
                    making it over 2000 years old. 
                </Paragraph>
            </Text>
            <Text>
                <Heading size = {700}> INTRO</Heading>
                    <Paragraph style = {paragraph}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 
                        making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 
                        making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure 
                    </Paragraph>
            </Text>
            <Text>
            <Paragraph>
                    <Strong size = {500} >
                        "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Contrary to popular belief, Lorem Ipsum is not simply random text.
                    </Strong>
                </Paragraph>
            </Text>
        </Pane>

    )
}

export default Sidebar;