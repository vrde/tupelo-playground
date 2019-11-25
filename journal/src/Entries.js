import React, { useState, useEffect } from "react";
import { Box } from "grommet";
import Day from "./Day";

function Entries({ tupelo }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function getEntries() {
      const [today] = new Date().toISOString().split("T");
      let entries = Object.keys(await tupelo.get("entries", {}));
      entries.sort();
      entries.reverse();
      if (!entries.includes(today)) {
        entries = [today, ...entries];
      }
      setEntries(entries);
    }
    getEntries();
  }, [tupelo]);

  return (
    <Box>
      {entries.map(entry => (
        <Day
          key={entry}
          tupelo={tupelo}
          date={entry}
          path={["entries", entry].join("/")}
        />
      ))}
    </Box>
  );
}

export default Entries;
