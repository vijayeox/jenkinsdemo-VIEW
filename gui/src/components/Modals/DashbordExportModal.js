import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'
import Select from 'react-select'


function DashboardExportModal(props) {

  const [input, setInput] = useState({})
  const [errors, setErrors] = useState({})
  const helper = props.core.make("oxzion/restClient");
  const [queryOptions, setQueryOptions] = useState([])


  useEffect(() => {
    setQueryList()
  }, [])

  async function setQueryList() {
    let inputCopy = { ...input }
    let response = await helper.request(
      "v1",
      `analytics/query?filter=[{"sort":[{"field":"name","dir":"asc"}],"skip":0,"take":5000}]`,
      {},
      "get"
    )
    if (response && response.data) {
      let queryList = []
      response.data.data.map(query => {
        queryList.push({ "label": query.name, "value": query.uuid, "configuration": query.configuration, "datasource_id": query.datasource_uuid })
      });
      let selectedExportQueryValue = {}
      if (typeof (props.selectedExportQuery) != "object") {
        selectedExportQueryValue = props.selectedExportQuery !== "" ? JSON.parse(props.selectedExportQuery) : {}
      } else if (typeof (props.selectedExportQuery) == "object") {
        selectedExportQueryValue = props.selectedExportQuery
      }
      setQueryOptions(queryList)
      setInput({ ...inputCopy, ["selectQuery"]: selectedExportQueryValue })
    }
  }
  function notify() {


    props.notification.current.notify(
      "Dashboard Query",
      "Dashboard query set successfully",
      "success"
    )

  }

  async function validateForm(operation) {

  }


  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    let error = errors
    error[e.target.name] = ""
    setErrors({ ...error })
    setInput({ ...input, [name]: value });
  }
  function selectableWidgetSelectionChanged(e) {
    setInput({ ...input, ["selectQuery"]: e })
  }
  function saveDashboardQuery() {
    let mockEvent = { "target": {} }
    mockEvent["target"]["name"] = "selectQuery"
    mockEvent["target"]["value"] = input["selectQuery"]
    props.inputChanged(mockEvent)
    notify()
    props.onHide()
  }
  function clearQuery() {
    let mockEvent = { "target": {} }
    mockEvent["target"]["name"] = "selectQuery"
    mockEvent["target"]["value"] = ""
    props.inputChanged(mockEvent)
    setInput({ ...input, ["selectQuery"]: "" })
  }

  return (
    <Modal
      show={props.show}
      onHide={() => props.onHide()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="datasource-modal"
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
          Dashboard Export Query
         </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form>
          <Form.Group as={Row}>
            <Form.Label column lg="3">Export Query</Form.Label>
            <Col lg="9" >

              <Select
                placeholder="Choose Query"
                name="selectQuery"
                id="selectQuery"
                onChange={(e) => selectableWidgetSelectionChanged(e)}
                value={(queryOptions.length > 0 && input["selectQuery"] != undefined) && queryOptions.filter(option => option.value == input["selectQuery"]["value"])}
                options={queryOptions}

              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={()=>ref.current.getFormConfig()}>REF</Button> */}
        <Button variant="secondary" onClick={() => { props.onHide() }}>Cancel</Button>
        <Button variant="secondary" onClick={() => clearQuery()}>Clear Selection</Button>
        <Button variant="success" onClick={() => saveDashboardQuery()}>Set Query</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DashboardExportModal