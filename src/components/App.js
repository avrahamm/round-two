import React from 'react';
import {connect} from 'react-redux';

import TreesContainer from "./TreesContainer";

import treesList from '../data/list1';

class App extends React.Component
{
  componentDidMount()
  {
    let treeListWithChecked = this.getTreeListWithChecked(treesList);
    this.props.dispatch({type: 'INIT_TREES', treesList: treeListWithChecked});
  }

  getTreeListWithChecked(treesList)
  {
    treesList.forEach( ( tree, index) =>
    {
      tree.checked = true;
      if ( Array.isArray(tree.children) ) {
        this.getTreeListWithChecked(tree.children);
      }
    })
    return treesList;
  }

  render()
  {
    return <React.Fragment>
      <TreesContainer />
    </React.Fragment>;
  }
}

export default connect()(App);
