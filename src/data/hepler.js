import {CHECKED, UNCHECKED, ROOT_TO_SOURCE, SOURCE_SUB_TREE, VISIBLE, HIDDEN} from "../actions/constants";

/**
 * Updates path from tree root to source
 * and then updates source children.
 * Works recursively.
 *
 * @param node
 * @param pathFromRootToSource
 * @param checkedValue
 * @param sourceLeavesNumber
 * @param sourceCheckedLeavesNumber
 * @param filter
 * @returns {(void|undefined)|void}
 */
function updatePathWithChecked(node, pathFromRootToSource, checkedValue,
                               sourceLeavesNumber, sourceCheckedLeavesNumber,
                               filter)
{
    if ( node.name === pathFromRootToSource[0]) {
        // counterDiff is sourceLeavesNumber,
        // as node is in path from root to source of click, including.
        updateNodeWithCheckedValue(node,checkedValue,
            sourceLeavesNumber,ROOT_TO_SOURCE, sourceCheckedLeavesNumber, filter);
        pathFromRootToSource.shift();
    }

    // path to source finished, update source children.
    if ( pathFromRootToSource.length === 0 ) {
        return updateNodeTreeListWithChecked(node.children, checkedValue,
            sourceCheckedLeavesNumber, filter);
    }
    else {
        // walks through path to source
        let nextChildInPath = node.children.find( (child) => child.name === pathFromRootToSource[0]);
        if ( nextChildInPath !== undefined ) {
            return updatePathWithChecked(nextChildInPath, pathFromRootToSource, checkedValue,
                sourceLeavesNumber,sourceCheckedLeavesNumber, filter);
        }
    }
}

/**
 * Updates source children.
 * @param treesList
 * @param checkedValue
 * @param sourceCheckedLeavesNumber
 * @param filter
 */
function updateNodeTreeListWithChecked(treesList, checkedValue, sourceCheckedLeavesNumber, filter)
{
    if (Array.isArray(treesList)) {
        treesList.forEach( (node) =>
        {
            // node.leavesNumber as node is in path from source of click, not including, to leaf.
            updateNodeWithCheckedValue(node,checkedValue,node.leavesNumber,
                SOURCE_SUB_TREE, sourceCheckedLeavesNumber, filter);
            if ( Array.isArray(node.children) ) {
                updateNodeTreeListWithChecked(node.children, checkedValue,
                    sourceCheckedLeavesNumber, filter);
            }
        })
    }
}

/**
 * Updates node with checked value and updates visibility status.
 * @param node
 * @param checkedValue
 * @param counterDiff
 * @param partOfPath
 * @param sourceCheckedLeavesNumber
 * @param filter
 */
function updateNodeWithCheckedValue(node, checkedValue, counterDiff=0,
                                    partOfPath, sourceCheckedLeavesNumber, filter)
{
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
        }
        else {
            // node in the source of checked click subtree
            node.checkCounter = 0;
        }
        if (node.checkCounter === 0 ) {
            node.checked = checkedValue;
            if ( filter !== '') {
                node.display = HIDDEN;
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
    node.display = VISIBLE;
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

function filterVisibleNodes(treeArray, filter)
{
    let treeArrayDisplay = false;

    treeArray.forEach( tree =>
    {
        tree.display = false;

        if( filter === '' ) {
            tree.display = true;
        }
        else if( tree.checkCounter <= 0) {
            tree.display = false;
        }
        else if( tree.checkCounter > 0) {
            tree.display = tree.name.includes(filter);
        }
        if( !Array.isArray(tree.children)) { // leaf node
            treeArrayDisplay = treeArrayDisplay || tree.display;
        }
        else {
            let childrenDisplay = filterVisibleNodes(tree.children, filter);
            tree.display = tree.display || childrenDisplay;
            treeArrayDisplay = treeArrayDisplay || tree.display;
        }
    });
    return treeArrayDisplay;
}

export { updateNodeTreeListWithChecked, updatePathWithChecked,
    updateNodeWithCheckedValue, initTreesArray,
    mutateTreeList, filterVisibleNodes};
