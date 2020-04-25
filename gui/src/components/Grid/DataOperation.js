import React from "react";
import { toODataString } from "@progress/kendo-data-query";
import { process } from "@progress/kendo-data-query";

export class DataOperation extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.loader = this.core.make("oxzion/splash");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gridData !== this.props.gridData) {
      this.props.onDataRecieved.call(
        undefined,
        process(this.props.gridData, this.props.dataState)
      );      
    }
  }

  requestDataIfNeeded = () => {
    if (
      this.pending ||
      toODataString(this.props.dataState) === this.lastSuccess
    ) {
      return;
    }
    this.pending = toODataString(this.props.dataState, this.props.dataState);
    this.lastSuccess = this.pending;
    this.pending = "";
    if (toODataString(this.props.dataState) === this.lastSuccess) {
      this.props.onDataRecieved.call(
        undefined,
        process(this.props.gridData, this.props.dataState)
      );
    } else {
      this.requestDataIfNeeded();
    }
    this.loader.destroy();
  };

  render() {
    this.requestDataIfNeeded();
    return <>{this.pending && this.loader.showGrid()}</>;
  }
}
export default DataOperation;
