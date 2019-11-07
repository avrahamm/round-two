export default function checkedNodes(state={treesList:[]}, action)
{
    switch (action.type) {
        case 'INIT_TREES': {
            state = {...state,treesList:action.treesList};
            return state;
        }

        // {type:'CHANGE_CHECK', pathFromRoot:pathFromRoot }
        case 'CHANGE_CHECK': {
            state = {...state};
            let pathFromRoot = action.pathFromRoot;
            let rootName = pathFromRoot[0];
            let tree = state.treesList.find( (tree) =>
            {
                return tree.name === rootName ;
            });



            return state;
        }

        default: {
            return state;
        }
    }
}