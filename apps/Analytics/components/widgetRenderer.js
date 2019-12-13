import React from 'react';
import ReactDOM from 'react-dom';
var numeral = require('numeral');
import WidgetGrid from './widget/editor/widgetGrid'

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
        let series = configuration.series;
        if (!Array.isArray(series)) {
            throw 'Chart series should be array.';
        }
        if (0 === series.length) {
            throw 'Chart series is empty.';
        }
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
        let contentElement = element.querySelector('div.oxzion-widget-content');
        ReactDOM.render(
            <WidgetGrid configuration={configuration} data={data}/>, 
            contentElement);
    }
}

export default WidgetRenderer;

