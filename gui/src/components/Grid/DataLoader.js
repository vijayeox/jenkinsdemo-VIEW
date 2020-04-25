import React from "react";
import { toODataString } from "@progress/kendo-data-query";
import moment from "moment";
import Notification from "./../../Notification";

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
    this.loader = this.core.make("oxzion/splash");

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
        this.loader.destroy()
      });
    }
  }

  async getData(url) {
    if (typeof this.core == "undefined") {
      let response = await fetch(url, this.init);
      let json = await response.json();
      if(json.status == 'success'){
        let data = { data: json.value, total: json["@odata.count"] };
        return data;
      } else {
        let data = { data: [], total: 0 };
        return data;
      }
    } else {
      let helper = this.core.make("oxzion/restClient");
      let paramSeperator =
        url !== undefined ? (url.includes("?") ? "&" : "?") : "&";
      if (Object.keys(this.props.dataState).length === 0) {
        var route = url;
      } else {
        var filterConfig = this.props.columnConfig
          ? this.prepareQueryFilters(this.props.dataState)
          : this.props.dataState;
        var route =
          url +
          paramSeperator +
          "filter=[" +
          JSON.stringify(filterConfig) +
          "]";
      }

      let data = await helper.request("v1", "/" + route, {}, "get");
      if(data.status == "success"){
        return data;
      } else {
        return { data: [], total: 0 };
      }
    }
  }

  prepareQueryFilters = filterConfig => {
    var gridConfig = JSON.parse(JSON.stringify(filterConfig));
    if (this.props.forceDefaultFilters) {
      try {
        if (gridConfig.sort.length == 0 || gridConfig.sort == null) {
          gridConfig.sort = this.props.gridDefaultFilters.sort
            ? this.props.gridDefaultFilters.sort
            : gridConfig.sort;
        }
      } catch {}
    }
    this.props.columnConfig.map(ColumnItem => {
      if (ColumnItem.filterFormat && gridConfig.filter) {
        gridConfig.filter.filters.map((filterItem1, i) => {
          if (filterItem1.field == ColumnItem.field) {
            var result = moment(filterItem1.value).format(
              ColumnItem.filterFormat
            );
            if (filterItem1.value && result != "Invalid date") {
              gridConfig.filter.filters[i].value = result;
            }
          }
        });
      }
      if (ColumnItem.multiFieldFilter && gridConfig.filter) {
        gridConfig.filter.filters.map((filterItem2, i) => {
          if (filterItem2.field == ColumnItem.field) {
            ColumnItem.multiFieldFilter.map(multiFieldItem => {
              let newFilter = JSON.parse(JSON.stringify(filterItem2));
              newFilter.field = multiFieldItem;
              gridConfig.filter.filters.push(newFilter);
            });
            gridConfig.filter.logic = "or";
          }
        });
      }
    });
    console.log(gridConfig);
    return gridConfig;
  };

  refresh = temp => {
    this.getData(this.state.url).then(response => {
      this.props.onDataRecieved({
        data: response.data,
        total: response.total
      });
      this.loader.destroy()
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
    // if(typeof this.timeout === 'number'){
    //   window.clearTimeout(this.timeout);      
    // }
    // this.timeout = window.setTimeout(() => {
      this.getData(this.state.url).then(response => {
        this.lastSuccess = this.pending;
        this.pending = "";
        if (toODataString(this.props.dataState) === this.lastSuccess) {
          this.props.onDataRecieved.call(undefined, {
            data: response.data,
            total: response.total ? response.total : null
          });
         this.loader.destroy()
        } else {
          this.requestDataIfNeeded();
        }
      });
    // }, 2000);
  };

  render() {
    this.requestDataIfNeeded();
    return <>{this.pending && this.loader.showGrid()}</>;
  }
}
export default DataLoader;
