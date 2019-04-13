import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';
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
      groupsList: this.props.groupsList,
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
  }

  componentDidMount() {
    M.updateTextFields();
  }

  async getUserData() {
    let loader = this.core.make("oxzion/splash");
    loader.show();
    let helper = this.core.make("oxzion/restClient");
    let userData = await helper.request("v1", "/user", {}, "get");
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
    this.props.save();
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
          <div className="row">
            <form className="col s12" onSubmit={this.submitData} id="groupForm">

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="groupName"
                    type="text"
                    className="validate"
                    name="name"
                    value={this.state.groupInEdit.name || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="groupName">Group Name</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <textarea
                    id="groupDescription"
                    type="text"
                    className="materialize-textarea validate"
                    name="description"
                    value={this.state.groupInEdit.description || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="groupDescription">Description</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <p style={{ marginTop: "0px" }}><label>Group Manager</label> </p>
                  <DropDownListWithValueField
                    data={this.state.usersList}
                    textField="name"
                    value={this.state.groupInEdit.manager_id}
                    valueField="id"
                    onChange={this.managerOnChange}
                    filterable={true}
                    onFilterChange={this.filterChange}
                    style={{ width: "200px" }}
                    popupSettings={{ height: "170px" }}
                  />
                </div>
              </div>


              <div className="row">
                <div className="input-field col s12">
                  <p style={{ marginTop: "0px" }}><label>Parent Group</label> </p>
                  <DropDownListWithValueField
                    data={this.state.groupsList}
                    textField="name"
                    onChange={this.parentGroupOnChange}
                    style={{ width: "200px" }}
                    value={this.state.groupInEdit.parent_id}
                    valueField="id"
                    popupSettings={{ height: "170px" }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="input-field col s6">
                  <input
                    id="organizationManager_id"
                    type="number"
                    className="validate"
                    name="org_id"
                    value={this.state.groupInEdit.org_id || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="organizationManager_id">Organization ID</label>
                </div>
              </div>
            </form>
          </div>

          <DialogActionsBar args={this.core}>
            <button className="k-button" onClick={this.props.cancel}>
              Cancel
            </button>
            <button
              className="k-button k-primary"
              type="submit"
              form="groupForm"
            >
              Save
            </button>
          </DialogActionsBar>
        </Dialog>
      </Validator>
    );
  }
}
