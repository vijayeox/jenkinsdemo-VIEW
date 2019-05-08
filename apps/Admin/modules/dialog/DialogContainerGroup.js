import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';
import TextareaAutosize from 'react-textarea-autosize';
import "@progress/kendo-ui";

import withValueField from './withValueField.js';
const DropDownListWithValueField = withValueField(DropDownList);

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.masterUserList = [];
    this.state = {
      usersList: [],
      groupsList: [],
      groupInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false
    };
    this.getUserData().then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName = response.data[i].name;
        var userid = response.data[i].id;
        tempUsers.push({ id: userid, name: userName });
      }
      this.setState({
        usersList: tempUsers
      });
      this.masterUserList = tempUsers;
      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });
    this.getGroupsData().then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var groupName = response.data[i].name;
        var groupid = response.data[i].id;
        tempUsers.push({ id: groupid, name: groupName });
      }
      this.setState({
        groupsList: tempUsers
      });
    })
  }

  componentDidMount() {
    M.updateTextFields();
  }

  async getUserData() {
    let loader = this.core.make("oxzion/splash");
    loader.show();
    let helper = this.core.make("oxzion/restClient");
    let userData = await helper.request("v1", "/user", {}, "get");
    return userData.data;
  }

  async getGroupsData() {
    let helper = this.core.make("oxzion/restClient");
    let userData = await helper.request("v1", "/group", {}, "get");
    return userData;
  }

  async pushData() {
    let helper = this.core.make("oxzion/restClient");
    let projectAddData = await helper.request(
      "v1",
      "/group",
      {
        name: this.state.groupInEdit.name,
        parent_id: this.state.groupInEdit.parent_id,
        manager_id: this.state.groupInEdit.manager_id,
        org_id: this.state.groupInEdit.org_id,
        description: this.state.groupInEdit.description
      },
      "post"
    );
    return projectAddData;
  }

  async editGroup() {
    let helper = this.core.make("oxzion/restClient");
    let groupEditData = await helper.request(
      "v1",
      "/group/" + this.state.groupInEdit.id,
      {
        name: this.state.groupInEdit.name,
        parent_id: this.state.groupInEdit.parent_id,
        manager_id: this.state.groupInEdit.manager_id,
        org_id: this.state.groupInEdit.org_id,
        description: this.state.groupInEdit.description
      },
      "put"
    );
  }

  managerOnChange = event => {
    const edited = this.state.groupInEdit;
    edited["manager_id"] = event.target.value;

    this.setState({
      groupInEdit: edited
    });
  }

  parentGroupOnChange = event => {
    const edited = this.state.groupInEdit;
    edited["parent_id"] = event.target.value;

    this.setState({
      groupInEdit: edited
    });
  }


  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.groupInEdit;
    edited[name] = value;

    this.setState({
      groupInEdit: edited
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    if (this.props.formAction == "edit") {
      this.editGroup().then(response => {
        var addResponse = response.data.id;
        this.props.action(addResponse);
      });
    } else {
      this.pushData().then(response => {
        var addResponse = response.data.id;
        this.props.action(addResponse);
      });
    }
    this.props.cancel();
  };

  filterChange = (event) => {
    this.setState({
      usersList: this.filterData(event.filter)
    });
  }

  filterData(filter) {
    const data = this.masterUserList.slice();
    return filterBy(data, filter);
  }

  render() {
    return (
      <Validator>
        <Dialog onClose={this.props.cancel}>
          <div>
            <form id="groupForm">
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={this.state.groupInEdit.name || ""}
                  onChange={this.onDialogInputChange}
                  placeholder="Enter Group Name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <TextareaAutosize
                  type="text"
                  className="form-control"
                  name="description"
                  value={this.state.groupInEdit.description || ""}
                  onChange={this.onDialogInputChange}
                  placeholder="Enter Group Description"
                />
              </div>
              <div className="form-group">
                <div className="form-row">
                  <div className="col">
                    <label>Group Manager</label>
                    <div>
                      <DropDownListWithValueField
                        data={this.state.usersList}
                        textField="name"
                        value={this.state.groupInEdit.manager_id}
                        valueField="id"
                        onChange={this.managerOnChange}
                        filterable={true}
                        onFilterChange={this.filterChange}
                        style={{ width: "210px" }}
                        popupSettings={{ height: "160px" }}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label>Parent Group</label>
                    <div>
                      <DropDownListWithValueField
                        data={this.state.groupsList}
                        textField="name"
                        onChange={this.parentGroupOnChange}
                        style={{ width: "210px" }}
                        value={this.state.groupInEdit.parent_id}
                        valueField="id"
                        popupSettings={{ height: "160px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Organization ID</label>
                <input
                  type="number"
                  className="form-control validate"
                  name="org_id"
                  value={this.state.groupInEdit.org_id || ""}
                  onChange={this.onDialogInputChange}
                  placeholder="Enter Organization ID"
                />
              </div>
            </form>
          </div>

          <DialogActionsBar args={this.core}>
          <button
              className="k-button k-primary"
              onClick={this.handleSubmit}
              form="groupForm"
            >
              Save
            </button>
            <button className="k-button" onClick={this.props.cancel}>
              Cancel
            </button>
          </DialogActionsBar>
        </Dialog>
      </Validator >
    );
  }
}
