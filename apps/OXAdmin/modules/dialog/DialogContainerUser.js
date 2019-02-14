import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";

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
        <div style={{ overflowY: "scroll", height: "400px" }}>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                User Name
                <br />
                <Input
                  type="text"
                  name="Name"
                  value={this.state.productInEdit.Name || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Email
                <br />
                <Input
                  type="text"
                  name="email"
                  value={this.state.productInEdit.email || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Contact
                <br />
                <Input
                  type="text"
                  name="Contact"
                  value={this.state.productInEdit.Contact || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </div>

            <div>
              <label>
                Address
                <br />
                <Input
                  type="text"
                  name="add"
                  value={this.state.productInEdit.add || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Designation
                <br />
                <Input
                  type="text"
                  name="Designation"
                  value={this.state.productInEdit.Designation || ""}
                  onChange={this.onDialogInputChange}
                />
              </label>
            </div>

            <div>
              <label>
                DOB
                <br />
                <DatePicker />
              </label>
            </div>
            <div>
              <label>
                DOJ
                <br />
                <DatePicker />
              </label>
            </div>
            <div>
              <label>
                AvatarName
                <br />
                <Input
                  type="text"
                  name="avname"
                  value={this.state.productInEdit.avname || ""}
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
