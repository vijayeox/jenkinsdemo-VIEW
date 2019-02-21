import React, { Component } from "react";
import Timezones from "./Timezones";

import "./Sample.css";

class Preferences extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      selectedOption1: "On",
      selectedOption2: "On",
      timez: "Pacific/Niue"

    };
    this.handleOptionChange1 = this.handleOptionChange1.bind(this);
    this.handleOptionChange2 = this.handleOptionChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelection=this.onSelection.bind(this);
  }
  handleOptionChange1(changeEvent) {
    this.setState({
      selectedOption1: changeEvent.target.value
    });
  }

  handleOptionChange2(changeEvent) {
    this.setState({
      selectedOption2: changeEvent.target.value
    });
  }
  onSelection(event) {
    this.setState({
      timez: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = {};
    for (const field in this.refs) {
      if (field == "SoundNotification") {
        formData[field] = this.state.selectedOption1;
      }
      if (field == "EmailAlerts") {
        formData[field] = this.state.selectedOption2;
      }
    }
    console.log("-->", formData);
  }
  init() {}
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col s12">
              <div className="input-field col s2">
                <label id="name">Sound Notification</label>
              </div>
              <div className="input-field col s1">
                <label id="name">
                  <input
                    type="radio"
                    name="group1"
                    value="On"
                    onChange={this.handleOptionChange1}
                    ref="SoundNotification"
                    defaultChecked
                  />
                  <span className="m-2">On</span>
                </label>
              </div>
              <div className="input-field col s1">
                <label id="name">
                  <input
                    type="radio"
                    name="group1"
                    value="Off"
                    onChange={this.handleOptionChange1}
                    ref="SoundNotification"
                  />
                  <span>Off</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="row">
              <div className="col s12">
                <div className="input-field col s2">
                  <label id="name">Email Alerts</label>
                </div>
                <div className="input-field col s1">
                  <label id="name">
                    <input
                      type="radio"
                      name="group2"
                      value="On"
                      onChange={this.handleOptionChange2}
                      ref="EmailAlerts"
                      defaultChecked
                    />
                    <span className="m-2">On</span>
                  </label>
                </div>
                <div className="input-field col s1">
                  <label id="name">
                    <input
                      type="radio"
                      name="group2"
                      value="Off"
                      onChange={this.handleOptionChange2}
                      ref="EmailAlerts"
                    />
                    <span>Off</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
            <div className="input-field col s2">

              <label id="name">Local Time Zone*</label>
              </div>
              <div className="input-field col s3">
              <select
                value={this.state.timez}
                onChange={this.onSelection}
                ref="timezone"
              >
                {Timezones.map((timez, key) => (
                  <option key={key} value={timez.label}>
                    {timez.name} (GMT {timez.offset})
                  </option>
                ))}
              </select>
            </div>
            </div>
          </div>

          <div className="row">
            <div className="col s12 input-field">
              <button className="btn waves-effect waves-light" type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default Preferences;
