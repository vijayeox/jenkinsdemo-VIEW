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

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  async getData(url, filters) {
    console.log(filters);
    if (this.isEmpty(filters.sort[0])) {
      this.sortValue = [];
    } else {
      this.sortValue = "&sort=" + filters.sort[0].field;
    }
    let helper = this.core.make("oxzion/restClient");
    let data = await helper.request(
      "v1",
      // "/" + url + "?" + filters,
      "/" + url + "?pg=1&psz=1000" + this.sortValue,
      {},
      "get"
    );
    return data;
  }

  refresh = temp => {
    this.getData(this.url, this.props.dataState).then(response => {
      this.props.onDataRecieved({
        data: response.data.data,
        total: response.data.data.length
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
    this.getData(this.url, this.props.dataState).then(response => {
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
    console.log(this.pending);
  };

  render() {
    this.requestDataIfNeeded();
    return this.pending && <LoadingPanel />;
  }
}
export default DataLoader;
