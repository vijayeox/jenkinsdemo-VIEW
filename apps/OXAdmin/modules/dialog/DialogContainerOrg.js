import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

    this.state = {
      productInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false,

      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      logo: "",
      languagefile: ""
    };
  }

  async pushData() {
    let helper = this.core.make("oxzion/restClient");
    let announ = await helper.request(
      "v1",
      "/organization",
      {
        name: this.state.name,
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        logo: this.state.logo,
        languagefile: this.state.languagefile
      },
      "post"
    );
  }

  handleName = event => {
    this.onDialogInputChange(event);
    this.setState({
      name: event.target.value
    });
  };

  handleAddress = event => {
    this.onDialogInputChange(event);
    this.setState({
      address: event.target.value
    });
  };

  handleCity = event => {
    this.onDialogInputChange(event);

    this.setState({
      city: event.target.value
    });
  };

  handleState = event => {
    this.onDialogInputChange(event);

    this.setState({
      state: event.target.value
    });
  };

  handleZip = event => {
    this.onDialogInputChange(event);

    this.setState({
      zip: event.target.value
    });
  };
  handleLogo = event => {
    this.onDialogInputChange(event);

    this.setState({
      logo: event.target.value
    });
  };

  handleLanguage = event => {
    this.onDialogInputChange(event);

    this.setState({
      languagefile: event.target.value
    });
  };

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

  submitData = event => {
    this.pushData();
    this.props.save();
  };

  render() {
    return (
      <Dialog onClose={this.props.cancel}>
        <div>
          {
            <form
              onSubmit={this.handleSubmit}
              style={{
                display: "table-caption",
                width: "200px",
                height: "300px"
              }}
            >
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={this.state.productInEdit.name || ""}
                  onChange={this.handleName}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={this.state.productInEdit.address || ""}
                  onChange={this.handleAddress}
                />
              </label>
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={this.state.productInEdit.city || ""}
                  onChange={this.handleCity}
                />
              </label>{" "}
              <label>
                State:
                <input
                  type="text"
                  name="state"
                  value={this.state.productInEdit.state || ""}
                  onChange={this.handleState}
                />
              </label>
              <label>
                Zip:
                <input
                  type="text"
                  name="zip"
                  value={this.state.productInEdit.zip || ""}
                  onChange={this.handleZip}
                />
              </label>
              <label>
                Logo:
                <input
                  type="text"
                  name="logo"
                  value={this.state.productInEdit.logo || ""}
                  onChange={this.handleLogo}
                />
              </label>
              <label>
                Language:
                <input
                  type="text"
                  name="languagefile"
                  value={this.state.productInEdit.languagefile || ""}
                  onChange={this.handleLanguage}
                />
              </label>
            </form>
          }
        </div>
        <DialogActionsBar args={this.core}>
          <button className="k-button" onClick={this.props.cancel}>
            Cancel
          </button>
          <button className="k-button k-primary" onClick={this.submitData}>
            Save
          </button>
        </DialogActionsBar>
      </Dialog>
    );
  }
}
