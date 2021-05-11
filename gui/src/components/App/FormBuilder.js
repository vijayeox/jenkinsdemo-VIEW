import { Formio } from "formiojs";
import React from "react";
import Notification from "../../Notification";
import { Window } from "@progress/kendo-react-dialogs";
import { camelCase } from "lodash";
import ConvergePayCheckoutComponent from "./Form/Payment/ConvergePayCheckoutComponent";
import DocumentComponent from "./Form/DocumentComponent";
import SliderComponent from "./Form/SliderComponent";
import FortePayCheckoutComponent from "./Form/Payment/FortePayCheckoutComponent";
import RadioCardComponent from "./Form/RadioCardComponent";
import PhoneNumberComponent from "./Form/PhoneNumberComponent";
import CountryComponent from "./Form/CountryComponent";
import FileComponent from "./Form/FileComponent";
import "../../public/css/formstyles.scss";
import "../../public/css/formbuilder.scss";
import formSettings from '../../public/forms/settingsForm.json'
import FormRender from "./FormRender";

class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.state = {
      appId: this.props.appId,
      saveForm: this.props.saveForm ? this.props.saveForm : null,
      formId: this.props.formId ? this.props.formId : null,
      form: this.props.form ? this.props.form : null,
      content: this.props.content ? this.props.content : {},
      title: "",
      name: "",
      display: "form",
      path: "",
      properties: "",
      showFormSettings: false,
    };
    this.updateFormSettings = this.updateFormSettings.bind(this);
    this.appUrl = "/app/" + this.state.appId;
    this.helper = this.core.make("oxzion/restClient");
    this.loader = this.core.make("oxzion/splash");
  }

  async getForm() {
    return await this.helper.request(
      "v1",
      this.appUrl + "/form/" + this.state.formId,
      {},
      "get"
    );
  }

  componentDidMount() {
    this.loader.show();
    if (this.props.formId) {
      this.getForm().then((response) => {
        if (response.status == "success") {
          this.setState(
            {
              content: JSON.parse(response.data.template),
              title: this.state.content.title,
              name: this.state.content.name,
              display: this.state.content.display,
              properties: this.state.content.properties
            },
            () => this.createForm().then(() => this.loader.destroy())
          );
        }
      });
    } else {
      if (this.state.content) {
        this.setState(
          {
            title: this.state.content.title,
            name: this.state.content.name,
            display: this.state.content.display,
            properties: this.state.content.properties
          },
          () => this.createForm().then(() => this.loader.destroy())
        );
      }
    }
  }

  createForm() {
    let that = this;
    Formio.registerComponent("slidercomponent", SliderComponent);
    Formio.registerComponent("convergepayment", ConvergePayCheckoutComponent);
    Formio.registerComponent("documentcomponent", DocumentComponent);
    Formio.registerComponent("fortepayment", FortePayCheckoutComponent);
    Formio.registerComponent("radiocardcomponent", RadioCardComponent);
    Formio.registerComponent("phonecomponent", PhoneNumberComponent);
    Formio.registerComponent("countrycomponent", CountryComponent);
    var builderCreated = Formio.builder(
      document.getElementById("builder"),
      this.state.content,
      {
        display: this.state.display,
        builder: {
          customBasic: {
            title: "Custom",
            default: true,
            weight: 0,
            components: {
              radiocardcomponent: true,
              file: true,
              slidercomponent: true,
              fortepayment: true,
              documentcomponent: true,
              phonecomponent: true,
              countrycomponent: true,
              convergepayment: true,
            },
          },
        },
      }
    ).then(function (builder) {
      builder.on("saveComponent", function (submission) {
        console.log(submission);
      });
      builder.on("change", function (schema) {
        console.log(schema);
      });
      builder.on("editForm", function (schema) {
        console.log(schema);
      });
      builder.on("onSubmit", function (schema) {
        console.log(schema);
      });
      builder.on("ready", function (schema) {
        console.log(schema);
      });
      that.setState({ builder: builder });
    });
    return builderCreated;
  }

  onChange(e) {
    var content = this.state.content;
    if (e.target.name == "display") {
      this.state.builder.destroy();
      document.getElementById("builder").innerHTML = "";
      content.display = e.target.value;
      this.setState(
        {
          display: e.target.value,
          content: content,
        },
        () => this.createForm()
      );
    } else if (e.target.name == "title") {
      content.name = camelCase(e.target.value);
      content.path = camelCase(e.target.value).toLowerCase();
      content.title = e.target.value;
      this.setState({
        title: e.target.value,
        name: camelCase(e.target.value),
        path: camelCase(e.target.value).toLowerCase(),
        content: content,
      });
    }
  }

  handleSaveForm() {
    var submission = this.state.builder.form;
    this.props.saveForm(submission);
  }

  updateFormSettings(settings) {
    var content = this.state.content;
    content.properties = settings.properties;
    content.controller = settings.controller;
    this.setState({ content: content,showFormSettings: false });
  }
  cancel = () => {
    this.setState({ showFormSettings: false });
  };

  render() {
    return (
      <div className="formBuilder">
        <Notification ref={this.notif} />
        {/* Show form settings */}
        {this.state.showFormSettings ? (<Window stage="FULLSCREEN" onClose={this.cancel}><FormRender core={this.props.core} content={formSettings} appId={this.state.appId} customSaveForm={this.updateFormSettings} data={this.state.content}></FormRender></Window>) : null}
        <div>
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-3">
              <div id="form-group-title" className="form-group">
                <label htmlFor="name" className="control-label field-required">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  placeholder="Enter the form title"
                  value={this.state.title}
                  onChange={(value) => this.onChange(value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3">
              <div id="form-group-name" className="form-group">
                <label htmlFor="name" className="control-label field-required">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Enter the form machine name"
                  value={this.state.name}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3">
              <div id="form-group-display" className="form-group">
                <label htmlFor="name" className="control-label">
                  Display as
                </label>
                <div className="input-group">
                  <select
                    className="form-control"
                    name="display"
                    id="display"
                    value={this.state.display}
                    onChange={(value) => this.onChange(value)}
                  >
                    <option label="Form" value="form">
                      Form
                    </option>
                    <option label="Wizard" value="wizard">
                      Wizard
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div id="form-save-button" className="col-lg-3 col-md-3 col-sm-3">
              <div className="form-group">
                <span
                  className="btn btn-primary"
                  onClick={() => this.setState({ showFormSettings: true })}
                >
                  Form Settings
                </span>
              </div>
              <div className="form-group">
                <span
                  className="btn btn-primary"
                  onClick={() => this.handleSaveForm()}
                >
                  Save Form
                </span>
              </div>
            </div>
          </div>
          <div id={this.formErrorDivId} style={{ display: "none" }}>
            <h3>{this.state.formErrorMessage}</h3>
          </div>
          <div className="form-render" id="builder"></div>
        </div>
      </div>
    );
  }
}
export default FormBuilder;
