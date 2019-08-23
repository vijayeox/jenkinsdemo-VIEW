import React from 'react';
import ReactDOM from 'react-dom';
import {query as section} from './metadata.json';

class Query extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

    this.props.setTitle(section.title.en_EN);
  }

  render() {
    return(
        <div className="query full-height">
            Query
        </div>
    );
  }
}

export default Query;

