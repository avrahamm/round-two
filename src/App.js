import React, { useState } from 'react';
import Node from "./components/Node";
import list from './list';

const App = () => {
  const [filter, setFilter] = useState("");
  const [checkedNodes, setCheckedNodes] = useState([]);

  return (
    <React.Fragment>
      <input type="text"
             placeholder="filter"
             value={filter}
             onChange={(event) => setFilter(event.target.value)}/>

      {list.map((node) => (
        <Node key={node.name}
              node={node}
              filter={filter}
              setCheckedNodes={setCheckedNodes}
              checkedNodes={checkedNodes}/>
      ))}
    </React.Fragment>
  );
};

export default App;
