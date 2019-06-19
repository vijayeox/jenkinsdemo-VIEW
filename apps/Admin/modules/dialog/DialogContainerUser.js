import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import { Input } from "@progress/kendo-react-inputs";
import { Ripple } from "@progress/kendo-react-ripple";
import scrollIntoView from "scroll-into-view-if-needed";

import { PushData } from "../components/apiCalls";
import { Notification } from "@oxzion/gui";
import { DateComponent, SaveCancel, DropDown } from "../components/index";

import Codes from "../data/Codes";
import ReactTooltip from "react-tooltip";
import Moment from "moment";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      userInEdit: this.props.dataItem || null
    };
    this.notif = React.createRef();
  }

  valueChange = (field, event) => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit[field] = event.target.value;
    this.setState({ userInEdit: userInEdit });
  };

  onDialogInputChange = event => {
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
    this.notif.current.uploadingData();

    if (this.props.formAction == "post") {
      PushData("user", this.props.formAction, this.props.dataItem.uuid, {
        username: this.state.userInEdit.username,
        password: this.state.userInEdit.password,
        firstname: this.state.userInEdit.firstname,
        lastname: this.state.userInEdit.lastname,
        email: this.state.userInEdit.email,
        date_of_birth: new Moment(this.state.userInEdit.date_of_birth).format(),
        designation: this.state.userInEdit.designation,
        gender: this.state.userInEdit.gender,
        managerid: this.state.userInEdit.managerid,
        date_of_join: new Moment(this.state.userInEdit.date_of_join).format(),
        country: this.state.userInEdit.country
      }).then(response => {
        this.props.action(response.status);
        if (response.status == "success") {
          this.props.cancel();
        } else if (
          response.errors[0].exception.message.indexOf("name_UNIQUE") >= 0
        ) {
          this.notif.current.duplicateEntry();
        } else {
          this.notif.current.failNotification();
        }
      });
    } else if (this.props.formAction == "put") {
      PushData("user", this.props.formAction, this.props.dataItem.uuid, {
        password: this.state.userInEdit.password,
        firstname: this.state.userInEdit.firstname,
        lastname: this.state.userInEdit.lastname,
        email: this.state.userInEdit.email,
        date_of_birth: new Moment(this.state.userInEdit.date_of_birth).format(),
        designation: this.state.userInEdit.designation,
        orgid: this.state.userInEdit.orgid,
        gender: this.state.userInEdit.gender,
        managerid: this.state.userInEdit.managerid,
        date_of_join: new Moment(this.state.userInEdit.date_of_join).format(),
        country: this.state.userInEdit.country
      }).then(response => {
        this.props.action(response.status);
        if (response.status == "success") {
          this.props.cancel();
        } else if (
          response.errors[0].exception.message.indexOf("name_UNIQUE") >= 0
        ) {
          this.notif.current.duplicateEntry();
        } else {
          this.notif.current.failNotification();
        }
      });
    }
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <Notification ref={this.notif} />
        <div id="tooltip" />
        <div className="container-fluid">
          <form onSubmit={this.handleSubmit} id="userForm">
            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label>First Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="firstname"
                    value={this.state.userInEdit.firstname || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter First Name"
                    pattern={"[A-Za-z]+"}
                    minLength={3}
                    required={true}
                    validationMessage={"Please enter a valid First Name"}
                  />
                </div>
                <div className="col">
                  <label>Last Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="lastname"
                    value={this.state.userInEdit.lastname || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Last Name"
                    pattern={"[A-Za-z]+"}
                    minLength={2}
                    required={true}
                    validationMessage={"Please enter a valid Last Name"}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label id="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.userInEdit.email || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter User Email Address"
                    required={true}
                    validationMessage={"Please enter a valid Email Address"}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label>User Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.userInEdit.username || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter User Name"
                    required={true}
                    validationMessage={"Please enter a valid User Name"}
                    data-tip="hello world"
                  />
                </div>
                <div className="col">
                  <label>Designation</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="designation"
                    value={this.state.userInEdit.designation || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Designation"
                    required={true}
                    validationMessage={"Please enter a valid User Name"}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col-4">
                  <label>Manager Assigned</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={"user"}
                      selectedItem={this.state.userInEdit.managerid}
                      onDataChange={e => this.valueChange("managerid", e)}
                      required={true}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <label>Organization</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={"organization"}
                      selectedItem={this.state.userInEdit.orgid}
                      onDataChange={e => this.valueChange("orgid", e)}
                      required={true}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <label>Country</label>
                  <div>
                    <DropDown
                      args={this.core}
                      rawData={Codes}
                      selectedItem={this.state.userInEdit.country}
                      onDataChange={e => this.valueChange("country", e)}
                      required={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col-6">
                  <label>Gender</label>
                  <div className="pt-2">
                    <Ripple>
                      <span className="col-6">
                        <input
                          type="radio"
                          id="mRadio"
                          name="gender"
                          value="Male"
                          className="k-radio"
                          onChange={e => this.valueChange("gender", e)}
                          checked={this.state.userInEdit.gender == "Male"}
                          required
                        />
                        <label
                          className="k-radio-label pl-4 radioLabel"
                          htmlFor="mRadio"
                        >
                          Male
                        </label>
                      </span>
                      <span className="col-4">
                        <input
                          type="radio"
                          id="fRadio"
                          name="gender"
                          value="Female"
                          className="k-radio pl-2"
                          onChange={e => this.valueChange("gender", e)}
                          checked={this.state.userInEdit.gender == "Female"}
                          required
                        />
                        <label
                          className="k-radio-label pl-4 radioLabel"
                          htmlFor="fRadio"
                        >
                          Female
                        </label>
                      </span>
                    </Ripple>
                  </div>
                </div>
                <div className="col-3">
                  <label>Date Of Birth</label>
                  <div>
                    <DateComponent
                      format={"dd-MMM-yyyy"}
                      value={this.state.userInEdit.date_of_birth}
                      change={e => this.valueChange("date_of_birth", e)}
                      required={true}
                    />
                  </div>
                </div>
                <div className="col-3">
                  <label>Date Of Join</label>
                  <div>
                    <DateComponent
                      format={"dd-MMM-yyyy"}
                      value={this.state.userInEdit.date_of_join}
                      change={e => this.valueChange("date_of_join", e)}
                      required={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ margin: "75px" }} />
          </form>
        </div>
        <SaveCancel save="userForm" cancel={this.props.cancel} />
      </Window>
    );
  }
}
