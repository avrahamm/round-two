
export const matchesFilter = (node, query, checkedNodes) => {
  const matches = node.name.toLowerCase().includes(query.toLowerCase());

  if (matches && checkedNodes.includes(node)) {
    return true;
  }

  if (!node.children) {
    return false;
  }

  return node.children
    .some((child) => matchesFilter(child, query, checkedNodes));
};

export const addToArray = (array, valuesToAdd) =>
  Array.from(new Set([...array, ...valuesToAdd]));

export const removeFromArray = (array, valuesToRemove) =>
  array.filter(value => !valuesToRemove.includes(value));

export const existsInArray = (array, valuesToCheck) =>
  valuesToCheck && array.some(value => valuesToCheck.includes(value));
