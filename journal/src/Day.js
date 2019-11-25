import React, { useState, useEffect } from "react";
import { Box, Heading, Layer, Markdown, Menu } from "grommet";
import NewPost from "./NewPost";
import marked from "marked";
import DOMPurify from "dompurify";

function Day({ tupelo, date, path }) {
  const [edit, setEdit] = useState(false);
  const [posts, setPosts] = useState({});
  const [today] = new Date().toISOString().split("T");

  async function onSubmit(post, date, time) {
    const resp = await tupelo.set(["entries", date, time].join("/"), post);
    posts[time] = post;
    setPosts({ ...posts });
  }

  async function onSubmitNew(post) {
    const now = new Date().toISOString();
    let [date, time] = now.split("T");
    // Remove the Z timezone
    time = time.slice(0, -1);
    return onSubmit(post, date, time);
  }

  async function onSubmitEdit(post, time) {
    await onSubmit(post, date, time);
    setEdit("");
    return true;
  }

  async function onEdit(time) {
    setEdit(time);
  }

  async function onDelete(time) {
    const resp = await tupelo.set(["entries", date, time].join("/"), "");
    delete posts[time];
    setPosts({ ...posts });
  }

  useEffect(() => {
    async function getPosts() {
      const posts = await tupelo.get(path, {});
      setPosts(posts);
    }
    getPosts();
  }, [tupelo, path]);

  const sortedPosts = {};
  const keys = Object.keys(posts);
  keys.sort();
  keys.reverse();
  //                NOTHING TO SEE HERE PLEASE DISPERSE
  keys.forEach(k => posts[k] !== "" && (sortedPosts[k] = posts[k]));

  return (
    <Box>
      <Heading level={2}>{date}</Heading>
      {today === date && <NewPost onSubmit={onSubmitNew} />}
      {edit && (
        <Layer
          onEsc={() => setEdit(false)}
          onClickOutside={() => setEdit(false)}
        >
          <Box pad="large">
            <NewPost
              value={posts[edit]}
              onSubmit={post => onSubmitEdit(post, edit)}
            />
          </Box>
        </Layer>
      )}
      {Object.entries(sortedPosts).map(([time, post]) => (
        <Box
          fill
          border="left"
          pad={{ left: "small" }}
          margin="small"
          key={time}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked(post))
            }}
          />
          <Box>
            <Menu
              size="small"
              label="actions"
              items={[
                { label: "Edit", onClick: () => onEdit(time) },
                { label: "Delete", onClick: () => onDelete(time) }
              ]}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Day;
