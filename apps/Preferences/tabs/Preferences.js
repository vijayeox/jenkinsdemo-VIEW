import React, { Component } from "react";
import Timezones from "./Timezones";
import ReactNotification from "react-notifications-component";
import merge from "deepmerge";
import osjs from "osjs";

class Preferences extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.userprofile = this.core.make('oxzion/profile').get();
    this.state = {
      file: null,
      timez: "",
      fields: this.userprofile.key.preferences,
      errors: {},
      initialized: -1,
      languageName: ""
    };

    this.settingsService = this.core.make("osjs/settings");
    this.packageService = this.core.make("osjs/packages");
    this.desktopService = this.core.make("osjs/desktop");
    const { translate, translatableFlat } = this.core.make("osjs/locale");
    this.translatableFlat = translatableFlat;
    this.filter = type => pkg => pkg.type === type;

    this.setSettings = this.setSettings.bind(this);
    this.resolveNewSetting = this.resolveNewSetting.bind(this);
    this.getLocales = this.getLocales.bind(this);
    this.getDefaults = this.getDefaults.bind(this);
    this.getSettings = this.getSettings.bind(this);

    this.initialState = {
      loading: false,
      locales: this.getLocales(),
      defaults: this.getDefaults(),
      settings: this.getSettings()
    };

    console.log((this.initialState.locales));

    this.newSettings = this.initialState;

    this.actions = {
      save: () => {
        if (this.initialState.loading) {
          return;
        }

        this.actions.setLoading(true);

        this.setSettings(this.newSettings.settings)
          .then(() => {
            this.actions.setLoading(false);
            this.desktopService.applySettings();
          })
          .catch(error => {
            this.actions.setLoading(false);
            console.error(error); // FIXME
          });
      },

      update: (path, value) => {
        this.newSettings = this.resolveNewSetting(path, value);
      },
      refresh: () => {
        this.initialState.settings = this.getSettings();
      },
      setLoading: loading => ({ loading })
    };

    this.languagesList = [];

    for(var i in this.initialState.locales){
      this.languagesList.push(
        {value: i, label: this.initialState.locales[i]}
      )
    }
    console.log(this.languagesList);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.addNotificationFail = this.addNotificationFail.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  getDefaults = () => ({
    locale: this.core.config("locale", {})
  });

  getSettings = () => ({
    locale: this.settingsService.get("osjs/locale", undefined, {})
  });

    getLocales = () => this.core.config('languages', {
      en_EN: 'English'
    });

    setSettings = settings =>
    this.settingsService
      .set("osjs/locale", null, settings.locale)
      .save();

  resolveNewSetting = (key, value) => {
    const object = {};
    const keys = key.split(/\./g);

    let previous = object;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const last = i >= keys.length - 1;

      previous[key] = last ? value : {};
      previous = previous[key];
    }

    const settings = merge(this.newSettings.settings, object);
    return { settings };
  };

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

  componentWillMount(){
     this.state.fields['dateformat'] = this.state.fields['dateformat'].replace(/m/g,"M");
  }

  componentDidMount(){
    if(this.newSettings.settings.locale.language){
      this.setState({
        languageName: (this.newSettings.settings.locale.language ? this.newSettings.settings.locale.language : this.newSettings.defaults.locale.language)
      });
    }
    else{
      this.setState({
        languageName: (this.newSettings.defaults.locale.language ? this.newSettings.defaults.locale.language : '')
      });
    }
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
    
    if(event.target.name === "locale.language"){
      console.log("selected:" +  e.target.name, e.target.value);
      this.actions.update(e.target.name, e.target.value);
      this.setState({
          languageName: this.newSettings.settings.locale.language
        });
    }
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
      this.actions.save();
      this.actions.refresh();

  }


  init() {}
  render() {
    return (
      <div>
      <ReactNotification ref={this.notificationDOMRef}/>
          <form className="formmargin" onSubmit={this.handleSubmit}>
          <div className="row marginsize">
              <div className="col-md-4" id="sound">
                <label id="labelname">Sound Notification:</label>
              </div>
              <div className="col-md-8">
                <label id="name">
                  <input
                    id="preferencesRadio"
                    type="radio"
                    name="soundnotification"
                    value="true"
                    onChange={this.handleChange}
                    ref="soundnotification"
                    checked={this.state.fields['soundnotification'] == "true"}
                  /> 
                  <span className="m-2 radioLabel">On</span>
                  <input
                    id="preferencesRadio"
                    type="radio"
                    name="soundnotification"
                    value="false"
                    onChange={this.handleChange}
                    ref="soundnotification"
                    checked={this.state.fields['soundnotification'] == "false"}
                    />
                  <span className="m-2 radioLabel">Off</span>
                </label>
              </div>
          </div>
            <div className="row marginsize">
                <div className="col-md-4" id="emailalert">
                  <label id="labelname">Email Alerts:</label>
                </div>
              <div className="col-md-8">
                  <label id="name">
                    <input
                      id="preferencesRadio"
                      type="radio"
                      name="emailalerts"
                      value="true"
                      onChange={this.handleChange}
                      ref="emailalerts"
                      checked={this.state.fields['emailalerts'] == "true"}
                    />
                    <span className="m-2 radioLabel">On</span>
                    <input
                      id="preferencesRadio"
                      type="radio"
                      name="emailalerts"
                      value="false"
                      onChange={this.handleChange}
                      ref="emailalerts"
                      checked={this.state.fields['emailalerts'] == "false"}
                    />
                    <span className="m-2 radioLabel">Off</span>
                  </label>
              </div>
            </div>
          <div className="row marginsize">
            <div className="col-md-4" id="localtimezone">
              <label id="labelname">Local Time Zone:</label>
              </div>
              <div className="col-md-4 timezonediv">
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
          <div className="row marginsize">
                <div className="input-field col-md-4" id="datef">
                <label id="labelname">Date Format:</label>
                  </div>
                <div className="input-field col-md-4 dateformat">
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
                <div className="input-field col-md-4 datetooltip" style={{zIndex:2}}>


                <i className="material-icons" id="dateicon">info_outline</i><span>"dd-MM-yyyy - 01-02-2012<br/>
                                                                                                  d-MMM-yyyy - 1-Feb-2012<br/>
                                                                                                  yy-M-dd - 12-2-01<br/>
                                                                                                  dd/MMMM/yyyy - 01/Febraury/2012<br/>
                                                                                                  Use either / or -"</span>
                </div>
          </div>


          <div className="row marginsize" style={{paddingTop:"5px"}}>
            <div className="col-md-4" id="locallanguage">
              <label id="labelname">Language:</label>
              </div>
              <div className="col-md-4 languagediv">
              <select
                value={this.state.languageName}
                onChange={this.handleChange}
                ref="language"
                name="locale.language"
                className="language"
                id="language"
              > {this.languagesList.map((language, key) => (
                  <option key={key} value={language.value}>
                    {language.label}
                  </option>
                ))}
                </select>
            </div>
          </div>
          
          <div className="row marginsize">
            <div className="col-md-12 input-field" >
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
