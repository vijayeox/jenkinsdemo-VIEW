import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import {name as applicationName} from './metadata.json';

class DataSource extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  render() {
    return(
        <div class="data-source full-height">
            Data source
        </div>
    );
  }
}
export default DataSource;

