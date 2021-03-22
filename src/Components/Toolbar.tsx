import Grid from '@material-ui/core/Grid';
import SelectorSection from './SelectorSection';
import Category from './Selectors/Category';
import {Link, Paragraph, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";

const Toolbar = () => {
    const theme = useTheme();
    const gridSect = {
        height: '100%',
        // border: '1px solid black',
    }
    const instructions_paragraph ={
        // : "left"
        color: theme.palette.primary.main,
        fontSize: "9pt",
        lineHeight: "12pt",
    };
    const linkStyle = {
        fontSize: "8pt",
        textDecoration: "none",
    }

    return (
        <Grid item xs = {12} style = {gridSect} container spacing = {3} direction = "row">
            
            <Grid container spacing = {0} style = {{height: "25%", backgroundColor: "white", justifyContent: "space-between"}}>
                <Grid item xs = {2} style = {gridSect}>
                    <div>

   
                    {/* <SelectorSection title = " f "> */}
                        <Text>
                        
                        <Link style = {linkStyle} >WAYS TO EXPEREINCE THIS 
                            <Icon icon = {ArrowRightIcon} size  = {9}/>
                        </Link>
                        <Paragraph style = {instructions_paragraph}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 
                            making it over 2000 years old. 
                        </Paragraph>
                        </Text>
                </div>
                    {/* </SelectorSection> */}
                </Grid>
                <Grid item xs = {3} style = {gridSect}>
                    <SelectorSection title = "COURSE YEAR">
                    <Category></Category>
                    </SelectorSection>
                </Grid>
                <Grid item xs = {4} style = {gridSect}>
                    <SelectorSection title = "TOPICS">
                        <Category></Category>
                    </SelectorSection>
                </Grid>
                <Grid item xs = {3} style = {gridSect}>
                    <SelectorSection title = "THEMES">
                        <Category></Category>
                    </SelectorSection>
                </Grid>
            </Grid>
        </Grid>
    )

}

export default Toolbar;