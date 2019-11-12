import {CHECKED, UNCHECKED, ROOT_TO_SOURCE, SOURCE_SUB_TREE} from "../actions/constants";

function updatePathWithChecked(node, pathFromRoot,sourceIsLeaf, checkedValue,
                               sourceLeavesNumber, sourceCheckedLeavesNumber)
{
    if ( node.name === pathFromRoot[0]) {
        // sourceLeavesNumber as node is in path from root to source of click, including.
        updateNodeWithCheckedValue(node,checkedValue,sourceIsLeaf,
            sourceLeavesNumber,ROOT_TO_SOURCE, sourceCheckedLeavesNumber);
        pathFromRoot.shift();
    }

    if ( pathFromRoot.length === 0 ) {
        return updateNodeTreeListWithChecked(node.children, checkedValue, sourceCheckedLeavesNumber);
    }
    else {
        let nextChildInPath = node.children.find( (child) => child.name === pathFromRoot[0]);
        if ( nextChildInPath !== undefined ) {
            return updatePathWithChecked(nextChildInPath, pathFromRoot,sourceIsLeaf, checkedValue,
                sourceLeavesNumber,sourceCheckedLeavesNumber);
        }
    }
}

function updateNodeTreeListWithChecked(treesList, checkedValue, sourceCheckedLeavesNumber)
{
    if (Array.isArray(treesList)) {
        treesList.forEach( (node) =>
        {
            // node.leavesNumber as node is in path from source of click, not including, to leaf.
            updateNodeWithCheckedValue(node,checkedValue,false,0,
                SOURCE_SUB_TREE, sourceCheckedLeavesNumber);
            if ( Array.isArray(node.children) ) {
                updateNodeTreeListWithChecked(node.children, checkedValue, sourceCheckedLeavesNumber);
            }
        })
    }
}

function updateNodeWithCheckedValue(node, checkedValue, sourceIsLeaf,
                                    counterDiff=0, partOfPath, sourceCheckedLeavesNumber)
{
    if (sourceIsLeaf) {
        if ( checkedValue === CHECKED ) {
            node.checkCounter++;
            node.checked = checkedValue;
        }
        else  if ( checkedValue === UNCHECKED ) {
            if( node.checkCounter > 0 ) {
                node.checkCounter--;
            }
            if (node.checkCounter === 0 ) {
                node.checked = checkedValue
            }
        }
    }
    else if( !sourceIsLeaf) {
        if ( checkedValue === CHECKED ) {
            if ( partOfPath === ROOT_TO_SOURCE) {
                // node in path from root to the source of checked click, adds sourceLeavesNumber
                node.checkCounter += counterDiff;
                node.checked = checkedValue;
            }
            else {
                // node in the source of checked click subtree
                node.checkCounter += node.leavesNumber;
                node.checked = checkedValue;
            }
        }
        else  if ( checkedValue === UNCHECKED ) {
            if ( partOfPath === ROOT_TO_SOURCE) {
                // node in path from root to the source of checked click,
                // subtracts sourceCheckedLeavesNumber
                if( node.checkCounter > 0 ) {
                    node.checkCounter -= sourceCheckedLeavesNumber;
                }
                if (node.checkCounter === 0 ) {
                    node.checked = checkedValue;
                }
            }
            else {
                // node in the source of checked click subtree
                node.checkCounter = 0;
                node.checked = checkedValue;
            }
        }
    }
}

/**
 * Inits fields and calculates leavesNumber for each tree node.
 * @param treesArray
 * @returns {number}
 */
function initTreesArray(treesArray)
{
    let treesArrayLeavesNumber = 0;
    treesArray.forEach( (treeNode) =>
    {
        initTreeNode(treeNode);
        if( !Array.isArray(treeNode.children) ) {
            treeNode.leavesNumber = 1;
        }
        else if ( Array.isArray(treeNode.children) ) {
            treeNode.leavesNumber = initTreesArray(treeNode.children);
        }
        treesArrayLeavesNumber += treeNode.leavesNumber;
    });
    return treesArrayLeavesNumber;
}

function initTreeNode(node) {
    // init
    node.checkCounter = 0;
    node.checked = UNCHECKED;
}

function getTreeCheckedLeaves(node)
{
    let checkedLeaves = 0;
    if ( !Array.isArray(node.children) ) {
        return node.checkCounter;
    }

    node.children.forEach( childTree =>
    {
        checkedLeaves += getTreeCheckedLeaves(childTree);
    })

    return checkedLeaves;
}

function mutateTreeList(treeArray)
{
    const mutatedTreeArray = treeArray.map(
        tree =>
    {
        if ( tree.children === undefined || (tree.children.length === 0) ) {
            return {...tree};
        }
        tree.children = mutateTreeList(tree.children);
        return {...tree};
    })

    return mutatedTreeArray;
}

export { updateNodeTreeListWithChecked, updatePathWithChecked,
    updateNodeWithCheckedValue, initTreesArray,
    getTreeCheckedLeaves, mutateTreeList};
