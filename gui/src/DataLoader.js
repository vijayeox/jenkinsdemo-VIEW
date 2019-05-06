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
    let data = await helper.request("v1", "/" + this.url, {}, "get");
    return data;
  }

  refresh = () => {
    this.getData(this.url).then(response => {
      this.props.onDataRecieved(response.data.data);
    });
  };

  requestDataIfNeeded = () => {
    if (
      this.pending ||
      toODataString(this.props.dataState) === this.lastSuccess
    ) {
      return;
    }
    this.pending = toODataString(this.props.dataState);
    if (this.url == "group") {
      this.getData(this.url).then(response => {
        this.lastSuccess = this.pending;
        this.pending = "";
        if (toODataString(this.props.dataState) === this.lastSuccess) {
          this.props.onDataRecieved.call(undefined, {
            data: response.data,
            total: response.data.length
          });
        } else {
          this.requestDataIfNeeded();
        }
      });
    } else {
      this.getData(this.url).then(response => {
        this.lastSuccess = this.pending;
        this.pending = "";
        if (toODataString(this.props.dataState) === this.lastSuccess) {
          this.props.onDataRecieved.call(undefined, {
            data: response.data.data,
            total: response.data.data.length
          });
        } else {
          this.requestDataIfNeeded();
        }
      });
    }
  };

  render() {
    this.requestDataIfNeeded();
    return this.pending && <LoadingPanel />;
  }
}
export default DataLoader;
