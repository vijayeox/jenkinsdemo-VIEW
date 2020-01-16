import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'


function QueryModal(props) {

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
  const [input, setInput] = useState({})

  useEffect(() => {
    setInput({ ["datasourcename"]: props.datasourcename, ["configuration"]: props.configuration, ["datasourceuuid"]: props.datasourceuuid })
  }, [props.configuration])

  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setInput({ ...input, [name]: value });
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
      formData["datasource_id"] = "1" //change after api is fixed
      formData["configuration"] = input["configuration"]
    }

    helper.request(
      "v1",
      requestUrl,
      formData,
      method
    )
      .then(response => {
        notify(response, "Saved")
        props.onHide()
      })
      .catch(err => {
        console.log(err)
      })
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
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Visibility</Form.Label>
            <Col lg="9">
              <Form.Control as="select" name="visibility" onChange={handleChange} >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </Form.Control>
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