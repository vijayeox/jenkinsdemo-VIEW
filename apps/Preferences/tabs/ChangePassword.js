import React, { Component } from "react";
import Notification from "OxzionGUI/Notification"
import { Form, InputGroup, Button, Col, Row } from 'react-bootstrap'
import { Tooltip } from 'reactstrap'

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      type: "password",
      type1: "password",
      type2: "password",
      tooltipOpen: false,
      pass_length: "black",
      pass_lowcase: "black",
      pass_upcase: "black",
      pass_num: "black",
      pass_spl: "black",
      fields: {},
      errors: {}
    };
    this.changePassword = this.changePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showHide = this.showHide.bind(this);
    this.showHide1 = this.showHide1.bind(this);
    this.showHide2 = this.showHide2.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.notif = React.createRef();
  }

  async changePassword(formData) {
    let helper = this.core.make("oxzion/restClient");
    let response = await helper.request(
      "v1",
      "/user/me/changepassword",
      formData,
      "post"
    );
    return response;
  }
  valid_pass() {
    if (this.state.pass_length === "green" && this.state.pass_num === "green" && this.state.pass_lowcase === "green" && this.state.pass_upcase === "green" && this.state.pass_spl === "green") {
      
      let errors={}
      errors["new_password"]=""
      this.setState({ tooltipOpen: false,errors:errors })

    }
    else {
      this.setState({ tooltipOpen: true })
    }
  }
  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
    //tool tip functionality
    if (e.target.name === "new_password") {

      (fields["new_password"].length < 8) ? this.setState({ pass_length: "red" }, () => { this.valid_pass() }) : this.setState({ pass_length: "green" }, () => { this.valid_pass() })
      var re = /[0-9]/;
      !re.test(fields["new_password"]) ? this.setState({ pass_num: "red" }, () => { this.valid_pass() }) : this.setState({ pass_num: "green" }, () => { this.valid_pass() })
      re = /[a-z]/;
      !re.test(fields["new_password"]) ? this.setState({ pass_lowcase: "red" }, () => { this.valid_pass() }) : this.setState({ pass_lowcase: "green" }, () => { this.valid_pass() })
      re = /[A-Z]/;
      !re.test(fields["new_password"]) ? this.setState({ pass_upcase: "red" }, () => { this.valid_pass() }) : this.setState({ pass_upcase: "green" }, () => { this.valid_pass() })
      re = /[$ & + , : ; = ? @ # | ' < > . - ^ * ( ) % !]/;
      !re.test(fields["new_password"]) ? this.setState({ pass_spl: "red" }, () => { this.valid_pass() }) : this.setState({ pass_spl: "green" }, () => { this.valid_pass() })


    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validateForm()) {
      const formData = {};
      Object.keys(this.state.fields).map(key => {
        formData[key] = this.state.fields[key];
      });

      this.changePassword(formData).then(response => {
        if (response.status == "error") {
          this.notif.current.notify(
            "Error",
            response.message,
            "danger"
          )
        } else {
          this.notif.current.notify(
            "Success",
            "Password updated successfully.",
            "success"
            )
          let fields = this.state.fields;
          fields['old_password'] = '';
          fields['new_password'] = '';
          fields['confirm_password'] = '';
          this.setState({
            fields
          });
          for(var i=0; i<document.getElementsByClassName("passwordField").length; i++){
            document.getElementsByClassName("passwordField")[i].value = '';
          }
        }
      });
    }
  }
  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === "text" ? "password" : "text",
      showPassText: this.state.showPassText === "Show" ? "Hide" : "Show"
    });
  }
  showHide1(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type1: this.state.type1 === "text" ? "password" : "text"
    });
  }
  showHide2(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type2: this.state.type2 === "text" ? "password" : "text"
    });
  }

  toggleToolTip(bool_value) {
    this.setState({ tooltipOpen: bool_value })
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["old_password"]) {
      formIsValid = false;
      errors["old_password"] = "*Please enter your Old Password.";
    }

    if (!fields["new_password"]) {
      formIsValid = false;
      errors["new_password"] = "*Please enter your New Password.";
    }

    if (!fields["confirm_password"]) {
      formIsValid = false;
      errors["confirm_password"] = "*Please confirm your password.";
    }

    if (fields["new_password"] != fields["confirm_password"]) {
      formIsValid = false;
      errors["confirm_password"] = "*Password does not match.";
    }
    if (fields["new_password"].length < 8) {
      formIsValid = false;
      errors["new_password"] =
        "Password must contain at least eight characters!";
    }
    var re = /[0-9]/;
    if (!re.test(fields["new_password"])) {
      formIsValid = false;
      errors["new_password"] =
        "Password must contain at least one number (0-9)!";
    }

    re = /[a-z]/;
    if (!re.test(fields["new_password"])) {
      formIsValid = false;
      errors["new_password"] =
        "Password must contain at least one lowercase letter (a-z)!";
    }

    re = /[A-Z]/;
    if (!re.test(fields["new_password"])) {
      formIsValid = false;
      errors["new_password"] =
        "Password must contain at least one uppercase letter (A-Z)!";
    }

    re = /[$ & + , : ; = ? @ # | ' < > . - ^ * ( ) % !]/;
    if (!re.test(fields["new_password"])) {
      formIsValid = false;
      errors["new_password"] =
        "Password must contain at least one Special Character($&+,:;=?@#|'<>.-^*()%!)!";
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  init() { }
  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="confirm-password-form preferenceForm">
        <Notification ref={this.notif} />
          <div className="row">
          <div className="col-md-12">
        <Form.Group>
          <Form.Label>Old Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={this.state.type}
              name="old_password"
              className="passwordField"
              onChange={this.handleChange}
            />
            <InputGroup.Append>
              <Button className="preferenceForm-showbtn" onClick={this.showHide}>{this.state.type === "text" ? "Hide" : "Show"}</Button>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted errorMsg">
            {this.state.errors.old_password}
          </Form.Text>
        </Form.Group>
      </div>
      </div>

          <div className="row">
          <div className="col-md-12">
        <Form.Group>
          <Form.Label>New Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={this.state.type1}
              name="new_password"
              onClick={() => this.toggleToolTip(this.state.tooltipOpen)}
              onChange={this.handleChange}
              id="newPassword"
              className="passwordField"
              onBlur={() => this.toggleToolTip(false)}
            />
            <InputGroup.Append>
              <Button className="preferenceForm-showbtn" onClick={this.showHide1}>{this.state.type1 === "text" ? "Hide" : "Show"}</Button>
            </InputGroup.Append>
          </InputGroup>
          <Tooltip target="newPassword" isOpen={this.state.tooltipOpen} placement="bottom-end" style={{ background: "rgb(231, 222, 234)", color: "black", fontSize: ".675rem", width: "200px" }}>
            <Row style={{ marginLeft: "2px" }}>Password Must Contain</Row>
            <Row style={{ color: this.state.pass_length, marginLeft: "2px" }} > at least 8 characters</Row>
            <Row style={{ color: this.state.pass_num, marginLeft: "2px" }}> at least one number (0-9)</Row>
            <Row style={{ color: this.state.pass_lowcase, marginLeft: "2px" }}> at least one lowercase letter (a-z)</Row>
            <Row style={{ color: this.state.pass_upcase, marginLeft: "2px" }}> at least one uppercase letter (A-Z)</Row>
            <Row style={{ color: this.state.pass_spl, marginLeft: "2px" }}>at least one special character</Row>
          </Tooltip>
          <Form.Text className="text-muted errorMsg">
            {this.state.errors.new_password}
          </Form.Text>
        </Form.Group>
        </div>
        </div>

          <div className="row">
          <div className="col-md-12">
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={this.state.type2}
              name="confirm_password"
              className="passwordField"
              onChange={this.handleChange}
            />
            <InputGroup.Append>
              <Button className="preferenceForm-showbtn" onClick={this.showHide2}>{this.state.type2 === "text" ? "Hide" : "Show"}</Button>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted errorMsg">
            {this.state.errors.confirm_password}
          </Form.Text>
            </Form.Group>
      </div>
      </div>
        <Button type="submit" className="pull-right preferenceForm-btn">Save</Button>
      </Form>
    );
  }
}

export default ChangePassword;
