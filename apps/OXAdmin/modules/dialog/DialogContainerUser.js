import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
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
    this.dob = null;
    this.doj = null;
    this.state = {
      userInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false
    };
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
        gamelevel: this.state.userInEdit.gamelevel,
        username: this.state.userInEdit.username,
        password: this.state.userInEdit.password,
        firstname: this.state.userInEdit.firstname,
        lastname: this.state.userInEdit.lastname,
        name:
          this.state.userInEdit.firstname +
          " " +
          this.state.userInEdit.lastname,
        role: this.state.userInEdit.role,
        email: this.state.userInEdit.email,
        date_of_birth: this.state.userInEdit.dob,
        designation: this.state.userInEdit.designation,
        country: this.state.userInEdit.country,
        gender: this.state.userInEdit.sex,
        managerid: this.state.userInEdit.managerid,
        level: this.state.userInEdit.level,
        date_of_join: this.state.userInEdit.doj,
        listtoggle: this.state.userInEdit.listtoggle,
        mission_link: this.state.userInEdit.mission_link
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
      // JSON.stringify(formData),
      {
        gamelevel: this.state.userInEdit.gamelevel,
        username: this.state.userInEdit.username,
        password: this.state.userInEdit.password,
        firstname: this.state.userInEdit.firstname,
        lastname: this.state.userInEdit.lastname,
        name:
          this.state.userInEdit.firstname +
          " " +
          this.state.userInEdit.lastname,
        role: this.state.userInEdit.role,
        email: this.state.userInEdit.email,
        dob: this.state.userInEdit.dob,
        designation: this.state.userInEdit.designation,
        country: this.state.userInEdit.country,
        sex: this.state.userInEdit.sex,
        managerid: this.state.userInEdit.managerid,
        level: this.state.userInEdit.level,
        doj: this.state.userInEdit.doj,
        listtoggle: this.state.userInEdit.listtoggle,
        mission_link: this.state.userInEdit.mission_link
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
    return (
      <Validator>
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

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="UserDOB"
                    type="text"
                    className="datepicker validate"
                    name="dob"
                    value={this.state.userInEdit.dob || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="UserDOB">Date Of Birth</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <select
                    id="UserSex"
                    type="text"
                    className="validate"
                    name="sex"
                    value={this.state.userInEdit.sex || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  >
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </select>
                  <label htmlFor="UserSex">Gender</label>
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
                    id="UserGamelevel"
                    type="text"
                    className="validate"
                    name="gamelevel"
                    value={this.state.userInEdit.gamelevel || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="UserGamelevel">Game Level</label>
                </div>
              </div>

              <div className="row">
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
                    id="UserRole"
                    type="text"
                    className="validate"
                    name="role"
                    value={this.state.userInEdit.role || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="UserRole">Role</label>
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
            </form>
          </div>

          <DialogActionsBar args={this.core}>
            <button className="k-button" onClick={this.props.cancel}>
              Cancel
            </button>
            <button
              className="k-button k-primary"
              type="submit"
              form="userForm"
            >
              Save
            </button>
          </DialogActionsBar>
        </Dialog>
      </Validator>
    );
  }
}
