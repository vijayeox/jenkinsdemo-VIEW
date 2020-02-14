import React from 'react'
import DatePicker from 'react-datepicker'
import { Form, Row, Col, Button } from 'react-bootstrap'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select/creatable'

const FilterFields = function (props) {
    const { rows, index, fieldName, dataType, onUpdate, removeField } = props;
    const filtersOptions = {
        "dateoptions": [{ "Between": "gte&&lte" }, { "<": "lt" }, { ">": "gt" }, { "=": "eq" }],
        "textoptions": [{ "Starts With": "startswith" }, { "contains": "contains" }],
        "numericoptions": [{ "<": "lt" }, { ">": "gt" }, { "=": "eq" }]
    };
    const dataTypeOptions = [
        "numeric"
    ]
    return (
        <Form.Row>
            <Col sm="2">
                <Form.Group  >
                    <Form.Label>Field Name</Form.Label>
                    <Form.Control type="text" value={fieldName} disabled />
                </Form.Group>
            </Col>
            {
                dataType !== "date" && dataType !== "text"
                    ?
                    <Col sm="2">
                        <Form.Group controlId="formGridData">
                            <Form.Label>Data Type</Form.Label>
                            <Form.Control name="dataType" as="select" onChange={(e) => onUpdate(e, index)} value={rows[index] !== undefined ? rows[index]["dataType"] : ""} >

                                <option disabled key="-1" value=""></option>
                                {dataTypeOptions.map(item => {
                                    return (<option>{item}</option>)
                                })}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    : null
            }
            <Col sm="2">
                <Form.Group >
                    <Form.Label>Options</Form.Label>
                    {
                        dataType === "date" || dataType === "text" || dataType === "numeric"
                            ?
                            <Form.Control as="select" name={"options"} onChange={(e) => onUpdate(e, index)} value={rows[index] !== undefined ? rows[index]["options"] : ""}>
                                <option disabled key="-1" value=""></option>
                                {filtersOptions[dataType + 'options'].map(item => {
                                    return (<option value={Object.values(item)[0]}>{Object.keys(item)[0]}</option>)
                                })}
                            </Form.Control>
                            :
                            <Form.Control as="select" name={"options"} onChange={(e) => onUpdate(e, index)} value={rows[index] !== undefined ? rows[index]["options"] : ""}>
                                <option disabled key="-1" value=""></option>
                            </Form.Control>
                    }

                </Form.Group>
            </Col>
            <Col sm>
                <Form.Group controlId="formGridPassword">
                    <Form.Label>Default Value</Form.Label><br />
                    {dataType === "date"
                        ?
                        rows[index]["options"] !== "gte&&lte" ?
                            <DatePicker
                                key={index}
                                dateFormat="dd/MM/yyyy"
                                selected={rows[index]["startDate"]}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                popperPlacement="bottom"
                                popperModifiers={{
                                    flip: {
                                        behavior: ["bottom"] // don't allow it to flip to be above
                                    },
                                    preventOverflow: {
                                        enabled: false // tell it not to try to stay within the view (this prevents the popper from covering the element you clicked)
                                    },
                                    hide: {
                                        enabled: false // turn off since needs preventOverflow to be enabled
                                    }
                                }}
                                onChange={date => onUpdate(date, index, "startDate")}
                                name="startDate" />
                            :
                            <div className="dates-container">
                                <DatePicker
                                    selected={rows[index]["startDate"]}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={date => onUpdate(date, index, "startDate")}
                                    selectsStart
                                    startDate={rows[index]["startDate"]}
                                    endDate={rows[index]["endDate"]}
                                    showMonthDropdown
                                    showYearDropdown
                                    popperPlacement="bottom"
                                    popperModifiers={{
                                        flip: {
                                            behavior: ["bottom"] // don't allow it to flip to be above
                                        },
                                        preventOverflow: {
                                            enabled: false // tell it not to try to stay within the view (this prevents the popper from covering the element you clicked)
                                        },
                                        hide: {
                                            enabled: false // turn off since needs preventOverflow to be enabled
                                        }
                                    }}
                                    dropdownMode="select"
                                />
                                <DatePicker
                                    selected={rows[index]["endDate"]}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={date => onUpdate(date, index, "endDate")}
                                    selectsEnd
                                    startDate={rows[index]["startDate"]}
                                    endDate={rows[index]["endDate"]}
                                    minDate={rows[index]["startDate"]}
                                    showMonthDropdown
                                    showYearDropdown
                                    popperPlacement="bottom"
                                    popperModifiers={{
                                        flip: {
                                            behavior: ["bottom"] // don't allow it to flip to be above
                                        },
                                        preventOverflow: {
                                            enabled: false // tell it not to try to stay within the view (this prevents the popper from covering the element you clicked)
                                        },
                                        hide: {
                                            enabled: false // turn off since needs preventOverflow to be enabled
                                        }
                                    }}
                                    dropdownMode="select"
                                />
                            </div>
                        :
                        <Form.Control type="text" name="defaultvalue" onChange={(e) => onUpdate(e, index)} value={rows[index] !== undefined ? rows[index]["defaultvalue"] : ""} />}
                </Form.Group>
            </Col>
            <Col style={{ marginBottom: "1em" }}>
                <Form.Group>
                    <Button onClick={(e) => removeField(index, fieldName)}>x</Button>
                </Form.Group>
            </Col>
        </Form.Row>)
}


