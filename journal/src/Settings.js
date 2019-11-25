import React, { useState, useEffect } from "react";
import { Box, Button, Form, Icons, FormField, TextInput } from "grommet";

function Settings({ tupelo }) {
  const [did, setDid] = useState("");
  const [name, setName] = useState("");

  async function onSubmit() {
    await tupelo.set("name", name);
  }

  useEffect(() => {
    tupelo.get("name").then(setName);
    tupelo.tree.id().then(setDid);
  }, [tupelo]);

  return (
    <Box>
      <Box>
        <Form onSubmit={onSubmit}>
          <FormField label="Display Name">
            <TextInput value={name} onChange={e => setName(e.target.value)} />
          </FormField>
          <Button type="submit" label="Submit" />
        </Form>
      </Box>

      <Box>Your DID is: {did}</Box>
    </Box>
  );
}

export default Settings;
