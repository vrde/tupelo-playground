import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Form,
  Icons,
  FormField,
  TextInput,
  Paragraph
} from "grommet";
import Tupelo, { login } from "./tupelo.js";

function Login({ onLogin }) {
  const history = useHistory();
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit() {
    let key;
    try {
      key = await login(username, password);
      await onLogin(key);
      history.replace("/");
    } catch (e) {
      console.log("error", e);
      if (e.toString() !== "wrong password") {
        throw e;
      }
      setIsWrongPassword(true);
      setPassword("");
    }
  }

  return (
    <Box pad="large">
      {isWrongPassword && (
        <Box background="status-error" align="center">
          <Paragraph>Wrong Password</Paragraph>
        </Box>
      )}
      <Form onSubmit={onSubmit}>
        <FormField label="Username">
          <TextInput
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormField>
        <FormField label="Password">
          <TextInput
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormField>
        <Button type="submit" label="Login" />
      </Form>
    </Box>
  );
}

export default Login;
