import React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";
import { GetData } from "../components/apiCalls";

import withValueField from "../dialog/withValueField";
const DropDownListWithValueField = withValueField(DropDownList);

export class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.masterUserList = [];
    this.state = {
      mainList: []
    };
  }

  componentWillMount() {
    if (typeof this.props.rawData == "object") {
      this.setState({
        mainList: this.props.rawData
      });
      this.masterUserList = this.props.rawData;
    } else {
      let loader = this.core.make("oxzion/splash");
      loader.show();
      GetData(this.props.mainList).then(response => {
        var tempUsers = [];
        for (var i = 0; i <= response.data.length - 1; i++) {
          var userName = response.data[i].name;
          var userid = response.data[i].id;
          tempUsers.push({ id: userid, name: userName });
        }
        this.setState({
          mainList: tempUsers
        });
        this.masterUserList = tempUsers;
        let loader = this.core.make("oxzion/splash");
        loader.destroy();
      });
    }
  }

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
    return (
      <div>
        {this.props.rawData ? (
          <DropDownList
            data={this.state.mainList}
            value={this.props.selectedItem}
            onChange={this.props.onDataChange}
            filterable={true}
            onFilterChange={this.filterChange}
            style={{ width: "210px" }}
            popupSettings={{ height: "160px" }}
            required={this.props.required}
          />
        ) : (
          <DropDownListWithValueField
            data={this.state.mainList}
            textField={"name"}
            valueField={"id"}
            value={this.props.selectedItem}
            onChange={this.props.onDataChange}
            filterable={true}
            onFilterChange={this.filterChange}
            style={{ width: "210px" }}
            popupSettings={{ height: "160px" }}
            required={this.props.required}
          />
        )}
      </div>
    );
  }
}
