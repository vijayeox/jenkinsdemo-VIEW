import React from 'react';
import ReactDOM from 'react-dom';
import Swal from "sweetalert2";
import ChartRenderer from '../../../components/chartRenderer';
import '../../../../../gui/src/public/css/sweetalert.css';

class BaseChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.widget;
        this.state.errors = {};
        this.state.dataSetColumns = [];
        this.chart = null;
    }

    graphConfigurationToState = () => {
        throw 'Abstract method. Child class should provide implementation.';
    }
    
    stateToGraphConfiguration = () => {
        throw 'Abstract method. Child class should provide implementation.';
    }

    isUserInputValid = (field, value) => {
        throw 'Abstract method. Child class should provide implementation.';
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

    makeReadOnly = (flag) => {
        this.setState({
            readOnly : flag
        });
    }

    updateWidgetState = () => {
        this.props.updateWidgetState(this.state);
    }

    textFieldChanged = (e) => {
        let thiz = this;
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name]:value,
            modified:true
        },
        () => {
            thiz.updateWidgetState();
            thiz.stateToGraphConfiguration();
            thiz.draw();
        });
    }

    selectionChanged = (e) => {
        let thiz = this;
        let name = e.target.name;
        let value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
        this.setState({
            [name]:value,
            modified:true
        },
        () => {
            thiz.updateWidgetState();
            thiz.stateToGraphConfiguration();
            thiz.isUserInputValid(name, value);
            thiz.draw();
        });
    }

    inputChanged = (e) => {
        let thiz = this;
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name]:value,
            modified:true
        },
        () => {
            thiz.updateWidgetState();
            thiz.isUserInputValid(name, value);
        });
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
        if (this.chart && this.chart.dispose) {
            this.chart.dispose();
        }
        this.chart = ChartRenderer.render(document.querySelector('div#chartPreview'), this.state);
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

    componentDidMount() {
    }

    componentWillUnmount() {
        if (this.chart && this.chart.dispose) {
            this.chart.dispose();
        }
    }

    render() {
        throw 'render() method should be overridden in the child class.';
    }
}

export default BaseChart;

