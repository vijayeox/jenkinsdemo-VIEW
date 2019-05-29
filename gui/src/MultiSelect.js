import React from "react";
import { GetDataSearch, ExistingUsers } from "./components/apiCalls";
import {
  MultiSelectComponent,
  CheckBoxSelection,
  Inject
} from "@syncfusion/ej2-react-dropdowns";
import { FaArrowCircleRight, FaInfoCircle } from "react-icons/fa";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import "./public/css/syncfusion.css";

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      userList: [],
      selectedUsers: []
    };
    this.captureSelectedUsers = this.captureSelectedUsers.bind(this);
    this.checkFields = { text: "userName", value: "userid" };
  }

  componentDidMount() {
    let loader = this.core.make("oxzion/splash");
    loader.show();

    ExistingUsers(this.props.config.subList, this.props.config.dataItem).then(
      response => {
        var ExistingUsers = [];
        for (var i = 0; i <= response.data.length - 1; i++) {
          var userid = response.data[i].id;
          ExistingUsers.push(userid);
        }
        this.setState({
          selectedUsers: ExistingUsers
        });
      }
    );
    this.getMainList("", 20);
  }

  getMainList = (query, size) => {
    GetDataSearch("user", query, size).then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName =
          response.data[i].firstname + " " + response.data[i].lastname;
        var userid = response.data[i].id;
        tempUsers.push({ userid: userid, userName: userName });
      }
      this.setState({
        userList: tempUsers
      });

      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });
  };

  filterData = e => {
    this.getMainList(e.text, 20);
    e.updateData();
  };

  captureSelectedUsers(e) {
    this.setState({
      selectedUsers: e.value
    });
  }

  closePopup = () => {
    this.getMainList("", 1000);
  };

  render() {
    return (
      <Dialog
        title={"Add Users to the Organization"}
        onClose={this.props.manage.toggleDialog}
      >
        <div>
          <div className="justify-content-center col-12">
            <div style={{ margin: "auto", width: "85%", paddingTop: "15px" }}>
              <MultiSelectComponent
                id="checkbox"
                dataSource={this.state.userList}
                value={this.state.selectedUsers}
                filtering={this.filterData.bind(this)}
                allowFiltering={true}
                change={this.captureSelectedUsers}
                sortOrder="Ascending"
                text="name"
                close={this.closePopup}
                fields={this.checkFields}
                mode="CheckBox"
                placeholder="Click to add Users"
                showDropDownIcon={true}
                filterBarPlaceholder="Search Users"
                popupHeight="350px"
              >
                <Inject services={[CheckBoxSelection]} />
              </MultiSelectComponent>
            </div>
          </div>
        </div>
        <div
          style={{
            height: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ul className="list-group" style={{ listStyle: "disc" }}>
            <div
              href="#"
              className="list-group-item list-group-item-action active"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ fontSize: "medium" }}>Please Note:</div>
              <div style={{ marginLeft: "auto" }}>
                <FaInfoCircle />
              </div>
            </div>
            <li
              className="list-group-item"
              style={{ display: "flex", alignItems: "center" }}
            >
              <FaArrowCircleRight /> &nbsp; &nbsp; Initially the list displays
              only the first 20 users.
            </li>
            <li
              className="list-group-item"
              style={{ display: "flex", alignItems: "center" }}
            >
              <FaArrowCircleRight /> &nbsp; &nbsp; Please use the search filter
              to find other users.
            </li>
          </ul>
        </div>
        <DialogActionsBar>
          <button
            className="k-button k-primary"
            onClick={() =>
              this.props.manage.postSelected(this.state.selectedUsers)
            }
          >
            Save
          </button>
          <button className="k-button" onClick={this.props.manage.closeDialog}>
            Cancel
          </button>
        </DialogActionsBar>
      </Dialog>
    );
  }
}

export default MultiSelect;
