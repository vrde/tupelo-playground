import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tupelo from "./tupelo.js";

function TupeloLoader(props) {
  const { did } = useParams();
  const [tupelo, setTupelo] = useState();

  useEffect(() => {
    if (did) {
      Tupelo.fromDID(did).then(setTupelo);
    } else {
      Tupelo.fromKey().then(setTupelo);
    }
  }, [did]);

  let elements = React.Children.toArray(props.children).map(child =>
    React.cloneElement(child, { tupelo })
  );

  if (tupelo === undefined) {
    return <p>Loading ChainTree, please wait...</p>;
  }
  return elements;
}

export default TupeloLoader;
