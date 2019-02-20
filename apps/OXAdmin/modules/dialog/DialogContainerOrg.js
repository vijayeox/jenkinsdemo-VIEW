import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import "@progress/kendo-ui";

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
    this.submitData();
  };

  submitData = event => {
    this.pushData();
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
              id="organizationForm"
            >
              <div className="row">
                <div className="input-field col s12">
                  <input
                    disabled
                    id="disabled"
                    type="text"
                    className="validate"
                  />
                  <label htmlFor="disabled">ID (Auto Generated)</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="organizationName"
                    type="text"
                    className="validate"
                    name="name"
                    value={this.state.productInEdit.name || ""}
                    onChange={this.handleName}
                    required={true}
                  />
                  <label htmlFor="organizationName">Organization Name</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="organizationAddress"
                    type="text"
                    className="validate"
                    name="address"
                    value={this.state.productInEdit.address || ""}
                    onChange={this.handleAddress}
                    required={true}
                  />
                  <label htmlFor="organizationAddress">Address</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s6">
                  <input
                    id="organizationCity"
                    type="text"
                    className="validate"
                    name="city"
                    value={this.state.productInEdit.city || ""}
                    onChange={this.handleCity}
                    required={true}
                  />
                  <label htmlFor="organizationCity">City</label>
                </div>

                <div className="input-field col s6">
                  <input
                    id="organizationState"
                    type="text"
                    className="validate"
                    name="state"
                    value={this.state.productInEdit.state || ""}
                    onChange={this.handleState}
                    required={true}
                  />
                  <label htmlFor="organizationState">State</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="organizationZip"
                    type="text"
                    className="validate"
                    name="zip"
                    value={this.state.productInEdit.zip || ""}
                    onChange={this.handleZip}
                    required={true}
                  />
                  <label htmlFor="organizationZip">Zip Code</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="organizationLogo"
                    type="text"
                    className="validate"
                    name="logo"
                    value={this.state.productInEdit.logo || ""}
                    onChange={this.handleLogo}
                    required={true}
                  />
                  <label htmlFor="organizationLogo">Logo</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="organizationLang"
                    type="text"
                    className="validate"
                    name="languagefile"
                    value={this.state.productInEdit.languagefile || ""}
                    onChange={this.handleLanguage}
                    required={true}
                  />
                  <label htmlFor="organizationLang">Language</label>
                </div>
              </div>
              {/* <button className="k-button k-primary" type="submit">
                Save
              </button> */}
            </form>
          </div>

          <DialogActionsBar args={this.core}>
            <button className="k-button" onClick={this.props.cancel}>
              Cancel
            </button>
            <button
              className="k-button k-primary"
              type="submit"
              form="organizationForm"
            >
              Save
            </button>
          </DialogActionsBar>
        </Dialog>
      </Validator>
    );
  }
}
