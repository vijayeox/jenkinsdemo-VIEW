import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'


function DataSourceModal(props) {

  const [input, setInput] = useState({})
  const allowedOperation = {
    ACTIVATE: "Activated",
    CREATE: "Created",
    EDIT: "Edited",
    DELETE: "Deleted"
  }
  useEffect(() => {
    if (props.content !== undefined) {
      var { name, type } = props.content;
      var configuration = JSON.stringify(props.content.configuration)
      setInput({ ...input, ["name"]: name, ["type"]: type, ["configuration"]: configuration })
    }
    else {
      //clear all inputs
      setInput({ ["name"]: "", ["type"]: "", ["configuration"]: "" })
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


  function dataSourceOperation(operation) {

    let helper = props.osjsCore.make("oxzion/restClient");
    let requestUrl = ""
    let method = ""
    let formData = {}

    if (operation !== undefined && operation !== allowedOperation.DELETE) {
      formData["name"] = input["name"];
      formData["type"] = input["type"];
      formData["configuration"] = input["configuration"];

      if (operation === allowedOperation.EDIT || operation === allowedOperation.ACTIVATE) {
        //pass additional form inputs required for edit operation
        formData["uuid"] = props.content.uuid
        formData["version"] = props.content.version;
        requestUrl = "analytics/datasource/" + props.content.uuid;
        operation === "Activated" ? formData["isdeleted"] = "0" : null
        method = "put"
      }
      else {
        requestUrl = "analytics/datasource";
        method = "filepost"
      }
    }
    else if (operation === allowedOperation.DELETE) {
      requestUrl = "analytics/datasource/" + props.content.uuid + "?version=" + props.content.version
      method = "delete"
    }

    helper.request(
      "v1",
      requestUrl,
      formData,
      method
    )
      .then(response => {
        props.refreshGrid.current.child.current.refresh()
        notify(response, operation)
        props.onHide()
      })
      .catch(err => {
        console.log(err)
      })
  }

  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setInput({ ...input, [name]: value });
  }
  var Footer = null
  var DisabledFields = true

  if (props.modalType === "Edit") {
    //set to none if no content is changed else set to block
    Footer = (<Button variant="primary" onClick={() => dataSourceOperation("Edited")} >Save Changes</Button>)
    DisabledFields = false
  }
  else if (props.modalType === "Delete") {
    Footer = (<Button variant="danger" onClick={() => dataSourceOperation("Deleted")}>Delete</Button>)
    DisabledFields = true
  }
  else if (props.modalType === "Create") {
    Footer = (<Button variant="primary" onClick={() => dataSourceOperation("Created")}>Create</Button>)
    DisabledFields = false
  }
  else if (props.modalType === "Activate") {
    Footer = (<Button variant="success" onClick={() => dataSourceOperation("Activated")}>Activate</Button>)
    DisabledFields = true
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
          {props.modalType} Data Source
         </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Name</Form.Label>
            <Col lg="9">
              <Form.Control type="text" name="name" value={input["name"]} onChange={handleChange} disabled={DisabledFields} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Type</Form.Label>
            <Col lg="9">
              <Form.Control type="text" name="type" value={input["type"]} onChange={handleChange} disabled={DisabledFields} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Configuration</Form.Label>
            <Col lg="9">
              <Form.Control as="textarea" rows="4" name="configuration" value={input["configuration"]} onChange={handleChange} disabled={DisabledFields} />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { props.onHide() }}>Cancel</Button>
        {Footer}
      </Modal.Footer>
    </Modal>
  );
}

export default DataSourceModal