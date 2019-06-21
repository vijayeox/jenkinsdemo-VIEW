import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { PushData } from "../components/apiCalls";
import { SaveCancel } from "../components/index";
import { FaUserLock } from "react-icons/fa";

import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { Input } from "@progress/kendo-react-inputs";
import { Ripple } from "@progress/kendo-react-ripple";
import { orderBy } from "@progress/kendo-data-query";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      roleInEdit: this.props.dataItem || null,
      masterList: [],
      privilegeData: [],
      sort: []
    };

    this.props.formAction=="put"
      ? this.getPrivilegeData().then(response => {
          this.setState({
            masterList: response.data.masterPrivilege
          });
          let temp = [];
          for (let i = 0; i < response.data.rolePrivilege.length; i++) {
            temp[response.data.rolePrivilege[i].privilege_name] =
              response.data.rolePrivilege[i].permission;
          }
          this.setState({
            privilegeData: temp
          });
          this.isAdmin =
            this.state.roleInEdit.name.toUpperCase() == "ADMIN" ? true : false;
        })
      : this.masterList().then(response => {
          this.setState({
            masterList: response.data.masterPrivilege
          });
          this.isAdmin = false;
        });

    this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
    this.vals = {
      read: ["0", "1"],
      write: ["1", "3"],
      create: ["3", "7"],
      delete: ["7", "15"]
    };
  }

  async getPrivilegeData() {
    let helper2 = this.core.make("oxzion/restClient");
    let privilegedata = await helper2.request(
      "v1",
      "/masterprivilege/" + this.props.dataItem.id,
      {},
      "get"
    );
    return privilegedata;
  }

  async masterList() {
    let helper2 = this.core.make("oxzion/restClient");
    let masterData = await helper2.request("v1", "/masterprivilege", {}, "get");
    return masterData;
  }

  async pushData() {
    let helper = this.core.make("oxzion/restClient");
    console.log(this.state.privilegeInEdit);
    let roleAddData = await helper.request(
      "v1",
      "/role",
      {
        name: this.state.roleInEdit.name,
        description: this.state.roleInEdit.description,
        privileges: this.state.privilegeInEdit,
        show: false
      },
      "post"
    );
    console.log(privileges);
    console.log(this.state.privilegeInEdit);
    return roleAddData;
  }

  async editRole() {
    let helper = this.core.make("oxzion/restClient");
    let roleEditData = await helper.request(
      "v1",
      "/role/" + this.state.roleInEdit.id,
      {
        name: this.state.roleInEdit.name,
        description: this.state.roleInEdit.description,
        show: false
      },
      "put"
    );
  }

  onChangeCheckbox = e => {
    var value = e.target.props;
    let privilegeData = { ...this.state.privilegeData };
    const index = value.checked ? 0 : 1;
    privilegeData[value.id.slice(0, -1)] = this.vals[value.refs][index];
    this.setState({ privilegeData: privilegeData });
  };

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.roleInEdit;
    edited[name] = value;

    this.setState({
      roleInEdit: edited
    });
  };

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    this.props.cancel();
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <div>
          <form id="roleForm" onSubmit={this.submitData}>
            <div className="form-group">
              <label>Role Name</label>
              <input
                id="Name"
                type="text"
                className="validate"
                name="name"
                value={this.state.roleInEdit.name || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Role Name"
                required={true}
              />
            </div>

            <div className="form-group text-area-custom">
              <label>Role Description</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                name="description"
                value={this.state.roleInEdit.description || ""}
                onChange={this.onDialogInputChange}
                required={true}
                placeholder="Enter Role Description"
                style={{ marginTop: "5px" }}
              />
            </div>
          </form>

          <Ripple>
            <div className="col-10 pt-3" style={{ margin: "auto" }}>
              <div className="privilegeGrid">
                <Grid
                  data={orderBy(this.state.masterList, this.state.sort)}
                  resizable={true}
                  sortable
                  sort={this.state.sort}
                  onSortChange={e => {
                    this.setState({
                      sort: e.sort
                    });
                  }}
                >
                  <GridToolbar>
                    <div>
                      <div
                        style={{
                          fontSize: "20px"
                        }}
                      >
                        Configure Privileges For&nbsp;
                        {this.state.roleInEdit.name
                          ? this.toTitleCase(this.state.roleInEdit.name)
                          : ""}
                        &nbsp;
                        {this.isAdmin ? (
                          <React.Fragment>
                            &nbsp; (READ ONLY MODE)
                            <FaUserLock
                              style={{
                                fontSize: "2.5rem",
                                right: "2%",
                                top: "2px",
                                position: "absolute"
                              }}
                            />
                          </React.Fragment>
                        ) : null}
                      </div>
                    </div>
                  </GridToolbar>
                  <GridColumn title="App Name" field="name" width="100px" />
                  <GridColumn
                    title="Privilege Name"
                    width="200px"
                    cell={props => (
                      <td>
                        <label>{props.dataItem.privilege_name.slice(7)}</label>
                      </td>
                    )}
                  />

                  <GridColumn
                    title="Read"
                    width="80px"
                    cell={props =>
                      props.dataItem.permission & 1 ? (
                        <td>
                          <div className="privelegeGridcellFix">
                            <Input
                              type="checkbox"
                              refs="read"
                              id={props.dataItem.privilege_name + "R"}
                              className="k-checkbox"
                              onChange={
                                this.isAdmin ? null : this.onChangeCheckbox
                              }
                              checked={
                                this.state.privilegeData[
                                  props.dataItem.privilege_name
                                ] & 1
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="k-checkbox-label"
                              htmlFor={props.dataItem.privilege_name + "R"}
                            />
                          </div>
                        </td>
                      ) : (
                        <td />
                      )
                    }
                  />
                  <GridColumn
                    title="Write"
                    width="80px"
                    cell={props =>
                      props.dataItem.permission & 2 ? (
                        <td>
                          <div className="privelegeGridcellFix">
                            <Input
                              type="checkbox"
                              refs="write"
                              id={props.dataItem.privilege_name + "W"}
                              className="k-checkbox"
                              onChange={
                                this.isAdmin ? null : this.onChangeCheckbox
                              }
                              checked={
                                this.state.privilegeData[
                                  props.dataItem.privilege_name
                                ] & 2
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="k-checkbox-label"
                              htmlFor={props.dataItem.privilege_name + "W"}
                            />
                          </div>
                        </td>
                      ) : (
                        <td />
                      )
                    }
                  />
                  <GridColumn
                    title="Create"
                    width="80px"
                    cell={props =>
                      props.dataItem.permission & 4 ? (
                        <td>
                          <div className="privelegeGridcellFix">
                            <Input
                              type="checkbox"
                              refs="create"
                              id={props.dataItem.privilege_name + "C"}
                              className="k-checkbox"
                              onChange={
                                this.isAdmin ? null : this.onChangeCheckbox
                              }
                              checked={
                                this.state.privilegeData[
                                  props.dataItem.privilege_name
                                ] & 4
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="k-checkbox-label"
                              htmlFor={props.dataItem.privilege_name + "C"}
                            />
                          </div>
                        </td>
                      ) : (
                        <td />
                      )
                    }
                  />
                  <GridColumn
                    title="Delete"
                    width="80px"
                    cell={props =>
                      props.dataItem.permission & 8 ? (
                        <td>
                          <div className="privelegeGridcellFix">
                            <Input
                              type="checkbox"
                              refs="delete"
                              id={props.dataItem.privilege_name + "D"}
                              className="k-checkbox"
                              onChange={
                                this.isAdmin ? null : this.onChangeCheckbox
                              }
                              checked={
                                this.state.privilegeData[
                                  props.dataItem.privilege_name
                                ] & 8
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="k-checkbox-label"
                              htmlFor={props.dataItem.privilege_name + "D"}
                            />
                          </div>
                        </td>
                      ) : (
                        <td />
                      )
                    }
                  />
                </Grid>
              </div>
              <div style={{ margin: "75px" }} />
            </div>
          </Ripple>
        </div>
        <SaveCancel save="roleForm" cancel={this.props.cancel} />
      </Window>
    );
  }
}
