import React, { useState, useEffect } from "react";
import { Box, Button, Form, Icons, FormField, TextArea } from "grommet";
import { FormAdd } from "grommet-icons";
import db from "./db";

function NewPost({ onSubmit, value }) {
  const [post, setPost] = useState(value || db.get("post", ""));

  async function _onSubmit(e) {
    e.preventDefault();
    if (await onSubmit(post)) {
      return;
    }
    setPost("");
    db.set("post", "");
  }

  // It's pretty annoying if you wrote some text and accidentally close
  // the page.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      db.set("post", post);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [post]);

  return (
    <Box pad={{ bottom: "medium" }} margin={{ bottom: "medium" }}>
      <Form onSubmit={_onSubmit}>
        <TextArea
          fill
          placeholder="Describe your activity. You can use **Markdown**!"
          value={post}
          onChange={e => setPost(e.target.value)}
        />
        <Button icon={<FormAdd />} type="submit" label="Submit" />
      </Form>
    </Box>
  );
}

export default NewPost;
