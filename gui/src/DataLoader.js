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

  async getData(url, filters) {
    console.log(filters);
    let helper = this.core.make("oxzion/restClient");
    let data = await helper.request(
      "v1",
      "/" + url + "?pg=1&psz=1000&sort=" + filters.sort[0].field,
      {},
      "get"
    );
    return data;
  }

  refresh = temp => {
    if (temp == "group" || temp == "announcement" || temp == "project") {
      this.getData(this.url, this.props.dataState).then(response => {
        this.props.onDataRecieved(response.data);
      });
    } else {
      this.getData(this.url, this.props.dataState).then(response => {
        this.props.onDataRecieved(response.data.data);
      });
    }
  };

  requestDataIfNeeded = () => {
    if (
      this.pending ||
      toODataString(this.props.dataState) === this.lastSuccess
    ) {
      return;
    }
    this.pending = toODataString(this.props.dataState, this.props.dataState);
    if (this.url == "group" || this.url == "announcement/a") {
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
      this.getData(this.url, this.props.dataState).then(response => {
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
