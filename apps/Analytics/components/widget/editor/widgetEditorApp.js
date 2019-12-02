import React from 'react';
import ReactDOM from 'react-dom';
import {Overlay, Tooltip} from 'react-bootstrap';
import AmChartEditor from './amChartEditor';
import AggregateValueEditor from './aggregateValueEditor';
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
        this.refs.editor.makeReadOnly(flag);
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
                    if (thiz.refs.editor) {
                        thiz.refs.editor.setWidgetData({
                            data: widget.data,
                            configuration: widget.configuration,
                            queries: widget.queries,
                            expression: widget.expression
                        });
                    }
                });
                thiz.makeReadOnly(true);
            }).
            catch(function(responseData) {
                console.error('Could not load widget.');
                console.error(responseData);
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Could not load widget. Please try after some time.'
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

    areAllFieldsValid = () => {
        let resolvePromise;
        let promise = new Promise((resolve, reject)=> {
            resolvePromise = resolve;
        });

        let thiz = this;
        this.isWidgetNameValid().then(function(isNameValid) {
            console.debug(`Widget name valid? ${isNameValid}`);
            let result = isNameValid & 
                thiz.refs.editor.areAllFieldsValid();
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
            type: (widget.type === 'aggregate' || widget.type === 'inline') ? 'inline' : 'block',
            id: widget.uuid
        };
    }

    //Called in globalFunctions.js
    saveWidget = () => {
        let state = this.state;
        let editorState = this.refs.editor.getState();
        let params = {
            'uuid' : state.widget.uuid,
            'configuration' : editorState.configuration,
            'expression' : editorState.expression,
            'queries' : editorState.queries,
            'name' : state.widgetName
        };
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
                resolvePromise(true); //true indicates there are errors.
            }
            else {
                resolvePromise(false); //false indicates there are no errors.
            }
        });

        return promise;
    }

    //Called in globalFunctions.js to detect whether the widget has been edited.
    isEdited = () => {
        return !this.state.readOnly;
    }

    render() {
        let htmlWidgetOptions = this.widgetList.map((widget, index) => {
            return (
                <option key={widget.uuid} value={widget.uuid}>{widget.name}</option>
            )
        });

        return (
            <form className="widget-editor-form">
                <div className="form-group row no-left-margin no-right-margin">
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
                        {this.state.widget.uuid && 
                        <button type="button" className="btn btn-primary add-series-button" title="Copy widget" 
                            onClick={this.copyWidget} disabled={!this.state.readOnly}>
                            <span className="fa fa-copy" aria-hidden="true"></span>
                        </button>
                        }
                    </div>
                    { !this.state.readOnly && 
                    <>
                    <div className="col-2 right-align">
                        <label htmlFor="widgetName" className="right-align col-form-label form-control-sm">Widget Name</label>
                    </div>
                    <div className="col-4">
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
                    </div>
                    </>
                    }
                </div>
                <div className="row">
                    {(this.state.widget.type === 'chart') && 
                        <AmChartEditor ref="editor" widget={this.state.widget}/>
                    }
                    {(this.state.widget.type === 'inline') && 
                        <AggregateValueEditor ref="editor" widget={this.state.widget}/>
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

