import React from "react";
import ReactDOM from "react-dom";
import { Window } from "@progress/kendo-react-dialogs";
import { Input } from "@progress/kendo-react-inputs";
import { Ripple } from "@progress/kendo-react-ripple";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { FaUserLock } from "react-icons/fa";

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
      userInEdit: [],
      roleList: []
    };
    this.notif = React.createRef();
  }

  componentDidMount() {
    if (this.props.formAction == "put") {
      this.getUserDetails(this.props.dataItem.uuid).then(response => {
        this.setState({
          userInEdit: response.data
        });
      });
    }
  }

  componentDidMount() {
    this.getRolesList().then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName = response.data[i].name;
        var userid = response.data[i].uuid;
        tempUsers.push({ uuid: userid, name: userName });
      }
      this.setState({
        roleList: tempUsers
      });
    });

    if (this.props.formAction == "put") {
      ReactDOM.render(
        <ReactTooltip
          place="bottom"
          type="error"
          effect="solid"
          delayHide={100}
          delayShow={100}
          html={true}
        />,
        document.getElementById("tooltip")
      );
      this.getUserDetails(this.props.dataItem.uuid).then(response => {
        this.setState({
          userInEdit: response.data
        });
      });
    }
  }

  async getRolesList() {
    let helper2 = this.core.make("oxzion/restClient");
    let rolesList = await helper2.request(
      "v1",
      "organization/" + this.props.selectedOrg + "/role",
      {},
      "get"
    );
    return rolesList;
  }

  async getUserDetails(uuid) {
    let helper2 = this.core.make("oxzion/restClient");
    let rolesList = await helper2.request(
      "v1",
      "/user/" + uuid + "/role+a",
      {},
      "get"
    );
    return rolesList;
  }

  valueChange = (field, event) => {
    if (field == "role") {
      let userInEdit = { ...this.state.userInEdit };
      userInEdit[field] = event.target.value;
      const selectedRole = event.target.value.map(x => x.id);
      userInEdit["selectedRole"] = selectedRole;
      this.setState({ userInEdit: userInEdit });
    } else {
      let userInEdit = { ...this.state.userInEdit };
      userInEdit[field] = event.target.value;
      this.setState({ userInEdit: userInEdit });
    }
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
    var userRoles = [];
    for (var i = 0; i <= this.state.userInEdit.role.length - 1; i++) {
      var uid = { uuid: this.state.userInEdit.role[i].uuid };
      userRoles.push(uid);
    }
    if (this.props.formAction == "post") {
      PushData("user", this.props.formAction, this.props.dataItem.uuid, {
        username: this.state.userInEdit.username,
        password: this.state.userInEdit.password,
        firstname: this.state.userInEdit.firstname,
        lastname: this.state.userInEdit.lastname,
        email: this.state.userInEdit.email,
        date_of_birth: new Moment(this.state.userInEdit.date_of_birth).format(
          "YYYY-MM-DD"
        ),
        designation: this.state.userInEdit.designation,
        gender: this.state.userInEdit.gender,
        managerid: this.state.userInEdit.managerid,
        role: userRoles,
        date_of_join: new Moment(this.state.userInEdit.date_of_join).format(
          "YYYY-MM-DD"
        ),
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
          this.notif.current.failNotification(
            "Error",
            response.message ? response.message : null
          );
        }
      });
    } else if (this.props.formAction == "put") {
      PushData("user", this.props.formAction, this.props.dataItem.uuid, {
        password: this.state.userInEdit.password,
        firstname: this.state.userInEdit.firstname,
        lastname: this.state.userInEdit.lastname,
        email: this.state.userInEdit.email,
        date_of_birth: new Moment(this.state.userInEdit.date_of_birth).format(
          "YYYY-MM-DD"
        ),
        designation: this.state.userInEdit.designation,
        gender: this.state.userInEdit.gender,
        managerid: this.state.userInEdit.managerid,
        role: userRoles,
        date_of_join: new Moment(this.state.userInEdit.date_of_join).format(
          "YYYY-MM-DD"
        ),
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
          this.notif.current.failNotification(
            "Error",
            response.message ? response.message : null
          );
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
            {this.props.diableField ? (
              <div className="read-only-mode">
                <h5>(READ ONLY MODE)</h5>
                <FaUserLock />
              </div>
            ) : null}

            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label className="required-label">First Name</label>
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
                    readOnly={this.props.diableField ? true : false}
                    validationMessage={"Please enter a valid First Name"}
                  />
                </div>
                <div className="col">
                  <label className="required-label">Last Name</label>
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
                    readOnly={this.props.diableField ? true : false}
                    validationMessage={"Please enter a valid Last Name"}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label className="required-label">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.userInEdit.email || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter User Email Address"
                    required={true}
                    readOnly={this.props.diableField ? true : false}
                    validationMessage={"Please enter a valid Email Address"}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label className="required-label">User Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.userInEdit.username || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter User Name"
                    required={true}
                    readOnly={this.props.diableField ? true : false}
                    validationMessage={"Please enter a valid User Name"}
                    data-tip="Changing the username will reset the User's chat history."
                  />
                </div>
                <div className="col">
                  <label className="required-label">Designation</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="designation"
                    value={this.state.userInEdit.designation || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Designation"
                    required={true}
                    readOnly={this.props.diableField ? true : false}
                    validationMessage={"Please enter a valid User Name"}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col-4">
                  <label className="required-label">Gender</label>
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
                          disabled={this.props.diableField ? true : false}
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
                          disabled={this.props.diableField ? true : false}
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
                <div className="col-4">
                  <label className="required-label">Manager Assigned</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={
                        "organization/" + this.props.selectedOrg + "/users"
                      }
                      selectedItem={this.state.userInEdit.managerid}
                      onDataChange={e => this.valueChange("managerid", e)}
                      required={true}
                      disableItem={this.props.diableField}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <label className="required-label">Country</label>
                  <div>
                    <DropDown
                      args={this.core}
                      rawData={Codes}
                      selectedItem={this.state.userInEdit.country}
                      onDataChange={e => this.valueChange("country", e)}
                      required={true}
                      disableItem={this.props.diableField}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col-6">
                  <label className="required-label">Role</label>
                  <MultiSelect
                    data={this.state.roleList}
                    onChange={e => {
                      this.valueChange("role", e);
                    }}
                    value={this.state.userInEdit.role}
                    clearButton={false}
                    textField="name"
                    dataItemKey="uuid"
                    placeholder={"Select User Roles"}
                    disabled={this.props.diableField ? true : false}
                    required={true}
                  />
                </div>
                <div className="col-3">
                  <label className="required-label">Date Of Birth</label>
                  <div>
                    <DateComponent
                      format={this.props.userPreferences.dateformat}
                      value={this.state.userInEdit.date_of_birth}
                      change={e => this.valueChange("date_of_birth", e)}
                      required={true}
                      disabled={this.props.diableField ? true : false}
                    />
                  </div>
                </div>
                <div className="col-3">
                  <label className="required-label">Date Of Join</label>
                  <div>
                    <DateComponent
                      format={this.props.userPreferences.dateformat}
                      value={this.state.userInEdit.date_of_join}
                      change={e => this.valueChange("date_of_join", e)}
                      required={true}
                      disabled={this.props.diableField ? true : false}
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
