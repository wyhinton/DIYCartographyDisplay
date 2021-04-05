// import Grid from '@material-ui/core/Grid';
import {Link, Paragraph, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import SelectorGroup from './Containers/SelectorGroup';
import SelectorParent from './Containers/SelectorParent';
import Grid from './Grid/Grid';
import GridUnit from './Grid/GridUnit';
import { useStoreState } from "../../hooks";

const YearDiscipline = () => {
    const theme = useTheme();
    const map_stats = useStoreState(state=>state.map_data.map_stats);
    const year_data = map_stats.year;
    console.log(year_data);
    // console.log(year_discipline_data);

    const disciplineStyle = {
        color: theme.palette.primary.main,
        fontSize: '8pt',
        justifyContent: 'space-between',
    
    } as React.CSSProperties
    const rowContainer = {
        display: 'flex',
        fontSize: '8pt'
        // : 'center',
    } as React.CSSProperties

    return (
       <>
        <SelectorParent>
            <SelectorGroup title = {""} size = {3}>
                <div style = {rowContainer}>
                    <GridUnit color = {0}/>
                    <Paragraph style = {disciplineStyle}>ARCHITECTURE</Paragraph>
                </div>
                <div style = {rowContainer}>
                    <GridUnit color = {1}/>
                    <Text style = {disciplineStyle}>
                        <Paragraph style = {disciplineStyle}>LANDSCAPE ARCH</Paragraph>
                    </Text>
                </div>
                <div style = {rowContainer}>
                    <GridUnit color = {2}/>
                    <Paragraph style = {disciplineStyle}>ART + DESIGN</Paragraph>
                </div>
                <div style = {rowContainer}>
                    <GridUnit color = {3}/>
                    <Paragraph style = {disciplineStyle}>OTHER</Paragraph>
                </div>
            </SelectorGroup>
            <SelectorGroup title = {"2016"} size = {3}>
                {
                    
                }
                {/* <Grid rows = {3} cols = {1}></Grid> */}
            </SelectorGroup>
            <SelectorGroup title = {"2018"} size = {3}/>
            <SelectorGroup title = {"2020"} size = {3}/>
        </SelectorParent>
      </>
    )

}

export default YearDiscipline;