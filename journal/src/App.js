import React, { useState, useEffect } from "react";
import { Box, Grommet } from "grommet";
import Tupelo from "./tupelo.js";
import Header from "./Header.js";
import Entries from "./Entries.js";
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

const AppBar = props => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    style={{ zIndex: "1" }}
    {...props}
  />
);

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
        <Box align="center">
          <Box fill>
            <AppBar>Tupelo's Journal</AppBar>
          </Box>
          <Box width="large">
            <Header tupelo={tupelo} />
            <Entries tupelo={tupelo} />
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default App;
