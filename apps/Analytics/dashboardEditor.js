import React from 'react';
import ReactDOM from 'react-dom';
import {dashboardEditor as section} from './metadata.json';
import JavascriptLoader from './components/javascriptLoader';
import osjs from 'osjs';

class DashboardEditor extends React.Component {
    constructor(props) {
        super(props);
        var thisInstance = this;
        this.renderedCharts = {};
        this.core = this.props.args;
        this.state = {
        };
        this.props.setTitle(section.title.en_EN);
        this.editorDialog = null;
        this.restClient = osjs.make('oxzion/restClient');
        this.editorDialogMessageHandler = function(event) {
            var data = event.data;
            switch(data.action) {
                case 'register':
                    var editorDialog = event.source;
                    thisInstance.editorDialog = editorDialog;
                    editorDialog.postMessage({
                        'status':'success'
                    }, '*');
                break;
                case 'data':
                    if (!thisInstance.loader) {
                        thisInstance.loader = thisInstance.core.make('oxzion/splash');
                    }
                    thisInstance.loader.show();
                    let response = thisInstance.restClient.request('v1', 'analytics/widget', {}, 'get');
                    response.then(function(data) {
                        if (data.status === 'error') {
                            thisInstance.editorDialog.postMessage({
                                'status':'failure', 
                                'url':data.url, 
                                'params':data.params, 
                                'data':{'none':'none'}
                            }, '*');
                        }
                    }).
                    catch(function(data){
                        thisInstance.editorDialog.postMessage({
                            'status':'failure', 
                            'url':data.url, 
                            'params':data.params, 
                            'data':{'none':'none'}
                        }, '*');
                    }).
                    finally(function(data){
                        if (thisInstance.loader) {
                            thisInstance.loader.destroy();
                        }
                    });
                break;
            }
        };
    }

    //---------------------------------------------------------------------------------------
    //jsLibraryList is done this way to avoid utility functions modifying the list.
    //---------------------------------------------------------------------------------------
    getJsLibraryList = () => {
        var self = this;
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
        var editor = CKEDITOR.appendTo( 'ckEditorInstance', config );
        this.setEditorContent(editor);
        var thisInstance = this;
        editor.on('oxzionWidgetInitialization', function(event) {
            try {
                var elementId = event.data.elementId;
                thisInstance.drawChart(elementId);
                console.info(`drawChart called for element id ${elementId}.`);
            }
            catch(error) {
                console.error(error);
            }
        });
        editor.on('oxzionWidgetPrepareToDowncast', function(event) {
            try {
                var elementId = event.data.elementId;
                var chart = thisInstance.renderedCharts[elementId];
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
    }

    setEditorContent = (editor) => {
        editor.setData(
            '<p>Under this section, the Commercial Contributor then makes performance claims of USD <span style="font-style:bold;font-size:2em;color:red;"><span class="oxzion-widget" id="widget1" data-oxzion-widget-id="f5b8ee95-8da2-409a-8cf0-fa5b4af10667">300,000</span></span>, or offers warranties related to Product X, those performance claims and warranties are such Commercial Contributor\'s responsibility alone.' + 
            '<figure class="oxzion-widget" id="widget2" data-oxzion-widget-id="f5b8ee95-8da2-409a-8cf1-fa5b4af10667">' + 
                '<div class="oxzion-widget-content" style="width:600px;height:300px;"></div>' + 
                '<figcaption class="oxzion-widget-caption">Sales by sales person</figcaption>' + 
            '</figure>' + 
            'Under this section, the Commercial Contributor in writing by the law of the following: accompany any non-standard executables and testcases, giving the users of the Licensed Product, you hereby agree that use of Licensed Product. This License relies on precise definitions for certain terms.</p><p>Those terms are used only in the copyright notice and this permission notice shall be governed by the use or sale of its release under this License will continue in full force and effect.</p>',
            {
                callback:function() {} //this.drawCharts
            });
    }

    drawChart = (elementId) => {
        var iframeElement = document.querySelector('iframe.cke_wysiwyg_frame');
        var iframeWindow = iframeElement.contentWindow;
        var iframeDocument = iframeWindow.document;
        var graphElement = iframeDocument.querySelector('figure#' + elementId + '>div.oxzion-widget-content');
        var chart = am4core.create(graphElement, am4charts.XYChart);
        chart.colors.step = 2;
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.dataFields.category = 'person';
        categoryAxis.title.text = 'Person';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 1;
        chart.colors.list = [
            am4core.color('#0000FF')
        ];
        valueAxis.title.text = 'Sales (Million $)';
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.name = 'Sales';
        series.dataFields.valueY = 'sales';
        series.dataFields.categoryX = 'person';
        series.tooltipText = '{name}: [bold]{valueY}[/]';
        chart.data = [
            {'person': 'Bharat', 'sales': 4.2},
            {'person': 'Harsha', 'sales': 5.2},
            {'person': 'Mehul', 'sales': 15.2},
            {'person': 'Rajesh', 'sales': 2.9},
            {'person': 'Ravi', 'sales': 2.9},
            {'person': 'Yuvraj', 'sales': 14.2}
        ];
        this.renderedCharts[elementId] = chart;
    }

    componentDidMount() {
        window.addEventListener('message', this.editorDialogMessageHandler, false);
        JavascriptLoader.loadScript(this.getJsLibraryList());
    }

    componentWillUnmount() {
        for (var elementId in this.renderedCharts) {
            var chart = this.renderedCharts[elementId];
            if (chart) {
                chart.dispose();
                this.renderedCharts[elementId] = null;
            }
        }
        window.removeEventListener('message', this.editorDialogMessageHandler, false);
        var ckEditorInstance = CKEDITOR.instances['editor1'];
        if (ckEditorInstance) {
            ckEditorInstance.destroy();
        }
        JavascriptLoader.unloadScript(this.getJsLibraryList());
    }

    render() {
        return(
            <div className="dashboard">
                <div id="ckEditorInstance" style={{height:'calc(100%)'}}></div>
            </div>
        );
    }
}

export default DashboardEditor;

