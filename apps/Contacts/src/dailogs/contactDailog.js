import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import { ContactTypes } from "../data";
import Countries from "../data/Countries";
import { ProfilePictureWidget } from "../widgets";
import { SaveContact } from "../services/services";
import Notification from "OxzionGUI/Notification";

import { ContactTypeEnum, IconTypeEnum } from "../enums";
import PhoneInput from "react-phone-number-input";

class ContactDailog extends React.Component {
  constructor(props) {
    super(props);
    
    this.core = this.props.args;
    this.state = {
      contactDetails: {},
      tempPhoneData: { type: "Other", value: "" },
      tempEmailData: { type: "Other", value: "" },
      icon: null,
      errors: {
        first_name: true
      },
      countryWiseStates:Countries
    };
    this.notif = React.createRef();
    this.loader = this.core.make("oxzion/splash");
  }

  componentWillMount() {
    this.setState(
      {
        contactDetails: this.cloneContact(this.props.contactDetails)
      },
      () => {
        const { contactDetails } = this.state;
        if (contactDetails.first_name) {
          if (contactDetails.first_name.length > 0) {
            let { errors } = this.state;
            errors.first_name = false;
            this.setState({
              errors
            });
          }
        }
      }
    );
  }

  cloneContact = contactDetails => {
    return Object.assign({}, contactDetails);
  };

  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    let contactDetails = { ...this.state.contactDetails };
    contactDetails[name] = value;
    this.setState({ contactDetails: contactDetails });
    if (name == "first_name") {
      let { errors } = this.state;
      if (value.length > 0) {
        errors.first_name = false;
        this.setState({
          errors
        });
      } else {
        errors.first_name = true;
        this.setState({
          errors
        });
      }
    }
  };

  removeItem = (key, type) => {
    event.preventDefault();
    let dataList;
    if (type == "phone") {
      dataList = this.state.contactDetails.phone_list;
    } else if (type == "email") {
      dataList = this.state.contactDetails.email_list;
    }
    dataList.map((data, index) => {
      if (key == index) {
        dataList.splice(index, 1);
        this.setState({
          dataList
        });
      }
    });
  };

  handleChange = e => {
    e.preventDefault();
    if (e.target.name == "newEmailValue") {
      let tempEmailData = this.state.tempEmailData;
      tempEmailData.value = e.target.value;
      this.setState({
        tempEmailData
      });
    } else if (e.target.name == "newPhoneType") {
      let tempPhoneData = this.state.tempPhoneData;
      tempPhoneData.type = e.target.value;
      this.setState({
        tempPhoneData
      });
    } else if (e.target.name == "newEmailType") {
      let tempEmailData = this.state.tempEmailData;
      tempEmailData.type = e.target.value;
      this.setState({
        tempEmailData
      });
    }
  };

  handlePhoneChange = (phone, name) => {
    if (name == "phone_1") {
      let contactDetails = { ...this.state.contactDetails };
      contactDetails["phone_1"] = phone;
      this.setState({ contactDetails: contactDetails });
    } else if (name == "newPhoneValue") {
      let tempPhoneData = this.state.tempPhoneData;
      tempPhoneData.value = phone;
      this.setState({
        tempPhoneData
      });
    }
  };

  handleAdd = (e, type) => {
    e.preventDefault();
    if (type == "addNewPhone") {
      let contactDetails = this.state.contactDetails;
      if (contactDetails.phone_list) {
        contactDetails.phone_list.push({ ...this.state.tempPhoneData });
      } else {
        contactDetails.phone_list = new Array();
        contactDetails.phone_list.push({ ...this.state.tempPhoneData });
      }
      this.setState({
        contactDetails,
        tempPhoneData: { type: "Other", value: "" }
      });
    } else if (type == "addNewEmail") {
      let contactDetails = this.state.contactDetails;
      if (contactDetails.email_list) {
        contactDetails.email_list.push({ ...this.state.tempEmailData });
      } else {
        contactDetails.email_list = new Array();
        contactDetails.email_list.push({ ...this.state.tempEmailData });
      }

      this.setState({
        contactDetails,
        tempEmailData: { type: "Other", value: "" }
      });
    }
  };

  handleProfilePic = (icon, iconType) => {
    console.log(icon);
    console.log(iconType);
    let contactDetails = this.state.contactDetails;
    contactDetails.icon_type =
      iconType == true ? IconTypeEnum.default : IconTypeEnum.selected;
    contactDetails.icon = icon;
    this.setState({
      contactDetails
    });
  };

  saveContactService = (uuid, data) => {
    this.loader.show();
    SaveContact(uuid, data).then(response => {
      if (response.status == "success") {
        this.setState({ contactDetails: {} }, () => this.props.success());
        //close on success
      } else {
        this.notif.current.notify(
          "Error",
          "Operation failed" + response.message,
          "danger"
        )
        
      }
      this.loader.destroy();
    });
  };

  saveContact = () => {
    const { contactDetails, errors } = this.state;
    if (errors.first_name) {
      this.notif.current.notify(
        "Error",
        "Please fill required fields.",
        "danger"
      )
      return;
    }
    let data = {};
    if (contactDetails.phone_1 || contactDetails.email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (contactDetails.email && !re.test(contactDetails.email)) {
        this.notif.current.notify(
          "Error",
          "Primary email is not valid.",
          "danger"
        )
        return;
      }
    } else {
      this.notif.current.notify(
        "Error",
        "Either primary phone or email is mandatory.",
        "danger"
      )
      return;
    }
    if (Object.keys(contactDetails).length != 0) {
      for (var i = 0; i < Object.keys(contactDetails).length; i++) {
        if ([Object.keys(contactDetails)[i]] == "icon") {
          data.icon = contactDetails.icon;
        } else if (
          [Object.keys(contactDetails)[i]] == "phone_list" ||
          [Object.keys(contactDetails)[i]] == "email_list"
        ) {
          data[Object.keys(contactDetails)[i]] = JSON.stringify(
            contactDetails[Object.keys(contactDetails)[i]]
          );
        } else {
          data[Object.keys(contactDetails)[i]] =
            contactDetails[Object.keys(contactDetails)[i]];
        }
      }
    }

    if (contactDetails.contact_type == ContactTypeEnum.orgContact) {
      //contact_Type : 2 = orgContact, if trying to add orgContact to myContact
      if (
        data.icon_type === null ||
        data.icon_type === undefined ||
        data.icon_type === ""
      ) {
        data.icon_type = IconTypeEnum.default;
      }
      this.saveContactService("", data);
    } else if (contactDetails.uuid) {
      // edited from myContact
      // remove user_id = null, because we are sending as form data, backend it considered as string.
      if (data.user_id == null) {
        delete data.user_id;
      }
      this.saveContactService(contactDetails.uuid, data);
    } else {
      // New Contact
      data.icon_type = IconTypeEnum.selected; //Setting icon_type 0 for new contact
      this.saveContactService("", data);
    }
  };

  contactTypeDropDown = (typeName, type) => {
    return (
      <select
        className="form-control"
        name={typeName}
        placeholder="Contact Type."
        value={type}
        onChange={this.handleChange}
      >
        {ContactTypes.map((data, key) => {
          return (
            <option value={data.value} key={key}>
              {data.label}
            </option>
          );
        })}
      </select>
    );
  };

  additionalContactListData = (data, key, type) => {
    return (
      <span key={key}>
        <div className="col-3 displayInline ">
          <p>
            <b>{data.type}:</b>
          </p>
        </div>
        <div className="col-7 displayInline">
          <p>{data.value}</p>
        </div>
        <div className="col-2 displayInline paddingNone">
          <button
            className="btn btn-danger trashButton"
            onClick={() => this.removeItem(key, type)}
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      </span>
    );
  };

  additionalPhoneNumberData = () => {
    return (
      <span>
        <label htmlFor="phone_1">Additional Phone</label> <br />
        {this.state.contactDetails.phone_list &&
          this.state.contactDetails.phone_list.length > 0 &&
          this.state.contactDetails.phone_list.map((phone, key) => {
            return this.additionalContactListData(phone, key, "phone");
          })}
        <div className="col-3 displayInline paddingNone">
          {this.contactTypeDropDown(
            "newPhoneType",
            this.state.tempPhoneData.type
          )}
        </div>
        <div className="col-7 displayInline">
          <PhoneInput
            international={false}
            country="US"
            name="newPhoneValue"
            placeholder="Enter phone."
            maxLength="15"
            countryOptions={["US", "IN", "CA", "|", "..."]}
            value={this.state.tempPhoneData.value}
            onChange={phone => this.handlePhoneChange(phone, "newPhoneValue")}
          />
        </div>
        <div className="col-2 displayInline paddingNone">
          <button
            className="btn btn-primary"
            onClick={e => this.handleAdd(e, "addNewPhone")}
          >
            ADD
          </button>
        </div>
      </span>
    );
  };

  additionalEmailData = () => {
    return (
      <span>
        <label htmlFor="email">Additional Email</label> <br />
        {this.state.contactDetails.email_list &&
          this.state.contactDetails.email_list.length > 0 &&
          this.state.contactDetails.email_list.map((email, key) => {
            return this.additionalContactListData(email, key, "email");
          })}
        <div className="col-3 displayInline paddingNone">
          {this.contactTypeDropDown(
            "newEmailType",
            this.state.tempEmailData.type
          )}
        </div>
        <div className="col-7 displayInline">
          <input
            type="text"
            className="form-control inputHeight"
            name="newEmailValue"
            placeholder="Enter email."
            value={this.state.tempEmailData.value}
            onChange={this.handleChange}
          />
        </div>
        <div className="col-2 displayInline paddingNone">
          <button
            className="btn btn-primary"
            onClick={e => this.handleAdd(e, "addNewEmail")}
          >
            ADD
          </button>
        </div>
      </span>
    );
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        
        <Notification ref={this.notif} />
        <div className="contactPanel addEditPanel">
          <div className="contactForm">
            <div className="row">
              <div className="col-6">
                <div className="row">
                  <div className="col-12 form-group">
                    <label htmlFor="first_name">First Name *</label>
                    <input
                      type="text"
                      className="form-control inputHeight"
                      name="first_name"
                      placeholder="Enter first name."
                      value={
                        this.state.contactDetails.first_name
                          ? this.state.contactDetails.first_name
                          : ""
                      }
                      onChange={this.handleUserInput}
                      required
                    />
                    {this.state.errors.first_name && (
                      <span className="errorLabel">
                        First name is required.
                      </span>
                    )}
                  </div>

                  <div className="col-12 form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      className="form-control inputHeight"
                      name="last_name"
                      placeholder="Enter last name."
                      value={
                        this.state.contactDetails.last_name
                          ? this.state.contactDetails.last_name
                          : ""
                      }
                      onChange={this.handleUserInput}
                    />
                  </div>

                  <div className="col-12 form-group">
                    <label htmlFor="country">Country</label>
                    <select
                      className="form-control inputHeight"
                      name="country"
                      placeholder="Select country."
                      value={
                        this.state.contactDetails.country
                          ? this.state.contactDetails.country
                          : ""
                      }
                      onChange={this.handleCountryChange}
                    >
                      <option disabled value="">
                        Select country
                      </option>
                      {Countries.map((country, key) => {
                        return (
                          <option key={key} value={country.name}>
                            {country.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="row">
                  <div className="col-6 profileImage">
                    <ProfilePictureWidget
                      args={this.core}
                      contactDetails={this.state.contactDetails}
                      handleProfilePic={this.handleProfilePic}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="row">
                  <div className="col-4 form-group">
                    <label htmlFor="state">State</label>
                    <select
                      className="form-control inputHeight"
                      name="state"
                      placeholder="Select state."
                      value={
                        this.state.contactDetails.state
                          ? this.state.contactDetails.state
                          : ""
                      }
                      onChange={this.handleUserInput}
                    >
                      <option disabled value="">
                        Select city
                      </option>
                      {this.state.countryWiseStates.map((state, key) => {
                        return (
                          <option key={key} value={state.name}>
                            {state.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="col-4 form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      className="form-control inputHeight"
                      name="city"
                      placeholder="Enter city."
                      value={
                        this.state.contactDetails.city
                          ? this.state.contactDetails.city
                          : ""
                      }
                      onChange={this.handleUserInput}
                    />
                  </div>

                  <div className="col-4 form-group">
                    <label htmlFor="zip">Zip</label>
                    <input
                      type="text"
                      className="form-control inputHeight"
                      name="zip"
                      placeholder="Enter zip."
                      value={
                        this.state.contactDetails.zip
                          ? this.state.contactDetails.zip
                          : ""
                      }
                      onChange={this.handleUserInput}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="row">
                  <div className="col-6 form-group">
                    <label htmlFor="phone_1">Address line 1</label>
                    <textarea
                      row={4}
                      className="form-control"
                      name="address_1"
                      placeholder="Enter address."
                      value={
                        this.state.contactDetails.address_1
                          ? this.state.contactDetails.address_1
                          : ""
                      }
                      onChange={this.handleUserInput}
                    />
                  </div>

                  <div className="col-6 form-group">
                    <label htmlFor="phone_1">Address line 2</label>
                    <textarea
                      row={4}
                      className="form-control"
                      name="address_2"
                      placeholder="Enter address."
                      value={
                        this.state.contactDetails.address_2
                          ? this.state.contactDetails.address_2
                          : ""
                      }
                      onChange={this.handleUserInput}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="row">
                  <div className="form-group col-6">
                    <label htmlFor="company_name">Company Name</label>
                    <input
                      type="text"
                      className="form-control inputHeight"
                      name="company_name"
                      placeholder="Enter company name. "
                      value={
                        this.state.contactDetails.company_name
                          ? this.state.contactDetails.company_name
                          : ""
                      }
                      onChange={this.handleUserInput}
                    />
                  </div>

                  <div className="col-6 form-group">
                    <label htmlFor="designation">Designation</label>
                    <input
                      type="text"
                      className="form-control inputHeight"
                      name="designation"
                      placeholder="Enter designation."
                      value={
                        this.state.contactDetails.designation
                          ? this.state.contactDetails.designation
                          : ""
                      }
                      onChange={this.handleUserInput}
                    />
                  </div>
                </div>
              </div>

              <div className="col-6">
                <label htmlFor="phone_1">Primary Phone</label>
                <div className="col-12 form-group paddingNone">
                  <PhoneInput
                    international={false}
                    country="US"
                    name="phone_1"
                    placeholder="Enter primary phone."
                    maxLength="15"
                    countryOptions={["US", "IN", "CA", "|", "..."]}
                    value={
                      this.state.contactDetails.phone_1
                        ? this.state.contactDetails.phone_1
                        : ""
                    }
                    onChange={phone => this.handlePhoneChange(phone, "phone_1")}
                  />
                </div>
                {this.additionalPhoneNumberData()}
              </div>

              <div className="col-6">
                <label htmlFor="email">Primary Email</label>
                <div className="col-12 form-group paddingNone">
                  <input
                    type="email"
                    className="form-control inputHeight"
                    name="email"
                    placeholder="Enter primary email."
                    value={
                      this.state.contactDetails.email
                        ? this.state.contactDetails.email
                        : ""
                    }
                    onChange={this.handleUserInput}
                  />
                </div>
                {this.additionalEmailData()}
              </div>

              <div className="col-12">
                <div className="row">
                  <div className="col-12 form-group">
                    <label htmlFor="phone_1">Address</label>
                    <textarea
                      row={4}
                      className="form-control"
                      name="address_1"
                      placeholder="Enter address."
                      value={
                        this.state.contactDetails.address_1
                          ? this.state.contactDetails.address_1
                          : ""
                      }
                      onChange={this.handleUserInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="submitCancelButtonDiv">
          <button
            className="btn btn-success"
            onClick={() => this.saveContact()}
          >
            Save
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              this.setState({ contactDetails: {} }, () => this.props.cancel());
            }}
          >
            Cancel
          </button>
        </div>
      </Window>
    );
  }
}

export default ContactDailog;
