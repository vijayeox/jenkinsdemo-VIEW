import React from "react";
import { toODataString } from "@progress/kendo-data-query";
import { process } from "@progress/kendo-data-query";


export class DataOperation extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.loader = this.core.make("oxzion/splash");

    this.timeout = null;
  }

  requestDataIfNeeded = () => {
    if (
      this.pending ||
      toODataString(this.props.dataState) === this.lastSuccess
    ) {
      return;
    }
    this.pending = toODataString(this.props.dataState, this.props.dataState);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
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
    }, 500);
  };

  render() {
    this.requestDataIfNeeded();
    return <>{this.pending && this.loader.showGrid()}</>;
  }
}
export default DataOperation;
