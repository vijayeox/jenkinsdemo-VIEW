import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { Form, Col, Row, Button, Tab, Tabs, InputGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import "./public/css/JSONFormRenderer.scss";
import { nextFrame } from "../amcharts/core";

const JSONFormRenderer = forwardRef((props, ref) => {
  const [input, setInput] = useState({});
  const [formValues, setFormValues] = useState("{}");
  const [formFields, setFormFields] = useState(props.formSchema != undefined ? props.formSchema : {})
  const [optionalFields, setOptionalFields] = useState(null);
  const [rasaResponse, setrasaResponse] = useState("{}");
  const [rasaInput, setrasaInput] = useState("{}");
  const el = useRef(null);
  useEffect(() => {
    //set fetched values from database if any exists
    setDefaultValues();
  }, [props.values]);

  useEffect(() => {
    setFormFields(props.formSchema != undefined ? props.formSchema : {})
  }, [props.formSchema]);

  useEffect(() => {
    generateOptionalFieldsDropDown()
    scrollToBottom()
  }, [formFields])


  useImperativeHandle(ref, () => ({
    getFormConfig(embedData) {
      let parsedConfig = JSON.parse(formValues)
      let preparedConfig = parsedConfig
      if(embedData){
        preparedConfig = { "data": parsedConfig }
      }
      return JSON.stringify(preparedConfig)
    }
  }))

  let values = props.values;
  let subForm = props.subForm != undefined ? props.subForm : false;

  const scrollToBottom = () => {
    const divContainer = document.getElementById("json-form-renderer-container")
    if (divContainer) {
      el.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
      // divContainer.scrollTop=divContainer.scrollHeight
      divContainer.scrollIntoView({ "behaviour": "smooth" })
      divContainer.scrollTop = divContainer.scrollHeight

    }
  }
  const generateOptionalFieldsDropDown = () => {
    let options = formFields["optionalFields"] && Object.keys(formFields["optionalFields"]).map((element) => {
      if (formFields["optionalFields"][element]) {
        return <option key={element} value={formFields["optionalFields"][element].control.name}>{element}</option>
      }
    })
    setOptionalFields(options)
  }
  const setDefaultValues = () => {
    console.log("Set default Values")
    let inputCopy = { ...input };
    for (const property in values) {
      inputCopy[property] = values[property];
    }
    setInput(inputCopy);
    console.log(inputCopy);
    setFormValues(JSON.stringify(props.values, null, 1))
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name == "formValues") {
      setFormValues(value)
    }
    else if (name === "rasaQuery") {
        setrasaInput(value)
        console.log("Place Holder changed to : ");
        console.log(rasaInput);
    } else if (name === "optionalFields") {
      console.log("Add optional Field")
      console.log(e.target.options[e.target.selectedIndex].text)
      addFormFields(e.target.options[e.target.selectedIndex].text)
      value = "-1" //setting to default on selecting from dropdown
    } else {
      let testVal1 = JSON.stringify({[name] : value})
      let formValuesCopy = { ...JSON.parse(formValues) }
      formValuesCopy[name] = value
      console.log(formValues)
      setInput({ ...input, [name] : value });
      setFormValues(JSON.stringify(formValuesCopy, null, 1))
    }
  };

  const removeFormField = (obj, field) => {
    let formFieldsCopy = { ...formFields }
    let formValuesCopy = JSON.parse(formValues)
    let inputCopy = { ...input }
    formFieldsCopy["optionalFields"][field] = formFieldsCopy["defaultFields"][field]
    delete formFieldsCopy["defaultFields"][field]
    delete formValuesCopy[obj.control.name]
    // delete inputCopy[obj.control.name]
    setFormFields(formFieldsCopy)
    setFormValues(JSON.stringify(formValuesCopy, null, 1))
    // setInput(inputCopy)
  }
  // Add the response from rasa to the query builder
  const addFormFields1 = (field, value) => {
    console.log('est')
    let formFieldsCopy = { ...formFields }
    let formValuesCopy = JSON.parse(formValues)
    if (typeof (formValuesCopy) !== "object") {
      formValuesCopy = {}
    }
    formFieldsCopy["defaultFields"][field] = formFieldsCopy["optionalFields"][field]
    let fieldName = formFieldsCopy["defaultFields"][field]["control"]["name"]
    formValuesCopy[fieldName] = input[fieldName]
    delete formFieldsCopy["optionalFields"][field]
    setFormFields(formFieldsCopy)
    setFormValues(JSON.stringify(formValuesCopy, null, 1))
    handleChange({target: {name: fieldName, value: value}})
  }

  const addFormFields = (field) => {
    console.log({ ...formFields })
    let formFieldsCopy = { ...formFields }
    let formValuesCopy = JSON.parse(formValues)
    if (typeof (formValuesCopy) !== "object") {
      formValuesCopy = {}
    }
    formFieldsCopy["defaultFields"][field] = formFieldsCopy["optionalFields"][field]
    let fieldName = formFieldsCopy["defaultFields"][field]["control"]["name"]
    formValuesCopy[fieldName] = input[fieldName]
    delete formFieldsCopy["optionalFields"][field]
    setFormFields(formFieldsCopy)
    setFormValues(JSON.stringify(formValuesCopy, null, 1))

  }

  //const URL = "http://54.184.77.136:5005/webhooks";

  const getRasaResponse = async () => {
    var data = {"sender": "Varun1",   //Avatar ID     // we can use Username
                "message": rasaInput
              }; 
    console.log("Body Looks like : ")
    console.log(JSON.stringify(data))
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    console.log("API Object Looks like : ");
    console.log(fetchOptions);

    const response = await fetch(
      `http://rasa.eoxvantage.com:5005/webhooks/rest/webhook`,
      fetchOptions,
    );
    const messagesJson = await response.json();
    const jsonRasa = messagesJson[0]["attachment"]
    console.log(messagesJson[0]["attachment"]);
    // Load the json in the bot tab of rasa. 
    setrasaResponse(JSON.stringify(jsonRasa))
    
    // Set the state for first tab to load the values in the first tab


    const newData = Object.keys(jsonRasa).map((json1, value) => {
      console.log(json1)
      console.log(jsonRasa[json1])
      var count = 1;
      if(json1 === 'Filter' && count === 1)
      {
        jsonRasa[json1] = JSON.stringify(jsonRasa[json1])
        addFormFields1(json1,jsonRasa[json1])
        count = 0;
      }
      else{
        addFormFields1(json1,jsonRasa[json1])
      }
    });    
  }

  const renderFormElement = (field, key) => {
    if (field) {
      console.log("Log from render");
      console.log(input);
      return (
        <Form.Group key={field.control.name + "_group"} as={Row}>
          <Form.Label key={field.control.name + "_label"} column lg="3">
            {field.label}
          </Form.Label>
          <Col lg="8">
            <Form.Control
              key={field.control.name + "_control"}
              {...field.control}
              onChange={handleChange}
              value={input[field.control.name] ? typeof (input[field.control.name]) == "object" ? JSON.stringify(input[field.control.name]) : input[field.control.name] : ""}
            />
          </Col>
          <Col lg="1" style={{ "padding": "0" }}>
            <Button onClick={() => removeFormField(field, key)}>-</Button>
          </Col>
        </Form.Group>
      );
    }
  };

  return (
    <div>
      <Tabs defaultActiveKey="form" id="uncontrolled-tab-example">
        <Tab eventKey="form" title={<i className="fa fa-file-text" aria-hidden="true" title="View Form"></i>}>
          {!subForm ?
            <Form >
              {formFields["defaultFields"] && Object.keys(formFields["defaultFields"]).map((element) => {
                return renderFormElement(formFields["defaultFields"][element], element);
              })}
              <select id="optionalFields" name="optionalFields" className="form-control form-control-sm" value={input["optionalFields"]} placeholder="Select Fields" onChange={handleChange} >
                <option key="" value="-1" >--Select Fields--</option>
                {optionalFields}
              </select>
            </Form>
            :
            <div className="json-form-renderer-container" id="json-form-renderer-container" ref={el}>
              {formFields["defaultFields"] && Object.keys(formFields["defaultFields"]).map((element) => {
                return renderFormElement(formFields["defaultFields"][element], element);
              })}
              {
                formFields["optionalFields"] && Object.keys(formFields["optionalFields"]).map((element) => {
                  if (formFields["optionalFields"][element]) {
                    let name = formFields["optionalFields"][element].control.name
                    let formValue = JSON.parse(formValues)
                    if (formValue.hasOwnProperty(name))
                      addFormFields(element)
                  }
                }
                )
              }
              <select id="optionalFields" name="optionalFields" className="form-control form-control-sm" value={input["optionalFields"]} placeholder="Select Fields" onChange={handleChange} >
                <option key="" value="-1" >--Select Fields--</option>
                {optionalFields}
              </select>
            </div>
          }

        </Tab>
        <Tab eventKey="json" title={<i aria-hidden="true" title="View JSON">{"{ }"}</i>} >
          <Form.Control as="textarea" rows="10" name="formValues" value={formValues} onChange={handleChange} disabled />
          {/* <Form.Text className="text-muted errorMsg">
                {errors["configuration"]}
              </Form.Text>  */}
        </Tab>
        <Tab eventKey="form1" title={<i className="fas fa-robot" aria-hidden="true" title="View Rasa tab value"></i>}>
        <div className="json-form-renderer-container">
            <Form.Group controlId="formRasa" onSubmit={getRasaResponse}>
              <Form.Label>Enter Your question here</Form.Label>
              <Form.Control type="query" name="rasaQuery" placeholder="Your Question here" onChange={handleChange}  />
              <hr/>
              <Button variant="primary" onClick={() => getRasaResponse()}>
              Generate Query
            </Button>
            </Form.Group>
            <div>
            <Form.Control as="textarea" rows="10" name="formValues" value={rasaResponse} disabled />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
})


//validation for props
JSONFormRenderer.propTypes = {
  formSchema: PropTypes.object,
  values: PropTypes.string,
};
export default JSONFormRenderer;
