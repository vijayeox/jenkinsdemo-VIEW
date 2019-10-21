import React from 'react';
import ReactDOM from 'react-dom';
import {Overlay, Tooltip} from 'react-bootstrap';
import BarChart from './barChart';
import PieChart from './pieChart';
import LineChart from './lineChart';
import AggregateValue from './aggregateValue';
import './globalFunctions';
import Swal from "sweetalert2";
import '../../../../../gui/src/public/css/sweetalert.css';
import './widgetEditorApp.scss';

class WidgetEditorApp extends React.Component {
    constructor(props) {
        super(props);
        this.widgetList = [];
        this.queryList = [];
        let editor = props.editor;
        let widgetConfiguration = editor.plugins.oxzion.getWidgetConfiguration(editor);
        this.state = {
            widget: {
                align: widgetConfiguration ? widgetConfiguration.align : null,
                uuid: widgetConfiguration ? widgetConfiguration.id : null,
                type: null
            },
            widgetName:'',
            querySelection:'',
            errors : {
            },
            readOnly:true,
            isPreLoadedWidget: widgetConfiguration ? (widgetConfiguration.id ? true : false) : false
        };
    }

    inputChanged = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name]:value
        });
    }

    makeReadOnly = (flag) => {
        this.setState({
            readOnly:flag
        });
        this.refs.widget.makeReadOnly(flag);
    }

    loadWidget = (uuid) => {
        let thiz = this;
        window.postDataRequest(`analytics/widget/${uuid}?data=true`).
            then(function(responseData) {
                let widget = responseData.widget;
                thiz.setState((state) => {
                    widget.align = state.widget.align; //Retain align in widget object.
                    state.widget = widget;
                    state.widgetName = widget.name;
                    return state;
                },
                () => {
                    if (thiz.refs.widget) {
                        thiz.refs.widget.setWidget(widget);
                    }
                });

                let queryUuid = widget.query_uuid;
                if (!thiz.state.querySelection || ('' === thiz.state.querySelection)) {
                    thiz.setState({
                        querySelection : queryUuid
                    },
                    () => {
                        thiz.refs.widget.setWidgetData(widget.data);
                    });
                }
                else {
                    if (thiz.state.querySelection === queryUuid) {
                        thiz.refs.widget.setWidgetData(widget.data);
                    }
                    else {
                        thiz.loadQuery();
                    }
                }
                thiz.makeReadOnly(true);
            }).
            catch(function(responseData) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Could not load widget. Please try after some time.'
                });
            });
    }

    loadQuery = () => {
        if (!this.state.querySelection || ('' === this.state.querySelection)) {
            thiz.refs.widget.setWidgetData(null);
            return;
        }
        let thiz = this;
        window.postDataRequest(`analytics/query/${this.state.querySelection}?data=true`).
            then(function(response) {
                let queryData = response.query.data;
                thiz.refs.widget.setWidgetData(queryData);
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

    widgetSelectionChanged = (e) => {
        let widgetId = e.target.value;
        if (widgetId === this.state.widget.uuid) {
            return;
        }
        this.setState((state) => {
            state.widget.align = null;
            return state;
        });
        this.loadWidget(widgetId);
    }

    querySelectionChanged = (queryUuid) => {
        this.setState((state) => {
            state.querySelection = queryUuid;
            return state;
        },
        () => {
            this.loadQuery();
        });
    }

    copyWidget = (e) => {
        this.makeReadOnly(false);
    }

    //Set the react app instance on the window so that the window can call this app to get its state before the window closes.
    componentDidMount() {
        window.widgetEditorApp = this;

        let thiz = this;
        window.postDataRequest('analytics/widget').
            then(function(response) {
                thiz.widgetList = response.data;
                thiz.forceUpdate();
            }).
            catch(function(response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Failed to load widgets. Please try after some time.'
                });
            });

        window.postDataRequest('analytics/query').
            then(function(response) {
                thiz.queryList = response.data;
                thiz.forceUpdate();
            }).
            catch(function(response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Failed to load queries. Please try after some time.'
                });
            });

        if (thiz.state.widget.uuid) {
            thiz.loadWidget(thiz.state.widget.uuid);
        }
    }

    updateWidgetState = (value) => {
        this.setState({
            widget:value
        });
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

    //Resolves with true if validation passes. Resolves with false if validation fails.
    isWidgetNameValid = () => {
        let resolvePromise;
        let promise = new Promise((resolve, reject)=> {
            resolvePromise = resolve;
        });

        //Don't validate widget name field if the widget editor is in readOnly state.
        if (this.state.readOnly) {
            this.setErrorMessage('widgetName', null);
            console.debug('Chart editor is readOnly. Widget name is valid.');
            resolvePromise(true); //No validation errors.
            return promise;
        }

        let widgetName = this.state.widgetName;
        if (widgetName) {
            widgetName = widgetName.trim();
        }
        if (!widgetName || ('' === widgetName)) {
            this.setErrorMessage('widgetName', 'Widget name is needed');
            console.debug('Widget name is null or empty. Invalid.');
            resolvePromise(false); //Found validation error.
        }
        else {
            let thiz = this;
            let errorMessage = null;
            let encodedName = encodeURIComponent(widgetName);
            window.postDataRequest(`analytics/widget/byName?name=${encodedName}`).
                then(function(response) {
                    if (response.widget) {
                        thiz.setErrorMessage('widgetName', 'Widget name is already in use. Please provide another name.');
                        console.debug('Widget name is in use. Invalid.');
                        resolvePromise(false); //Found validation error.
                    }
                }).
                catch(function(response) {
                    if (response.errorCode == 404) {
                        thiz.setErrorMessage('widgetName', null);
                        console.debug('Widget name is not in use. valid.');
                        resolvePromise(true); //No validation errors.
                    }
                    else {
                        console.error(response);
                        Swal.fire({
                            type: 'error',
                            title: 'Oops ...',
                            text: 'Could not validate widget name. Please try after some time.'
                        });
                        console.debug('Widget name validation REST request failed. Forced invalid.');
                        resolvePromise(false); //Found validation error.
                    }
                });
        }
        return promise;
    }

    isQuerySelectionValid = () => {
        let querySelection = this.state.querySelection;
        if (!querySelection || ('' === querySelection)) {
            this.setErrorMessage('querySelection', 'Query should be selected');
            console.debug('Query selection is invalid.');
            return false;
        }
        else {
            this.setErrorMessage('querySelection', null);
            console.debug('Query selection is valid.');
            return true;
        }
    }

    areAllFieldsValid = () => {
        let resolvePromise;
        let promise = new Promise((resolve, reject)=> {
            resolvePromise = resolve;
        });

        let thiz = this;
        this.isWidgetNameValid().then(function(isNameValid) {
            console.debug(`Widget name valid? ${isNameValid}`);
            let result = isNameValid & 
                thiz.isQuerySelectionValid() & 
                thiz.refs.widget.areAllFieldsValid();
            console.debug(`Overall validation result:${result}`);
            resolvePromise(result);
        });

        return promise;
    }

    //Called in globalFunctions.js
    getWidgetStateForCkEditorPlugin() {
        let widget = this.state.widget;
        return {
            align: widget.align,
            type: widget.type === 'aggregate' ? 'inline' : 'block',
            id: widget.uuid
        };
    }

    //Called in globalFunctions.js
    saveWidget = () => {
        let state = this.state;
        let params = {
            'uuid':state.widget.uuid,
            'configuration':JSON.stringify(state.widget.configuration),
            'name':state.widgetName
        };
        if (state.querySelection && ('' != state.querySelection)) {
            params['query_uuid'] = state.querySelection;
        }
        return window.postDataRequest('analytics/widget', params, 'post');
    }

    //Called in globalFunctions.js to ensure data is clean when the user clicks "Ok" button of dialog.
    hasUserInputErrors = (displayMessageOnError) => {
        let resolvePromise;
        let promise = new Promise((resolve, reject)=> {
            resolvePromise = resolve;
        });

        let thiz = this;
        this.areAllFieldsValid().then(function(areFieldsValid) {
            var errors = thiz.state.errors;
            var errorsFound = !areFieldsValid;
            for (let [key, value] of Object.entries(errors)) {
                if (value) {
                    errorsFound = true;
                    break;
                }
            }
            if (errorsFound) {
                Swal.fire({
                    type: 'info',
                    title: 'Input error',
                    text: 'Form fields have errors. Please resolve errors and try again.'
                });
                resolvePromise(true);
            }
            else {
                resolvePromise(false);
            }
        });

        return promise;
    }

    //Called in globalFunctions.js to detect whether the chart has been edited.
    isEdited = () => {
        return !this.state.readOnly;
    }

    render() {
        let htmlWidgetOptions = this.widgetList.map((widget, index) => {
            return (
                <option key={widget.uuid} value={widget.uuid}>{widget.name}</option>
            )
        });

        let htmlQueryOptions = this.queryList.map((query, index) => {
            return (
                <option key={query.uuid} value={query.uuid}>{query.name}</option>
            )
        });

        return (
            <form className="widget-editor-form">
                <div className="form-group row">
                    <div className="col-1 right-align">
                        <label htmlFor="selectWidget" className="right-align col-form-label form-control-sm">Widget</label>
                    </div>
                    <div className="col-4">
                        <select id="selectWidget" name="selectWidget" className="form-control form-control-sm" placeholder="Select widget" 
                            value={this.state.widget.uuid ? this.state.widget.uuid : ''} onChange={this.widgetSelectionChanged} 
                            disabled={this.state.isPreLoadedWidget}>
                            <option key="" value="">-Select widget-</option>
                            {htmlWidgetOptions}
                        </select>
                    </div>
                    <div className="col-1">
                        {this.state.widget.uuid && (this.state.widget.type !== 'inline') && 
                        <button type="button" className="btn btn-primary add-series-button" title="Copy widget" onClick={this.copyWidget}>
                            <span className="fa fa-copy" aria-hidden="true"></span>
                        </button>
                        }
                    </div>
                    <div className="col-6">&nbsp;</div>
                </div>
                <div className="form-group row">
                    <div className="col-1 right-align">
                        <label htmlFor="selectQuery" className="right-align col-form-label form-control-sm">Query</label>
                    </div>
                    <div className="col-4">
                        <select id="querySelection" name="querySelection" ref="querySelection" className="form-control form-control-sm" placeholder="Select query" 
                            value={this.state.querySelection ? this.state.querySelection : ''} onChange={(e) => {this.querySelectionChanged(e.target.value)}}
                            onBlur={this.isQuerySelectionValid} disabled={this.state.readOnly}>
                            <option key="" value="">-Select query-</option>
                            {htmlQueryOptions}
                        </select>
                        <Overlay target={this.refs.querySelection} show={this.state.errors.querySelection != null} placement="bottom">
                            {props => (
                            <Tooltip id="querySelection-tooltip" {...props} className="error-tooltip">
                                {this.state.errors.querySelection}
                            </Tooltip>
                            )}
                        </Overlay>
                    </div>
                    <div className="col-1">&nbsp;</div>
                    <div className="col-2 right-align">
                        <label htmlFor="widgetName" className="right-align col-form-label form-control-sm">Widget Name</label>
                    </div>
                    <div className="col-4">
                        <>
                        <input type="text" id="widgetName" name="widgetName"  ref="widgetName" className="form-control form-control-sm" 
                            onChange={this.inputChanged} value={this.state.widgetName} onBlur={this.isWidgetNameValid}
                            disabled={this.state.readOnly}/>
                        <Overlay target={this.refs.widgetName} show={this.state.errors.widgetName != null} placement="bottom">
                            {props => (
                            <Tooltip id="widgetName-tooltip" {...props} className="error-tooltip">
                                {this.state.errors.widgetName}
                            </Tooltip>
                            )}
                        </Overlay>
                        </>
                    </div>
                </div>
                <div className="row">
                    {(this.state.widget.type === 'barChart') && 
                        <BarChart ref="widget" widget={this.state.widget} 
                            updateWidgetState={this.updateWidgetState} querySelectionChanged={this.querySelectionChanged}/>
                    }
                    {(this.state.widget.type === 'lineChart') && 
                        <LineChart ref="widget" widget={this.state.widget} 
                            updateWidgetState={this.updateWidgetState} querySelectionChanged={this.querySelectionChanged}/>
                    }
                    {(this.state.widget.type === 'pieChart') && 
                        <PieChart ref="widget" widget={this.state.widget} 
                            updateWidgetState={this.updateWidgetState} querySelectionChanged={this.querySelectionChanged}/>
                    }
                    {(this.state.widget.type === 'inline') && 
                        <AggregateValue ref="widget" widget={this.state.widget} 
                            updateWidgetState={this.updateWidgetState} querySelectionChanged={this.querySelectionChanged}/>
                    }
                </div>
            </form>
        );
    }
}

export default WidgetEditorApp;

window.startWidgetEditorApp = function(editor) {
    ReactDOM.render(<WidgetEditorApp editor={editor}/>, document.getElementById('root'));
}

