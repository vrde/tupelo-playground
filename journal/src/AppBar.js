import React, { useState, useEffect } from "react";
import { Box, Button, Text } from "grommet";
import { Link } from "react-router-dom";

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
  >
    <Text>Tupelo's Journal</Text>
    <Link to="/">
      <Button label="Home" />
    </Link>
    <Link to="/settings">
      <Button label="Settings" />
    </Link>
  </Box>
);

export default AppBar;
