import { Formio } from "formiojs";
import React from 'react';
import Notification from "../../Notification";
import $ from "jquery";
import {  camelCase } from 'lodash'
import ConvergePayCheckoutComponent from "./Form/Payment/ConvergePayCheckoutComponent";
import DocumentComponent from "./Form/DocumentComponent";
import SliderComponent from "./Form/SliderComponent";
import FortePayCheckoutComponent from "./Form/Payment/FortePayCheckoutComponent";
import RadioCardComponent from "./Form/RadioCardComponent";
import PhoneNumberComponent from "./Form/PhoneNumberComponent";
import CountryComponent from "./Form/CountryComponent";
import FileComponent from "./Form/FileComponent";
import "../../public/css/formstyles.scss";

class FormBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.core;
        this.state = {
            appId: this.props.appId,
            saveForm: this.props.saveForm?this.props.saveForm:null,
            formId: this.props.formId?this.props.formId:null,
            form:this.props.form?this.props.form:null,
            content:this.props.content?this.props.content:{},
            title: '',
            name: '',
            display: 'form',
            path: ''
        }
        this.appUrl = "/app/"+this.state.appId
        this.helper = this.core.make("oxzion/restClient");
        this.handleSaveForm = this.handleSaveForm.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    async getForm() {
        return await this.helper.request("v1",this.appUrl + "/form/" + this.state.formId,{},"get");
    }
    
    componentDidMount() {
        var that = this;
        if (this.props.formId) {
            this.getForm().then((response) => {
                if (response.status == "success") {
                    this.setState({ content: JSON.parse(response.data.template) });
                    this.createForm().then(() => {
                          that.setState({ title: that.state.content.title });
                          that.setState({ name: that.state.content.name });
                          that.setState({ display: that.state.content.display });
                    });
                }
            });
        } else {
            if(that.state.content){
                that.setState({ title: that.state.content.title });
                that.setState({ name: that.state.content.name });
                that.setState({ display: that.state.content.display });
            }
            this.createForm(that.state.display).then(() => {
                  that.setState({ title: that.state.content.title });
                  that.setState({ name: that.state.content.name });
                  that.setState({ display: that.state.content.display });
            });
        }
    }
    
    createForm(display) {
        let that = this;
        Formio.registerComponent("slidercomponent", SliderComponent);
        Formio.registerComponent("convergepayment", ConvergePayCheckoutComponent);
        Formio.registerComponent("documentcomponent", DocumentComponent);
        Formio.registerComponent("fortepayment", FortePayCheckoutComponent);
        Formio.registerComponent("radiocardcomponent", RadioCardComponent);
        Formio.registerComponent("phonecomponent" ,PhoneNumberComponent);
        Formio.registerComponent("countrycomponent", CountryComponent);
        console.log(display)
        var builderCreated =Formio.builder(document.getElementById("builder") , this.state.content, {
            display: display,
            builder: {
                customBasic: {
                    title: 'Custom',
                    default: true,
                    weight: 0,
                    components: {
                        radiocardcomponent: true,
                        file: true,
                        slidercomponent : true,
                        fortepayment : true,
                        documentcomponent: true,
                        phonecomponent : true,
                        countrycomponent: true,
                        convergepayment: true
                    }
                }
            },
        }).then(function(builder) {
            builder.on('saveComponent', function(submission) {
                console.log(submission);
            });
            builder.on('change', function(schema) {
                console.log(schema);
            });
            builder.on('editForm', function(schema) {
                console.log(schema);
            });
            builder.on('ready', function(schema) {
                console.log(schema);
            });
            that.setState({ builder: builder});
        });
        return builderCreated;
    }
    
    handleImport(e) {
        e.preventDefault()
        console.log(e.target.files[0])
        const reader = new FileReader();
        reader.onload = async (e) => { 
            const text = (e.target.result)
            setForm(JSON.parse(text))
        };
        reader.readAsText(e.target.files[0])
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
        if(e.target.name=='display'){
            this.state.builder.destroy();
            document.getElementById('builder').innerHTML='';
            this.setState({ display: e.target.value});
            var content = this.state.content;
            content.display = e.target.value;
            this.setState({ content: content });
            this.createForm(e.target.value);
        } else {
            if(e.target.name == 'title'){
                this.setState({ title: e.target.value });
                this.setState({ name: camelCase(e.target.value)});
                this.setState({ path: camelCase(e.target.value).toLowerCase()});
                var content = this.state.content;
                content.name = camelCase(e.target.value);
                content.path = camelCase(e.target.value).toLowerCase();
                content.title = e.target.value;
                this.setState({ content: content });
            }
        }
   }
    handleSaveForm(event){
        var submission = this.state.builder.form;
        this.props.saveForm(submission);
    }
    
    render() {
        return (
            <div>
            <Notification ref={this.notif} />
            <div>
            <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-3">
            <div id="form-group-title" className="form-group">
            <label htmlFor="name" className="control-label field-required">Name</label>
            <input
            type="text"
            className="form-control" id="title"
            name="title"
            placeholder="Enter the form title"
            value={this.state.title}
            onChange={(value) => this.onChange(value)}
            />
            </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3">
            <div id="form-group-name" className="form-group">
            <label htmlFor="name" className="control-label field-required">Name</label>
            <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Enter the form machine name"
            value={this.state.name}
            onChange={(value) => this.onChange(value)}
            />
            </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3">
            <div id="form-group-display" className="form-group">
            <label htmlFor="name" className="control-label">Display as</label>
            <div className="input-group">
            <select
            className="form-control"
            name="display"
            id="display"
            value={this.state.display}
            onChange={(value) => this.onChange(value)}
            >
            <option label="Form" value="form">Form</option>
            <option label="Wizard" value="wizard">Wizard</option>
            <option label="PDF" value="pdf">PDF</option>
            </select>
            </div>
            </div>
            </div>
            <div id="save-buttons" className="col-lg-3 col-md-3 col-sm-3">
            <div className="form-group">
            <span className="btn btn-primary" onClick={this.handleSaveForm}>
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
            )
        }
    }
    export default FormBuilder