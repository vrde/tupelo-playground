import React, { useState, useEffect } from "react";
import { Box, Grommet } from "grommet";
import Editable from "./Editable";

function Header({ tupelo }) {
  const [name, setName] = useState("Unknown");

  function onChange(value) {
    tupelo.set("name", value);
    setName(value);
  }

  useEffect(() => {
    tupelo.get("name").then(setName);
  }, [tupelo]);

  return <h1>{name}'s Journal</h1>;
}

export default Header;
