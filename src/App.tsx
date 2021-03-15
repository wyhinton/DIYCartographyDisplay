import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Button} from 'evergreen-ui';
import Grid from '@material-ui/core/Grid';
import Sidebar from './Components/Sidebar'
import MapGallery from './Components/MapGallery';
import Timeline from './Components/Timeline';
import Category from './Components/Selectors/Category';
import SelectorSection from './Components/SelectorSection';


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

function App() {

  // const 
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
                  <MapGallery title = "hello"/>
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
