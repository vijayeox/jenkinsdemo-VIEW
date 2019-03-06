import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import "../../public/js/materialize.js";
import "@progress/kendo-ui";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      groupInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false
    };
  }

  componentDidMount() {
    M.AutoInit();
    M.updateTextFields();
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
        description: this.state.groupInEdit.description,
        type: this.state.groupInEdit.type
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
        description: this.state.groupInEdit.description,
        type: this.state.groupInEdit.type
      },
      "put"
    );
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
      this.editGroup();
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
            <form className="col s12" onSubmit={this.submitData} id="groupForm" style={{backgroundColor:'#F1F1F1'}}>
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
                <div className="input-field col s6">
                  <input
                    id="organizationParent_id"
                    type="number"
                    className="validate"
                    name="parent_id"
                    value={this.state.groupInEdit.parent_id || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="organizationParent_id">Parent ID</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s6">
                  <input
                    id="organizationManager_id"
                    type="number"
                    className="validate"
                    name="manager_id"
                    value={this.state.groupInEdit.manager_id || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="organizationManager_id">Manager ID</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s6">
                  <input
                    id="organizationType"
                    type="text"
                    className="validate"
                    name="type"
                    value={this.state.groupInEdit.type || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="organizationType">Type</label>
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
