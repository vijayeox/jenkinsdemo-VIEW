import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import {name as applicationName} from './metadata.json';

class Query extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  render() {
    return(
        <div class="query full-height">
            Query
        </div>
    );
  }
}
export default Query;

