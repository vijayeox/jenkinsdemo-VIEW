import React, { Component } from 'react';
import { render } from 'react-dom';
import { FormControl } from 'react-bootstrap';

class UpdateProfileIcon extends Component {
  constructor() {
    super();
    this.state = {
      file: null
    }
  }
  init() {
  }
  render() {
    return (
      <div className="editProf">
      <div className="row">
      <div className="col s12 input-field">
      <div className="file-field input-field">
      <img src={this.state.file} height="100" width="100"/>
      <i className="material-icons m-4">edit</i>
      <input type="file" onChange={this.handleFileChange} />
      <div className="file-path-wrapper">
      <input className="file-path validate" type="text"></input>
      </div>
      </div>
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

  export default UpdateProfileIcon;