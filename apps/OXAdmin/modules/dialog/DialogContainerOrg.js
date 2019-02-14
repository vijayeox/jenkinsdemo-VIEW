import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import axios from "axios";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false
    };
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

  handleSubmit = event => {
    event.preventDefault();
  };

  render() {
    return (
      <Dialog onClose={this.props.cancel}>
        <div>
          {
            <form
              onSubmit={this.handleSubmit}
              style={{ display: "table-caption", width: "200px" }}
            >
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={this.state.productInEdit.name || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={this.state.productInEdit.address || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={this.state.productInEdit.city || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>{" "}
              <label>
                State:
                <input
                  type="text"
                  name="state"
                  value={this.state.productInEdit.state || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
              <label>
                Zip:
                <input
                  type="text"
                  name="zip"
                  value={this.state.productInEdit.zip || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
              <label>
                Logo:
                <input
                  type="text"
                  name="logo"
                  value={this.state.productInEdit.logo || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
              <label>
                Language:
                <input
                  type="text"
                  name="languagefile"
                  value={this.state.productInEdit.languagefile || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </form>
          }
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
