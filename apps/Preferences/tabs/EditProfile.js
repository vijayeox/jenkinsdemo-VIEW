import React, { Component } from "react";
import Countries from "./Countries";
import M from "materialize-css";
import "./Sample.css";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    //  this.core = this.props.args;
    this.state = {
      heightSet: 0,
      selectedOption: "Male",
      phone: "",
      country: "Afghanistan",
      fields: {},
      errors: {}
    };
    this.onSelect = this.onSelect.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }
  componentDidMount() {
    let elems = document.querySelectorAll(".datepicker");
    console.log(elems);
    M.Datepicker.init(elems, {
      format: "dd/mm/yyyy",
      showClearBtn: true,
      yearRange: 100
    });
    var selectElems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(selectElems, { classes: "createSelect" });
  }
  onSelect(event) {
    this.setState({
      country: event.target.value
    });
  }
  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validateForm()) {
      const formData = {};
      for (const field in this.refs) {
        if (field == "Sex") {
          formData[field] = this.state.selectedOption;
        } else {
          if (this.refs[field].value) {
            formData[field] = this.refs[field].value;
          }
        }
      }
      console.log("-->", formData);
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["firstname"]) {
      formIsValid = false;
      errors["firstname"] = "*Please enter your username.";
    }

    if (typeof fields["firstname"] !== "undefined") {
      if (!fields["firstname"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["firstname"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["lastname"]) {
      formIsValid = false;
      errors["lastname"] = "*Please enter your username.";
    }

    if (typeof fields["lastname"] !== "undefined") {
      if (!fields["lastname"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["lastname"] = "*Please enter alphabet characters only.";
      }
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  init() {}
  render() {
    return (
      <div>
        <button className="waves-effect waves-light btn" id="goBack">
          Back
        </button>

        <form onSubmit={this.handleSubmit}>
        
<div className="row">
            <div className="input-field col s6">
              <input
                id="first_name"
                type="text"
                name="firstname"
                ref="firstname"
                value={this.state.fields.firstname} onChange={this.handleChange}
              />
               <div className="errorMsg">{this.state.errors.firstname}</div>
              <label htmlFor="first_name">First Name</label>
            </div>

            <div className="input-field col s6" margin-right="200px">
              <input
                id="last_name"
                type="text"
                name="lastname"
                ref="lastname"
                value={this.state.fields.lastname} onChange={this.handleChange}
               />     
                 <div className="errorMsg">{this.state.errors.lastname}</div>
              <label htmlFor="last_name">Last Name</label>
            </div>
          </div>


          <div className="row">
            <div className="input-field col s12">
              <input id="email" type="email" className="validate" ref="email" />
              <label htmlFor="email">Email *</label>
            </div>
          </div>

          <div className="row">
            <div className="col s12">
              <input
                className="datepicker"
                placeholder="Date of Birth"
                ref="dateofbirth"
                readOnly={true}
              />
            </div>
          </div>

          <div className="row">
            <div className="col s12">
              <label style={{ fontSize: "15px" }}>Country *</label>
              <select
                value={this.state.country}
                onChange={this.onSelect}
                ref="country"
              >
                {Countries.map((country, key) => (
                  <option key={key} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col s12 input-field">
              <input
                id="contact"
                type="number"
                pattern="[0-9]*"
                className="validate"
                ref="contact"
                inputMode="numeric"
              />
              <label htmlFor="contact">Contact *</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12 input-field">
              <textarea
                id="textarea"
                className="materialize-textarea"
                data-length="200"
                ref="address"
                pattern="[a-zA-z0-9]{1,}"
              />
              <label htmlFor="textarea">Address *</label>
            </div>
          </div>

          <div className="row">
            <div className="col s12">
              <input
                className="datepicker"
                placeholder="Date of Joining"
                ref="dateofjoining"
                readOnly={true}
              />
            </div>
          </div>

          <div className="row">
            <div className="col s12 input-field">
              <input
                id="website"
                type="text"
                className="validate"
                ref="website"
              />
              <label htmlFor="website">Website</label>
            </div>
          </div>

          <div className="row">
            <div className="col s12">
              <label style={{ fontSize: "15px" }}>Sex *</label>
              <label>
                <input
                  type="radio"
                  name="group3"
                  value="Male"
                  onChange={this.handleOptionChange}
                  defaultChecked
                  ref="Sex"
                />
                <span className="m-2">Male</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="group3"
                  value="Female"
                  onChange={this.handleOptionChange}
                  ref="Sex"
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col s12 input-field">
              <textarea
                id="textarea1"
                className="materialize-textarea"
                data-length="200"
                // required
                ref="aboutme"
                pattern="[a-zA-z]{1,}"
              />
              <label htmlFor="texarea1">About Me *</label>
            </div>
          </div>

          <div className="row">
            <div className="col s12 input-field">
              <input
                id="intrest"
                type="text"
                className="validate"
                // required
                ref="interest"
                pattern="[a-zA-z]{1,}"
              />
              <label htmlFor="intrest">Interest *</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12 input-field">
              <button className="btn waves-effect waves-light" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default EditProfile;
