import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'


function QueryModal(props) {

  const [input, setInput] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setInput({ ["datasourcename"]: props.datasourcename, ["configuration"]: props.configuration, ["datasourceuuid"]: props.datasourceuuid })
  }, [props.configuration])


  function notify(response, operation) {
    if (response.status == "success")
      props.notification.current.notify(
        "Data Source " + operation,
        "Operation succesfully completed",
        "success"
      )
    else {
      props.notification.current.notify(
        "Error",
        "Operation failed " + response.message,
        "danger"
      )
    }
  }


  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    let error = errors
    error[e.target.name] = ""
    setErrors({ ...error })
    setInput({ ...input, [name]: value });
  }

  function validateForm() {
    let formValid = true
    var error = errors
    if (!input["queryname"]) {
      formValid = false
      error["queryname"] = "* Please enter the query name"
    }
    if (!input["visibility"]) {
      formValid = false
      error["visibility"] = "* Please enter the configuration"
    }
    setErrors({ ...error })
    console.log(errors)
    return formValid
  }

  function queryOperation(operation) {
    let helper = props.osjsCore.make("oxzion/restClient");
    let requestUrl = ""
    let method = ""
    let formData = {}

    if (operation === "Saved") {
      requestUrl = "analytics/query"
      method = "filepost"
      formData["name"] = input["queryname"]
      formData["datasource_id"] = input["datasourceuuid"]
      formData["configuration"] = input["configuration"]
      formData["ispublic"] = input["visibility"]
    }

    let formValid = validateForm()
    if (formValid === true) {
      helper.request(
        "v1",
        requestUrl,
        formData,
        method
      )
        .then(response => {
          notify(response, "Saved")
          props.resetInput()
          props.onHide()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="datasource-modal"
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
          Save Query
         </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Query Name</Form.Label>
            <Col lg="9">
              <Form.Control type="text" name="queryname" onChange={handleChange} />
              <Form.Text className="text-muted errorMsg">
                {errors["queryname"]}
              </Form.Text>
            </Col>

          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Visibility</Form.Label>
            <Col lg="9">
              <Form.Control
                as="select"
                name="visibility"
                onChange={handleChange}
                value={input["visibility"] !== undefined ? input["visibility"] : -1}

              >
                <option disabled value={-1} key={-1}></option>
                <option value="0">Private</option>
                <option value="1">Public</option>
              </Form.Control>
              <Form.Text className="text-muted errorMsg">
                {errors["visibility"]}
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Data Source Name</Form.Label>
            <Col lg="9">
              <Form.Control type="text" name="datasourcename" value={props.datasourcename} disabled />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Configuration</Form.Label>
            <Col lg="9">
              <Form.Control as="textarea" name="configuration" value={props.configuration || ""} disabled />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.onHide()}>Close</Button>
        <Button onClick={() => queryOperation("Saved")}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QueryModal