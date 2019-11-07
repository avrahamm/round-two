import React from 'react';
import {connect} from 'react-redux';

class Tree extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      name: this.props.tree.name,
      checked: this.props.tree.checked,

      parents: this.props.parents,
      children: this.props.tree.children
    };
  }

  static deriveStateFromProps(props, state, prevProps)   {
    return {
      checked: props.tree.checked
    };
  }

  render()
  {
    console.log(this.props);
    let childrenTree='';
    let children = this.props.tree.children;
    let childrenParents = this.state.parents.slice();
    childrenParents.push(this.state.name);
    if ( children !== undefined && children.length) {
      childrenTree = children.map( ( childTree, index) =>
      {
        return <Tree
            key={index}
            tree={childTree}
            parents={childrenParents}
            dispatch={this.props.dispatch}
        />
      });

      childrenTree = <div className="children">
        {childrenTree}
      </div>;
    }

    return <div className="node">
      <input type="checkbox"
             checked={this.state.checked}

             onChange={ event =>
               {
                 let pathFromRoot = childrenParents;
                 this.props.dispatch({type:'CHANGE_CHECK', pathFromRoot:pathFromRoot })
               }
             }
      />
      <span>{this.state.name}</span>
      {childrenTree}
    </div>;
  }
}

export default connect()(Tree);
