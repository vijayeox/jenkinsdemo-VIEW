import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { Input } from "@progress/kendo-react-inputs";
import { PushData } from "../components/apiCalls";
import { FileUploader, Notification } from "@oxzion/gui";
import { SaveCancel } from "../components/index";
import scrollIntoView from "scroll-into-view-if-needed";

import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.url = this.core.config("wrapper.url");
    this.state = {
      orgInEdit: this.props.dataItem || null
    };
    this.fUpload = React.createRef();
    this.notif = React.createRef();
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

  onContactIPChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.orgInEdit;
    edited["contact"] = edited["contact"] ? edited["contact"] : {};
    edited["contact"][name] = value;

    this.setState({
      orgInEdit: edited
    });
  };

  onContactPhoneChange = (inValid, newNumber, data, fullNumber) => {
    console.table(inValid, newNumber, data, fullNumber);

    let orgInEdit = { ...this.state.orgInEdit };
    orgInEdit["contact"] = orgInEdit["contact"] ? orgInEdit["contact"] : {};
    orgInEdit["contact"]["phNumber"] = newNumber;
    this.setState({ orgInEdit: orgInEdit, contactValid: inValid });
  };

  sendData = e => {
    e.preventDefault();
    if (this.fUpload.current.firstUpload.cachedFileArray.length == 0) {
      var elm = document.getElementsByClassName("orgFileUploader")[0];
      scrollIntoView(elm, {
        scrollMode: "if-needed",
        block: "center",
        behavior: "smooth",
        inline: "nearest"
      });
      this.notif.current.uploadImage();
    } else {
      PushData(
        "organization",
        this.props.formAction,
        this.state.orgInEdit.uuid,
        {
          name: this.state.orgInEdit.name,
          address: this.state.orgInEdit.address,
          city: this.state.orgInEdit.city,
          state: this.state.orgInEdit.state,
          zip: this.state.orgInEdit.zip,
          logo: this.fUpload.current.firstUpload.cachedFileArray[0],
          languagefile: this.state.orgInEdit.languagefile,
          contact: JSON.stringify({
            firstname: this.state.orgInEdit.contact.firstname,
            lastname: this.state.orgInEdit.contact.lastname,
            email: this.state.orgInEdit.contact.email,
            phone: "232323"
          })
        }
      ).then(response => {
        this.props.action(response.status);
      });
      this.props.cancel();
    }
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <Notification ref={this.notif} />
        <div className="container-fluid">
          <form id="orgForm" onSubmit={this.sendData}>
            <div className="form-group">
              <label>Organization Name</label>
              <Input
                type="text"
                className="form-control"
                value={this.state.orgInEdit.name || ""}
                name="name"
                onChange={this.onDialogInputChange}
                placeholder="Enter Organization Name"
                required={true}
                validationMessage={"Please enter a valid Organization Name"}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                value={this.state.orgInEdit.address || ""}
                name="address"
                onChange={this.onDialogInputChange}
                placeholder="Enter Organization Address"
                style={{ marginTop: "5px" }}
                required={true}
              />
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label>City</label>
                  <div>
                    <Input
                      type="text"
                      className="form-control"
                      value={this.state.orgInEdit.city || ""}
                      name="city"
                      onChange={this.onDialogInputChange}
                      placeholder="Enter City"
                      required={true}
                      validationMessage={"Please enter the city name."}
                    />
                  </div>
                </div>
                <div className="col">
                  <label>State</label>
                  <div>
                    <Input
                      type="text"
                      className="form-control"
                      value={this.state.orgInEdit.state || ""}
                      name="state"
                      onChange={this.onDialogInputChange}
                      placeholder="Enter State"
                      required={true}
                      validationMessage={"Please enter the state name."}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label>Zip Code</label>
                  <Input
                    type="number"
                    value={this.state.orgInEdit.zip || ""}
                    name="zip"
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Zip Code"
                    required={true}
                    validationMessage={"Please enter the Zip Code."}
                  />
                </div>
                <div className="col">
                  <label>Language</label>
                  <Input
                    type="text"
                    value={this.state.orgInEdit.languagefile || ""}
                    name="languagefile"
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Language"
                    required={true}
                    validationMessage={"Please enter the language."}
                  />
                </div>
              </div>
            </div>

            <div className="form-group border-box">
              <label>Contact Details</label>
              <div className="form-row">
                <div className="col">
                  <Input
                    type="text"
                    name="firstname"
                    value={
                      this.state.orgInEdit.contact
                        ? this.state.orgInEdit.contact.firstname
                        : ""
                    }
                    onChange={this.onContactIPChange}
                    placeholder="Enter First Name"
                    required={true}
                  />
                </div>
                <div className="col">
                  <Input
                    type="text"
                    name="lastname"
                    value={
                      this.state.orgInEdit.contact
                        ? this.state.orgInEdit.contact.lastname
                        : ""
                    }
                    onChange={this.onContactIPChange}
                    placeholder="Enter Last Name"
                    required={true}
                  />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: "10px" }}>
                <div className="col">
                  <IntlTelInput
                    containerClassName="intl-tel-input"
                    inputClassName="form-control contactPhone"
                    value={
                      this.state.orgInEdit.contact
                        ? this.state.orgInEdit.contact.phNumber
                        : ""
                    }
                    preferredCountries={["in", "us"]}
                    onPhoneNumberChange={this.onContactPhoneChange}
                    placeholder="Enter Phone Number"
                    // format={true}
                    autoHideDialCode={true}
                  />
                </div>
                <div className="col">
                  <Input
                    type="email"
                    name="email"
                    value={
                      this.state.orgInEdit.contact
                        ? this.state.orgInEdit.contact.email
                        : ""
                    }
                    onChange={this.onContactIPChange}
                    placeholder="Enter Email ID"
                    required={true}
                  />
                </div>
              </div>
            </div>
            <div className="orgFileUploader">
              <FileUploader
                ref={this.fUpload}
                url={this.url}
                media={this.props.dataItem.logo}
                title={"Upload Organization Logo"}
                uploadID={"organizationLogo"}
              />
            </div>
          </form>
        </div>
        <SaveCancel save="orgForm" cancel={this.props.cancel} />
      </Window>
    );
  }
}
