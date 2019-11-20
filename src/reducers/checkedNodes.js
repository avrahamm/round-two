import {updatePathWithChecked,mutateTreeList, filterVisibleNodes} from '../data/hepler';

export default function checkedNodes(state={treesList:[], filter:''}, action)
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
            const filter = state.filter;

            const tree = state.treesList.find( (tree) =>
            {
                return tree.name === rootName;
            });

            updatePathWithChecked(tree,pathFromRoot,action.checkedValue,
                sourceLeavesNumber,sourceCheckedLeavesNumber, filter);
            state.treesList = mutateTreeList(state.treesList);
            return {...state};
        }

        case 'FILTER': {
            const filter = action.filter;
            state.treesList = mutateTreeList(state.treesList);
            filterVisibleNodes(state.treesList, filter);
            return {...state, filter:filter};
        }

        default: {
            return state;
        }
    }
}