import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay, Tooltip } from 'react-bootstrap';
import AmChartEditor from './amChartEditor';
import WidgetModal from './Modal/WidgetModal'
import AggregateValueEditor from './aggregateValueEditor';
import TableEditor from './tableEditor';
import './globalFunctions';
import Swal from "sweetalert2";
import '../../../../../gui/src/public/css/sweetalert.css';
import './widgetEditorApp.scss';
import { options } from '../../../../../gui/amcharts/core';
import Flippy, { FrontSide, BackSide } from 'react-flippy';


class WidgetEditorApp extends React.Component {
    constructor(props) {
        super(props);
        let editor = props.editor;
        let widgetConfiguration = editor.plugins.oxzion.getWidgetConfiguration(editor);
        this.state = {
            flipped: false,
            widget: {
                align: widgetConfiguration ? widgetConfiguration.align : null,
                uuid: widgetConfiguration ? widgetConfiguration.id : null,
                type: null
            },
            showModal: false,
            widgetName: '',
            widgetPermissions: {},
            widgetOwner: 0,
            visualizationID: '',
            errors: {
            },
            visualizationOptions: [],
            htmlWidgetOptions: [],
            readOnly: true,
            isPreLoadedWidget: widgetConfiguration ? (widgetConfiguration.id ? true : false) : false
        };
    }

