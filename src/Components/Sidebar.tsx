import {Paragraph, Text, Pane} from 'evergreen-ui';
import { useTheme } from "@material-ui/core/styles";
function Sidebar(){
    const theme = useTheme();

    const sidebarContainer = {
        height: "100%",
        width: "100%",
        paddingBottom: "1em",
        paddingRight: "2em",
        textAlign: "left" as const,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-evenly",
        color: theme.palette.primary.main,
        fontFamily: theme.typography.fontFamily, 
    } as React.CSSProperties;

    const sidebarParagraph ={
        color: theme.palette.primary.main,
        fontSize: "9pt",
        lineHeight: "12pt",
        fontFamily: theme.typography.fontFamily, 
    } as React.CSSProperties;

    return(
        <Pane style = {sidebarContainer}>
            <Text style = {{lineHeight: '12pt'}}>
                    <Paragraph style = {sidebarParagraph}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 
                        making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45.
                    </Paragraph>
            </Text>
            <Text style = {sidebarParagraph}>
            <Paragraph>
                "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Contrary to popular belief, Lorem Ipsum is not simply random text.
            </Paragraph>
            </Text>
        </Pane>

    )
}

export default Sidebar;