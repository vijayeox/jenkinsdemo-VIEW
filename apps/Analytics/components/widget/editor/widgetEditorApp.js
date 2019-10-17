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
            disableWidgetSelection: widgetConfiguration ? (widgetConfiguration.id ? true : false) : false
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
                    for (let property in widget) {
                        state.widget[property] = widget[property];
                    }
                    return state;
                });
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
                    title: 'Widgets not found',
                    text: 'Please configure few widget(s) and try again.'
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

    validateWidgetName = (e) => {
        let widgetName = e.target.value;
        if (widgetName) {
            widgetName = widgetName.trim();
        }
        if (!widgetName || ('' === widgetName)) {
            this.setErrorMessage('widgetName', 'Widget name is needed');
        }
        else {
            let thiz = this;
            let errorMessage = null;
            let encodedName = encodeURIComponent(widgetName);
            window.postDataRequest(`analytics/widget/byName?name=${encodedName}`).
                then(function(response) {
                    if (response.widget) {
                        thiz.setErrorMessage('widgetName', 'Widget name is already in use. Please provide another name.');
                    }
                }).
                catch(function(response) {
                    if (response.errorCode == 404) {
                        thiz.setErrorMessage('widgetName', null);
                    }
                    else {
                        console.error(response);
                        Swal.fire({
                            type: 'error',
                            title: 'Oops ...',
                            text: 'Could not validate widget name. Please try after some time.'
                        });
                    }
                });
        }
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
        let params = {
            'uuid':this.state.widget.uuid,
            'configuration':JSON.stringify(this.state.widget.configuration),
            'name':this.state.widgetName
        };
        return window.postDataRequest('analytics/widget', params, 'post');
    }

    //Called in globalFunctions.js to ensure data is clean when the user clicks "Ok" button of dialog.
    hasUserInputErrors = () => {
        var errors = this.state.errors;
        var errorsFound = false;
        for (let [key, value] of Object.entries(errors)) {
            if (value) {
                errorsFound = true;
                break;
            }
        }
        if (errorsFound) {
            return true;
        }
        else {
            return this.refs.widget.hasUserInputErrors();
        }
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

        return (
            <form className="widget-editor-form">
                <div className="form-group row">
                    <div className="col-1 right-align">
                        <label htmlFor="selectWidget" className="right-align col-form-label form-control-sm">Widget</label>
                    </div>
                    <div className="col-4">
                        <select id="selectWidget" name="selectWidget" className="form-control form-control-sm" placeholder="Select widget" 
                            value={this.state.widget.uuid ? this.state.widget.uuid : ''} onChange={this.widgetSelectionChanged} 
                            disabled={this.state.disableWidgetSelection}>
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
                    <div className="col-2 right-align">
                    {!this.state.readOnly && this.state.widget.uuid && 
                            <label htmlFor="widgetName" className="right-align col-form-label form-control-sm">Widget Name</label>
                    }
                    </div>
                    <div className="col-4">
                    {!this.state.readOnly && this.state.widget.uuid && 
                        <>
                        <input type="text" id="widgetName" name="widgetName"  ref="widgetName" className="form-control form-control-sm" 
                            onChange={this.inputChanged} value={this.state.widgetName} onBlur={this.validateWidgetName}/>
                        <Overlay target={this.refs.widgetName} show={this.state.errors.widgetName != null} placement="bottom">
                            {props => (
                            <Tooltip id="widgetName-tooltip" {...props} className="error-tooltip">
                                {this.state.errors.widgetName}
                            </Tooltip>
                            )}
                        </Overlay>
                        </>
                    }
                    </div>
                </div>
                <div className="row">
                    {(this.state.widget.type === 'barChart') && 
                        <BarChart ref="widget" widget={this.state.widget} updateWidgetState={this.updateWidgetState}/>
                    }
                    {(this.state.widget.type === 'lineChart') && 
                        <LineChart ref="widget" widget={this.state.widget} updateWidgetState={this.updateWidgetState}/>
                    }
                    {(this.state.widget.type === 'pieChart') && 
                        <PieChart ref="widget" widget={this.state.widget} updateWidgetState={this.updateWidgetState}/>
                    }
                    {(this.state.widget.type === 'inline') && 
                        <AggregateValue ref="widget" widget={this.state.widget} updateWidgetState={this.updateWidgetState}/>
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

