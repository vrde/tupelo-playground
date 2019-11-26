import React, { useState, useEffect } from "react";
import { Box, Button, Form, Icons, FormField, TextInput } from "grommet";
import db from "./db";

const EXPLORER =
  "https://quorumcontrol.github.io/wasm-explorer/build/#/chaintrees/";

function Settings({ tupelo }) {
  const [did, setDid] = useState("");
  const [name, setName] = useState("");

  async function onSubmit() {
    await tupelo.set("name", name);
  }

  function onLogout() {
    db.remove("tupelo:privateKey");
    window.location.reload();
  }

  useEffect(() => {
    tupelo.get("name").then(setName);
    tupelo.tree.id().then(setDid);
  }, [tupelo]);

  return (
    <Box>
      <Box margin={{ top: "large" }}>
        Your DID is:{" "}
        <a target="_blank" href={EXPLORER + did}>
          {did}
        </a>
      </Box>

      <Box margin={{ top: "large" }}>
        <Button label="Logout" onClick={onLogout} />
      </Box>
    </Box>
  );
}

export default Settings;
