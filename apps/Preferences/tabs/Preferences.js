import React, { Component } from "react";
import merge from "deepmerge";
import osjs from "osjs";
import Notification from "../components/Notification";
import DateFormats from "OxzionGUI/public/js/DateFormats";
import Timezones from "OxzionGUI/public/js/Timezones";

class Preferences extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.userprofile = this.core.make("oxzion/profile").get();
    if (
      this.userprofile.key.preferences != undefined ||
      this.userprofile.key.preferences != null
    ) {
      this.userprofile.key.preferences["dateformat"] =
        this.userprofile.key.preferences["dateformat"] &&
        this.userprofile.key.preferences["dateformat"] != ""
          ? this.userprofile.key.preferences["dateformat"]
          : "dd-MM-yyyy";
    } else {
      this.userprofile.key.preferences = { dateformat: "dd-MM-yyyy" };
    }
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

    for (var i in this.initialState.locales) {
      this.languagesList.push({
        value: i,
        label: this.initialState.locales[i]
      });
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.notif = React.createRef();
    
    Timezones.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
  }

  getDefaults = () => ({
    locale: this.core.config("locale", {})
  });

  getSettings = () => ({
    locale: this.settingsService.get("osjs/locale", undefined, {})
  });

  getLocales = () =>
    this.core.config("languages", {
      en_EN: "English"
    });

  setSettings = settings =>
    this.settingsService.set("osjs/locale", null, settings.locale).save();

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

  componentWillMount() {
    this.state.fields["dateformat"] = this.state.fields["dateformat"].replace(
      /m/g,
      "M"
    );
  }

  componentDidMount() {
    if (this.newSettings.settings.locale.language) {
      this.setState({
        languageName: this.newSettings.settings.locale.language
          ? this.newSettings.settings.locale.language
          : this.newSettings.defaults.locale.language
      });
    } else {
      this.setState({
        languageName: this.newSettings.defaults.locale.language
          ? this.newSettings.defaults.locale.language
          : ""
      });
    }
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });

    if (event.target.name === "locale.language") {
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

    let preferencedata = { preferences: JSON.stringify(formData) };

    let helper = this.core.make("oxzion/restClient");

    let pref = await helper.request(
      "v1",
      "/user/me/save",
      preferencedata,
      "post"
    );

    if (pref.status == "error") {
      this.notif.current.failNotification("Failed to update.");
    } else {
      this.notif.current.successNotification("Updated successfully.");
      this.core.make("oxzion/profile").update();
      this.actions.save();
      this.actions.refresh();
    }
  }

  init() {}
  render() {
    return (
      <div className="componentDiv">
        <Notification ref={this.notif} />
        <form className="formmargin" onSubmit={this.handleSubmit}>
          <div className="row marginsize">
            <div className="col-4" id="sound">
              <label id="labelname">Sound Notification:</label>
            </div>
            <div className="col-8">
              <label id="name">
                <input
                  className="preferencesRadio"
                  type="radio"
                  name="soundnotification"
                  value="true"
                  onChange={this.handleChange}
                  checked={this.state.fields["soundnotification"] == "true"}
                />
                <span className="m-2 radioLabel">On</span>
                <input
                  className="preferencesRadio"
                  type="radio"
                  name="soundnotification"
                  value="false"
                  onChange={this.handleChange}
                  checked={this.state.fields["soundnotification"] == "false"}
                />
                <span className="m-2 radioLabel">Off</span>
              </label>
            </div>
          </div>
          <div className="row marginsize">
            <div className="col-4" id="emailalert">
              <label id="labelname">Email Alerts:</label>
            </div>
            <div className="col-8">
              <label id="name">
                <input
                  className="preferencesRadio"
                  type="radio"
                  name="emailalerts"
                  value="true"
                  onChange={this.handleChange}
                  checked={this.state.fields["emailalerts"] == "true"}
                />
                <span className="m-2 radioLabel">On</span>
                <input
                  className="preferencesRadio"
                  type="radio"
                  name="emailalerts"
                  value="false"
                  onChange={this.handleChange}
                  checked={this.state.fields["emailalerts"] == "false"}
                />
                <span className="m-2 radioLabel">Off</span>
              </label>
            </div>
          </div>
          <div className="row marginsize">
            <div className="col-4" id="localtimezone">
              <label id="labelname">Local Time Zone:</label>
            </div>
            <div className="col-4 timezonediv">
              <select
                value={this.state.fields["timezone"]}
                onChange={this.handleChange}
                name="timezone"
                className="timezone"
              >
                {" "}
                {Timezones.map((timezone, key) => (
                  <option key={key} value={timezone.name}>
                    {timezone.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row marginsize">
            <div className="input-field col-4" id="datef">
              <label id="labelname">Date Format:</label>
            </div>
            <div className="input-field col-4">
              <select
                value={this.state.fields["dateformat"]}
                onChange={this.handleChange}
                name="dateformat"
              >
                {" "}
                {DateFormats.map((dateFormat, key) => (
                  <option key={key} value={dateFormat.value}>
                    {dateFormat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row marginsize" style={{ paddingTop: "5px" }}>
            <div className="col-4" id="locallanguage">
              <label id="labelname">Language:</label>
            </div>
            <div className="col-4 languagediv">
              <select
                value={this.state.languageName}
                onChange={this.handleChange}
                name="locale.language"
              >
                {" "}
                {this.languagesList.map((language, key) => (
                  <option key={key} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row marginsize">
            <div className="col-12 input-field">
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
