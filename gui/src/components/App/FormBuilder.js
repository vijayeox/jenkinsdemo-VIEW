import "../../public/css/formstyles.scss"
import React, { useEffect, useState} from 'react'
import {Formio } from 'formiojs'
import {  camelCase } from 'lodash'
import ConvergePayCheckoutComponent from "./Form/Payment/ConvergePayCheckoutComponent";
import DocumentComponent from "./Form/DocumentComponent";
import SliderComponent from "./Form/SliderComponent";
import FortePayCheckoutComponent from "./Form/Payment/FortePayCheckoutComponent";
import RadioCardComponent from "./Form/RadioCardComponent";
import PhoneNumberComponent from "./Form/PhoneNumberComponent";
import CountryComponent from "./Form/CountryComponent";
import FileComponent from "./Form/FileComponent";

const FormBuilder = () => {
    const [display,setDisplay] = useState({display: 'form'})
    const [form,setForm] = useState({
        display: '',
        path: '',
        name: '',
        title: '',
        components: ''
    });


    useEffect(()=> {
        setForm({...form, 'display' : display})
    },[])
    useEffect(() => {
        Formio.registerComponent("slidercomponent", SliderComponent);
        Formio.registerComponent("convergepayment", ConvergePayCheckoutComponent);
        Formio.registerComponent("documentcomponent", DocumentComponent);
        Formio.registerComponent("fortepayment", FortePayCheckoutComponent);
        Formio.registerComponent("radiocardcomponent", RadioCardComponent);
        Formio.registerComponent("phonecomponent" ,PhoneNumberComponent);
        Formio.registerComponent("countrycomponent", CountryComponent);
        Formio.builder(document.getElementById("builder") , {
            display :  form.display,
            components : form.components
        }, {
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
            })
            builder.on('editForm', function(schema) {
                console.log(schema);
            })
        })
    },[form])

    const handleImport = (e) => {
        e.preventDefault()
        console.log(e.target.files[0])
        const reader = new FileReader();
        reader.onload = async (e) => { 
            const text = (e.target.result)
            setForm(JSON.parse(text))
        };
        reader.readAsText(e.target.files[0])
    }
    const saveForm =  ()  =>{
        console.log(form)
    }
    const handleChange = value => event => {
        
        setForm({ ...form, [value]: event.target.value }); 
        if (value === 'title' && form._id === undefined) {
            setForm({ ...form,'title': event.target.value, 'name' : camelCase(event.target.value), 'path' : camelCase(event.target.value).toLowerCase()}); 
        }
    };
    
    return (
        <React.Fragment>{console.log(form)}
            <div style={{padding: 30}}>
            <div className="form-group">
                <div className="input-group mb-3">
                    <div className="custom-file">
                        <input onChange={handleImport} type="file" className="custom-file-input" id="inputGroupFile02"/>
                        <label className="custom-file-label">Choose file</label>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-2 col-md-4 col-sm-4">
                        <div id="form-group-title" className="form-group">
                            <label htmlFor="title" className="control-label field-required">Title</label>
                            <input
                                type="text"
                                className="form-control" id="title"
                                placeholder="Enter the form title"
                                value={form.title? form.title : ''}
                                onChange={handleChange('title')}
                            />
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-4">
                        <div id="form-group-name" className="form-group">
                            <label htmlFor="name" className="control-label field-required">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter the form machine name"
                                value={form.name? form.name : ''}
                                onChange={handleChange('name')}
                            />
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-3">
                        <div id="form-group-display" className="form-group">
                            <label htmlFor="name" className="control-label">Display as</label>
                            <div className="input-group">
                                <select
                                    className="form-control"
                                    name="form-display"
                                    id="form-display"
                                    value={form.display? form.display : ''}
                                    onChange={handleChange('display')}
                                >
                                <option label="Form" value="form">Form</option>
                                <option label="Wizard" value="wizard">Wizard</option>
                                <option label="PDF" value="pdf">PDF</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-2 col-md-4 col-sm-4">
                        <div id="form-group-path" className="form-group">
                            <label htmlFor="path" className="control-label field-required">Path</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="path"
                                    placeholder="example"
                                    style={{'textTransform': 'lowercase', width:'120px'}}
                                    value={form.path ? form.path : ''}
                                    onChange={handleChange('path')}
                                />
                            </div>
                        </div>
                    </div>
                    <div id="save-buttons" className="col-lg-2 col-md-5 col-sm-5 save-buttons pull-right">
                        <div className="form-group pull-right">
                        <span className="btn btn-primary" onClick={(schema) => saveForm(schema)}>
                            Save Form
                        </span>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{padding: 40}} id="builder"></div>
            </div>
            
        </React.Fragment>
    )
}
export default FormBuilder