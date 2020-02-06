import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { Input } from "@progress/kendo-react-inputs";
import { GetSingleEntityData, PushDataPOST } from "../components/apiCalls";
import { FileUploader, Notification } from "../../GUIComponents";
import { SaveCancel, DropDown, CurrencySelect } from "../components/index";
import { filterBy } from "@progress/kendo-data-query";
import scrollIntoView from "scroll-into-view-if-needed";
import PhoneInput from "react-phone-number-input";
import Codes from "../data/Codes";
import timezoneCode from "OxzionGUI/public/js/Timezones.js";

import { DropDownList } from "@progress/kendo-react-dropdowns";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.url = this.core.config("wrapper.url");
    this.state = {
      orgInEdit: this.props.dataItem || null,
      contactName: null,
      timeZoneValue: [],
      timezoneList: timezoneCode
    };
    this.countryByIP = undefined;
    this.fUpload = React.createRef();
    this.notif = React.createRef();
    this.onContactPhoneChange = this.onContactPhoneChange.bind(this);
    this.imageExists = this.props.dataItem.logo ? true : false;
  }

  UNSAFE_componentWillMount() {
    if (this.props.formAction == "put") {
      this.setState({
        timeZoneValue: {
          label: this.state.orgInEdit.preferences.timezone,
          name: this.state.orgInEdit.preferences.timezone,
          offset: 100
        }
      });

      GetSingleEntityData(
        "organization/" +
          this.props.dataItem.uuid +
          "/user/" +
          this.props.dataItem.contactid +
          "/profile"
      ).then(response => {
        this.setState({
          contactName: {
            id: "111",
            name: response.data.name
          }
        });
      });
    } else {
      getCountryByIP().then(data => (this.countryByIP = data.country));
    }
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

  onContactPhoneChange = fullNumber => {
    let orgInEdit = { ...this.state.orgInEdit };
    orgInEdit["contact"] = orgInEdit["contact"] ? orgInEdit["contact"] : {};
    orgInEdit["contact"]["phone"] = fullNumber;
    this.setState({ orgInEdit: orgInEdit });
  };

  dropdownChange = (field, event) => {
    let orgInEdit = { ...this.state.orgInEdit };
    orgInEdit[field] = event.target.value;
    this.setState({ orgInEdit: orgInEdit });
    if (field == "contactid") {
      this.setState({ contactName: event.target.value });
    }
  };

  valueChange = (field, event) => {
    if (field == "timezone") {
      this.setState({
        timeZoneValue: event
      });
      let orgInEdit = { ...this.state.orgInEdit };
      orgInEdit["preferences"] = orgInEdit["preferences"]
        ? orgInEdit["preferences"]
        : {};
      orgInEdit["preferences"][field] = event.name;
      this.setState({ orgInEdit: orgInEdit });
    } else {
      let orgInEdit = { ...this.state.orgInEdit };
      orgInEdit["preferences"] = orgInEdit["preferences"]
        ? orgInEdit["preferences"]
        : {};
      orgInEdit["preferences"][field] = event;
      this.setState({ orgInEdit: orgInEdit });
    }
  };

  validateEmail(emailText) {
    var pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    if (!pattern.test(emailText)) {
      this.notif.current.notify(
        "Invalid Email ID",
        "Please enter a valid email address.",
        "warning"
      );
      return true;
    }
  }

  activateOrganization(tempData) {
    MySwal.fire({
      title: "Organization already exists",
      text: "Do you want to reactivate the Organization?",
      imageUrl: "apps/Admin/091-email-1.svg",
      imageWidth: 75,
      imageHeight: 75,
      confirmButtonText: "Reactivate",
      confirmButtonColor: "#d33",
      showCancelButton: true,
      cancelButtonColor: "#66bb6a",
      target: ".Window_Admin"
    }).then(result => {
      if (result.value) {
        tempData.reactivate = "1";
        PushDataPOST(
          "organization",
          this.props.formAction,
          this.state.orgInEdit.uuid,
          tempData
        ).then(response => {
          if (response.status == "success") {
            this.props.action(response);
            this.props.cancel();
          } else {
            this.notif.current.notify(
              "Error",
              response.message ? response.message : null,
              "danger"
            );
          }
        });
      }
    });
  }

  pushData = () => {
    if (
      document.getElementById("select-currency").value !==
      this.state.orgInEdit.preferences.currency
    ) {
      this.notif.current.notify(
        "Invalid Currency",
        "Please choose a valid currency from the list.",
        "warning"
      );
      return;
    }
    if (this.props.formAction == "post") {
      if (
        this.validateEmail(
          document.getElementById("email-id").value
            ? document.getElementById("email-id").value
            : "dummydata@mail.com"
        )
      ) {
        return;
      }
    }

    this.notif.current.notify(
      "Uploading Data",
      "Please wait for a few seconds.",
      "default"
    );
    if (this.props.formAction == "post") {
      var contactData = JSON.stringify({
        firstname: this.state.orgInEdit.contact.firstname,
        lastname: this.state.orgInEdit.contact.lastname,
        username: this.state.orgInEdit.contact.username,
        email: this.state.orgInEdit.contact.email,
        phone: this.state.orgInEdit.contact.phone
      });
      var logoFile = this.fUpload.current.state.selectedFile[0].getRawFile();
    } else {
      var contactData = [];
      var contact_id = this.state.orgInEdit.contactid;
      var logoFile = this.fUpload.current.state.selectedFile[0]
        ? this.fUpload.current.state.selectedFile[0].getRawFile()
        : undefined;
    }

    let tempData = {
      name: this.state.orgInEdit.name,
      address: this.state.orgInEdit.address,
      city: this.state.orgInEdit.city,
      state: this.state.orgInEdit.state,
      country: this.state.orgInEdit.country,
      zip: this.state.orgInEdit.zip,
      logo: logoFile,
      contact: contactData,
      contactid: contact_id || null,
      preferences: JSON.stringify({
        dateformat: this.state.orgInEdit.preferences.dateformat,
        currency: this.state.orgInEdit.preferences.currency,
        timezone: this.state.orgInEdit.preferences.timezone.name
          ? this.state.orgInEdit.preferences.timezone.name
          : this.state.orgInEdit.preferences.timezone
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
      if (response.status == "success") {
        this.props.action(response);
        this.props.cancel();
      } else if (
        response.message ==
        "Organization already exists would you like to reactivate?"
      ) {
        this.activateOrganization(tempData);
      } else {
        this.notif.current.notify(
          "Error",
          response.message ? response.message : null,
          "danger"
        );
      }
    });
  };

  sendData = e => {
    e.preventDefault();
    if (this.imageExists) {
      this.pushData();
    } else {
      if (this.fUpload.current.state.selectedFile.length == 0) {
        var elm = document.getElementsByClassName("orgFileUploader")[0];
        scrollIntoView(elm, {
          scrollMode: "if-needed",
          block: "center",
          behavior: "smooth",
          inline: "nearest"
        });
        this.notif.current.notify(
          "No image selected",
          "Please choose a logo for the Organization.",
          "warning"
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
                <i class="fa fa-lock"></i>
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
                maxLength="100"
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
                maxLength="250"
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
                      maxLength="50"
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
                      maxLength="50"
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
                    type="text"
                    className="form-control"
                    value={this.state.orgInEdit.zip || ""}
                    name="zip"
                    pattern="[0-9]+"
                    maxLength="6"
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Zip Code"
                    required={true}
                    validationMessage={"Please enter a valid Zip Code."}
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
                        preFetch={true}
                        selectedItem={this.state.contactName}
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
                      className="form-control"
                      type="text"
                      name="firstname"
                      value={
                        this.state.orgInEdit.contact
                          ? this.state.orgInEdit.contact.firstname
                          : ""
                      }
                      maxLength="50"
                      onChange={this.onContactIPChange}
                      placeholder="Enter First Name"
                      required={true}
                      validationMessage={"Please enter the First Name."}
                    />
                  </div>
                  <div className="col">
                    <Input
                      className="form-control"
                      type="text"
                      name="lastname"
                      value={
                        this.state.orgInEdit.contact
                          ? this.state.orgInEdit.contact.lastname
                          : ""
                      }
                      maxLength="50"
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
                      className="form-control"
                      type="text"
                      name="username"
                      value={
                        this.state.orgInEdit.contact
                          ? this.state.orgInEdit.contact.username
                          : ""
                      }
                      maxLength="25"
                      onChange={this.onContactIPChange}
                      placeholder="Enter User Name"
                      required={true}
                      validationMessage={"Please enter the First Name."}
                    />
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="col">
                    <PhoneInput
                      placeholder="Enter phone number"
                      value={contactValue}
                      onChange={phone => this.onContactPhoneChange(phone)}
                      international={false}
                      country="US"
                      maxLength="15"
                      required={true}
                      country={this.countryByIP ? this.countryByIP : "IN"}
                      countryOptions={["US", "IN", "CA", "|", "..."]}
                    />
                  </div>
                  <div className="col">
                    <Input
                      className="form-control"
                      type="email"
                      name="email"
                      id="email-id"
                      value={
                        this.state.orgInEdit.contact
                          ? this.state.orgInEdit.contact.email
                          : ""
                      }
                      maxLength="250"
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
                  <div>
                    <DropDownList
                      data={this.state.timezoneList}
                      textField="name"
                      dataItemKey="name"
                      value={this.state.timeZoneValue}
                      onChange={e =>
                        this.valueChange("timezone", e.target.value)
                      }
                      style={{ width: "100%" }}
                      popupSettings={{ height: "160px" }}
                      filterable={true}
                      onFilterChange={e => {
                        this.setState({
                          timezoneList: filterBy(timezoneCode, e.filter)
                        });
                      }}
                      required={true}
                    />
                  </div>
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
                  acceptFileTypes={"image/*"}
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

async function getCountryByIP() {
  let response = await fetch(`https://get.geojs.io/v1/ip/country.json`);
  let data = await response.json();
  return data;
}
