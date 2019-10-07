
class ChartRenderer {
    static render(element, widget) {
        let widgetTagName = element.tagName.toUpperCase();
        switch(widget.renderer) {
            case 'html':
                if ((widgetTagName !== 'SPAN') && (widgetTagName !== 'DIV')) {
                    console.error(`Unexpected inline widget tag "${widgetTagName}"`);
                }
                element.innerHTML = widget.data;
            break;

            case 'amCharts':
                if ((widgetTagName !== 'FIGURE') && (widgetTagName !== 'DIV')) {
                    console.error(`Unexpected inline widget tag "${widgetTagName}"`);
                }
                return ChartRenderer.renderAmCharts(element, widget.configuration, widget.data);
            break;

            default:
                console.error(`Unexpected widget renderer "${widget.renderer}"`);
        }
    }

    static renderAmCharts(element, configuration, data) {
        let series = configuration.series;
        if (!Array.isArray(series)) {
            console.error('Chart series should be array.');
        }
        if (0 === series.length) {
            console.error('Chart series is empty.');
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
                console.error(`Unexpected chart element "${elementTagName}"`);
        }
        if (!canvasElement) {
            console.error('Canvas element not found for drawing the chart.');
        }
        try {
            let chart = am4core.createFromConfig(configuration, canvasElement, am4ChartType);
            if (chart && data) {
                chart.data = data;
            }
            return chart;
        }
        catch(e) {
            console.error(e);
        }
    }
}

export default ChartRenderer;

