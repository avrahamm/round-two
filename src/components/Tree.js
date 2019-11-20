import React from 'react';
import {connect} from 'react-redux';
import {HIDDEN} from "../actions/constants";

class Tree extends React.Component
{
  render()
  {
      if ( this.props.tree.display === HIDDEN ) {
          return '';
      }

    console.log(this.props);
    let childrenTree='';
    let children = this.props.tree.children;
    let parentsForChildren = this.props.parents.slice();
    parentsForChildren.push(this.props.tree.name);
    if ( children !== undefined && children.length) {
      childrenTree = children.map( ( childTree, index) =>
      {
        return <Tree
            key={index}
            tree={childTree}
            parents={parentsForChildren}
            dispatch={this.props.dispatch}
        />
      });

      childrenTree = <div className="children">
        {childrenTree}
      </div>;
    }

    return <div className="node">
      <input type="checkbox"
             checked={this.props.tree.checked}

             onChange={event => {
                 this.props.dispatch({
                     type: 'CHANGE_CHECK',
                     pathFromRoot: parentsForChildren,
                     children: this.props.tree.children,
                     sourceLeavesNumber: this.props.tree.leavesNumber,
                     sourceCheckedLeavesNumber: this.props.tree.checkCounter,
                     checkedValue: event.target.checked
                 })
                }
             }
      />
      <span>{this.props.tree.name}</span>
      {childrenTree}
    </div>;
  }
}

export default connect()(Tree);
