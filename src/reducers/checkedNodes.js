import {updatePathWithChecked,mutateTreeList} from '../data/hepler';

export default function checkedNodes(state={treesList:[]}, action)
{
    switch (action.type) {
        case 'INIT_TREES': {
            state = {...state,treesList:action.treesList};
            return state;
        }

        // {type:'CHANGE_CHECK', pathFromRoot:pathFromRoot }
        case 'CHANGE_CHECK': {
            let pathFromRoot = action.pathFromRoot;
            let rootName = pathFromRoot[0];
            let sourceLeavesNumber = action.sourceLeavesNumber;
            let sourceCheckedLeavesNumber = action.sourceCheckedLeavesNumber;

            const tree = state.treesList.find( (tree) =>
            {
                return tree.name === rootName;
            });

            updatePathWithChecked(tree,pathFromRoot,action.sourceIsLeaf,action.checkedValue,
                sourceLeavesNumber,sourceCheckedLeavesNumber);
            tree.children = mutateTreeList(tree.children);
            state.treesList = [...state.treesList];
            return {...state};
        }

        default: {
            return state;
        }
    }
}