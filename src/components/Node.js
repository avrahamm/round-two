import React, { useState, useEffect } from 'react';
import { addToArray, existsInArray, matchesFilter, removeFromArray } from "../utils";

const Node = ({ node, filter, setCheckedNodes, checkedNodes, parentNode }) => {
  const [hasEnabledChildren, setEnabledChildren] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const checkNodes = (nodes) => setCheckedNodes((current) => addToArray(current, nodes));
  const uncheckNodes = (nodes) => setCheckedNodes((current) => removeFromArray(current, nodes));

  const setNode = (node, checked) => checked
    ? checkNodes([node])
    : uncheckNodes([node]);

  useEffect(() => {
    setEnabledChildren(existsInArray(checkedNodes, node.children));
    setIsChecked(checkedNodes.includes(node));
  });

  useEffect(() => {
    if (!hasEnabledChildren) {
      uncheckNodes([node]);
    }

    if (hasEnabledChildren && !isChecked) {
      checkNodes([node]);
    }
  }, [hasEnabledChildren]);

  useEffect(() => {
    if (!isChecked && node.children) {
      uncheckNodes(node.children);
    }

    if (isChecked && node.children && !hasEnabledChildren) {
      checkNodes(node.children);
    }
  }, [isChecked]);

  const matched = !filter || matchesFilter(node, filter, checkedNodes);
  const nodeStyle = { display: matched ? "block" : "none" };

  const renderChildren = node.children && (
    <div className="children">
      {node.children.map(node => (
        <Node key={node.name}
              node={node}
              filter={filter}
              setCheckedNodes={setCheckedNodes}
              parentNode={node}
              checkedNodes={checkedNodes}/>
      ))}
    </div>
  );

  return (
    <div className="node" style={nodeStyle}>
      <span>
        <input type="checkbox"
               checked={isChecked}
               onChange={(event) => setNode(node, event.target.checked)}/>
        &nbsp;{node.name}
      </span>

      {renderChildren}
    </div>
  );
};

export default Node;