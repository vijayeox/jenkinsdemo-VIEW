import React from "react";
import ReactDOM from "react-dom";

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";
import "@progress/kendo-ui";
import Codes from "../data/Codes";
import ReactTooltip from "react-tooltip";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Moment from "moment";

import withValueField from "./withValueField.js";
const DropDownListWithValueField = withValueField(DropDownList);

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.masterUserList = this.props.usersList;
    this.state = {
      DOBInEdit: undefined,
      DOJInEdit: undefined,
      userInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false,
      date1: null,
      date2: null,
      usersList: this.props.usersList,
      value: null,
      value1: null,
      countries: Codes
    };
    this.getUserData().then(response => {
      this.setState({ usersList: response.data });
    });
  }
  componentWillMount() {
    if (this.props.formAction === "add") {
    } else {
      let userInEditTemp = { ...this.state.userInEdit };
      if (
        this.state.userInEdit.date_of_birth == "0000-00-00" ||
        this.state.userInEdit.date_of_birth == null ||
        this.state.userInEdit.date_of_join == "0000-00-00" ||
        this.state.userInEdit.date_of_join == null
      ) {
        if (
          this.state.userInEdit.date_of_birth == "0000-00-00" ||
          this.state.userInEdit.date_of_birth == null
        ) {
          userInEditTemp.date_of_birth = "";
          this.setState({ userInEdit: userInEditTemp });
          this.setState({ DOBInEdit: "" });
        } else {
          const DOBDate = this.state.userInEdit.date_of_birth;
          const DOBiso = new Moment(DOBDate, "YYYY-MM-DD").format();
          const DOBkendo = new Date(DOBiso);

          userInEditTemp.date_of_birth = DOBkendo;
          this.setState({ userInEdit: userInEditTemp });

          this.setState({ DOBInEdit: DOBiso });
        }
        if (
          this.state.userInEdit.date_of_join == "0000-00-00" ||
          this.state.userInEdit.date_of_join == null
        ) {
          userInEditTemp.date_of_join = null;
          this.setState({ userInEdit: userInEditTemp });

          this.setState({ DOJInEdit: null });
        } else {
          const DOJDate = this.state.userInEdit.date_of_join;
          const DOJiso = new Moment(DOJDate, "YYYY-MM_DD").format();
          const DOJkendo = new Date(DOJiso);

          userInEditTemp.date_of_join = DOJkendo;
          this.setState({ userInEdit: userInEditTemp });

          this.setState({ DOJInEdit: DOJiso });
        }
      } else {
        const DOBDate = this.state.userInEdit.date_of_birth;
        const DOJDate = this.state.userInEdit.date_of_join;
        const DOBiso = new Moment(DOBDate, "YYYY-MM-DD").format();
        const DOJiso = new Moment(DOJDate, "YYYY-MM_DD").format();
        const DOBkendo = new Date(DOBiso);
        const DOJkendo = new Date(DOJiso);

        let userInEdit = { ...this.state.userInEdit };
        userInEdit.date_of_birth = DOBkendo;
        userInEdit.date_of_join = DOJkendo;
        this.setState({ userInEdit: userInEdit });

        this.setState({ DOBInEdit: DOBiso });
        this.setState({ DOJInEdit: DOJiso });
      }
    }
  }

  componentDidMount() {
    M.updateTextFields();

    if (this.props.formAction === "edit") {
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
    }
  }

  handleDOJChange = event => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit.date_of_join = event.target.value;
    this.setState({ userInEdit: userInEdit });

    var DOJiso = new Moment(event.target.value).format();
    this.setState({ DOJInEdit: DOJiso });
  };

  handleDOBChange = event => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit.date_of_birth = event.target.value;
    this.setState({ userInEdit: userInEdit });

    var DOBiso = new Moment(event.target.value).format();
    this.setState({ DOBInEdit: DOBiso });
  };

  managerOnChange = event => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit.managerid = event.target.value;
    this.setState({ userInEdit: userInEdit });
  };

  countryOnChange = event => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit.country = event.target.value[0];
    this.setState({ userInEdit: userInEdit });
  };

  genderChange = event => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit.gender = event.value;
    this.setState({ userInEdit: userInEdit });
  };

  async getUserData() {
    let helper = this.core.make("oxzion/restClient");
    let userData = await helper.request("v1", "/user", {}, "get");
    return userData.data;
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
        email: this.state.userInEdit.email,
        date_of_birth: this.state.DOBInEdit,
        designation: this.state.userInEdit.designation,
        gender: this.state.userInEdit.gender,
        managerid: this.state.userInEdit.managerid,
        date_of_join: this.state.DOJInEdit,
        country: this.state.userInEdit.country
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
        email: this.state.userInEdit.email,
        date_of_birth: this.state.DOBInEdit,
        designation: this.state.userInEdit.designation,
        gender: this.state.userInEdit.gender,
        managerid: this.state.userInEdit.managerid,
        date_of_join: this.state.DOJInEdit,
        country: this.state.userInEdit.country
      },
      "put"
    );
    return orgEditData;
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

  filterChange = event => {
    this.setState({
      usersList: this.filterData(event.filter)
    });
  };

  filterData(filter) {
    const data = this.masterUserList.slice();
    return filterBy(data, filter);
  }

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    if (this.props.formAction == "edit") {
      this.editUser().then(response => {
        this.props.action();
      });
    } else {
      this.pushData().then(response => {
        var addResponse = response.data.id;
        this.props.action(addResponse);
      });
    }
    this.props.save();
  };

  render() {
    const style = this.props.formAction === "edit" ? { display: "none" } : {};

    return (
      <Dialog onClose={this.props.cancel}>
        <div id="tooltip" />
        <div className="row">
          <form className="col s12" onSubmit={this.submitData} id="userForm">
            <div className="row">
              <div className="input-field col s12">
                <Input
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
                <Input
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
                <Input
                  id="UserUsername"
                  type="text"
                  className="validate"
                  name="username"
                  value={this.state.userInEdit.username || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                  data-tip="Warning: </br> Changing the username will lead to loss of some user data, like chat history."
                />
                <label htmlFor="UserUsername">User Name</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <Input
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
                <Input
                  id="UserPassword"
                  type="password"
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
              <div className="col s12 example-col" id="datecol">
                <div>
                  <label id="label1">Date Of Birth</label>
                </div>
                <DatePicker
                  format={"dd-MMM-yyyy"}
                  value={this.state.userInEdit.date_of_birth}
                  onChange={this.handleDOBChange}
                />
              </div>
            </div>

            <div className="row">
              <div
                className="input-field col s12"
                style={{ marginBottom: "7px" }}
              >
                <Input
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
              <div className="input-field col s12 gendersel">
                <div>
                  <label htmlFor="UserGender" id="label1">
                    Gender
                  </label>
                </div>
                <div className="col s3 input-field gender1">
                  <label>
                    <Input
                      id="UserGender"
                      className="validate"
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={this.genderChange}
                      checked={this.state.userInEdit.gender == "Male"}
                    />
                    <span id="name">Male</span>
                  </label>
                </div>
                <div className="col s3 input-field gender2">
                  <label>
                    <Input
                      id="UserGender"
                      className="validate"
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={this.genderChange}
                      checked={this.state.userInEdit.gender == "Female"}
                    />
                    <span id="name">Female</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <p style={{ marginTop: "0px" }}>
                  <label style={{ fontSize: "12px" }}>Manager Assigned</label>{" "}
                </p>
                <DropDownListWithValueField
                  data={this.state.usersList}
                  textField="name"
                  value={this.state.userInEdit.managerid}
                  valueField="id"
                  onChange={this.managerOnChange}
                  filterable={true}
                  onFilterChange={this.filterChange}
                  style={{ width: "200px" }}
                  popupSettings={{ height: "170px" }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col s12 example-col" id="datecol">
                <div>
                  <label id="label1">Date Of Join</label>
                </div>
                <DatePicker
                  format={"dd-MMM-yyyy"}
                  value={this.state.userInEdit.date_of_join}
                  defaultValue={new Date()}
                  onChange={this.handleDOJChange}
                  required={true}
                />
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <div>
                  <label id="label1">Country</label>
                </div>
                <DropDownList
                  data={this.state.countries}
                  onChange={this.countryOnChange}
                  style={{ width: "200px" }}
                  value={this.state.userInEdit.country}
                />
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
