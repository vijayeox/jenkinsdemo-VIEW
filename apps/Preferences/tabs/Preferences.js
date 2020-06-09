import {React,ReactDOM,Notification,DateFormats,MomentTZ,ReactBootstrap} from "oxziongui";
import merge from "deepmerge";
import osjs from "osjs";
class Preferences extends React.Component {
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
    console.log(MomentTZ.tz.names());
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
    var fields = this.state.fields;
    this.state.fields["soundnotification"]?"":fields["soundnotification"]="true";
    this.state.fields["Greetingmessage"]?"":fields["Greetingmessage"]="true";
    this.state.fields["emailalerts"]?"":fields["emailalerts"]="true";
    this.setState({
      fields
    })
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
      this.notif.current.notify(
        "Error",
        "Failed to update.",
        "danger"
      )
    } else {
      this.notif.current.notify(
        "Success",
        "Updated successfully.",
        "success"
      )
      this.core.make("oxzion/profile").update();
      this.actions.save();
      this.actions.refresh();
    }
  }

  init() { }
  render() {
    return (
      //  <>
      //  <Notification ref={this.notif} />
      //   <ReactBootstrap.Form onSubmit={this.handleSubmit} className="preferenceForm"> 
      //       <ReactBootstrap.Form.Group>
      //         <ReactBootstrap.Form.Label>Sound Notification</ReactBootstrap.Form.Label>
      //         <ReactBootstrap.Form.Check
      //           type="radio"
      //           name="soundnotification"
      //           value="true"
      //           label="On"
      //           onChange={this.handleChange}
      //           checked={this.state.fields["soundnotification"] == "true"}
      //         />
      //          <ReactBootstrap.Form.Check
      //           type="radio"
      //           name="soundnotification"
      //           value="false"
      //           label="Off"
      //           onChange={this.handleChange}
      //           checked={this.state.fields["soundnotification"] == "false"}
      //         />
      //       </ReactBootstrap.Form.Group>
      //       <ReactBootstrap.Form.Group>
      //         <ReactBootstrap.Form.Label></ReactBootstrap.Form.Label>
      //         <ReactBootstrap.Form.Control/>
      //       </ReactBootstrap.Form.Group>
      //       <ReactBootstrap.Form.Group>
      //         <ReactBootstrap.Form.Label></ReactBootstrap.Form.Label>
      //         <ReactBootstrap.Form.Control/>
      //       </ReactBootstrap.Form.Group>
      //       <ReactBootstrap.Form.Group>
      //         <ReactBootstrap.Form.Label></ReactBootstrap.Form.Label>
      //         <ReactBootstrap.Form.Control/>
      //       </ReactBootstrap.Form.Group>
      //   </ReactBootstrap.Form>
      //  </>
      <div className="componentDiv">
        <Notification ref={this.notif} />
        <ReactBootstrap.Form className="formmargin preferenceForm" onSubmit={this.handleSubmit}>
          <div className="row marginsize">
            <div className="col-md-4" id="sound">
              <ReactBootstrap.Form.Label>Sound Notification:</ReactBootstrap.Form.Label>
            </div>
            <div className="col-md-8">
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
            <div className="col-md-4" id="Greetingmessage">
              <ReactBootstrap.Form.Label>Greeting message:</ReactBootstrap.Form.Label>
            </div>
            <div className="col-md-8">
              <label id="name">
                <input
                  className="preferencesRadio"
                  type="radio"
                  name="Greetingmessage"
                  value="true"
                  onChange={this.handleChange}
                  checked={this.state.fields["Greetingmessage"] == "true"}
                />
                <span className="m-2 radioLabel">On</span>
                <input
                  className="preferencesRadio"
                  type="radio"
                  name="Greetingmessage"
                  value="false"
                  onChange={this.handleChange}
                  checked={this.state.fields["Greetingmessage"] == "false"}
                />
                <span className="m-2 radioLabel">Off</span>
              </label>
            </div>
          </div>
          <div className="row marginsize">
            <div className="col-md-4" id="emailalert">
              <ReactBootstrap.Form.Label>Email Alerts:</ReactBootstrap.Form.Label>
            </div>
            <div className="col-md-8">
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
            <div className="col-md-4" id="localtimezone">
              <ReactBootstrap.Form.Label>Local Time Zone:</ReactBootstrap.Form.Label>
            </div>
            <div className="col-md-8 timezonediv">
              <select
                value={this.state.fields["timezone"]}
                onChange={this.handleChange}
                name="timezone"
                className="timezone"
              >
                {" "}
                {MomentTZ.tz.names().map((timezone, key) => (
                  <option key={key} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row marginsize">
            <div className="input-field col-md-4" id="datef">
              <ReactBootstrap.Form.Label>Date Format:</ReactBootstrap.Form.Label>
            </div>
            <div className="input-field col-md-8">
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

          <div className="row marginsize">
            <div className="col-md-12 input-field">
              <ReactBootstrap.Button className="pull-right preferenceForm-btn" type="submit">Submit</ReactBootstrap.Button>
            </div>
          </div>
        </ReactBootstrap.Form>
      </div>
    );
  }
}
export default Preferences;
