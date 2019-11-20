import React from 'react';
import {connect} from "react-redux";

class Filter extends React.Component
{
    render()
    {
       return <input
           placeholder="filter" type="text"
           onChange={ event => this.props.dispatch({type:'FILTER', filter: event.target.value })}
       />;
    }
}

export default connect()(Filter);