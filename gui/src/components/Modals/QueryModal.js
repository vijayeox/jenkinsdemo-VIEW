import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'


function QueryModal(props) {

  const [input, setInput] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (props.content !== undefined) {
      if (props.content.length !== 0) {
        var { name, ispublic, configuration, uuid, version } = props.content;
        setInput({ ...input, ["queryname"]: name, ["visibility"]: ispublic, configuration, uuid, version })
      }
      else {
        setInput({ ["queryname"]: "", ["datasourcename"]: props.datasourcename, ["datasourceuuid"]: props.datasourceuuid })
      }
    }
  }, [props.content])


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

  var Footer = null
  var DisabledFields = true


  if (props.modalType === "Delete") {
    Footer = (<Button variant="danger" onClick={() => queryOperation("Deleted")}>Delete</Button>)
    DisabledFields = true
  }
  else if (props.modalType === "Save") {
    Footer = (<Button variant="primary" onClick={() => queryOperation("Created")}>Create</Button>)
    DisabledFields = false
  }
  else if (props.modalType === "Activate") {
    Footer = (<Button variant="success" onClick={() => queryOperation("Activated")}>Activate</Button>)
    DisabledFields = true
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
    return formValid
  }

  function queryOperation(operation) {
    let helper = props.osjsCore.make("oxzion/restClient");
    let requestUrl = ""
    let method = ""
    let formData = {}

    if (operation === "Created" || operation === "Activated") {

      formData["name"] = input["queryname"]
      formData["datasource_id"] = input["datasourceuuid"]
      formData["configuration"] = input["configuration"]
      formData["ispublic"] = input["visibility"]
      if (operation === "Activated") {
        formData["configuration"] = JSON.stringify(input["configuration"])
        formData["version"] = input["version"]
        formData["isdeleted"] = "0"
        requestUrl = "analytics/query/" + input["uuid"]
        method = "put"
      }
      else {
        requestUrl = "analytics/query"
        method = "filepost"
      }
    }
    else if (operation === "Deleted") {
      requestUrl = "analytics/query/" + input["uuid"] + "?version=" + input["version"]
      method = "delete"
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
          props.refreshGrid.current.child.current.refresh()
          notify(response, operation)
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
          {props.modalType} Query
         </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Query Name</Form.Label>
            <Col lg="9">
              <Form.Control type="text" name="queryname" onChange={handleChange} disabled={DisabledFields} value={input["queryname"] !== undefined ? input["queryname"] : null} />
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
                disabled={DisabledFields}
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
              <Form.Control as="textarea" name="configuration" value={input["configuration"] !== undefined ? JSON.stringify(input["configuration"]) : props.configuration} disabled />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {Footer}
      </Modal.Footer>
    </Modal>
  );
}

export default QueryModal