    inputChanged = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name]: value
        });
    }

    makeReadOnly = (flag) => {
        this.setState({
            readOnly: flag
        });
        this.refs.editor.makeReadOnly(flag);
    }

    loadWidget = (uuid) => {
        let thiz = this;
        window.postDataRequest(`analytics/widget/${uuid}?data=true`).
            then(function (responseData) {
                let widget = responseData.widget;
                thiz.setState((state) => {
                    widget.align = state.widget.align; //Retain align in widget object.
                    state.widget = widget;
                    state.widgetName = widget.name;
                    state.version = widget.version;
                    state.widgetOwner = widget.is_owner
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
            catch(function (responseData) {
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

    deleteWidget = (e) => {
        let thiz = this;

        window.postDataRequest('analytics/widget/' + this.state.widget.uuid + "?version=" + this.state.widget.version, {}, "delete")
            .then(function (response) {

                //fetch the updated widget list after delete
                window.postDataRequest('analytics/widget')
                    .then(function (response) {
                        let widgetData = response.data;
                        let widgetList = []
                        widgetList = widgetData.map(widget => {
                            return (
                                <option key={widget.uuid} value={widget.uuid}>{widget.name}</option>
                            )
                        })
                        thiz.setState({
                            htmlWidgetOptions: widgetList, widget: {
                                align: null,
                                uuid: null,
                                type: null
                            },
                            showModal: false
                        })

                    })
                    .catch(function (response) {
                        thiz.setState({ showModal: false })
                        Swal.fire({
                            type: 'error',
                            title: 'Oops ...',
                            text: 'Failed to load widgets. Please try after some time.'
                        });
                    });
                Swal.fire({
                    type: 'success',
                    title: 'Operation Successfull',
                    text: 'Widget Deleted Successfully'
                });
            })
            .catch(function (response) {
                thiz.setState({ showModal: false })
                Swal.fire({
                    type: 'error',
                    title: 'Operation Failed',
                    text: 'Failed to Delete widget. Please try after some time.'
                });
            });




    }

    //Set the react app instance on the window so that the window can call this app to get its state before the window closes.
    componentDidMount() {
        window.widgetEditorApp = this;
        let thiz = this;
        window.postDataRequest('analytics/widget')
            .then(function (response) {
                let widgetData = response.data;
                let widgetList = []
                widgetList = widgetData.map(widget => {
                    return (
                        <option key={widget.uuid} value={widget.uuid}>{widget.name}</option>
                    )
                })
                thiz.setState({ htmlWidgetOptions: widgetList })
            })
            .catch(function (response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Failed to load widgets. Please try after some time.'
                });
            });

        window.postDataRequest('analytics/visualization')
            .then(function (response) {
                let visualizationData = response.data;
                let visualList = []
                visualList = visualizationData.map(visualization => {
                    return (
                        <option key={visualization.uuid} data-key={visualization.uuid} value={visualization.type}>{visualization.name}</option>
                    )
                });
                thiz.setState({ visualizationOptions: visualList })
            })
            .catch(err => {
                console.log(err)
            })

        window.getAllPermission()
            .then(function (response) {
                //permissions are sent from dashboardEditor
                const { MANAGE_ANALYTICS_WIDGET_READ, MANAGE_ANALYTICS_WIDGET_WRITE } = response.permissions
                thiz.setState({ widgetPermissions: { MANAGE_ANALYTICS_WIDGET_READ, MANAGE_ANALYTICS_WIDGET_WRITE } })
            })
            .catch(err => {
                console.log(err)
            })

        if (thiz.state.widget.uuid) {
            thiz.loadWidget(thiz.state.widget.uuid);
        }

    }

    updateWidgetState = (value) => {
        this.setState({
            widget: value
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
        let promise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
        });

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
                then(function (response) {
                    if (response.widget) {
                        thiz.setErrorMessage('widgetName', 'Widget name is already in use. Please provide another name.');
                        console.debug('Widget name is in use. Invalid.');
                        resolvePromise(false); //Found validation error.
                    }
                }).
                catch(function (response) {
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
        let promise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
        });

        let thiz = this;
        this.isWidgetNameValid().then(function (isNameValid) {
            console.debug(`Widget name valid? ${isNameValid}`);
            let result = isNameValid &
                thiz.refs.editor.areAllFieldsValid();
            console.debug(`Overall validation result:${result}`);
            resolvePromise(result);
        }).
            catch(function () {
                console.debug('widgetEditorApp.isWidgetNameValid call failed.');
                resolvePromise(false);
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
            'configuration': editorState.configuration,
            'expression': editorState.expression,
            'queries': editorState.queries,
            'name': state.widgetName
        };
        if (this.state.flipped) {
            params["visualization"] = this.state.visualizationID
            return window.postDataRequest('analytics/widget', params, 'post');
        }
        else {
            return window.postDataRequest('analytics/widget/' + state.widget.uuid + '/copy', params, 'post');
        }
    }

    //Called in globalFunctions.js to ensure data is clean when the user clicks "Ok" button of dialog.
    hasUserInputErrors = (displayMessageOnError) => {
        let resolvePromise;
        let promise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
        });

        let thiz = this;
        this.areAllFieldsValid().then(function (areFieldsValid) {
            console.debug(`widgetEditorApp.areAllFieldsValid resolved with ${areFieldsValid}`);
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
    selectVisualization(e) {
        const selectedIndex = event.target.options.selectedIndex;
        let visualizationid = event.target.options[selectedIndex].getAttribute('data-key')
        let newWidget = { type: "" }
        if (e.target.value !== undefined) {
            newWidget.type = e.target.value
            this.setState({ widget: newWidget, visualizationID: visualizationid }, () => {
                this.copyWidget()
            })
        }
    }
    toggleWidgetDiv() {
        this.setState({ flipped: true })
        console.log(document.getElementById("cke_139_uiElement"))
    }

    render() {
        // let htmlWidgetOptions = this.widgetList.map((widget, index) => {
        //     return (
        //         <option key={widget.uuid} value={widget.uuid}>{widget.name}</option>
        //     )
        // });


        return (
            <form className="widget-editor-form">
                <Flippy
                    flipDirection="horizontal" // horizontal or vertical
                    isFlipped={this.state.flipped}
                    flipOnClick={false}
                    style={{ width: '100%', height: '100vh' }}
                >
                    <FrontSide>
                        <div className="form-group row no-left-margin no-right-margin">
                            <div className="col-1 right-align">
                                <label htmlFor="selectWidget" className="col-form-label form-control-sm">Widget</label>
                            </div>
                            <div className="col-3">
                                <select id="selectWidget" name="selectWidget" className="form-control form-control-sm" placeholder="Select widget"
                                    value={this.state.widget.uuid ? this.state.widget.uuid : ''} onChange={this.widgetSelectionChanged}
                                    disabled={this.state.isPreLoadedWidget}>
                                    <option key="" value="">-Select widget-</option>
                                    {this.state.htmlWidgetOptions}
                                </select>
                            </div>
                            {/* {
                                this.state.widgetPermissions.MANAGE_ANALYTICS_WIDGET_WRITE &&
                                <div className="col-1" style={{ maxWidth: "3em" }}>
                                    <button type="button" className="btn btn-primary add-series-button" title="Create widget"
                                        onClick={() => this.toggleWidgetDiv()}>
                                        <span className="fa fa-plus" aria-hidden="true"></span>
                                    </button>
                                </div>
                            } */}
                            {(this.state.widget.uuid && this.state.widgetPermissions.MANAGE_ANALYTICS_WIDGET_WRITE && this.state.widgetOwner == 1) &&
                                <div className="col-1" style={{ maxWidth: "3em" }}>
                                    <button type="button" className="btn btn-primary add-series-button" title="Delete widget"
                                        onClick={() => { this.setState({ showModal: true }) }} disabled={!this.state.readOnly}>
                                        <span className="fa fa-trash" aria-hidden="true"></span>
                                    </button>
                                </div>
                            }

                            <div className="col-1">
                                {(this.state.widget.uuid && this.state.widgetPermissions.MANAGE_ANALYTICS_WIDGET_WRITE) &&
                                    <>
                                        <button type="button" className="btn btn-primary add-series-button" title="Copy widget"
                                            onClick={this.copyWidget} disabled={!this.state.readOnly}>
                                            <span className="fa fa-copy" aria-hidden="true"></span>
                                        </button>

                                    </>
                                }
                            </div>
                            {!this.state.readOnly &&
                                <>
                                    <div className="col-2 right-align">
                                        <label htmlFor="widgetName" className="right-align col-form-label form-control-sm">Widget Name</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="text" id="widgetName" name="widgetName" ref="widgetName" className="form-control form-control-sm"
                                            onChange={this.inputChanged} value={this.state.widgetName} onBlur={this.isWidgetNameValid}
                                            disabled={this.state.readOnly} />
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
                        {!this.state.flipped &&
                            <div className="row">
                                {(this.state.widget.type === 'chart') &&
                                    <AmChartEditor ref="editor" widget={this.state.widget} />
                                }
                                {(this.state.widget.type === 'table') &&
                                    <TableEditor ref="editor" widget={this.state.widget} />
                                }
                                {(this.state.widget.type === 'inline') &&
                                    <AggregateValueEditor ref="editor" widget={this.state.widget} />
                                }
                            </div>
                        }
                    </FrontSide>
                    <BackSide style={{ padding: "0px" }}>
                        <button type="button" className="btn btn-primary add-series-button" title="Create widget"
                            onClick={() => this.setState({ flipped: false })} >
                            <span className="fa fa-arrow-left" aria-hidden="true"></span>
                        </button>

                        <div className="row create-widget-div" >
                            <div className="col-1 right-align">
                                <label htmlFor="selectWidget" className="right-align col-form-label form-control-sm">Name</label>
                            </div>
                            <div className="col-3">
                                <input type="text" id="widgetName" name="widgetName" ref="widgetName" className="form-control form-control-sm"
                                    onChange={this.inputChanged} value={this.state.widgetName} onBlur={this.isWidgetNameValid}
                                />
                                <Overlay target={this.refs.widgetName} show={this.state.errors.widgetName != null} placement="bottom">
                                    {props => (
                                        <Tooltip id="widgetName-tooltip" {...props} className="error-tooltip">
                                            {this.state.errors.widgetName}
                                        </Tooltip>
                                    )}
                                </Overlay>
                            </div>
                            <div className="col-1 right-align">
                                <label htmlFor="selectVisualization" className="right-align col-form-label form-control-sm">Visualization</label>
                            </div>
                            <div className="col-3">
                                <select id="selectVisualization" name="selectVisualization" className="form-control form-control-sm" placeholder="Select Visualization"
                                    onChange={(event) => this.selectVisualization(event)}>
                                    <option key="-1" val="-1"></option>
                                    {this.state.visualizationOptions}
                                </select>
                            </div>
                            <div className="col-1 right-align">
                                <label htmlFor="selectVisibility" className="right-align col-form-label form-control-sm">Visibility</label>
                            </div>
                            <div className="col-3">
                                <select id="selectVisibility" name="selectVisibility" className="form-control form-control-sm" placeholder="Select widget">
                                    <option disabled value="-1" key="-1"></option>
                                    <option key="1" value="inline">public</option>
                                    <option key="2" value="chart">private</option>
                                </select>
                            </div>
                        </div>

                        {this.state.flipped ?
                            <div className="row">
                                {(this.state.widget.type === 'chart') &&
                                    <AmChartEditor ref="editor" widget={this.state.widget} />
                                }
                                {(this.state.widget.type === 'table') &&
                                    <TableEditor ref="editor" widget={this.state.widget} />
                                }
                                {(this.state.widget.type === 'inline') &&
                                    <AggregateValueEditor ref="editor" widget={this.state.widget} />
                                }
                            </div> : null}

                    </BackSide>
                </Flippy>
                <WidgetModal
                    show={this.state.showModal}
                    onHide={() => { this.setState({ showModal: false }) }}
                    deletewidget={this.deleteWidget}
                />
            </form>
        );
    }
}

export default WidgetEditorApp;

window.startWidgetEditorApp = function (editor) {
    ReactDOM.render(<WidgetEditorApp editor={editor} />, document.getElementById('root'));
}

