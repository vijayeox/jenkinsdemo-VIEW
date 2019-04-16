import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import { Tooltip } from '@progress/kendo-react-tooltip';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { orderBy } from '@progress/kendo-data-query';
import "../../public/scss/kendo.css";
import "@progress/kendo-ui";

import "jquery/dist/jquery.js";
import $ from "jquery";

class ProductNameHeader extends React.Component {
  render() {
      return (
          <a className="k-link" onClick={this.props.onClick}>
          <span title={this.props.field}>{this.props.title}</span>
          </a>
      );
  }
}

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      roleInEdit: this.props.dataItem || null,
      visibleDialog: false,
      products2: [],
      privilegeInEdit: [],

    };
    this.getPrivilegeData().then(response => {
      this.setState({ products2: response.data });
    });
    this.handleChange = this.handleChange.bind(this);
    this.testdata = this.testdata.bind(this);

  }
  async getPrivilegeData() {
    let helper2 = this.core.make("oxzion/restClient");
    let privilegedata = await helper2.request("v1", "/privilege", {}, "get");
    return privilegedata;
  }

  componentDidMount() {
    M.AutoInit();
    M.updateTextFields();
    if (this.props.formAction == "edit") {
      this.handleFunction();
    } else {
      this.getPrivilegeData().then(response => {
        this.setState({ products2: response.data });
      });
    }
  }

  handleFunction() {
    this.getPrivilegeData().then(response => {
      console.log(response.data);
      this.setState({ products2: response.data });
      for (var i = 0; i < this.state.products2.length; i++) {

        var number = this.state.products2[i].permission_allowed;
        if (number & 1) {
          $('#' + this.state.products2[i].name + '1').attr('checked', true);
        }
        if (number & 2) {
          $('#' + this.state.products2[i].name + '2').attr('checked', true);
        }
        if (number & 4) {
          $('#' + this.state.products2[i].name + '3').attr('checked', true);
        }
        if (number & 8) {
          $('#' + this.state.products2[i].name + '4').attr('checked', true);
        }
      }

    });
  }
  async pushData() {
    let helper = this.core.make("oxzion/restClient");
    let roleAddData = await helper.request(
      "v1",
      "/role",
      {
        name: this.state.roleInEdit.name,
        description: this.state.roleInEdit.description,
        show: false
      },
      "post"
    );
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

  handleChange = event => {
    console.log(event.target.id);
    let name1 = event.target.id;
    let name2 = document.getElementById(event.target.id);
    let num = name1.slice(-1);
    let manage = name1.slice(0, -1);
    let manage1 = document.getElementById(manage + '1');
    let manage2 = document.getElementById(manage + '2');
    let manage3 = document.getElementById(manage + '3');
    let clickValue = '';
    if (num == 1) {
      if (name2.checked == true) {
        name2.checked = true;
        let event1 = parseInt(name2.value);
        clickValue = event1;
      } else {
        name2.checked = false;
        let event1 = 0;
        clickValue = event1;
      }
    }
    if (num == 2) {
      if (name2.checked == true) {
        name2.checked = true;
        manage1.checked = true;
        manage1.disabled = true;
        let event2 = parseInt(name2.value) + parseInt(manage1.value);
        clickValue = event2;
      } else {
        name2.checked = false;
        manage1.checked = false;
        manage1.disabled = false;
        let event2 = 0;
        clickValue = event2;
      }
    }
    if (num == 3) {
      if (name2.checked == true) {
        name2.checked = true;
        manage1.checked = true;
        manage1.disabled = true;
        manage2.checked = true;
        manage2.disabled = true;
        let event3 = parseInt(name2.value) + parseInt(manage1.value) + parseInt(manage2.value);
        clickValue = event3;
      } else {
        name2.checked = false;
        manage1.checked = false;
        manage1.disabled = false;
        manage2.checked = false;
        manage2.disabled = false;
        let event3 = 0;
        clickValue = event3;
      }
    }
    if (num == 4) {
      if (name2.checked == true) {
        name2.checked = true;
        manage1.checked = true;
        manage1.disabled = true;
        manage2.checked = true;
        manage2.disabled = true;
        manage3.checked = true;
        manage3.disabled = true;
        let event4 = parseInt(name2.value) + parseInt(manage1.value) + parseInt(manage2.value) + parseInt(manage3.value);
        clickValue = event4;
      } else {
        name2.checked = false;
        manage1.checked = false;
        manage1.disabled = false;
        manage2.checked = false;
        manage2.disabled = false;
        manage3.checked = false;
        manage3.disabled = false;
        let event4 = 0;
        clickValue = event4;
      }
    }

    // this.newMethod(manage,clickValue);
  }

  // newMethod(manage,clickValue) {

  //   let tempData = { ...this.state.privilegeInEdit };
  //   tempData[manage] = clickValue  ;
  //   this.setState({ privilegeInEdit: tempData });
  //   console.log(manage);
  //   console.log(tempData);

  // }

  testdata = () => {

    const edited = this.state.privilegeInEdit; 

    for (var i = 0; i < this.state.products2.length; i++) {
      let test = this.state.products2[i].name;
      var clk = 0;
      let test1 = document.getElementById(this.state.products2[i].name + '1')
      let test2 = document.getElementById(this.state.products2[i].name + '2')
      let test3 = document.getElementById(this.state.products2[i].name + '3')
      let test4 = document.getElementById(this.state.products2[i].name + '4')
      if (test1.checked == true) {
        clk = parseInt(test1.value);
      }
      if (test2.checked == true) {
        clk = clk + parseInt(test2.value);
      }
      if (test3.checked == true) {
        clk = clk + parseInt(test3.value);
      }
      if (test4.checked == true) {
        clk = clk + parseInt(test4.value);
      }

    edited[test] = clk;

    }

    this.setState({
      privilegeInEdit: edited
    });

    console.log(edited);
    console.log(this.state.privilegeInEdit);

  }

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

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    var self = this;
    if (this.props.formAction == "edit") {
      this.editRole();
      this.handleFunction();
    } else {
      this.pushData().then(response => {
        var addResponse = response.data.id;
        this.props.action(addResponse);
      });
    }
    this.props.save();
  };

  render() {
    return (
      <Validator>
        <Dialog onClose={this.props.cancel}>
          <div className="row">
            <form className="col s12" onSubmit={this.submitData} id="roleForm">
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="Name"
                    type="text"
                    className="validate"
                    name="name"
                    value={this.state.roleInEdit.name || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />

                  <label htmlFor="roleName">Role Name</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="roleDescription"
                    type="text"
                    className="validate"
                    name="description"
                    value={this.state.roleInEdit.description || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="roleDescription">Description</label>
                </div>
              </div>

              <div> 
                <label>
                  Privileges    
                  </label>
              </div>
              <Tooltip openDelay={100} position="top" anchorElement="element">
              <Grid
                style={{ height: '225px', width: '373px' }}
                data={this.state.products2}
              >
                <Column field="id" title="ID" width="40px" />
                <Column field="name" title="Name" width="150px"
                  cell={(props) => (
                    <td>
                      <label>{props.dataItem.name.slice(7)}</label>
                    </td>
                  )}
                />
                <Column field="Read" title="R" width="40px" headerCell={ProductNameHeader}
                  cell={(props) => (
                    <td>
                      <input type="checkbox" onChange={this.handleChange} id={props.dataItem.name + "1"} className={props.dataItem.name + "1"}
                        //  checked={this.state[props.dataItem.name] & 1 ? true : false}
                        value="1" />
                    </td>
                  )} />
                <Column field="Write" title="W" width="40px" headerCell={ProductNameHeader}
                  cell={(props) => (
                    <td>
                      <input type="checkbox" onChange={this.handleChange} id={props.dataItem.name + "2"} className={props.dataItem.name + "2"}
                        //  checked={this.state[props.dataItem.name] & 2 ? true : false} 
                        value="2" />
                    </td>
                  )} />
                <Column field="Create" title="C" width="40px" headerCell={ProductNameHeader}
                  cell={(props) => (
                    <td>
                      <input type="checkbox" onChange={this.handleChange} id={props.dataItem.name + "3"} className={props.dataItem.name + "3"}
                        //  checked={this.state[props.dataItem.name] & 4 ? true : false} 
                        value="4" />
                    </td>
                  )} />
                <Column field="Delete" title="D" width="40px" headerCell={ProductNameHeader}
                  cell={(props) => (
                    <td>
                      <input type="checkbox" onChange={this.handleChange} id={props.dataItem.name + "4"} className={props.dataItem.name + "4"}
                        // checked={this.state[props.dataItem.name] & 8 ? true : false}
                        value="8" />
                    </td>
                  )} />
              </Grid>
            </Tooltip>
            </form>
          </div>

          <DialogActionsBar args={this.core}>
            <button className="k-button" onClick={this.props.cancel}>
              Cancel
            </button>
            <button
              className="k-button k-primary"
              type="submit"
              form="roleForm"
            >
              Save
            </button>
            <button className="k-button" onClick={this.testdata}>
              Test
            </button>
          </DialogActionsBar>
        </Dialog>
      </Validator>
    );
  }
}
