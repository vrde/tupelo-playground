import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Switch,
  Redirect,
  Route,
  Link
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { Box, Grommet } from "grommet";
import Tupelo, { getKey, loadWasm } from "./tupelo.js";
import TupeloLoader from "./TupeloLoader.js";
import AppBar from "./AppBar.js";
import Header from "./Header.js";
import Entries from "./Entries.js";
import Settings from "./Settings.js";
import Login from "./Login.js";
import db from "./db.js";

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
  const [loading, setLoading] = useState("Loading Tupelo WASM SDK");
  const [tupelo, setTupelo] = useState();

  window.tupelo = tupelo;

  useEffect(() => {
    async function loadTupelo() {
      await loadWasm();
      setLoading("Connecting to Network");
      const privateKey = await getKey();
      if (privateKey) {
        const tupelo = await Tupelo.fromKey(privateKey);
        setTupelo(tupelo);
      }
      setLoading(null);
    }
    loadTupelo();
  }, []);

  async function onLogin(key) {
    const tupelo = await Tupelo.fromKey(key);
    setTupelo(tupelo);
  }

  console.log("render", tupelo);
  if (loading) {
    return <p>{loading}, please wait...</p>;
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
                <PrivateRoute exact path="/" isAuthenticated={tupelo}>
                  <Header tupelo={tupelo} />
                  <Entries tupelo={tupelo} />
                </PrivateRoute>
                <Route exact path="/journal/:username">
                  <TupeloLoader>
                    <Header />
                    <Entries />
                  </TupeloLoader>
                </Route>
                <PrivateRoute path="/settings" isAuthenticated={tupelo}>
                  <Settings tupelo={tupelo} />
                </PrivateRoute>
                <Route path="/login">
                  <Login onLogin={onLogin} />
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
