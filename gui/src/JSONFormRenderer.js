import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Form, Col, Row, Button, Tab, Tabs } from "react-bootstrap";
import PropTypes from "prop-types";
import "./public/css/JSONFormRenderer.scss";

const JSONFormRenderer=forwardRef((props,ref)=>{
  const [input, setInput] = useState({});
  const [formConfiguration, setFormConfiguration] = useState("");

  useEffect(() => {
    //set fetched values from database if any exists
    setDefaultValues();
  }, [props.values]);

  useEffect(() => {
    //set fetched values from database if any exists
    setFormConfiguration(JSON.stringify(input, null, 1))
  }, [input]);

  useImperativeHandle(ref,()=>({
    getFormConfig(){
      let parsedConfig=JSON.parse(formConfiguration)
      let preparedConfig={"data":parsedConfig}
     return JSON.stringify(preparedConfig)
    }
  }))

  let jsonFormData = props.formSchema;
  let defaultFields = jsonFormData["defaultFields"];
  let optionalFields = jsonFormData["optionalFields"];
  let values = props.values;
  let subForm = props.subForm != undefined ? props.subForm : false;

  const setDefaultValues = () => {
    let inputCopy = { ...input };
    for (const property in values) {
      inputCopy[property] = values[property];
    }
    setInput(inputCopy);
    setFormConfiguration(JSON.stringify(props.values, null, 1))
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if(name=="formConfiguration"){
      setFormConfiguration(value)
    } else {
      setInput({ ...input, [name]: value });
    }
   
  };

  const renderFormElement = (element) => {
    return (
      <Form.Group key={element.control.name + "_group"} as={Row}>
        <Form.Label key={element.control.name + "_label"} column lg="3">
          {element.label}
        </Form.Label>
        <Col lg="9">
          <Form.Control
            key={element.control.name + "_control"}
            {...element.control}
            onChange={handleChange}
            value={input[element.control.name] || ""}
          />
        </Col>
      </Form.Group>
    );
  };

  return (
    <div>
      <Tabs defaultActiveKey="form" id="uncontrolled-tab-example">
        <Tab eventKey="form" title={<i class="fa fa-file-text" aria-hidden="true" title="View Form"></i>}>
          {!subForm ?
            <Form >
              {Object.keys(defaultFields).map((element) => {
                return renderFormElement(defaultFields[element]);
              })}
            </Form>
            :
            <div className="json-form-renderer-container">
              {Object.keys(defaultFields).map((element) => {
                return renderFormElement(defaultFields[element]);
              })}
            </div>
          }
        </Tab>
        <Tab eventKey="json" title={<i aria-hidden="true" title="View JSON">{"{ }"}</i>} >
          <Form.Control as="textarea" rows="10" name="formConfiguration" value={formConfiguration} onChange={handleChange} />
          {/* <Form.Text className="text-muted errorMsg">
                {errors["configuration"]}
              </Form.Text>  */}
        </Tab>
      </Tabs>
    </div>
  );
})

JSONFormRenderer.propTypes = {
  formSchema: PropTypes.object,
  values: PropTypes.object,
};
export default JSONFormRenderer;
