import React from "react";
import ReactDOM from "react-dom";

import { Window } from "@progress/kendo-react-dialogs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Input } from "@progress/kendo-react-inputs";
import { Ripple } from "@progress/kendo-react-ripple";
import Cleave from "cleave.js/react";
import scrollIntoView from "scroll-into-view-if-needed";

import { PushData } from "../components/apiCalls";
import PasswordField from "../components/PasswordField";
import EmailField from "../components/EmailField";
import FormField from "../components/FormField";
import { SaveCancel } from "../components/saveCancel";
import { DropDown } from "../components/DropDownList";
import Codes from "../data/Codes";
import ReactTooltip from "react-tooltip";
import Moment from "moment";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      DOBInEdit: undefined,
      DOJInEdit: undefined,
      userInEdit: this.props.dataItem || null,
      countries: Codes
    };
  }

  fieldStateChanged = field => state => {
    console.log(this.state);
    this.setState({ [field]: state.errors.length === 0 });
    if (field == "password") {
      let userInEdit = { ...this.state.userInEdit };
      userInEdit.password = state.value;
      this.setState({ userInEdit: userInEdit });
    }
  };

  emailChanged = this.fieldStateChanged("email");
  cPasswordChanged = this.fieldStateChanged("cPassword");
  passwordChanged = this.fieldStateChanged("password");

  componentWillMount() {
    if (this.props.formAction === "post") {
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
    if (this.props.formAction === "put") {
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
    userInEdit.gender = event.target.value;
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
    if (this.state.email || this.state.password) {
      PushData("user", this.props.formAction, {
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
      }).then(response => {
        this.props.action(response.status);
      });
      this.props.cancel();
    } else {
      var elm = document.getElementById("email");
      scrollIntoView(elm, {
        scrollMode: "if-needed",
        block: "center",
        behavior: "smooth",
        inline: "nearest"
      });
      this.emailChanged;
    }
  };

  render() {
    const { fullname, email, password } = this.state;
    const validateFullname = value => {
      if (value !== this.state.userInEdit.password) {
        this.setState({
          validForm: false
        });
        throw new Error("Fullname is invalid");
      } else {
        this.setState({
          validForm: true
        });
      }
    };
    return (
      <Window onClose={this.props.cancel}>
        <div id="tooltip" />
        <Ripple>
          <div className="container-fluid">
            <form className="k-form" onSubmit={this.handleSubmit} id="userForm">
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
                    <EmailField
                      value={this.state.userInEdit.email || ""}
                      placeholder="Enter Email Address"
                      onStateChanged={this.emailChanged}
                      required={true}
                    />
                  </div>
                </div>
              </div>

              {this.props.formAction === "post" && (
                <div className="form-group border-box">
                  <div className="form-row">
                    <div className="col">
                      <label>Password</label>
                      <PasswordField
                        fieldId="password"
                        label="Password"
                        placeholder="Enter Password"
                        value={this.state.userInEdit.cpassword || ""}
                        onStateChanged={this.passwordChanged}
                        thresholdLength={7}
                        minStrength={3}
                        required={true}
                      />
                    </div>
                    <div className="col">
                      <label>Confirm Password</label>
                      <span
                        className="d-block form-hint"
                        style={{ paddingBottom: "14px" }}
                      >
                        Please enter the same password once more.
                      </span>
                      <FormField
                        type="password"
                        value="hel"
                        value={this.state.userInEdit.cpassword || ""}
                        placeholder="Retype Password"
                        validator={validateFullname}
                        onStateChanged={this.fullnameChanged}
                        required={true}
                      />
                    </div>
                  </div>
                </div>
              )}

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
                  <div className="col-6">
                    <label>Manager Assigned</label>
                    <div>
                      <DropDown
                        args={this.core}
                        mainList={"user"}
                        selectedItem={this.state.userInEdit.managerid}
                        onDataChange={this.managerOnChange}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <label>Country</label>
                    <div>
                      <DropDownList
                        data={this.state.countries}
                        onChange={this.countryOnChange}
                        style={{ width: "200px" }}
                        value={this.state.userInEdit.country}
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
                      <span className="col-6">
                        <input
                          type="radio"
                          id="mRadio"
                          name="gender"
                          value="Male"
                          className="k-radio"
                          onChange={this.genderChange}
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
                          onChange={this.genderChange}
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
                    </div>
                  </div>
                  <div className="col-3">
                    <label>Date Of Birth</label>
                    <div>
                      <DatePicker
                        format={"dd-MMM-yyyy"}
                        value={this.state.userInEdit.date_of_birth}
                        onChange={this.handleDOBChange}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <label>Date Of Join</label>
                    <div>
                      <DatePicker
                        format={"dd-MMM-yyyy"}
                        value={this.state.userInEdit.date_of_join}
                        defaultValue={new Date()}
                        onChange={this.handleDOJChange}
                        required={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ margin: "75px" }} />
            </form>
          </div>
          <SaveCancel form={"userForm"} cancel={this.props.cancel} />
        </Ripple>
      </Window>
    );
  }
}
