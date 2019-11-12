import {CHECKED, UNCHECKED, ROOT_TO_SOURCE, SOURCE_SUB_TREE} from "../actions/constants";

/**
 * Updates path from tree root to source
 * and then updates source children.
 * Works recursively.
 *
 * @param node
 * @param pathFromRootToSource
 * @param sourceIsLeaf
 * @param checkedValue
 * @param sourceLeavesNumber
 * @param sourceCheckedLeavesNumber
 * @returns {(void|undefined)|void}
 */
function updatePathWithChecked(node, pathFromRootToSource,sourceIsLeaf, checkedValue,
                               sourceLeavesNumber, sourceCheckedLeavesNumber)
{
    if ( node.name === pathFromRootToSource[0]) {
        // counterDiff is sourceLeavesNumber,
        // as node is in path from root to source of click, including.
        updateNodeWithCheckedValue(node,checkedValue,sourceIsLeaf,
            sourceLeavesNumber,ROOT_TO_SOURCE, sourceCheckedLeavesNumber);
        pathFromRootToSource.shift();
    }

    // path to source finished, update source children.
    if ( pathFromRootToSource.length === 0 ) {
        return updateNodeTreeListWithChecked(node.children, checkedValue, sourceCheckedLeavesNumber);
    }
    else {
        // walks through path to source
        let nextChildInPath = node.children.find( (child) => child.name === pathFromRootToSource[0]);
        if ( nextChildInPath !== undefined ) {
            return updatePathWithChecked(nextChildInPath, pathFromRootToSource,sourceIsLeaf, checkedValue,
                sourceLeavesNumber,sourceCheckedLeavesNumber);
        }
    }
}

/**
 * Updates source children.
 * @param treesList
 * @param checkedValue
 * @param sourceCheckedLeavesNumber
 */
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
            }
            else {
                // node in the source of checked click subtree
                node.checkCounter += node.leavesNumber;
            }
            node.checked = checkedValue;
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

/**
 * Initializes tree node to prepare for redux logic.
 * @param node
 */
function initTreeNode(node) {
    node.checkCounter = 0;
    node.checked = UNCHECKED;
}

/**
 * Mutates redux state to send to subscribers.
 *
 * @param treeArray
 * @returns {*}
 */
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
    mutateTreeList};
