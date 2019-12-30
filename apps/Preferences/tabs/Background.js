import React, { Component } from "react";
import merge from "deepmerge";
import osjs from "osjs";
import Notification from "OxzionGUI/Notification"
import { Form, Button } from 'react-bootstrap'
class Background extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.win = this.props.win;
    this.state = {
      styleName: "",
      colorCode: "",
      imageSrc: ""
    };
    this.settingsService = this.core.make("osjs/settings");
    this.packageService = this.core.make("osjs/packages");
    this.desktopService = this.core.make("osjs/desktop");
    const { translate, translatableFlat } = this.core.make("osjs/locale");
    this.translatableFlat = translatableFlat;
    this.filter = type => pkg => pkg.type === type;
    this.getDefaults = this.getDefaults.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.setSettings = this.setSettings.bind(this);
    this.resolveNewSetting = this.resolveNewSetting.bind(this);

    this.styleList = [
      { value: "color", label: "Color" },
      { value: "cover", label: "Cover" },
      { value: "contain", label: "Contain" },
      { value: "repeat", label: "Repeat" }
    ];

    this.initialState = {
      loading: false,
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
            this.notif.current.notify(
              "Success",
              "Updated successfully.",
              "success"
            )
          })
          .catch(error => {
            this.actions.setLoading(false);
            console.error(error); // FIXME
            this.notif.current.notify(
              "Error",
              "Update failed.",
              "danger"
            )
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
    this.selectBackgroundImageDialog = this.selectBackgroundImageDialog.bind(
      this
    );

    this.createDialog = (...args) => this.core.make("osjs/dialog", ...args);
    this.notif = React.createRef();
  }

  componentDidMount() {
    if (this.newSettings.settings.desktop.background) {
      this.setState({
        styleName: this.newSettings.settings.desktop.background.style
          ? this.newSettings.settings.desktop.background.style
          : this.newSettings.defaults.desktop.background.style,
        colorCode: this.newSettings.settings.desktop.background.color
          ? this.newSettings.settings.desktop.background.color
          : this.newSettings.defaults.desktop.background.color,
        imageSrc: this.newSettings.settings.desktop.background.src
          ? this.newSettings.settings.desktop.background.src.path
          : ""
      });
    } else {
      this.setState({
        styleName: this.newSettings.defaults.desktop.background.style
          ? this.newSettings.defaults.desktop.background.style
          : "",
        colorCode: this.newSettings.defaults.desktop.background.color
          ? this.newSettings.defaults.desktop.background.color
          : "",
        imageSrc: this.newSettings.defaults.desktop.background.src
          ? this.newSettings.defaults.desktop.background.src.path
          : ""
      });
    }
  }

  getDefaults = () => ({
    desktop: this.core.config("desktop.settings", {})
  });

  getSettings = () => ({
    desktop: this.settingsService.get("osjs/desktop", undefined, {})
  });

  setSettings = settings =>
    this.settingsService.set("osjs/desktop", null, settings.desktop).save();

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

    if (event.target.name === "desktop.background.style") {
      this.setState({
        styleName: this.newSettings.settings.desktop.background.style
      });
    } else if (event.target.name === "desktop.background.color") {
      this.setState({
        colorCode: this.newSettings.settings.desktop.background.color
      });
    }
  };

  callback = (btn, value) => {
    let path = "desktop.background.src";

    if (btn == "ok") {
      this.actions.update(path, value);
      this.setState({
        imageSrc: this.newSettings.settings.desktop.background.src.path
      });
    }
  };

  selectBackgroundImageDialog = event => {
    event.preventDefault();
    const args = {
      type: "open",
      title: "Select Background",
      mime: [/^image/]
    };

    this.createDialog("file", args, {
      attributes: { modal: true },
      parent: this.win
    }, this.callback);
  };
  render() {
    return (
      <div className="componentDiv">
        <Notification ref={this.notif} />
        <Form className="formmargin preferenceForm" onSubmit={this.handleSubmit}>
          <div className="row marginsize">
            <div className="col-4">
              <Form.Label>Image:</Form.Label>
              {/* <label id="imageLabel">Image:</label> */}
            </div>
            <div className="col-4 imagediv">
              <div className="image" id="image">
                {this.state.imageSrc}{" "}
                <button
                  className="imageBtn"
                  onClick={this.selectBackgroundImageDialog}
                >
                  Select Image
                </button>
              </div>
            </div>
          </div>

          <div className="row marginsize">
            <div className="col-4">
              <Form.Label>Color:</Form.Label>
            </div>
            <div className="col-4 colordiv">
              <input
                type="color"
                value={this.state.colorCode}
                onChange={this.handleChange}
                name="desktop.background.color"
                className="colorPicker"
              />
            </div>
          </div>
          <div className="row marginsize">
            <div className="col-4">
              <Form.Label>Style:</Form.Label>
            </div>
            <div className="col-8 backgroundStylediv">
              <select
                value={this.state.styleName}
                onChange={this.handleChange}
                name="desktop.background.style"
              >
                {this.styleList.map((style, key) => (
                  <option key={key} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

         

          <div className="row">
            <div className="col-12 input-field">
              <Button className="pull-right preferenceForm-btn" type="submit">Save</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default Background;
