import React from 'react';
import ReactDOM from 'react-dom';
import {dashboardEditor as section} from './metadata.json';
import JavascriptLoader from './components/javascriptLoader';
import osjs from 'osjs';
import Swal from "sweetalert2";
import '../../gui/src/public/css/sweetalert.css';
import './components/widget/editor/widgetEditorApp.scss';

class DashboardEditor extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.state = {
            dashboardId : (props.dashboardId ? props.dashboardId : null),
            contentChanged : false
        };
        let thisInstance = this;
        this.renderedCharts = {};        
        this.props.setTitle(section.title.en_EN);
        this.restClient = osjs.make('oxzion/restClient');
        this.editorDialogMessageHandler = function(event) {
            let editorDialog = event.source;
            let eventData = event.data;
            switch(eventData.action) {
                case 'data':
                    thisInstance.doRestRequest(eventData.url, eventData.params, eventData.method ? eventData.method : 'get', 
                        function(response) { //Successful response
                            editorDialog.postMessage(response, '*');
                        },
                        function(response) { //Failure response
                            editorDialog.postMessage(response, '*');
                        }
                    );
                break;
                default:
                    console.warn(`Unhandled editor dialog message action:${eventData.action}`);
            }
        };
    }

    //---------------------------------------------------------------------------------------
    //jsLibraryList is done this way to avoid utility functions modifying the list.
    //---------------------------------------------------------------------------------------
    getJsLibraryList = () => {
        let self = this;
        return [
            {'name':'amChartsCoreJs','url':'https://www.amcharts.com/lib/4/core.js','onload':function() {},'onerror':function(){}},
            {'name':'amChartsChartsJs','url':'https://www.amcharts.com/lib/4/charts.js','onload':function() {},'onerror':function(){}},
            {'name':'amChartsAnimatedJs','url':'https://www.amcharts.com/lib/4/themes/animated.js','onload':function() {},'onerror':function(){}},
            {'name':'amChartsKellyJs','url':'https://www.amcharts.com/lib/4/themes/kelly.js','onload':function() {},'onerror':function(){}},
            {'name':'ckEditorJs','url':'/apps/Analytics/ckeditor/ckeditor.js','onload':function() {self.setupCkEditor();},'onerror':function(){}}
        ];
    }

    setupCkEditor = () => {
        const config = {
            extraPlugins: 'oxzion,autogrow',
            autoGrow_minHeight: 250,
            autoGrow_maxHeight: 400,
            height:400,
            width:'100%',
            //IMPORTANT: Need this setting to retain HTML tags as we want them. Without this setting, 
            //CKEDITOR removes tags like span and flattens HTML structure.
            allowedContent:true,
            //extraAllowedContent:'span(*)',
            oxzion: {
                dimensions: {
                    begin: {
                        width:300,
                        height:200
                    },
                    min: {
                        width:50,
                        height:50
                    },
                    max: {
                        width:800,
                        height:600,
                    }
                },
                dialogUrl: '/apps/Analytics/widgetEditorDialog.html'
            }
        };
        //Without this setting CKEditor removes empty inline widgets (which is <span></span> tag).
        CKEDITOR.dtd.$removeEmpty['span'] = false;
        let editor = CKEDITOR.appendTo( 'ckEditorInstance', config );
        this.setEditorContent(editor);
        let thisInstance = this;
        editor.on('oxzionWidgetInitialization', function(event) {
            try {
                let elementId = event.data.elementId;
                let widgetId = event.data.widgetId;
                thisInstance.updateWidget(elementId, widgetId);
            }
            catch(error) {
                console.error(error);
            }
        });
        editor.on('oxzionWidgetPrepareToDowncast', function(event) {
            try {
                let elementId = event.data.elementId;
                let chart = thisInstance.renderedCharts[elementId];
                if (chart) {
                    chart.dispose();
                    thisInstance.renderedCharts[elementId] = null;
                    console.info(`Disposed the chart of element id ${elementId} for downcasting it.`); 
                }
            }
            catch(error) {
                console.error(error);
            }
        });
        editor.on('change', function() { 
            thisInstance.setState({
                contentChanged : true
            });
        });
    }

    saveDashboard = () => {
        let ckEditorInstance = CKEDITOR.instances['editor1'];
        let params = {
            'content':ckEditorInstance.getData()
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
            function(response) {
                thisInstance.setState({
                    contentChanged : false
                });
                if (!thisInstance.state.dashboardId) {
                    thisInstance.setState({
                        dashboardId : response.uuid
                    });
                }
            }, 
            function(response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Could not save dashboard. Please try after some time.'
                });
            }
        );
    }

    setEditorContent = (editor) => {
        if (this.state.dashboardId) {
            this.doRestRequest('analytics/dashboard/' + this.state.dashboardId, {}, 'get', 
                function(response) {
                    editor.setData(response.content);
                }, 
                function(response) {
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
            console.info(`Received a non-success status from server. Status:${JSON.stringify(response)}.`);
            if (thisInstance.loader) {
                thisInstance.loader.destroy();
            }
            if (failureHandler) {
                response.url = url;
                response.params = params;
                failureHandler(response);
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
            then(function(response) {
                if (response.status !== 'success') {
                    handleNonSuccessResponse(response);
                }
                else {
                    if (successHandler) {
                        let responseObject = {
                            'url':url,
                            'params':params,
                            'status':'success'
                        };
                        let dataContent = response.data;
                        for (let property in dataContent) {
                            if ((property === 'url') || (property === 'params') || (property === 'status')) {
                                throw `Reserved property name ${property} used in REST response. Modify the server side controller to use some other property name.`;
                            }
                            responseObject[property] = dataContent[property];
                        }
                        successHandler(responseObject);
                    }
                }
            }).
            catch(function(response){
                handleNonSuccessResponse(response);
            }).
            finally(function(response){
                if (thisInstance.loader) {
                    thisInstance.loader.destroy();
                }
            });
    }

    updateWidget = (elementId, widgetId) => {
        let iframeElement = document.querySelector('iframe.cke_wysiwyg_frame');
        let iframeWindow = iframeElement.contentWindow;
        let iframeDocument = iframeWindow.document;
        let widgetElement = iframeDocument.querySelector('#' + elementId);
        switch(widgetElement.tagName.toUpperCase()) {
            case 'SPAN':
                this.updateInlineWidget(widgetElement, widgetId);
            break;
            case 'FIGURE':
                this.updateBlockWidget(widgetElement, widgetId);
            break;
            default:
                throw `Unexpected Oxzion widget tag ${widgetElement.tagName}`;
        }
    }

    updateInlineWidget = (element, widgetId) => {
        if (!widgetId) {
            let widgetIdAttribute = element.attributes.getNamedItem('data-oxzion-widget-id');
            if (widgetIdAttribute) {
                widgetId = widgetIdAttribute.nodeValue;
            }
        }
        this.doRestRequest('analytics/widget/' + widgetId, {}, 'get', 
            function(response) {
                element.innerHTML = response.data;
            }, 
            function(response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Could not fetch contents of a widget. Please try after some time.'
                });
            }
        );
    }

    updateBlockWidget = (element, widgetId) => {
        let thiz = this;
        if (!widgetId) {
            let widgetIdAttribute = element.attributes.getNamedItem('data-oxzion-widget-id');
            if (widgetIdAttribute) {
                widgetId = widgetIdAttribute.nodeValue;
            }
        }
        this.doRestRequest('analytics/widget/' + widgetId, {}, 'get', 
            function(response) {
                let graphElement = element.querySelector('div.oxzion-widget-content');
                let chart = am4core.createFromConfig(response.configuration, graphElement, am4charts.XYChart);
                chart.data = response.data;
                let elementId = element.attributes.getNamedItem('id');
                thiz.renderedCharts[elementId] = chart;
            },
            function(response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Could not fetch contents of a widget. Please try after some time.'
                });
            }
        );
    }

    componentDidMount() {
        window.addEventListener('message', this.editorDialogMessageHandler, false);
        JavascriptLoader.loadScript(this.getJsLibraryList());
    }

    componentWillUnmount() {
        for (let elementId in this.renderedCharts) {
            let chart = this.renderedCharts[elementId];
            if (chart) {
                chart.dispose();
                this.renderedCharts[elementId] = null;
            }
        }
        window.removeEventListener('message', this.editorDialogMessageHandler, false);
        let ckEditorInstance = CKEDITOR.instances['editor1'];
        if (ckEditorInstance) {
            ckEditorInstance.destroy();
        }
        JavascriptLoader.unloadScript(this.getJsLibraryList());
    }

    render() {
        return(
            <div className="dashboard">
                <button type="button" className="btn btn-primary" style={{float:'right'}} onClick={this.saveDashboard} disabled={!this.state.contentChanged}>
                    Save
                </button>
                <br/><br/><br/>
                <div id="ckEditorInstance" style={{height:'calc(100%)'}}>
                </div>
            </div>
        );
    }
}

export default DashboardEditor;

