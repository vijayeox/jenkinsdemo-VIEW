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
        this.chart = null;
    }

    graphConfigurationToState = () => {
    }

    stateToGraphConfiguration = () => {
    }

    validateUserInput = (field, value) => {
    }

    //Called by widgetEditorApp.hasUserInputErrors
    hasUserInputErrors = () => {
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
            thiz.validateUserInput(name, value);
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
            thiz.validateUserInput(name, value);
        });
    }

    draw = () => {
        if (this.chart) {
            this.chart.dispose();
        }
        this.chart = ChartRenderer.render(document.querySelector('div#chartPreview'), this.state);
    }

    loadWidget = () => {
        //If state has widget and widget data we can assume parent had loaded the widget.
        if (this.state && this.state.widget && this.state.widget.data) {
            console.info('Widget data is already loaded.');
            this.graphConfigurationToState();
            return;
        }

        let thiz = this;
        window.postDataRequest(`analytics/widget/${this.state.uuid}?data=true`).
            then(function(response) {
                thiz.state = response.widget;
                thiz.graphConfigurationToState();
                thiz.draw();
            }).
            catch(function(response) {
                console.error(response);
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Could not load widget. Please try after some time.'
                });
            });
    }

    componentDidMount() {
        this.loadWidget();
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        throw 'render() method should be overridden in the child class.';
    }
}

export default BaseChart;

