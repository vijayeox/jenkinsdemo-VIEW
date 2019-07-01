import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import {name as applicationName} from './metadata.json';

class Visualization extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  render() {
    return(
        <div class="visualization full-height">
            Visualization
        </div>
    );
  }
}
export default Visualization;

