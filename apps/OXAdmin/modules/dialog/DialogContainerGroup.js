import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productInEdit: this.props.dataItem || null
    };
  }
  handleSubmit(event) {
    event.preventDefault();
  }

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.productInEdit;
    edited[name] = value;

    this.setState({
      productInEdit: edited
    });
  };

  render() {
    return (
      <Dialog onClose={this.props.cancel}>
        <div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                Group Name
                <br />
                <Input
                  type="text"
                  name="GroupName"
                  value={this.state.productInEdit.GroupName || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Manager ID
                <br />
                <Input
                  type="text"
                  name="ManagerId"
                  value={this.state.productInEdit.ManagerId || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Organisation
                <br />
                <Input
                  type="text"
                  name="Organisation"
                  value={this.state.productInEdit.Organisation || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </div>

            <div>
              <label>
                Description
                <br />
                <Input
                  type="text"
                  name="Description"
                  value={this.state.productInEdit.Description || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </div>
          </form>
        </div>
        <DialogActionsBar>
          <button className="k-button" onClick={this.props.cancel}>
            Cancel
          </button>
          <button className="k-button k-primary" onClick={this.props.save}>
            Save
          </button>
        </DialogActionsBar>
      </Dialog>
    );
  }
}
