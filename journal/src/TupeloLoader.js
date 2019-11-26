import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tupelo, { usernameToDid } from "./tupelo.js";

function TupeloLoader(props) {
  const { username } = useParams();
  const [tupelo, setTupelo] = useState();

  useEffect(() => {
    async function loadTupelo() {
      const did = await usernameToDid(username);
      console.log(did);
      if (did) {
        Tupelo.fromDID(did).then(setTupelo);
      } else {
        Tupelo.fromKey().then(setTupelo);
      }
    }
    loadTupelo();
  }, [username]);

  let elements = React.Children.toArray(props.children).map(child =>
    React.cloneElement(child, { tupelo })
  );

  if (tupelo === undefined) {
    return <p>Loading ChainTree, please wait...</p>;
  }
  return elements;
}

export default TupeloLoader;
