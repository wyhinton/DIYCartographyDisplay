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


const panel_width = "20%";

const section = {
  height: "100%",
  width: "100%",
  paddingTop: 5,
  backgroundColor: "blue"
};

const topSection = {
  height: "75vh",
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
    <div>
        <Grid direction = "column" style = {mainGrid} >
          <Grid  container spacing = {0} item xs = {12} style = {topSection}>
            <Grid  container spacing = {0} direction = "row" style = {{height: "100%"}}>
              
              {/* upper left */}
              {/* <Grid item xs = {12} xl = {3}style = {gridSect}> */}
              <Grid item xs = {2} style = {gridSect}>
              {/* left side */}
              <Sidebar/>
              
              </Grid>
              {/* upper right */}
              <Grid item xs = {10} style = {gridSect} container spacing = {0} direction = "row">
                {/* right top */}
                <Grid container spacing = {3} style = {{height: "25%", backgroundColor: "white", justifyContent: "space-between"}}>
                  <Grid item xs = {3} style = {gridSect}>
                    <SelectorSection title = "COURSE YEAR">
                      <Category></Category>
                    </SelectorSection>
                  </Grid>
                  <Grid item xs = {6} style = {gridSect}>
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
                {/* right bottom */}
                <Grid item xs = {12} style = {{height: "75%", backgroundColor: "black", overflow: "hidden"}}>
                  <MapGallery/>
                </Grid>
                {/* right side */}
              </Grid>
            </Grid>
          
          </Grid>
          <Grid item xs = {12} style = {{height: "25%"}}>
                <Timeline/>
          </Grid>
        </Grid>
    </div>
  );
}

export default App;
