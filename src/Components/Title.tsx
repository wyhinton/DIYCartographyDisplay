import {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import {Text, } from 'evergreen-ui';
import { useTheme } from "@material-ui/core/styles";
import '../css/App.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';

function Title() {
  const theme = useTheme();
  const is_md = useMediaQuery(theme.breakpoints.up("lg"));
  const titleHeader = {
    fontSize: "36px",
    fontFamily: theme.typography.fontFamily,

  } as React.CSSProperties;
  const titleSubHeader = {
    fontSize: "14px",
    fontFamily: theme.typography.fontFamily,

  } as React.CSSProperties;

  return (
    <Grid container spacing = {0}>
        <Grid item xs = {2} style = {{display: is_md?'flex':'none'}}>
            <div>
            </div>
        </Grid>
        <Grid item xs = {10}>
            <div>
            <Text style = {titleHeader}>DIY CARTOGRAPHY: </Text>
            </div>
            <div>
            <Text style = {titleSubHeader}>MAPPING THE IMPACT OF URBAN DEVELOPMENT</Text>
            </div>
        </Grid>
    </Grid>
                  
  );
}

export default Title;
