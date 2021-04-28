// import Grid from '@material-ui/core/Grid';
import {Paragraph, Text} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import SelectorGroup from './Containers/SelectorGroup';
import SelectorParent from './Containers/SelectorParent';
import GridChunk from './Grid/GridChunk';
import GridUnit from './Grid/GridUnit';
import { useStoreState } from "../../hooks";
import {AuthorDisciplineFilter} from '../../model/enums';


function to_author_enum(discipline: string, year: string): AuthorDisciplineFilter{
    const filter_string = discipline+"_"+year;
    const filter_enum =  AuthorDisciplineFilter[filter_string as unknown as keyof typeof AuthorDisciplineFilter]
    return filter_enum; 
}

const YearDiscipline = () => {
    const theme = useTheme();
    const year_data = useStoreState(state=>state.map_data?.map_stats?.year);
    console.log(year_data);

    const chunksContainer = {
        // position: 'relative',
        // marginTop: ''
        display: 'flex',
        height: '51px',

    } as React.CSSProperties;

    const disciplineStyle = {
        color: theme.palette.primary.main,
        fontSize: '8pt',
        justifyContent: 'space-between',
        fontFamily: theme.typography.fontFamily,
    
    } as React.CSSProperties
    const rowContainer = {
        display: 'flex',
        fontSize: '8pt',
        height: 20,
        // paddingTop: 10,
        marginTop: -4,

        // : 'center',
    } as React.CSSProperties

    const make_year_chunks = (year: string, year_breakdown?: any) =>{
        
        if (year_breakdown){
            return (
                <div style = {chunksContainer}>
                    <GridChunk base_color = {0} count = {year_breakdown.ARCHITECTURE} filter = {to_author_enum("ARCHITECTURE", year)}/>
                    <GridChunk base_color = {1} count = {year_breakdown.ARCHITECTURE} filter = {to_author_enum("ARTDESIGN", year)}/>
                    <GridChunk base_color = {2} count = {year_breakdown.ARCHITECTURE} filter = {to_author_enum("LANDSCAPE", year)}/>
                    <GridChunk base_color = {3} count = {year_breakdown.ARCHITECTURE} filter = {to_author_enum("OTHER", year)}/>
                </div>
            )
        }
    }
    return (
       <>
        <SelectorParent>
            <SelectorGroup title = {null} size = {3}>
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
                    <GridUnit color = {2} />
                    <Paragraph style = {disciplineStyle}>ART + DESIGN</Paragraph>
                </div>
                <div style = {rowContainer}>
                    <GridUnit color = {3}/>
                    <Paragraph style = {disciplineStyle}>OTHER</Paragraph>
                </div>
            </SelectorGroup>
            <SelectorGroup title = {"2016"} size = {3} filters = {
                [
                AuthorDisciplineFilter.ARTDESIGN_2016,
                AuthorDisciplineFilter.ARCHITECTURE_2016,
                AuthorDisciplineFilter.OTHER_2016,
                AuthorDisciplineFilter.LANDSCAPE_2016
                ]    
                }>
                {
                make_year_chunks("2016", year_data["2016"])
                }
            </SelectorGroup>
            <SelectorGroup title = {"2018"} size = {3}  filters = {
                [
                AuthorDisciplineFilter.ARTDESIGN_2018,
                AuthorDisciplineFilter.ARCHITECTURE_2018,
                AuthorDisciplineFilter.OTHER_2018,
                AuthorDisciplineFilter.LANDSCAPE_2018,
                ]    
                }>
            {
                    make_year_chunks( "2018", year_data["2018"])
                }
            </SelectorGroup>
            <SelectorGroup title = {"2020"} size = {3}  filters = {
                [
                AuthorDisciplineFilter.ARTDESIGN_2020,
                AuthorDisciplineFilter.ARCHITECTURE_2020,
                AuthorDisciplineFilter.OTHER_2020,
                AuthorDisciplineFilter.LANDSCAPE_2020,
                ]    
                }>
            {
                    make_year_chunks("2020", year_data["2020"])
                }
            </SelectorGroup>
        </SelectorParent>
      </>
    )

}

export default YearDiscipline;