class DashboardEditorFilter extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.createField = this.createField.bind(this);
        this.removeField = this.removeField.bind(this);

        this.state = {
            input: {},
            focused: null,
            inputFields: [],
            startDate: new Date(),
            availableFilterOption: [{ value: "text", label: "Text" }, { value: "date", label: "Date" }],
            rows: []
        }
    }

    removeField(index, field) {
        var availableOptions = [...this.state.availableFilterOption];
        let rows = [...this.state.rows]

        if (index > -1) {
            delete rows[index]
            //add back the option to the filter list
            if (field === "text" || field === "date") {
                let newItem = { value: field, label: field }
                availableOptions.push(newItem)
                this.setState({ rows: rows, availableFilterOption: availableOptions })
            }
            else {
                this.setState({ rows: rows })
            }
        }
    }

    createField(fieldname) {
        var availableOptions = [...this.state.availableFilterOption];
        let rows = [...this.state.rows]
        let newoption = null
        let length = rows !== undefined ? rows.length : 0
        if (fieldname === "date") {
            rows.push({ fieldName: fieldname, dataType: "date", options: "", value: new Date(), key: length })
        } else if (fieldname === "text") {
            rows.push({ fieldName: fieldname, dataType: "text", options: "", value: "", key: length })
        } else {
            rows.push({ fieldName: fieldname, dataType: "", options: "", value: "", key: length })
        }
        //removing filter from option list 
        newoption = availableOptions.filter(function (obj) {
            return obj.value !== fieldname;
        });
        this.setState({ availableFilterOption: newoption, rows: rows })
    }

    handleChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ input: { ...this.state.input, [name]: value } })
    }

    updateRow(e, index, type) {
        let name
        let value
        if (type === "startDate" || type === "endDate") {
            name = type
            value = e
        }
        else {
            name = e.target.name
            value = e.target.value
        }
        let rows = [...this.state.rows]
        rows[index][name] = value
        this.setState({ rows })
    }
    handleSelect(e) {
        let name = e.value;
        let value = e.label;
        if (e.__isNew__) {
            let rows = [...this.state.rows]
            let length = rows !== undefined ? rows.length : 0
            rows.push({ fieldName: name, dataType: "", options: "", value: "", key: length })
            this.setState({ input: { ...this.state.input, "filtertype": "" }, rows })
        } else {
            this.createField(e.value)
            this.setState({ input: { ...this.state.input, "filtertype": "" } })
        }
    }

    hideFilterDiv() {
        var element = document.getElementById("filter-form-container");
        element.classList.add("disappear");
        document.getElementById("dashboard-container").classList.remove("disappear")
        document.getElementById("dashboard-filter-btn").disabled = false

    }

    saveFilter() {

        let restClient = this.props.core.make('oxzion/restClient');
        let filters
        if (this.state.rows !== undefined) {
            filters = this.state.rows.filter(function (obj) {
                return obj !== undefined && obj.value !== undefined;
            });
        }

        let formData = {}
        formData["dashboard_type"] = "html";
        formData["version"] = this.props.dashboardVersion;
        formData["filters"] = filters

        console.log(formData)
        //uncomment once api is implemented

        // formData["filters"]="";
        // this.restClient.request(
        //     "v1",
        //     'analytics/dashboard/' + this.props.dashboardId,
        //     formData,
        //     "put"
        //   )
        //     .then(response => {
        //       props.refreshGrid.current.child.current.refresh()
        //       notify(response, operation)
        //       props.resetInput()
        //       props.onHide()
        //     })
        //     .catch(err => {
        //       console.log(err)
        //     })
    }
    render() {
        return (
            <div id="filter-form-container" className="disappear">
                <Row className="pull-right">
                    <button type="button" className="close" aria-label="Close" onClick={() => this.hideFilterDiv()}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Row>
                <Form className="create-filter-form">
                    {this.state.rows.filter(obj => obj !== undefined).map((row, index) => {
                        return <FilterFields
                            index={row.key}
                            rows={this.state.rows}
                            input={this.state.input}
                            key={index}
                            dataType={row.dataType || ""}
                            value={row.value || this.state.input[row.fieldName + "defaultvalue"]}
                            removeField={this.removeField}
                            fieldName={row.fieldName}
                            onUpdate={(e, index, type) => this.updateRow(e, index, type)}
                            onChange={(e) => this.handleChange(e)}
                        />
                    })
                    }
                    <Form.Group>
                        <Form.Label> Choose/Create Filters </Form.Label>
                        <Select
                            placeholder="Choose filters"
                            name="filtertype"
                            id="filtertype"
                            onChange={(e) => this.handleSelect(e)}
                            value={this.state.input["filtertype"]}
                            options={this.state.availableFilterOption}
                        />
                    </Form.Group>
                    <Row >
                        <Button className="apply-filter-btn" onClick={() => this.saveFilter()}>Apply Filters</Button>

                    </Row>

                </Form>
            </div>
        )
    }
}
export default DashboardEditorFilter