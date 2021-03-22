import React, {useEffect, useState} from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import Sidebar from './Components/Sidebar'
import MapGallery from './Components/MapGallery';
import Timeline from './Components/Timeline';
import Category from './Components/Selectors/Category';
import SelectorSection from './Components/SelectorSection';
import GetSheetDone from 'get-sheet-done';
import { useStoreActions, useStoreState } from "./hooks";
import { isConstructorDeclaration } from 'typescript';
import Toolbar from './Components/Toolbar'

const panel_width = "20%";

const section = {
  height: "100%",
  width: "100%",
  paddingTop: 5,
  backgroundColor: "blue"
};

const topSection = {
  height: "60vh",
  // height: "75vh",
  width: "100%",
  paddingTop: 0,
  // backgroundColor: "red"
};

const bottomSection = {
  width: "100%",
  height: "25vh",
  paddingTop: 0,
  backgroundColor: "blue"
};

const mainGrid = {
  height: '100vh',
  spacing: 0,
  justify: 'space-around',
  paddingLeft: "2em",
  paddingRight: "2em",
  paddingTop: "1em",
  paddingBottom: "1em"
};

const subGrid ={
  height: '100%',
  width: '100%'
}

const gridSect = {
  height: '100%',
  // border: '1px solid black',
}

const topContainer = {
  height: '100%'
}

const mainContainer = {
  paddingLeft: "2em",
  paddingRight: "2em",
  paddingTop: "1em",
  paddingBottom: "1em"
}

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
    <Grid container spacing = {3}>
          <Toolbar/>
          <Grid container spacing = {3}>
              <Grid item xs = {2}>
                    <Sidebar/>
              </Grid>
              <Grid item xs = {10}>
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
