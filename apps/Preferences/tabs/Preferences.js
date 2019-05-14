import React, { Component } from "react";
import Timezones from "./Timezones";
import ReactNotification from "react-notifications-component";

class Preferences extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.userprofile = this.core.make('oxzion/profile').get();
    this.state = {
      file: null,
      timez: "",
      fields: {},
      errors: {},
      initialized: -1

    };

    this.getPreferences().then(response => {
      console.log(response);
      this.setState({fields :response.key.preferences});
      console.log(this.state.fields);
  
   });

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.addNotificationFail = this.addNotificationFail.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  addNotification() {
    this.notificationDOMRef.current.addNotification({
      message: "Operation succesfully completed.",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 1000 },
      dismissable: { click: true }
    });
  }

  addNotificationFail(serverResponse) {
    this.notificationDOMRef.current.addNotification({
      message: "Operation Unsuccessfull" + serverResponse,
      type: "danger",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 1000 },
      dismissable: { click: true }
    });
  }


  async getPreferences() {
    let userpreferences = await this.core.make("oxzion/profile").get();
    return userpreferences;
  }
  
  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
  
    const formData = {};
      Object.keys(this.state.fields).map(key => {
        formData[key] = this.state.fields[key];
      });
    console.log("-->", formData);

    let preferencedata={"preferences":JSON.stringify(formData)};
    console.log(preferencedata);


    let helper = this.core.make("oxzion/restClient");

      let pref = await helper.request(
        "v1",
        "/user/" + this.userprofile.key.id,preferencedata,
        "put"
      );
      console.log("done");
      if (pref.status == "error") {
         this.addNotificationFail(pref.message);
      }else{
         this.addNotification();
         this.core.make("oxzion/profile").update();
      }

  }


  init() {}
  render() {
    return (
      <div>
      <ReactNotification ref={this.notificationDOMRef}/>
        
          <form style={{padding:"20px"}} onSubmit={this.handleSubmit}>
          <div className="row marginsize">
              <div className="col-md-5" id="sound" style={{marginTop:"5px"}}>
                <label id="labelname">Sound Notification</label>
              </div>
              <div className="col-md-6">
              <div className="row">
                <label id="name">
                  <input
                    type="radio"
                    name="soundnotification"
                    value="true"
                    onChange={this.handleChange}
                    ref="soundnotification"
                    checked={this.state.fields['soundnotification'] == "true"}
                    // checked
                  />
                  <span className="m-2">On</span>
                </label>
              </div>
              <div className="row">
                <label id="name">
                  <input
                    type="radio"
                    name="soundnotification"
                    value="false"
                    onChange={this.handleChange}
                    ref="soundnotification"
                    checked={this.state.fields['soundnotification'] == "false"}
                    />
                  <span className="m-2">Off</span>
                </label>
              </div>
              </div>
          </div>

          <div>
            <div className="row">
                <div className="col-md-5" id="emailalert" style={{marginTop:"7px"}}>
                  <label id="labelname">Email Alerts</label>
                </div>
              <div className="col-md-6">
              <div className="row">
                  <label id="name">
                    <input
                      type="radio"
                      name="emailalerts"
                      value="true"
                      onChange={this.handleChange}
                      ref="emailalerts"
                      checked={this.state.fields['emailalerts'] == "true"}
                    />
                    <span className="m-2">On</span>
                  </label>
                </div>
                <div className="row">
                  <label id="name">
                    <input
                      type="radio"
                      name="emailalerts"
                      value="false"
                      onChange={this.handleChange}
                      ref="emailalerts"
                      checked={this.state.fields['emailalerts'] == "false"}
                    />
                    <span className="m-2">Off</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="row" id="row1" style={{paddingTop:"5px"}}>
            <div className="col-md-5" id="localtimezone" style={{marginTop:"18px"}}>
              <label id="labelname">Local Time Zone</label>
              </div>
              <div className="col-md-6 timezonediv">
              <select
                value={this.state.fields['timezone']}
                onChange={this.handleChange}
                ref="timezone"
                name="timezone"
                className="timezone"
                id="timezone"
              > {Timezones.map((timezone, key) => (
                  <option key={key} value={timezone.name}>
                    {timezone.name}
                  </option>
                ))}
                </select>
            </div>
          </div>

          <div className="row" id="row2" style={{paddingBottom:0}}>
                <div className="input-field col-md-5" id="datef" style={{marginTop:"16px"}}>
                <label id="labelname">Date Format</label>
                  </div>
                <div className="input-field col-md-3 dateformat">
                <input
                  type="text"
                  name="dateformat"
                  ref="dateformat"
                  pattern={"['d','M','y']{1,4}"+"['/','-']"+"['d','M','y']{1,4}"+"['/','-']"+"['d','M','y']{1,4}"}
                  value={this.state.fields['dateformat']}
                  onChange={this.handleChange}
                  className="validate"
                />               

                </div>
                <div className="input-field col-md-3 datetooltip">


                <i className="material-icons" id="dateicon">info_outline</i><span>"dd-MM-yyyy - 01-02-2012<br/>
                                                                                                  d-MMM-yyyy - 1-Feb-2012<br/>
                                                                                                  yy-M-dd - 12-2-01<br/>
                                                                                                  dd/MMMM/yyyy - 01/Febraury/2012<br/>
                                                                                                  Use either / or -"</span>
                </div>
          </div>

          <div className="row savebutton">
            <div className="col s12 input-field">
              <button className="k-button k-primary" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default Preferences;
