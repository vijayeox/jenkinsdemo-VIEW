import React, { Component } from 'react';
import { render } from 'react-dom';
import { FormControl } from 'react-bootstrap';

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  init() {
  }
  render() {
    return (
      <div className="form">
      <div className="row">
      <div className="input-field col s6">
      <input id="first_name" type="text" className="validate" />
      <label htmlFor="first_name">First Name</label>
      </div>
      <div className="input-field col s6" margin-right="200px">
      <input id="last_name" type="text" className="validate" />
      <label htmlFor="last_name">Last Name</label>
      </div>
      </div>

      <div className="row">
      <div className="input-field col s12">
      <input id="email" type="email" className="validate" />
      <label htmlFor="email">Email *</label>
      </div>
      </div>

      <div className="row">
      <div className="col s12">
      <label>Email Alerts</label>
      <label><input type="radio" name="group1" defaultChecked ></input>
      <span className="m-2">On</span>
      </label>
      <label>
      <input type="radio" name="group1" />
      <span>Off</span></label>
      </div>
      </div>

      <div className="row">
      <div className="col s12" id="date1">
      <input type="text" className="datepicker" placeholder="Date of Birth" />
      </div>
      </div>

      <div className="row">
      <div className="col s12 input-field">
      <label>Local Time Zone *</label>
      </div>
      </div>

      <div className="row">
      <div className="col s12 input-field">
      <input id="contact" type="text" className="validate" />
      <label htmlFor="contact">Contact *</label>
      </div>
      </div>

      <div className="row">
      <div className="col s12">
      <textarea id="textarea" className="materialize-textarea" data-length="200" />
      <label htmlFor="textarea">Address *</label>
      </div>
      </div>

      <div className="row">
      <div className="col s12">
      <input type="text" className="datepicker" placeholder="Date of Joining" />
      </div>
      </div>

      <div className="row">
      <div className="col s12 input-field">
      <input id="website" type="text" className="validate" />
      <label htmlFor="website">Website *</label>
      </div>
      </div>

      <div className="row">
      <div className="col s12">
      <label>Sex *</label>
      <label><input type="radio" name="group2" defaultChecked></input><span className="m-2">Male</span></label>
      <label><input type="radio" name="group2"></input><span>Female</span></label>
      </div>
      </div>

      <div className="row">
      <div className="col s12 input-field">
      <textarea id="textarea1" className="materialize-textarea" data-length="200" />
      <label htmlFor="texarea1">About Me *</label>
      </div>
      </div>

      <div className="row">
      <div className="col s12 input-field">
      <input id="intrest" type="text" className="validate" />
      <label htmlFor="intrest">Interest *</label>
      </div>
      </div>
      <div className="row">
      <div className="col s12 input-field">
      <button>Save</button>
      </div>
      </div>
      </div>
      );
  }
}

export default EditProfile;