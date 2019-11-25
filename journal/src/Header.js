import React, { useState, useEffect } from "react";
import { Heading } from "grommet";
import Editable from "./Editable";

function Header({ tupelo }) {
  const [name, setName] = useState("Unknown");

  useEffect(() => {
    tupelo.get("name").then(setName);
  }, [tupelo]);

  return <Heading level={1}>{name}'s Journal</Heading>;
}

export default Header;