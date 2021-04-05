// import Grid from '@material-ui/core/Grid';
import {Link, Paragraph, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";
import SelectorGroup from './Containers/SelectorGroup';
import SelectorParent from './Containers/SelectorParent';
import Grid from './Grid/Grid';
import GridUnit from './Grid/GridUnit';
import { useStoreState } from "../../hooks";

const Themes = () => {
    const theme = useTheme();
    const total_count = 35;
    const map_stats = useStoreState(state=>state.map_data.map_stats);
    const theme_stats = map_stats.theme;
    return (
       <>
        <SelectorParent>
            <SelectorGroup title = {"Equity"} size = {4}>
            </SelectorGroup>
            <SelectorGroup title = {"Access"} size = {4}/>
            <SelectorGroup title = {"Diversity"} size = {4}/>
        </SelectorParent>
      </>
    )

}

export default Themes;