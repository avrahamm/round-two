import React from 'react';
import {connect} from 'react-redux';

import Tree from "./Tree";

class TreesContainer extends React.Component
{
  render() {
    const trees = this.props.treesList.map( (tree, index) =>
    {
      return <Tree
          key={index}
          tree={tree}
          parents={[]}
      />
    });

    return(
        <div className="node">
          {trees}
        </div>
    );
  }
}

const mapStateToProps = (state) =>
{
  return {treesList: state.treesList};
};

export default connect(mapStateToProps)(TreesContainer);
