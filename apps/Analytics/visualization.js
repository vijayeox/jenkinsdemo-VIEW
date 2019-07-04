import React from "react";
import ReactDOM from "react-dom";
import {visualization as section} from './metadata.json';

class Visualization extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

    this.props.setTitle(section.title.en_EN);
  }

  render() {
    return(
        <div className="visualization full-height">
            Visualization
        </div>
    );
  }
}
export default Visualization;

