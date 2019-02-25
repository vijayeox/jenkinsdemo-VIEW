import React, { Component } from "react";
import Timezones from "./Timezones";
import M from "materialize-css";
// import "./Sample.css";

class Preferences extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      file: null,
      selectedOption1: "On",
      selectedOption2: "On",
      timez: "",
      fields: {},
      errors: {}

    };
    // this.handleOptionChange1 = this.handleOptionChange1.bind(this);
    // this.handleOptionChange2 = this.handleOptionChange2.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
  var selectElems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(selectElems, { classes: "createSelect" });
  }

  // handleOptionChange1(changeEvent) {
  //   this.setState({
  //     selectedOption1: changeEvent.target.value
  //   });
  // }

  // handleOptionChange2(changeEvent) {
  //   this.setState({
  //     selectedOption2: changeEvent.target.value
  //   });
  // }
  
  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }


  handleSubmit(event) {
    event.preventDefault();
  
    const formData = {};
      Object.keys(this.state.fields).map(key => {
        formData[key] = this.state.fields[key];
      });
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
                <label id="name" style={{paddingTop:"6px"}}>Sound Notification</label>
              </div>
              <div className="input-field col s1">
                <label id="name">
                  <input
                    type="radio"
                    name="group1"
                    value="On"
                    onChange={this.handleChange}
                    ref="SoundNotification"
                    checked={this.state.fields.group1 == "On"}
                    
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
                    onChange={this.handleChange}
                    ref="SoundNotification"
                    checked={this.state.fields.group1 == "Off"}
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
                  <label id="name" style={{paddingTop:"6px"}}>Email Alerts</label>
                </div>
                <div className="input-field col s1">
                  <label id="name">
                    <input
                      type="radio"
                      name="group2"
                      value="On"
                      onChange={this.handleChange}
                      ref="EmailAlerts"
                      checked={this.state.fields.group2 == "On"}
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
                      onChange={this.handleChange}
                      ref="EmailAlerts"
                      checked={this.state.fields.group2 == "Off"}
                    />
                    <span>Off</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="row" id="row1" style={{paddingBottom:0}}>
            <div className="col s12">
            <div className="input-field col s2">

              <label id="name" style={{paddingTop:"10px"}}>Local Time Zone</label>
              </div>
              <div className="input-field col s3">
              <select
                value={this.state.fields.timez}
                onChange={this.handleChange}
                ref="timezone"
                name="country"
              >
                {Timezones.map((timez, key) => (
                  <option key={key} value={timez.offset}>
                    {timez.name}
                  </option>
                ))}
              </select>
            </div>
            </div>
          </div>

          <div className="row" id="row2" style={{paddingBottom:0}}>
                <div className="col s12">
                <div className="input-field col s2">

                <label id="name" style={{paddingTop:"10px"}}>Date Format</label>
                  </div>
                <div className="input-field col s3">
                <select 
                ref="datef"
                value={this.state.fields.datef}
                onChange={this.handleChange}
                name="datef">

                <option value="dd/mm/yyyy" defaultValue>dd/mm/yyyy</option>
                <option value="yyyy/mm/dd">yyyy/mm/dd</option>
                <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                <option value="dd-mm-yyyy">dd-mm-yyyy</option>
                <option value="yyyy-mm-dd">yyyy-mm-dd</option>
                <option value="mm-dd-yyyy">mm-dd-yyyy</option>
                <option value="dd-mmm-yyyy">dd-mmm-yyyy</option>
                <option value="yyyy-mm-dd">yyyy-mm-dd</option>
                <option value="mm-dd-yyyy">mm-dd-yyyy</option>

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
