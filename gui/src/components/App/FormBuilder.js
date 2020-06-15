import "../../public/css/formstyles.scss"
import React, { useEffect, useState} from 'react'
import {Formio } from 'react-formio'
import FormEdit from 'react-formio/lib/components/FormEdit';
import ConvergePayCheckoutComponent from "./Form/Payment/ConvergePayCheckoutComponent";
import DocumentComponent from "./Form/DocumentComponent";
import SliderComponent from "./Form/SliderComponent";
import FortePayCheckoutComponent from "./Form/Payment/FortePayCheckoutComponent";
import DocumentViewerComponent from "./Form/DocumentViewerComponent";
import RadioCardComponent from "./Form/RadioCardComponent";
import PhoneNumberComponent from "./Form/PhoneNumberComponent";
import CountryComponent from "./Form/CountryComponent";
import FileComponent from "./Form/FileComponent";

const FormBuilder = () => {
    const [form,setForm] = useState({display:'form'});
    const [success,setSuccess] = useState(false);
    const [error,setError] = useState(false);
    const [msg,setMessage] = useState('');

    useEffect(() => {
        Formio.registerComponent("slider", SliderComponent);
        Formio.registerComponent("convergepay", ConvergePayCheckoutComponent);
        Formio.registerComponent("document", DocumentComponent);
        Formio.registerComponent("fortepay", FortePayCheckoutComponent);
        Formio.registerComponent("radiocard", RadioCardComponent);
        Formio.registerComponent("phonenumber" ,PhoneNumberComponent);
        Formio.registerComponent("country", CountryComponent);
        // Formio.registerComponent("documentviewer", DocumentViewerComponent);
        // Formio.registerComponent("file", FileComponent);
        
    })
    const handleChange = (e) => {
        e.preventDefault()
        console.log(e.target.files[0])
        const reader = new FileReader();
        reader.onload = async (e) => { 
            const text = (e.target.result)
            setForm(JSON.parse(text))
        };
        reader.readAsText(e.target.files[0])
    }
    const saveForm =  (schema)  =>{
        
    }
    
    return (
        <React.Fragment>
            <div className="form-group">
                <div className="input-group mb-3">
                    <div className="custom-file">
                        <input onChange={handleChange} type="file" className="custom-file-input" id="inputGroupFile02"/>
                        <label className="custom-file-label">Choose file</label>
                    </div>
                </div>
            </div>
          
            <br/><br/>
            <div className="form-render">
                <FormEdit
                    saveText="Save Form"
                    form={form}
                    saveForm={(scheme) => saveForm(scheme)}
                    options={{
                        builder: {
                            customBasic: {
                                title: 'Custom Components',
                                default: true,
                                weight: 0,
                                components: {
                                    file: true,
                                    radiocard: true,
                                    slider : true,
                                    fortepay : true,
                                    document: true,
                                    documentviewer: true,
                                    phonenumber : true,
                                    country: true
                                }
                            }
                        }
                    }}
                />
            </div>
            
        </React.Fragment>
    )
}
export default FormBuilder