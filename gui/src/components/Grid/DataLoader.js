import React from "react";
import { toODataString } from "@progress/kendo-data-query";
import moment from "moment";
import Notification from "./../../Notification";
import LoadingPanel from "./LoadingPanel";

export class DataLoader extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.refresh = this.refresh.bind(this);
    this.state = {
      url: this.props.url
    };
    this.init = { method: "GET", accept: "application/json", headers: {} };
    this.timeout = null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.setState({
        url: this.props.url
      });
      this.getData(this.props.url).then(response => {
        if (typeof response == "object" && response.status == "success") {
          this.props.onDataRecieved({
            data: response.data,
            total: response.total
          });
        } else {
          //put notification

          this.pending = undefined;
        }
      });
    }
  }

  async getData(url) {
    if (typeof this.core == "undefined") {
      let response = await fetch(url, this.init);
      let json = await response.json();
      let data = { data: json.value, total: json["@odata.count"] };
      return data;
    } else {
      let helper = this.core.make("oxzion/restClient");
      let paramSeperator =
        url !== undefined ? (url.includes("?") ? "&" : "?") : "&";
      if (Object.keys(this.props.dataState).length === 0) {
        var route = url;
      } else {
        var filterConfig = this.prepareQueryFilters(this.props.dataState);
        var route =
          url +
          paramSeperator +
          "filter=[" +
          JSON.stringify(filterConfig) +
          "]";
      }
      let data = await helper.request("v1", "/" + route, {}, "get");
      return data;
    }
  }

  prepareQueryFilters = filterConfig => {
    var gridConfig = JSON.parse(JSON.stringify(filterConfig));
    this.props.columnConfig.map(ColumnItem => {
      if (ColumnItem.filterFormat && gridConfig.filter) {
        gridConfig.filter.filters.map((filterItem, i) => {
          if (filterItem.field == ColumnItem.field) {
            var result = moment(gridConfig.filter.filters[i].value).format(
              ColumnItem.filterFormat
            );
            if (
              gridConfig.filter.filters[i].value &&
              result != "Invalid date"
            ) {
              gridConfig.filter.filters[i].value = result;
            }
          }
        });
      }
    });
    return gridConfig;
  };

  refresh = temp => {
    this.getData(this.state.url).then(response => {
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
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getData(this.state.url).then(response => {
        this.lastSuccess = this.pending;
        this.pending = "";
        if (toODataString(this.props.dataState) === this.lastSuccess) {
          this.props.onDataRecieved.call(undefined, {
            data: response.data,
            total: response.total ? response.total : null
          });
        } else {
          this.requestDataIfNeeded();
        }
      });
    }, 1000);
  };

  render() {
    this.requestDataIfNeeded();
    return (
      <>
        <Notification ref={this.notif} />
        {this.pending && <LoadingPanel />}
      </>
    );
  }
}
export default DataLoader;
