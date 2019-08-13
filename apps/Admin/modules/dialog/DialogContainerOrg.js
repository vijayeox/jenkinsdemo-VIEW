import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { Input } from "@progress/kendo-react-inputs";
import { PushDataPOST } from "../components/apiCalls";
import { FileUploader, Notification } from "@oxzion/gui";
import { SaveCancel, TimezonePicker, DropDown } from "../components/index";
import scrollIntoView from "scroll-into-view-if-needed";
import IntlTelInput from "react-intl-tel-input";
import Codes from "../data/Codes";
import "react-intl-tel-input/dist/main.css";
import { FaUserLock } from "react-icons/fa";

import CurrencySelect from "../components/Currency Select/currencySelect.js";

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
    this.onContactPhoneChange = this.onContactPhoneChange.bind(this);
    this.imageExists = this.props.dataItem.logo ? true : false;
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
    let orgInEdit = { ...this.state.orgInEdit };
    orgInEdit["contact"] = orgInEdit["contact"] ? orgInEdit["contact"] : {};
    orgInEdit["contact"]["phone"] = fullNumber.replace(/\s|-/g, "");
    this.setState({ orgInEdit: orgInEdit, contactValid: inValid });
  };

  dropdownChange = (field, event) => {
    let orgInEdit = { ...this.state.orgInEdit };
    orgInEdit[field] = event.target.value;
    this.setState({ orgInEdit: orgInEdit });
  };

  valueChange = (field, event) => {
    let orgInEdit = { ...this.state.orgInEdit };
    orgInEdit["preferences"] = orgInEdit["preferences"]
      ? orgInEdit["preferences"]
      : {};
    orgInEdit["preferences"][field] = event;

    this.setState({ orgInEdit: orgInEdit });
  };

  pushData = () => {
    this.notif.current.uploadingData();
    if (this.props.formAction == "post") {
      var contactData = JSON.stringify({
        firstname: this.state.orgInEdit.contact.firstname,
        lastname: this.state.orgInEdit.contact.lastname,
        username: this.state.orgInEdit.contact.username,
        email: this.state.orgInEdit.contact.email,
        phone: "+" + this.state.orgInEdit.contact.phone
      });
    } else {
      var contactData = [];
      var contact_id = this.state.orgInEdit.contactid;
    }

    let tempData = {
      name: this.state.orgInEdit.name,
      address: this.state.orgInEdit.address,
      city: this.state.orgInEdit.city,
      state: this.state.orgInEdit.state,
      country: this.state.orgInEdit.country,
      zip: this.state.orgInEdit.zip,
      logo: this.fUpload.current.firstUpload.cachedFileArray[0],
      contact: contactData,
      contactid: contact_id || null,
      preferences: JSON.stringify({
        dateformat: this.state.orgInEdit.preferences.dateformat,
        currency: this.state.orgInEdit.preferences.currency,
        timezone: this.state.orgInEdit.preferences.timezone
      })
    };

    for (var i = 0; i <= Object.keys(tempData).length; i++) {
      let propertyName = Object.keys(tempData)[i];
      if (tempData[propertyName] == undefined) {
        delete tempData[propertyName];
      }
    }
    PushDataPOST(
      "organization",
      this.props.formAction,
      this.state.orgInEdit.uuid,
      tempData
    ).then(response => {
      this.props.action(response.status);
      if (response.status == "success") {
        this.props.cancel();
      } else if (
        response.errors[0].exception.message.indexOf("name_UNIQUE") >= 0
      ) {
        this.notif.current.duplicateEntry();
      } else {
        this.notif.current.failNotification(
          "Error",
          response.message ? response.message : null
        );
      }
    });
  };

  sendData = e => {
    e.preventDefault();
    if (this.imageExists) {
      this.pushData();
    } else {
      if (this.fUpload.current.firstUpload.cachedFileArray.length == 0) {
        var elm = document.getElementsByClassName("orgFileUploader")[0];
        scrollIntoView(elm, {
          scrollMode: "if-needed",
          block: "center",
          behavior: "smooth",
          inline: "nearest"
        });
        this.notif.current.customWarningNotification(
          "No image selected",
          "Please choose a logo for the Organization."
        );
      } else {
        this.pushData();
      }
    }
  };

  render() {
    if (typeof this.state.orgInEdit.contact == "undefined") {
      var contactValue = "";
    } else {
      var contactValue = this.state.orgInEdit.contact.phone
        ? this.state.orgInEdit.contact.phone
        : "";
    }
    return (
      <Window onClose={this.props.cancel}>
        <Notification ref={this.notif} />
        <div className="container-fluid">
          <form id="orgForm" onSubmit={this.sendData}>
            {this.props.diableField ? (
              <div className="read-only-mode">
                <h5>(READ ONLY MODE)</h5>
                <FaUserLock />
              </div>
            ) : null}
            <div className="form-group">
              <label className="required-label">Organization Name</label>
              <Input
                type="text"
                className="form-control"
                value={this.state.orgInEdit.name || ""}
                name="name"
                onChange={this.onDialogInputChange}
                placeholder="Enter Organization Name"
                required={true}
                validationMessage={"Please enter a valid Organization Name"}
                readOnly={this.props.diableField ? true : false}
              />
            </div>
            <div className="form-group text-area-custom">
              <label className="required-label">Address</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                value={this.state.orgInEdit.address || ""}
                name="address"
                onChange={this.onDialogInputChange}
                placeholder="Enter Organization Address"
                style={{ marginTop: "5px" }}
                required={true}
                readOnly={this.props.diableField ? true : false}
              />
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label className="required-label">City</label>
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
                      readOnly={this.props.diableField ? true : false}
                    />
                  </div>
                </div>
                <div className="col">
                  <label className="required-label">State</label>
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
                      readOnly={this.props.diableField ? true : false}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label className="required-label">Zip Code</label>
                  <Input
                    type="number"
                    value={this.state.orgInEdit.zip || ""}
                    name="zip"
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Zip Code"
                    required={true}
                    validationMessage={"Please enter the Zip Code."}
                    readOnly={this.props.diableField ? true : false}
                  />
                </div>
                <div className="col">
                  <label className="required-label">Country</label>
                  <div>
                    <DropDown
                      args={this.core}
                      rawData={Codes}
                      selectedItem={this.state.orgInEdit.country}
                      onDataChange={e => this.dropdownChange("country", e)}
                      required={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {this.props.formAction == "put" ? (
              <div className="form-group">
                <div className="form-row">
                  <div className="col">
                    <label className="required-label">
                      Organization Contact Person (Admin)
                    </label>
                    <div>
                      <DropDown
                        args={this.core}
                        mainList={
                          "organization/" +
                          this.props.dataItem.uuid +
                          "/adminusers"
                        }
                        selectedItem={this.state.orgInEdit.contactid}
                        onDataChange={e => this.dropdownChange("contactid", e)}
                        required={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {this.props.formAction == "post" ? (
              <div className="form-group border-box">
                <label className="required-label">Contact Details</label>
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
                      validationMessage={"Please enter the First Name."}
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
                      validationMessage={"Please enter the Last Name."}
                    />
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="col">
                    <Input
                      type="text"
                      name="username"
                      value={
                        this.state.orgInEdit.contact
                          ? this.state.orgInEdit.contact.username
                          : ""
                      }
                      onChange={this.onContactIPChange}
                      placeholder="Enter User Name"
                      required={true}
                      validationMessage={"Please enter the First Name."}
                    />
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="col">
                    <IntlTelInput
                      containerClassName="intl-tel-input"
                      inputClassName="form-control contactPhone"
                      value={contactValue}
                      preferredCountries={["in", "us"]}
                      onPhoneNumberChange={this.onContactPhoneChange}
                      placeholder="Enter Phone Number"
                      autoHideDialCode={true}
                      formatOnInit={false}
                      formatFull={false}
                      telInputProps={{
                        required: true,
                        pattern: "++[0-9]"
                      }}
                      format={false}
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
            ) : null}

            <div className="form-group border-box">
              <label className="required-label">Organization Preferences</label>
              <div className="form-row pt-3 pb-3">
                <div className="col">
                  <label className="required-label">Currency</label>
                  <CurrencySelect
                    id={"select-currency"}
                    name={"currency"}
                    onChange={e => this.valueChange("currency", e.target.value)}
                    value={
                      this.state.orgInEdit.preferences
                        ? this.state.orgInEdit.preferences.currency
                        : ""
                    }
                    readOnly={this.props.diableField ? true : false}
                  />
                </div>

                <div className="col" style={{ display: "flex" }}>
                  <label
                    style={{ position: "absolute" }}
                    className="required-label"
                  >
                    Date Format
                  </label>
                  <div
                    style={{
                      marginTop: "34px",
                      width: "inherit"
                    }}
                  >
                    <DropDown
                      args={this.core}
                      disableItem={this.props.diableField}
                      rawData={[
                        "19-06-2019  (dd-MM-yyyy)",
                        "19-Jun-2019 (dd-MMM-yyyy)",
                        "2019-06-19  (yyyy-MM-dd)",
                        "06-19-2019  (MM-dd-yyyy)"
                      ]}
                      selectedItem={
                        this.state.orgInEdit.preferences
                          ? this.state.orgInEdit.preferences.dateformat
                          : ""
                      }
                      onDataChange={e => {
                        var start = e.target.value.indexOf("(") + 1;
                        var end = e.target.value.indexOf(")");
                        this.valueChange(
                          "dateformat",
                          e.target.value.slice(start, end)
                        );
                      }}
                      required={true}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row" style={{ marginTop: "5px" }}>
                <div className="col timeZonePicker">
                  <label className="required-label">Timezone</label>
                  <TimezonePicker
                    onChange={e => this.valueChange("timezone", e)}
                    disableItem={this.props.diableField}
                    value={
                      this.state.orgInEdit.preferences
                        ? this.state.orgInEdit.preferences.timezone
                        : ""
                    }
                    inputProps={{
                      placeholder: "Select Organization Timezone",
                      name: "timezone",
                      required: true,
                      readOnly: this.props.diableField ? true : false,
                      autoComplete: "off"
                    }}
                  />
                </div>
              </div>
            </div>

            {this.props.diableField ? (
              <div style={{ margin: "50px" }} />
            ) : (
              <div className="orgFileUploader">
                <FileUploader
                  ref={this.fUpload}
                  required={true}
                  media_type={"image"}
                  media_URL={this.props.dataItem.logo}
                  title={"Upload Organization Logo"}
                  uploadID={"organizationLogo"}
                />
              </div>
            )}
          </form>
        </div>
        <SaveCancel
          save="orgForm"
          cancel={this.props.cancel}
          hideSave={this.props.diableField}
        />
      </Window>
    );
  }
}
