import Grid from '@material-ui/core/Grid';
import SelectorSection from './SelectorSection';
import {Link, Paragraph, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import YearDiscipline from './Selectors/YearDiscipline';
import Themes from './Selectors/Themes';
import MapLens from './Selectors/MapLens';

const Toolbar = () => {
    const theme = useTheme();
    const toolbarContainer = {
        height: '15%',
        justifyContent: "space-between",
    } as React.CSSProperties


    const instructions_paragraph ={
        color: theme.palette.primary.main,
        fontSize: "9pt",
        lineHeight: "12pt",
    };
    const SelectorContainer = withStyles({
        root: {
            // padding: 0,
            border: `1px solid ${theme.palette.primary.main}`, 
            paddingLeft: '.5em',
            paddingRight: '.1em',
        }
    })(Grid);

    return (
        <Grid container spacing = {1} style = {toolbarContainer}>
        {/* <Grid container spacing = {1} style = {{height: "15%", backgroundColor: "white", justifyContent: "space-between"}}> */}
        {/* <Grid container spacing = {0} style = {{height: "25%", backgroundColor: "white", justifyContent: "space-between"}}> */}
                <SelectorContainer item xs = {1}>
                    <SelectorSection title = "SELECT & FILTER">
                        <Text style = {instructions_paragraph}>
                            <Paragraph size = {300} style = {instructions_paragraph}>
                            Click on titles to view main categories. Click on rectangle blocks to filter by subcategories.
                            </Paragraph>
                        </Text>
                    </SelectorSection>
                </SelectorContainer>

                <SelectorContainer item xs = {4} >
                    <SelectorSection title = "YEAR & DISCIPLINE">
                        <YearDiscipline></YearDiscipline>
                    </SelectorSection>
                </SelectorContainer>
                <SelectorContainer item xs = {4}>
                    <SelectorSection title = "TOPICS">
                        <MapLens></MapLens>
                    </SelectorSection>
                </SelectorContainer>
                <SelectorContainer item xs = {2}>
                    <SelectorSection title = "THEMES">
                        <Themes></Themes>
                    </SelectorSection>
                </SelectorContainer>

  
        </Grid>
    )

}

export default Toolbar;


            //     {/* <Grid item xs = {3} style = {gridSect}>
            //         <div style = {{paddingRight: '2em'}}>

   
            //         {/* <SelectorSection title = " f "> */}
            //         <Text>
                        
            //         <Link style = {linkStyle} >WAYS TO EXPEREINCE THIS 
            //             <Icon icon = {ArrowRightIcon} size  = {9}/>
            //         </Link>
            //         <Paragraph style = {instructions_paragraph}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 
            //             making it over 2000 years old. 
            //         </Paragraph>
            //         </Text>
            // </div>
            //     {/* </SelectorSection> */}
            // </Grid> */}