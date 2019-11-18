import React from 'react';
import ReactDOM from 'react-dom';
import {Overlay, Tooltip} from 'react-bootstrap';

class AggregateValue extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.widget;
        this.state.errors = {};
        this.state.dataSetColumns = [];
    }

    graphConfigurationToState = () => {
    }
    
    stateToGraphConfiguration = () => {
    }

    isUserInputValid = (field, value) => {
        return true;
    }

    setWidget = (widget) => {
        if (!widget) {
            return;
        }
        this.setState((state) => {
            for (let[key, value] of Object.entries(widget)) {
                state[key] = value;
            }
            return state;
        },
        () => {
            this.graphConfigurationToState();
        });
    }

    setWidgetData = (data) => {
        this.state.data = data;
        this.detectDataSetColumns(data);
        this.draw();            
    }

    detectDataSetColumns = (dataSet) => {
        if (!dataSet) {
            this.setState((state) => {
                state.dataSetColumns = [];
                return state;
            });
            return;
        }
        let columnsMap = {};
        if (dataSet && dataSet.forEach) { //dataSet.forEach checks whether dataSet is an array.
            dataSet.forEach(function(item, index, array) {
                if (item) {
                    for (let [column, value] of Object.entries(item)) {
                        columnsMap[column] = true;
                    }
                }
            });
        }
        let options = [];
        for (let[column, flag] of Object.entries(columnsMap)) {
            options.push({
                value:column, 
                label:column
            });
        }
        options.sort(function(a, b) {
            if (a.label < b.label) {
                return -1;
            }
            if (a.label > b.label) {
                return 1;
            }
            return 0;
        });
        this.setState((state) => {
            state.dataSetColumns = options;
            return state;
        });
    }

    draw = () => {
        let previewElement = document.querySelector('span#previewElement');
        let type = typeof this.state.data;
        if ((type === 'number') || (type === 'string')) {
            previewElement.innerHTML = this.state.data;
        }
        else {
            previewElement.innerHTML = '[Invalid data. Please select aggregate value query.]';
        }
    }

    makeReadOnly = (flag) => {
        this.setState({
            readOnly : flag
        });
    }

    //Called by widgetEditorApp.hasUserInputErrors
    hasUserInputErrors = () => {
        if (this.areAllFieldsValid()) {
            return false;
        }
        var errors = this.state.errors;
        var errorsFound = false;
        for (let [key, value] of Object.entries(errors)) {
            if (value) {
                errorsFound = true;
                break;
            }
        }
        return errorsFound;
    }

    areAllFieldsValid = () => {
        if (!this.refs) {
            console.debug('No field with "ref" attribute. Validation success.');
            return true;
        }
        let valid = true;
        for (let [key, value] of Object.entries(this.refs)) {
            if ((value.tagName === 'INPUT') || 
                (value.tagName === 'SELECT')) {
                valid = valid & this.isUserInputValid(value.name, value.value);
            }
            else {
                console.debug(`Did not validate ref "${key}" having tag name "${value.tagName}"`);
            }
        }
        console.debug('Validation of all widget fields result:' + valid);
        return valid;
    }

    setErrorMessage = (key, message) => {
        this.setState((state) => {
            if (!message || ('' === message)) {
                delete state.errors[key];
            }
            else {
                state.errors[key] = message;
            }
            return state;
        });
    }

    componentDidMount() {
    }

    render() {
        let thiz = this;
        function dataSetColumns() {
            let options = [];
            thiz.state.dataSetColumns.map((item, key) => {
                options.push(
                    <option value={item.value}>{item.label}</option>
                );
            });
            return options;
        }

        return (
            <>
                <div className="form-group col">
                    <div className="card" id="chartPropertyBox">
                        <div className="card-header">
                            Aggregate value properties
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <em>No editable properties for this widget.</em>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group col">
                    <div className="card" id="chartPreviewBox">
                        <div className="card-header">
                            Preview
                        </div>
                        <div className="card-body">
                            <div id="chartPreview">
                                <table style={{border:'1px solid black', width:'100%', fontSize:'2em'}}>
                                    <tbody>
                                        <tr>
                                            <td align="center" valign="middle"><span id="previewElement">[Loading...]</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default AggregateValue;

