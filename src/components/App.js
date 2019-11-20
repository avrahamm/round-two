import React from 'react';
import {connect} from 'react-redux';

import Filter from "./Filter";
import {initTreesArray} from '../data/hepler';
import TreesContainer from "./TreesContainer";

import treesList from '../data/list3';

class App extends React.Component
{
  componentDidMount()
  {
    initTreesArray(treesList);
    this.props.dispatch({type: 'INIT_TREES', treesList: treesList});
  }

  render()
  {
    return <React.Fragment>
      <Filter />
      <TreesContainer />
    </React.Fragment>;
  }
}

export default connect()(App);
