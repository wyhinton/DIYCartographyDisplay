import {Heading, Paragraph, Link, Strong, Small, Text, Icon, Pane, ArrowRightIcon} from 'evergreen-ui';
import { useTheme } from "@material-ui/core/styles";
import type {EventRow} from '../../model/map_data';
import  {EventLevel} from '../../model/enums';
import {useEffect} from 'react';

type EventInfoDisplayProps = {
    info: EventRow | undefined, 
}

function EventInfoDisplay({info}: EventInfoDisplayProps){
    const theme = useTheme();
    // start: Date,
    // end: Date,
    // title: string,
    // info: string,
    // tags: string,
    // category: EventLevel, 
    const infoContainer= {
        height: '85%',
        paddingTop: '1em',
        // border: `1px solid ${theme.palette.primary.main}`,
    } as React.CSSProperties
    const infoBody= {
        color: theme.palette.primary.main,
        fontSize: "9pt",
        lineHeight: "9pt",
    } as React.CSSProperties

    const infoHeader= {
        color: theme.palette.primary.main,
        fontSize: "9pt",
        lineHeight: "5pt",
        // borderBottom: `1px solid ${theme.palette.primary.main}`,
        textDecoration: "underline",
    } as React.CSSProperties

    const paragraph ={
        // : "left"
        color: theme.palette.primary.main,
        fontSize: "9pt",
        lineHeight: "15pt",
    } as React.CSSProperties; 

    const default_val: EventRow ={
        start: new Date(1/1/1900),
        end: new Date(1/1/1900),
        title: "",
        info: "",
        tags: "",
        category: EventLevel.national,
    }
    const data = info ?? default_val;
    useEffect(()=>{

    }, [info])
  
    return(
        <div style = {infoContainer}>
            {/* <Pane> */}

        
            <Text style = {infoHeader}>
                <Paragraph>
                {data.title}
                </Paragraph>
            </Text>
            <Text style = {paragraph}>
            <Paragraph style = {paragraph}>
                {data.info}
                </Paragraph>
            </Text>
            {/* </Pane> */}
        </div>

    )
}

export default EventInfoDisplay;