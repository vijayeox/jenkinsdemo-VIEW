import React from "react";
import {
  Dialog,
  DialogActionsBar
} from "@progress/kendo-react-dialogs";
import {
  Validator
} from "@progress/kendo-validator-react-wrapper";
import "../../public/js/materialize.js";
import "@progress/kendo-ui";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      prjInEdit: this.props.dataItem || null,
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
    let prjAddData = await helper.request(
      "v1",
      "/project", {
        name: this.state.prjInEdit.name
      },
      "post"
    );
    return prjAddData;
  }

  async editProject() {
    let helper = this.core.make("oxzion/restClient");
    let prjEditData = await helper.request(
      "v1",
      "/project/" + this.state.prjInEdit.id, {
        name: this.state.prjInEdit.name
      },
      "put"
    );
    return prjEditData;
  }

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.prjInEdit;
    edited[name] = value;

    this.setState({
      prjInEdit: edited
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    if (this.props.formAction == "edit") {
      this.editProject().then(response => {
        this.props.action();
      });
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
              id="projectForm"
            >
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="projectName"
                    type="text"
                    className="validate"
                    name="name"
                    value={this.state.prjInEdit.name || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="projectName">Project Name</label>
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
              form="projectForm"
            >
              Save
            </button>
          </DialogActionsBar>
        </Dialog>
      </Validator>
    );
  }
}