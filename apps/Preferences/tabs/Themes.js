import React, { Component } from "react";
import merge from "deepmerge";
import osjs from "osjs";

class Themes extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      themeName: "",
      iconName: "",
      soundName: ""
    };
    this.settingsService = this.core.make("osjs/settings");
    this.packageService = this.core.make("osjs/packages");
    this.desktopService = this.core.make("osjs/desktop");
    const { translate, translatableFlat } = this.core.make("osjs/locale");
    this.translatableFlat = translatableFlat;
    this.filter = type => pkg => pkg.type === type;

    this.getThemes = this.getThemes.bind(this);
    this.getDefaults = this.getDefaults.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.setSettings = this.setSettings.bind(this);

    this.resolveNewSetting = this.resolveNewSetting.bind(this);

    this.initialState = {
      loading: false,
      themes: this.getThemes(),
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

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if(this.newSettings.settings.desktop){
        this.setState({
        themeName: (this.newSettings.settings.desktop.theme ? this.newSettings.settings.desktop.theme : this.newSettings.defaults.desktop.theme),
        iconName: (this.newSettings.settings.desktop.icons ? this.newSettings.settings.desktop.icons : this.newSettings.defaults.desktop.icons),
        soundName: (this.newSettings.settings.desktop.sounds ? this.newSettings.settings.desktop.sounds : this.newSettings.defaults.desktop.sounds)
        });
    }
    else{
        this.setState({
            themeName: (this.newSettings.defaults.desktop.theme ? this.newSettings.defaults.desktop.theme : ''),
            iconName: (this.newSettings.defaults.desktop.icons ? this.newSettings.defaults.desktop.icons : ''),
            soundName: (this.newSettings.defaults.desktop.sounds ? this.newSettings.defaults.desktop.sounds : '')
        });
    }
  }

  getThemes = () => {
    this.get = type =>
      this.packageService.getPackages(this.filter(type)).map(pkg => ({
        value: pkg.name,
        label: this.translatableFlat(pkg.title)
      }));

    return {
      styles: this.get("theme"),
      icons: this.get("icons"),
      sounds: [{ value: "", label: "None" }, ...this.get("sounds")]
    };
  };

  getDefaults = () => ({
    desktop: this.core.config("desktop.settings", {}),
  });

  getSettings = () => ({
    desktop: this.settingsService.get("osjs/desktop", undefined, {}),
  });

  setSettings = settings =>
    this.settingsService
      .set("osjs/desktop", null, settings.desktop)
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

  handleSubmit = event => {
    event.preventDefault();
    this.actions.save();
    this.actions.refresh();
  };

  handleChange = event => {
    this.actions.update(event.target.name, event.target.value);
    if(event.target.name === "desktop.theme"){
        this.setState({
            themeName: this.newSettings.settings.desktop.theme
          });
    }
    else if(event.target.name === "desktop.icons"){
        this.setState({
            iconName: this.newSettings.settings.desktop.icons
        });
    }
    else if(event.target.name === "desktop.sounds"){
        this.setState({
            soundName: this.newSettings.settings.desktop.soundName
        })
    }
  };

  render() {
    return (
      <div>
        <form style={{ padding: "20px" }} onSubmit={this.handleSubmit}>
          <div className="row" id="row2" style={{ paddingTop: "5px" }}>
            <div
              className="col-md-5"
              style={{ marginTop: "18px", paddingLeft: "25%" }}
            >
              <label id="labelname">Style:</label>
            </div>
            <div className="col-md-7 themeStylediv">
              <select
                value={this.state.themeName}
                onChange={this.handleChange}
                name="desktop.theme"
                className="themeStyle"
                id="themeStyle"
              >
                {" "}
                {this.initialState.themes.styles.map((style, key) => (
                  <option key={key} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row" id="row2" style={{ paddingTop: "5px" }}>
            <div
              className="col-md-5"
              style={{ marginTop: "18px", paddingLeft: "25%" }}
            >
              <label id="labelname">Icons:</label>
            </div>
            <div className="col-md-7 iconsdiv">
              <select
                value={this.state.iconName}
                onChange={this.handleChange}
                name="desktop.icons"
                className="icons"
                id="icons"
              >
                {" "}
                {this.initialState.themes.icons.map((icon, key) => (
                  <option key={key} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row" id="row2" style={{ paddingTop: "5px" }}>
            <div
              className="col-md-5"
              style={{ marginTop: "18px", paddingLeft: "25%" }}
            >
              <label id="labelname">Sounds:</label>
            </div>
            <div className="col-md-7 soundsdiv">
              <select
                value={this.state.soundName}
                onChange={this.handleChange}
                name="desktop.sounds"
                className="sounds"
                id="sounds"
              >
                {" "}
                {this.initialState.themes.sounds.map((sound, key) => (
                  <option key={key} value={sound.value}>
                    {sound.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row savebutton">
            <div className="col s12 input-field" style={{paddingLeft: "23%"}}>
              <button className="k-button k-primary" type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Themes;
