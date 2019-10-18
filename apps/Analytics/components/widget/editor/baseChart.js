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
        this.queryUuid = null;
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

    validateAllFields = () => {
        if (!this.refs) {
            return;
        }
        for (let [key, value] of Object.entries(this.refs)) {
            if ((value.tagName === 'INPUT') || 
                (value.tagName === 'SELECT')) {
                this.validateUserInput(value.name, value.value);
            }
            else {
                console.debug(`Did not validate ref "${key}" having tag name "${value.tagName}"`);
            }
        }
    }

    //Called by widgetEditorApp when the user selects a query.
    queryChanged = (queryUuid) => {
        if (this.queryUuid != queryUuid) {
            this.queryUuid = queryUuid;
            this.loadQuery();
        }
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
        //IMPORTANT: We cannot look at this.queryUuid and decide to load/not load the data with widget
        //because it depends on the widget's query_uuid value. Therefore we should always load data 
        //with the widget and then decide to separately load query data only if this.queryUuid does not
        //match widget.query_uuid.
        window.postDataRequest(`analytics/widget/${this.state.uuid}?data=true`).
            then(function(response) {
                //We don't want ReactJs to detect state change and invoke render cycle. We draw widget preview ourselves.
                //That is why state is assigned like this (instead of calling this.setState).
                thiz.state = response.widget; 
                thiz.graphConfigurationToState();
                let queryUuid = response.widget.query_uuid;
                if (!thiz.queryUuid || ('' === thiz.queryUuid)) {
                    thiz.queryUuid = queryUuid; //Assigned here to avoid thiz.queryChanged to invoke loadQuery.
                    thiz.props.querySelectionChanged(queryUuid);
                }
                if (thiz.queryUuid === queryUuid) {
                    let widgetData = response.widget.data;
                    thiz.detectDataSetColumns(widgetData);
                    thiz.draw();
                }
                else {
                    thiz.loadQuery();
                }
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

    loadQuery = () => {
        if (!this.queryUuid || ('' === this.queryUuid)) {
            this.state.data = null;
            this.detectDataSetColumns(null);
            this.draw();            
            return;
        }
        let thiz = this;
        window.postDataRequest(`analytics/query/${this.queryUuid}?data=true`).
            then(function(response) {
                let queryData = response.query.data;
                thiz.state.data = queryData;
                thiz.detectDataSetColumns(queryData);
                thiz.draw();
            }).
            catch(function(response) {
                console.error(response);
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Could not load query data. Please try after some time.'
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

