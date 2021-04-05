import {useEffect} from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import Sidebar from './Components/Sidebar'
import MapGallery from './Components/MapGallery';
import Timeline from './Components/Timeline';
import { useStoreActions } from "./hooks";
import Toolbar from './Components/Toolbar'

const panel_width = "20%";

// const test_data = 
// https://docs.google.com/spreadsheets/d/1-S8EkLYsknYoFWSynVeMQCi6Gf9PoV9A5ezzICXamJA/edit?usp=sharing
    // https://docs.google.com/spreadsheets/d/e/2PACX-1vShkIFNo43AJw8tdtdq4vsa40okE7v4IJbbXUOuIsLpnCYZMaQnPH9k3_YFhm814s2oa9VrVkQbzPNa/pubhtml
function App() {
  const test_thunk = useStoreActions(actions => actions.map_data.fetch_map_data);
  
  useEffect(()=>{
    test_thunk();
  },[]);
  
  return (
    <div style = {{padding: '1em'}}>
    <Grid container spacing = {0}>
          <Toolbar/>
          <Grid container spacing = {0} style = {{paddingTop: '2em'}}>
              <Grid item xs = {3}>
                    <Sidebar/>
              </Grid>
              <Grid item xs = {9}>
                    <MapGallery/>
              </Grid>
          </Grid>
          <Grid item xs = {12} style = {{height: "25%", padding: 0}}>
                <Timeline/>
          </Grid>
    </Grid>
    </div>
  );
}

export default App;
