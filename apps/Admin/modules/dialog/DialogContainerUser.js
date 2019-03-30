import React from "react";
import ReactDOM from "react-dom";

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import "@progress/kendo-ui";
import Codes from "../data/Codes";
import ReactTooltip from 'react-tooltip';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import Moment from "moment";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      DOBInEdit: undefined,
      DOJInEdit: undefined,
      userInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false
    };
  }

  componentWillMount() {
    if (this.props.formAction === "add") {
    } else {
      const DOBDate = this.state.userInEdit.date_of_birth;
      const DOJDate = this.state.userInEdit.date_of_join;
      const DOBiso = new Moment(DOBDate, 'YYYY-MM-DD').format();
      const DOJiso = new Moment(DOJDate, 'YYYY-MM_DD').format();
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

  componentDidMount() {
    M.AutoInit();
    M.updateTextFields();

    if (this.props.formAction === "edit") {
      ReactDOM.render(<ReactTooltip
        place="bottom" type="error" effect="solid"
        delayHide={100} delayShow={100}
        html={true}
      />, document.getElementById('tooltip'));
    };
  }

  handleDOJChange = (event) => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit.date_of_join = event.target.value;
    this.setState({ userInEdit: userInEdit })

    var DOJiso = new Moment(event.target.value).format();
    this.setState({ DOJInEdit: DOJiso });
  }

  handleDOBChange = (event) => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit.date_of_birth = event.target.value;
    this.setState({ userInEdit: userInEdit })

    var DOBiso = new Moment(event.target.value).format();
    this.setState({ DOBInEdit: DOBiso });
  }

  countryChange = (event) => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit.country = event.target.value;
    this.setState({ userInEdit: userInEdit })
  }

  genderChange = (event) => {
    let userInEdit = { ...this.state.userInEdit };
    userInEdit.gender = event.target.value;
    this.setState({ userInEdit: userInEdit })
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
    const style = this.props.formAction === "edit" ? { "display": "none" } : {};
    return (
      <Dialog onClose={this.props.cancel}>
        <div id="tooltip"></div>
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
                  data-tip="Warning: </br> Changing the username will lead to loss of some user data, like chat history."
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
              <div className="col s12 example-col">
                <p>Date Of Birth</p>
                <DatePicker
                  format={"dd-MMM-yyyy"}
                  value={this.state.userInEdit.date_of_birth}
                  required={true}
                  onChange={this.handleDOBChange}
                />
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
                  defaultValue={'0'}
                  onChange={this.genderChange}
                  required={true}
                >
                  <option value="0" disabled>Choose your option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
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
              <div className="col s12 example-col">
                <p>Date Of Join</p>
                <DatePicker
                  format={"dd-MMM-yyyy"}
                  value={this.state.userInEdit.date_of_join}
                  onChange={this.handleDOJChange}
                  required={true}
                />
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <select
                  id="UserCountry"
                  value={this.state.userInEdit.country}
                  defaultValue={'0'}
                  onChange={this.countryChange}
                  required={true}
                >
                  <option value="0" disabled>Choose your option</option>
                  {Codes.map((country, key) => (
                    <option key={key} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="UserCountry">Country</label>
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
