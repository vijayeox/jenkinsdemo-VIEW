import React from 'react';
import ReactDOM from 'react-dom';
var numeral = require('numeral');
import WidgetGrid from './WidgetGrid';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/animated";
import WidgetTransformer from './WidgetTransformer';
am4core.useTheme(am4themes_animated);

class WidgetRenderer {
    static render(element, widget) {
        let widgetTagName = element.tagName.toUpperCase();
        switch(widget.renderer) {
            case 'JsAggregate':
            case 'JsCalculator':
                if ((widgetTagName !== 'SPAN') && (widgetTagName !== 'DIV')) {
                    console.error(`Unexpected inline aggregate value widget tag "${widgetTagName}"`);
                }
                return WidgetRenderer.renderAggregateValue(element, widget.configuration, widget.data);
            break;

            case 'amCharts':
                if ((widgetTagName !== 'FIGURE') && (widgetTagName !== 'DIV')) {
                    console.error(`Unexpected chart widget tag "${widgetTagName}"`);
                    return null;
                }
                try {
                    return WidgetRenderer.renderAmCharts(element, widget.configuration, widget.data);
                }
                catch(e) {
                    console.error(e);
                    return null;
                }
            break;

            case 'JsTable':
                if ((widgetTagName !== 'FIGURE') && (widgetTagName !== 'DIV')) {
                    console.error(`Unexpected table widget tag "${widgetTagName}"`);
                    return null;
                }
                try {
                    return WidgetRenderer.renderTable(element, widget.configuration, widget.data);
                }
                catch(e) {
                    console.error(e);
                    return null;
                }
            break;

            default:
                console.error(`Unexpected widget renderer "${widget.renderer}"`);
                return null;
        }
    }

    static renderAggregateValue(element, configuration, data) {
        let displayValue = null;
        if (configuration) {
            if (configuration.numberFormat) {
                let format = configuration.numberFormat;
                let num = numeral(data);
                displayValue = num.format(format);
            }
            else if (configuration.dateFormat) {
                let format = configuration.dateFormat;
                displayValue = dayjs(data).format(format);
            }
        }
        element.innerHTML = displayValue ? displayValue : ('' + data);
        return null;
    }

    static renderAmCharts(element, configuration, data) {
        function getAvailablePropertiesAsObject(dataItem, propertyList) {
            let obj = {};
            propertyList.forEach(function(prop, index, array) {
                if (dataItem[prop]) {
                    obj[prop] = dataItem[prop];
                }
            }
            return obj;
        }

        function dumpProperties(obj) {
            for (var prop in obj) {
                console.log(prop + ' => ' + obj[prop]);
            }
            //Object.keys(obj).forEach(function(key,index) {
            //    // key: the name of the object key
            //    // index: the ordinal position of the key within the object 
            //    console.log(key + ' => ' + obj[key]);
            //});
        }

        var transformedConfig = WidgetTransformer.transform(configuration, data);
        configuration = transformedConfig.chartConfiguration;
        data = transformedConfig.chartData;

        let series = configuration.series;
        if (!Array.isArray(series)) {
            throw 'Chart series should be array.';
        }
        if (0 === series.length) {
            throw 'Chart series is empty.';
        }

        series.forEach(function(ser) {
            switch(ser.type) {
                case 'ColumnSeries':
                    if (!ser['columns']) {
                        ser['columns'] = {};
                    }
                    let columns = ser['columns'];
                    if (!columns['events']) {
                        columns['events'] = {};
                    }
                    let  seriesEvts = columns['events'];
                     seriesEvts['hit'] = function(evt) {
                        let dataObj = getAvailablePropertiesAsObject(evt.target.dataItem, [
                            'valueX',
                            'valueY',
                            'dateX',
                            'dateY',
                            'categoryX',
                            'categoryY',
                            'openValueX',
                            'openValueY',
                            'openDateX',
                            'openDateY',
                            'openCategoryX',
                            'openCategoryY'
                        ]);
                        //console.log("Clicked => category:" + evt.target.dataItem.categoryX + ", value:" + evt.target.dataItem.valueY);
                        //console.log("Clicked => ", evt.target.dataItem);
                        console.log("Clicked => ", dataObj);
                    }
                break;
                case 'LineSeries':
                    if (!ser['bullets']) {
                        ser['bullets'] = {};
                    }
                    let bullets = ser['bullets'];
                    if (!bullets['events']) {
                        bullets['events'] = {};
                    }
                    let bulletEvts = bullets['events'];
                    bulletEvts['hit'] = function(evt) {
                        console.log("Clicked => ", evt.target.dataItem);
                        dumpProperties(evt.target.dataItem);
                    }
                break;
            }
        });

        let type = series[0].type;
        let am4ChartType;
        switch(type) {
            case 'LineSeries':
                am4ChartType = am4charts.XYChart;
            break;

            case 'ColumnSeries':
                am4ChartType = am4charts.XYChart;
            break;

            case 'PieSeries':
                am4ChartType = am4charts.PieChart;
            break;
        }
        let elementTagName = element.tagName.toUpperCase();
        let canvasElement = null;
        switch(elementTagName) {
            case 'DIV':
                canvasElement = element;
            break;
            case 'FIGURE':
                canvasElement = element.querySelector('div.oxzion-widget-content');
            break;
            default:
                throw `Unexpected chart element "${elementTagName}"`;
        }
        if (!canvasElement) {
            throw 'Canvas element not found for drawing the chart.';
        }

        let chart = am4core.createFromConfig(configuration, canvasElement, am4ChartType);
        if (chart && data) {
            chart.data = data;
        }
        return chart;
    }

    static renderTable(element, configuration, data) {
        let elementTagName = element.tagName.toUpperCase();
        let canvasElement = null;
        switch(elementTagName) {
            case 'DIV':
                canvasElement = element;
            break;
            case 'FIGURE':
                canvasElement = element.querySelector('div.oxzion-widget-content');
            break;
            default:
                throw `Unexpected table element "${elementTagName}"`;
        }
        if (!canvasElement) {
            throw 'Canvas element not found for drawing the table/grid.';
        }

        ReactDOM.render(
            <WidgetGrid configuration={configuration} data={data}/>, 
            canvasElement);
    }
}

export default WidgetRenderer;

