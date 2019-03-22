import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Tooltip } from "@progress/kendo-popups-react-wrapper";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import "../../public/js/materialize.js";
import "@progress/kendo-ui";
import Codes from "../data/Codes";

import {
  MaskedTextBox,
  NumericTextBox,
  Input,
  Switch
} from "@progress/kendo-react-inputs";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.date_of_birth = null;
    this.doj = null;
    this.state = {
      userInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false
    };

    this.warning = "Changing username will clear your chat history!";
  }
  componentDidMount() {
    M.AutoInit();
    M.updateTextFields();

    var datePick = document.querySelectorAll(".datepicker");
    var instances = M.Datepicker.init(datePick, { format: "yyyy-mm-dd" });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  async pushData() {
    let helper = this.core.make("oxzion/restClient");
    let userAddData = await helper.request(
      "v1",
      "/user",
      {
        username: this.state.userInEdit.username,
        password: this.state.userInEdit.password,
        firstname: this.state.userInEdit.firstname,
        lastname: this.state.userInEdit.lastname,
        name:
          this.state.userInEdit.firstname +
          " " +
          this.state.userInEdit.lastname,
        email: this.state.userInEdit.email,
        date_of_birth: this.state.userInEdit.date_of_birth,
        designation: this.state.userInEdit.designation,
        gender: this.state.userInEdit.gender,
        managerid: this.state.userInEdit.managerid,
        date_of_join: this.state.userInEdit.doj,
        hobbies: this.state.userInEdit.hobbies,
        phone: this.state.userInEdit.phone,
        country: this.state.userInEdit.country,
        address: this.state.userInEdit.address,
        about: this.state.userInEdit.about,
        interest: this.state.userInEdit.interest,
        signature: this.state.userInEdit.signature
      },
      "post"
    );
    return userAddData;
  }

  async editUser() {
    let helper = this.core.make("oxzion/restClient");
    let orgEditData = await helper.request(
      "v1",
      "/user/" + this.state.userInEdit.id,
      {
        username: this.state.userInEdit.username,
        firstname: this.state.userInEdit.firstname,
        lastname: this.state.userInEdit.lastname,
        name:
          this.state.userInEdit.firstname +
          " " +
          this.state.userInEdit.lastname,
        email: this.state.userInEdit.email,
        date_of_birth: this.state.userInEdit.date_of_birth,
        designation: this.state.userInEdit.designation,
        gender: this.state.userInEdit.gender,
        managerid: this.state.userInEdit.managerid,
        date_of_join: this.state.userInEdit.doj,
        hobbies: this.state.userInEdit.hobbies,
        phone: this.state.userInEdit.phone,
        country: this.state.userInEdit.country,
        address: this.state.userInEdit.address,
        about: this.state.userInEdit.about,
        interest: this.state.userInEdit.interest,
        signature: this.state.userInEdit.signature
      },
      "put"
    );
  }

  onDialogInputChange = event => {
    M.updateTextFields();

    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.userInEdit;
    edited[name] = value;

    this.setState({
      userInEdit: edited
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    var self = this;
    if (this.props.formAction == "edit") {
      this.editUser();
      this.props.action();
    } else {
      this.pushData().then(response => {
        var addResponse = response.data.id;
        this.props.action(addResponse);
      });
      this.props.action();
    }
    this.props.save();
  };

  render() {
    const style = this.props.formAction === "edit" ? {"display" : "none"} : {}
    return (
      <Dialog onClose={this.props.cancel}>
        <div className="row">
          <form className="col s12" onSubmit={this.submitData} id="userForm">
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserFName"
                  type="text"
                  className="validate"
                  name="firstname"
                  value={this.state.userInEdit.firstname || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserFName">First Name</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserLName"
                  type="text"
                  className="validate"
                  name="lastname"
                  value={this.state.userInEdit.lastname || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserLName">Last Name</label>
              </div>
            </div>

            <Tooltip content={this.warning}>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="UserUsername"
                    type="text"
                    className="validate"
                    name="username"
                    value={this.state.userInEdit.username || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="UserUsername">User Name</label>
                </div>
              </div>
            </Tooltip>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserEmail"
                  type="email"
                  className="validate"
                  name="email"
                  value={this.state.userInEdit.email || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserEmail">Email</label>
              </div>
            </div>
            <div className="row" style={style}>
              <div className="input-field col s12">
                <input
                  id="UserPassword"
                  type="text"
                  className="validate"
                  name="password"
                  value={this.state.userInEdit.password || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserPassword">Password</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserDOB"
                  type="text"
                  className="datepicker validate"
                  name="date_of_birth"
                  value={this.state.userInEdit.date_of_birth || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserDOB">Date Of Birth</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserDesignation"
                  type="text"
                  className="validate"
                  name="designation"
                  value={this.state.userInEdit.designation || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserDesignation">Designation</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <select
                  id="UserGender"
                  type="text"
                  className="validate"
                  name="gender"
                  value={this.state.userInEdit.gender || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                >
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
                <label htmlFor="UserGender">Gender</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserManagerid"
                  type="number"
                  className="validate"
                  name="managerid"
                  value={this.state.userInEdit.managerid || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserManagerid">Manager ID</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserDOJ"
                  type="text"
                  className="datepicker validate"
                  name="date_of_join"
                  value={this.state.userInEdit.date_of_join || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserDOJ">Date Of Join</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <select
                  id="UserCountry"
                  value={this.state.userInEdit.country}
                  onChange={this.onDialogInputChange}
                >
                  {Codes.map((country, key) => (
                    <option key={key} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="UserCountry">Country</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserHobbies"
                  type="text"
                  className="validate"
                  name="hobbies"
                  value={this.state.userInEdit.hobbies || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserHobbies">Hobbies</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserPhone"
                  type="text"
                  className="validate"
                  name="phone"
                  value={this.state.userInEdit.phone || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserPhone">Phone</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <textarea
                  id="UserAddress"
                  type="text"
                  className="materialize-textarea validate"
                  name="address"
                  value={this.state.userInEdit.address || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserAddress">Address</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserAbout"
                  type="text"
                  className="validate"
                  name="about"
                  value={this.state.userInEdit.about || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserAbout">About</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserInterest"
                  type="text"
                  className="validate"
                  name="interest"
                  value={this.state.userInEdit.interest || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserInterest">Interest</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="UserSignature"
                  type="text"
                  className="validate"
                  name="signature"
                  value={this.state.userInEdit.signature || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="UserSignature">Signature</label>
              </div>
            </div>
          </form>
        </div>

        <DialogActionsBar args={this.core}>
          <button className="k-button" onClick={this.props.cancel}>
            Cancel
          </button>
          <button className="k-button k-primary" type="submit" form="userForm">
            Save
          </button>
        </DialogActionsBar>
      </Dialog>
    );
  }
}
