import React from "react";
import { toODataString } from "@progress/kendo-data-query";
import LoadingPanel from "./LoadingPanel";

export class DataLoader extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.url = this.props.url;
    this.refresh = this.refresh.bind(this);
  }

  async getData(url) {
    let helper = this.core.make("oxzion/restClient");
    let data = await helper.request(
      "v1",
      "/" + url + "?" + "filter=[" + JSON.stringify(this.props.dataState) + "]",
      {},
      "get"
    );
    return data;
  }

  refresh = temp => {
    this.getData(this.url).then(response => {
      this.props.onDataRecieved({
        data: response.data,
        total: response.total
      });
    });
  };

  requestDataIfNeeded = () => {
    if (
      this.pending ||
      toODataString(this.props.dataState) === this.lastSuccess
    ) {
      return;
    }
    this.pending = toODataString(this.props.dataState, this.props.dataState);
    setTimeout(() => {
      this.getData(this.url).then(response => {
        this.lastSuccess = this.pending;
        this.pending = "";
        if (toODataString(this.props.dataState) === this.lastSuccess) {
          this.props.onDataRecieved.call(undefined, {
            data: response.data,
            total: response.total
          });
        } else {
          this.requestDataIfNeeded();
        }
      });
    }, 500);
  };

  render() {
    this.requestDataIfNeeded();
    return this.pending && <LoadingPanel />;
  }
}
export default DataLoader;
