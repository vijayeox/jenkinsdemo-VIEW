import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { PushData } from "../components/apiCalls";
import { SaveCancel } from "../components/index";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      roleInEdit: this.props.dataItem || null
    };
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
                placeholder="Enter Project Description"
                style={{ marginTop: "5px" }}
              />
            </div>
          </form>
        </div>
        <SaveCancel save="roleForm" cancel={this.props.cancel} />
      </Window>
    );
  }
}
