
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
      appInEdit: this.props.dataItem || null,
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
    let orgAddData = await helper.request(
      "v1",
      "/app",
      {
        name: this.state.appInEdit.name,
        type: this.state.appInEdit.type,
        category: this.state.appInEdit.category
      },
      "post"
    );
    return orgAddData;
  }

  async editApps() {
    let helper = this.core.make("oxzion/restClient");
    let orgEditData = await helper.request(
      "v1",
      "/app/" + this.state.appInEdit.uuid,
      {
        name: this.state.appInEdit.name,
        type: this.state.appInEdit.type,
        category: this.state.appInEdit.category
      },
      "put"
    );
  }

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.appInEdit;
    edited[name] = value;

    this.setState({
      appInEdit: edited
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    if (this.props.formAction == "edit") {
      this.editApps();
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
            <form
              className="col s12"
              onSubmit={this.submitData}
              id="applicationForm"
            >
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="appName"
                    type="text"
                    className="validate"
                    name="name"
                    value={this.state.appInEdit.name || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="appName">Application Name</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="appType"
                    type="text"
                    className="validate"
                    name="type"
                    value={this.state.appInEdit.type || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="appType">Type</label>
                </div>
              </div>



              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="appCategory"
                    type="text"
                    className="validate"
                    name="category"
                    value={this.state.appInEdit.category || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="appCategory">Category</label>
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
              form="applicationForm"
            >
              Save
            </button>
          </DialogActionsBar>
        </Dialog>
      </Validator>
    );
  }
}
