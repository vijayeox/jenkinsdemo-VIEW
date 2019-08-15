import React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";
import { GetDataSearch } from "../components/apiCalls";
import withValueField from "../dialog/withValueField";
const DropDownListWithValueField = withValueField(DropDownList);

export default class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.masterUserList = [];
    this.state = {
      mainList: [],
      selectedEntityType: this.props.selectedEntityType || "object"
    };
    //can remove selectedEntityType if this works
    // selectedItem={{
    //           id: "111",
    //           name: "Switch Organization"
    //         }}
    this.timeout = null;
  }

  componentWillMount() {
    if (typeof this.props.rawData == "object") {
      this.setState({
        mainList: this.props.rawData
      });
      this.masterUserList = this.props.rawData;
    }
  }

  getMainList = (query, size) => {
    GetDataSearch(this.props.mainList, query, size).then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName = response.data[i].name;
        var userid = response.data[i].uuid;
        tempUsers.push({ id: userid, name: userName });
      }
      this.setState({
        selectedEntityType: "object",
        mainList: tempUsers
      });
    });
  };

  filterChangeAPI = e => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getMainList(e.filter.value, 20);
    }, 1000);
  };

  filterChange = event => {
    this.setState({
      mainList: this.filterData(event.filter)
    });
  };

  filterData(filter) {
    const data = this.masterUserList.slice();
    return filterBy(data, filter);
  }

  render() {
    this.props.disableItem ? (this.inputProps = { opened: false }) : [];
    return (
      <div>
        {this.props.rawData ? (
          <DropDownList
            data={this.state.mainList}
            {...this.inputProps}
            value={this.props.selectedItem}
            onChange={this.props.onDataChange}
            filterable={true}
            onFilterChange={this.filterChange}
            style={{ width: this.props.width ? this.props.width : "100%" }}
            popupSettings={{ height: "160px" }}
            required={this.props.required}
          />
        ) : (
          <DropDownListWithValueField
            data={this.state.mainList}
            {...this.inputProps}
            textField={"name"}
            valueField={"id"}
            // textField={
            //   this.state.selectedEntityType == "object" ? "name" : undefined
            // }
            // valueField={
            //   this.state.selectedEntityType == "object" ? "id" : undefined
            // }
            value={this.props.selectedItem}
            onChange={this.props.onDataChange}
            filterable={true}
            onFilterChange={this.filterChangeAPI}
            style={{ width: "100%" }}
            popupSettings={{ height: "160px" }}
            required={this.props.required}
          />
        )}
      </div>
    );
  }
}
