import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import "../../public/materialize.js";
import "@progress/kendo-ui";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.prajwal = null;
    this.state = {
      orgInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false
    };
  }

  componentDidMount() {
    M.updateTextFields();
  }

  componentWillUnmount() {
    this.setState({ orgInEdit: { id: this.prajwal } });
    console.log(this.prajwal);
  }

  async pushData() {
    let helper = this.core.make("oxzion/restClient");
    let orgAddData = await helper.request(
      "v1",
      "/organization",
      {
        name: this.state.orgInEdit.name,
        address: this.state.orgInEdit.address,
        city: this.state.orgInEdit.city,
        state: this.state.orgInEdit.state,
        zip: this.state.orgInEdit.zip,
        logo: this.state.orgInEdit.logo,
        languagefile: this.state.orgInEdit.languagefile
      },
      "post"
    );
    return orgAddData;
  }

  async editOrganization() {
    let helper = this.core.make("oxzion/restClient");
    let orgEditData = await helper.request(
      "v1",
      "/organization/" + this.state.orgInEdit.id,
      {
        name: this.state.orgInEdit.name,
        address: this.state.orgInEdit.address,
        city: this.state.orgInEdit.city,
        state: this.state.orgInEdit.state,
        zip: this.state.orgInEdit.zip,
        logo: this.state.orgInEdit.logo,
        languagefile: this.state.orgInEdit.languagefile
      },
      "put"
    );
  }

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.orgInEdit;
    edited[name] = value;

    this.setState({
      orgInEdit: edited
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    var self = this;
    if (this.props.formAction == "edit") {
      this.editOrganization();
    } else {
      this.pushData().then(response => {
        var prajwal;
        prajwal = response.data.id;
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
              id="organizationForm"
            >
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="organizationName"
                    type="text"
                    className="validate"
                    name="name"
                    value={this.state.orgInEdit.name || ""}
                    onChange={this.onDialogInputChange}
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
                    value={this.state.orgInEdit.address || ""}
                    onChange={this.onDialogInputChange}
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
                    value={this.state.orgInEdit.city || ""}
                    onChange={this.onDialogInputChange}
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
                    value={this.state.orgInEdit.state || ""}
                    onChange={this.onDialogInputChange}
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
                    value={this.state.orgInEdit.zip || ""}
                    onChange={this.onDialogInputChange}
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
                    value={this.state.orgInEdit.logo || ""}
                    onChange={this.onDialogInputChange}
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
                    value={this.state.orgInEdit.languagefile || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="organizationLang">Language</label>
                </div>
              </div>

              {/* <div className="row">
                <div className="input-field col s12">
                  <input
                    id="organizationId"
                    type="text"
                    className="validate"
                    name="id"
                    value={this.state.orgInEdit.id || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="organizationId">id</label>
                </div>
              </div> */}
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
