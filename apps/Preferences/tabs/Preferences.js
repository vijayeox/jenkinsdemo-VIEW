import React, { Component } from 'react';
import { render } from 'react-dom';
import { FormControl } from 'react-bootstrap';

class Preferences extends Component {
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
      <div className="row">
            <div className="col s12">
              <div className="input-field col s8">
                    <label>Sound Notification</label>
              </div>
              <div className="input-field col s4">
                 <div className="switch">
                 <label>
                      <input type="checkbox"/>
                         <span className="lever"></span>
                  </label>
                </div>
              </div>
        </div>
        </div>
      );
  }
}
export default Preferences;