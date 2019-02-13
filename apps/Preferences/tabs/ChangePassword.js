import React, { Component } from 'react';
import { render } from 'react-dom';
import { FormControl } from 'react-bootstrap';

class ChangePassword extends Component {
  constructor() {
    super();
  }
  init() {
  }
  render() {
    return (<div className="form">
        <div className="row">
          <div className="col s12 input-field">
            <input id="old" type="password" className="validate" />
            <label for="old">Old Password *</label>
          </div>
          </div>
        <div className="row">
          <div className="col s12 input-field">
            <input id="new" type="password" className="validate" />
            <label for="new">New Password *</label>
          </div>
          </div>
          
        <div className="row">
          <div className="col s12 input-field">
            <input id="confirm" type="password" className="validate" />
            <label for="confirm">Confirm Password *</label>
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

export default ChangePassword;