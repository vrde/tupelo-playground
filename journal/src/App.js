import React, { useState, useEffect } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Box, Grommet } from "grommet";
import Tupelo from "./tupelo.js";
import TupeloLoader from "./TupeloLoader.js";
import AppBar from "./AppBar.js";
import Header from "./Header.js";
import Entries from "./Entries.js";
import Settings from "./Settings.js";
import "./global.css";

const theme = {
  global: {
    font: {
      family: "monospace",
      size: "18px",
      height: "20px"
    }
  }
};

function App() {
  const [tupelo, setTupelo] = useState();

  window.tupelo = tupelo;

  useEffect(() => {
    Tupelo.fromKey().then(setTupelo);
  }, []);

  if (tupelo === undefined) {
    return <p>Loading Tupelo WASM SDK, please wait...</p>;
  } else {
    return (
      <Grommet theme={theme} full>
        <Router>
          <Box align="center">
            <Box fill>
              <AppBar />
            </Box>
            <Box width="large">
              <Switch>
                <Route exact path="/">
                  <Header tupelo={tupelo} />
                  <Entries tupelo={tupelo} />
                </Route>
                <Route exact path="/journal/:did">
                  <TupeloLoader>
                    <Header />
                    <Entries />
                  </TupeloLoader>
                </Route>
                <Route path="/settings">
                  <Settings tupelo={tupelo} />
                </Route>
              </Switch>
            </Box>
          </Box>
        </Router>
      </Grommet>
    );
  }
}

export default App;
