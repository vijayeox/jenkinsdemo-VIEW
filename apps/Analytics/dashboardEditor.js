import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay, Tooltip, Button, Form } from 'react-bootstrap';
import { dashboardEditor as section } from './metadata.json';
import JavascriptLoader from './components/javascriptLoader';

import { WidgetRenderer, DashboardFilter } from './GUIComponents';
import Swal from 'sweetalert2';
import '../../gui/src/public/css/sweetalert.css';
import './components/widget/editor/widgetEditorApp.scss';
import '../../gui/src/public/css/dashboardEditor.scss'
import '@progress/kendo-theme-default/dist/all.css';

class DashboardEditor extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.state = {
            dashboardId: (props.dashboardId ? props.dashboardId : null),
            dashboardName: '',
            dashboardDescription: '',
            version: 1,
            contentChanged: false,
            editorMode: 'initial',
            errors: {},
            filterConfiguration: [],
            showFilterDiv: false
        };
        this.initialState = { ...this.state }
        this.renderedCharts = {};
        this.props.setTitle(section.title.en_EN);
        this.restClient = this.core.make('oxzion/restClient');
        this.editor = null;

        let thisInstance = this;
        this.editorDialogMessageHandler = function (event) {
            let editorDialog = event.source;
            let eventData = event.data;
            switch (eventData.action) {
                case 'data':
                    thisInstance.doRestRequest(eventData.url, eventData.params, eventData.method ? eventData.method : 'get',
                        function (response) { //Successful response
                            editorDialog.postMessage(response, '*');
                        },
                        function (response) { //Failure response
                            editorDialog.postMessage(response, '*');
                        }
                    );
                    break;
                case 'permissions':
                    thisInstance.userProfile = thisInstance.core.make("oxzion/profile").get();
                    let permissions = thisInstance.userProfile.key.privileges;
                    let preparedData = {
                        "permissions": permissions,
                        "corrid": eventData.params["OX_CORR_ID"]
                    }
                    editorDialog.postMessage({ "data": preparedData }, '*')
                default:
                    console.warn(`Unhandled editor dialog message action:${eventData.action}`);
            }
        };
    }

    widgetDrillDownMessageHandler = (event) => {
        let data = event['data'];
        if (data['action'] !== 'oxzion-widget-drillDown') {
            return;
        }

        let elementId = data['elementId'];
        let widgetId = data['widgetId'];
        let chart = this.renderedCharts[elementId];
        if (chart) {
            if (chart.dispose) {
                chart.dispose();
            }
            this.renderedCharts[elementId] = null;
        }
        let replaceWidgetId = data['replaceWith'];
        if (replaceWidgetId) {
            widgetId = replaceWidgetId;
            let iframeElement = document.querySelector('iframe.cke_wysiwyg_frame');
            let iframeWindow = iframeElement.contentWindow;
            let iframeDocument = iframeWindow.document;
            let widgetElement = iframeDocument.querySelector('#' + elementId);
            widgetElement.setAttribute('data-oxzion-widget-id', replaceWidgetId);
        }
        this.updateWidget(elementId, widgetId);
    }

    inputChanged = (e) => {
        let thiz = this;
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name]: value,
            contentChanged: true
        });
    }

    //---------------------------------------------------------------------------------------
    //jsLibraryList is done this way to avoid utility functions modifying the list.
    //---------------------------------------------------------------------------------------
    getJsLibraryList = () => {
        let self = this;
        return [
            { 'name': 'ckEditorJs', 'url': '/apps/Analytics/ckeditor/ckeditor.js', 'onload': function () { self.setupCkEditor(); }, 'onerror': function () { } }
        ];
    }

    setupCkEditor = () => {
        const config = {
            extraPlugins: 'oxzion,autogrow',
            autoGrow_minHeight: 250,
            autoGrow_maxHeight: 400,
            height: 400,
            width: '100%',
            //IMPORTANT: Need this setting to retain HTML tags as we want them. Without this setting, 
            //CKEDITOR removes tags like span and flattens HTML structure.
            allowedContent: true,
            //extraAllowedContent:'span(*)',
            oxzion: {
                dimensions: {
                    begin: {
                        width: 300,
                        height: 200
                    },
                    min: {
                        width: 50,
                        height: 50
                    },
                    max: {
                        width: 800,
                        height: 600,
                    }
                },
                dialogUrl: '/apps/Analytics/widgetEditorDialog.html'
            }
        };
        //Without this setting CKEditor removes empty inline widgets (which is <span></span> tag).
        CKEDITOR.dtd.$removeEmpty['span'] = false;
        let editor = CKEDITOR.appendTo('ckEditorInstance', config);
        //Kendo theme CSS is added like this for rendering Kendo grid inside a widget displayed within ckeditor.
        editor.addContentsCss('/apps/Analytics/kendo-theme-default-all.css');
        this.editor = editor;
        let thisInstance = this;
        editor.on('instanceReady', function (event) {
            thisInstance.getDashboard(editor);
        });
        editor.on('oxzionWidgetInitialization', function (event) {
            try {
                let elementId = event.data.elementId;
                let widgetId = event.data.widgetId;
                thisInstance.updateWidget(elementId, widgetId);
            }
            catch (error) {
                console.error(error);
            }
        });
        editor.on('oxzionWidgetPrepareToDowncast', function (event) {
            try {
                let elementId = event.data.elementId;
                let chart = thisInstance.renderedCharts[elementId];
                if (chart) {
                    if (chart.dispose) {
                        chart.dispose();
                    }
                    thisInstance.renderedCharts[elementId] = null;
                    console.info(`Disposed the chart of element id ${elementId} for downcasting it.`);
                }
            }
            catch (error) {
                console.error(error);
            }
        });
        //editor.on('key', function(event) {
        //    if (thisInstance.state.editorMode === 'source') {
        //        thisInstance.setState({
        //            contentChanged:true
        //        });
        //    }
        //});
        editor.on('oxzionWidgetResized', function (event) {
            thisInstance.setState({
                contentChanged: true
            });
            try {
                let elementId = event.data.elementId;
                let widgetId = event.data.widgetId;
                thisInstance.updateWidget(elementId, widgetId);
            }
            catch (error) {
                console.error(error);
            }
        });
        editor.on('change', function (event) {
            thisInstance.setState({
                contentChanged: true
            });
        });
        editor.on('mode', function (event) {
            thisInstance.setState({
                editorMode: this.mode
            });
        });
    }

    saveDashboard = () => {
        let params = {
            'content': this.editor.getData(),
            'version': this.state.version,
            'name': this.state.dashboardName,
            'description': this.state.dashboardDescription,
            'dashboard_type': "html",
            'filter_configuration': JSON.stringify(this.state.filterConfiguration)
        };
        let url = 'analytics/dashboard';
        let method = '';
        if (this.state.dashboardId) {
            url = url + '/' + this.state.dashboardId;
            method = 'put';
        }
        else {
            method = 'post';
        }
        let thisInstance = this;
        this.doRestRequest(url, params, method,
            function (response) {
                thisInstance.props.flipCard("Saved")

                let updateState = {
                    contentChanged: false
                };
                if (thisInstance.state.dashboardId) { //Case of updating existing dashboard.
                    updateState.version = response.dashboard.version;
                }
                if (!thisInstance.state.dashboardId) {
                    updateState.version = 0;
                    updateState.dashboardId = response.dashboard.uuid;
                }
                thisInstance.setState(updateState);

            },
            function (response) {
                let versionChanged = false;
                if (response.data && response.data.reasonCode) {
                    if (response.data.reasonCode === 'VERSION_CHANGED') {
                        versionChanged = true;

                    }
                }
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: versionChanged ?
                        'Dashboard has been modified by another user. Please reload the data and try again.' :
                        'Could not save dashboard. Please try after some time.'
                });
            }
        );
    }

    getDashboard = (editor) => {
        var thisInstance = this;
        if (this.state.dashboardId) {

            this.doRestRequest('analytics/dashboard/' + this.state.dashboardId, {}, 'get',
                function (response) {
                    let dashboard = response.dashboard;
                    thisInstance.setState({
                        version: dashboard.version,
                        dashboardName: dashboard.name ? dashboard.name : '',
                        dashboardDescription: dashboard.description ? dashboard.description : '',
                        filterConfiguration: (dashboard.filter_configuration!="" ? JSON.parse(dashboard.filter_configuration):[])
                    });
                    editor.setData(response.dashboard.content);
                },
                function (response) {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Could not fetch dashboard. Please try after some time.'
                    });
                }
            );
        }
    }

    doRestRequest = (url, params, method, successHandler, failureHandler) => {
        if (!this.loader) {
            this.loader = this.core.make('oxzion/splash');
        }
        this.loader.show();
        let thisInstance = this;
        let restResponse = thisInstance.restClient.request('v1', url, params ? params : {}, method ? method : 'get');
        function handleNonSuccessResponse(response) {
            console.info(`Received a non-success status from server for URL ${url}. JSON:${JSON.stringify(response)}.`);
            if (thisInstance.loader) {
                thisInstance.loader.destroy();
            }
            if (failureHandler) {
                response.url = url;
                response.params = params;
                try {
                    failureHandler(response);
                }
                catch (e) {
                    console.error(response);
                }
            }
            else {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Unexpected error occurred. Please try after some time.'
                });
            }
        }
        restResponse.
            then(function (response) {
                if (response.status !== 'success') {
                    handleNonSuccessResponse(response);
                }
                else {
                    if (successHandler) {

                        let responseObject = {
                            'url': url,
                            'params': params,
                            'status': 'success'
                        };
                        let dataContent = response.data;
                        for (let property in dataContent) {
                            if ((property === 'url') || (property === 'params') || (property === 'status')) {
                                throw `Reserved property name ${property} used in REST response. Modify the server side controller to use some other property name.`;
                            }
                            responseObject[property] = dataContent[property];
                        }
                        try {
                            successHandler(responseObject);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                }
            }).
            catch(function (response) {
                handleNonSuccessResponse(response);
            }).
            finally(function (response) {
                if (thisInstance.loader) {
                    thisInstance.loader.destroy();
                }
            });
    }

    updateWidget = (elementId, widgetId) => {
        //Dispose and cleanup if this chart had been painted previously.
        let existingChart = this.renderedCharts[elementId];
        if (existingChart) {
            if (existingChart.dispose) {
                existingChart.dispose();
                this.renderedCharts[elementId] = null;
            }
        }

        let iframeElement = document.querySelector('iframe.cke_wysiwyg_frame');
        let iframeWindow = iframeElement.contentWindow;
        let iframeDocument = iframeWindow.document;
        let widgetElement = iframeDocument.querySelector('#' + elementId);
        if (!widgetId) {
            let widgetIdAttribute = widgetElement.attributes.getNamedItem('data-oxzion-widget-id');
            if (widgetIdAttribute) {
                widgetId = widgetIdAttribute.nodeValue;
            }
        }

        var thisInstance = this;
        this.doRestRequest(`analytics/widget/${widgetId}?data=true`, {}, 'get',
            function (response) {
                let chart = WidgetRenderer.render(widgetElement, response.widget);
                thisInstance.renderedCharts[elementId] = chart;
            },
            function (response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Could not fetch contents of a widget. Please try after some time.'
                });
            }
        );
    }

    componentDidUpdate(prevProps) {
        if (this.props.dashboardId !== prevProps.dashboardId) {
            if (this.props.dashboardId === "") {
                this.editor.setData("");
                this.setState({ ...this.initialState })
            }
            else {
                this.setState({ dashboardId: this.props.dashboardId }, () => this.getDashboard(this.editor))

            }
            //call the update funciton here

        }
    }

    componentDidMount() {
        if (this.state.dashboardId == null) {
            let loader = this.core.make('oxzion/splash');
            loader.destroy()
        }

        window.addEventListener('message', this.editorDialogMessageHandler, false);
        window.addEventListener('message', this.widgetDrillDownMessageHandler, false);
        JavascriptLoader.loadScript(this.getJsLibraryList());
    }

    componentWillUnmount() {
        for (let elementId in this.renderedCharts) {
            let chart = this.renderedCharts[elementId];
            if (chart) {
                if (chart.dispose) {
                    chart.dispose();
                }
                this.renderedCharts[elementId] = null;
            }
        }
        window.removeEventListener('message', this.editorDialogMessageHandler, false);
        window.removeEventListener('message', this.widgetDrillDownMessageHandler, false);
        if (this.editor) {
            this.editor.destroy();
        }
        JavascriptLoader.unloadScript(this.getJsLibraryList());
    }

    displayFilterDiv() {
        this.setState({ showFilterDiv: true }, state => {

            var element = document.getElementById("filter-form-container");
            element.classList.remove("disappear");
            document.getElementById("dashboard-container").classList.add("disappear")
            document.getElementById("dashboard-filter-btn").disabled = true
        })
    }

    setFilter(filter){
        this.setState({ filterConfiguration: filter })
    }

    render() {
        return (
            <form className="dashboard-editor-form">
                <div className="row col-12" style={{ marginBottom: "3em" }}>
                    <Button className="dashboard-back-btn" onClick={() => this.props.flipCard("")}><i className="fa fa-arrow-left" aria-hidden="true" title="Go back"></i></Button>
                    <Button className="dashboard-save-btn" onClick={this.saveDashboard} disabled={!this.state.contentChanged}>Save</Button>
                    <Button className="dashboard-filter-btn" id="dashboard-filter-btn" onClick={() => this.displayFilterDiv()}><i className="fa fa-filter" aria-hidden="true"></i>Filter</Button>
                </div>
                <div>{
                    this.state.showFilterDiv &&
                    <DashboardFilter
                        hideFilterDiv={() => this.setState({ showFilterDiv: false })}
                        setFilter={(filter) =>this.setFilter(filter) }
                        notif={this.props.notif}
                        filterMode="CREATE" 
                        dashboardId={this.props.dashboardId}
                        dashboardVersion={this.state.version}
                        filterConfiguration={this.state.filterConfiguration}
                        core={this.core}
                    />
                }

                </div>
                <div id="dashboard-container">
                    <div className="form-group row">
                        <label htmlFor="dashboardName" className="col-2 col-form-label form-control-sm">Name</label>
                        <div className="col-2">
                            <>
                                <input type="text" id="dashboardName" name="dashboardName" ref="dashboardName" className="form-control form-control-sm"
                                    onChange={this.inputChanged} value={this.state.dashboardName} onBlur={this.isNameValid}
                                    disabled={false} />
                                <Overlay target={this.refs.dashboardName} show={this.state.errors.dashboardName != null} placement="bottom">
                                    {props => (
                                        <Tooltip id="dashboardName-tooltip" {...props} className="error-tooltip">
                                            {this.state.errors.dashboardName}
                                        </Tooltip>
                                    )}
                                </Overlay>
                            </>
                        </div>
                        <label htmlFor="dashboardDescription" className="col-2 col-form-label form-control-sm">Description</label>
                        <div className="col-4">
                            <>
                                <input type="text" id="dashboardDescription" name="dashboardDescription" ref="dashboardDescription" className="form-control form-control-sm"
                                    onChange={this.inputChanged} value={this.state.dashboardDescription} onBlur={this.isDescriptionValid}
                                    disabled={false} />
                                <Overlay target={this.refs.dashboardDescription} show={this.state.errors.dashboardDescription != null} placement="bottom">
                                    {props => (
                                        <Tooltip id="dashboardDescription-tooltip" {...props} className="error-tooltip">
                                            {this.state.errors.dashboardDescription}
                                        </Tooltip>
                                    )}
                                </Overlay>
                            </>
                        </div>

                    </div>
                    <div className="dashboard">
                        <div id="ckEditorInstance" style={{ height: 'calc(100%)' }}>
                        </div>
                    </div>

                    <div id="gridArea" style={{ height: '200px', width: '800px' }}>
                        <div className="oxzion-widget-content"></div>
                    </div>
                </div>
            </form>
        );
    }
}

export default DashboardEditor;

