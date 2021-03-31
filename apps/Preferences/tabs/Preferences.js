import {React,Notification,ReactBootstrap, FormRender} from "oxziongui";
import merge from "deepmerge";
import preferenceForm from '../public/forms/preferenceForm.json'

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
          : "DD-MM-YYYY";
    } else {
      this.userprofile.key.preferences = { dateformat: "DD-MM-YYYY" };
    }
    this.state = {
      file: null,
      timez: "",
      fields: this.userprofile.key.preferences,
      errors: {},
      initialized: -1,
      languageName: "",
      reload : false
     
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

  
  componentDidMount() {
    this.setState({reload: false})
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
    if (event.target.name === "locale.language") {
      this.actions.update(e.target.name, e.target.value);
      this.setState({
        languageName: this.newSettings.settings.locale.language
      });
    }
  }

  async handleSubmit() {
      this.core.make("oxzion/profile").update();
      this.actions.save();
      this.actions.refresh();
      this.setState({reload : true})
  }

  init() { }
  componentWillMount () {
    this.setState({reload : false})
  }
  render() {
    console.log("preferences")
    return (
      <ReactBootstrap.Form  className="confirm-password-form preferenceReactBootstrap.Form">
        <Notification ref={this.notif} />
        <FormRender 
          content = {preferenceForm}
          core ={this.core}
          route= {"/user/me/save"}
          postSubmitCallback = {this.handleSubmit}
        />
      </ReactBootstrap.Form>
    );
  }
}
export default Preferences;
