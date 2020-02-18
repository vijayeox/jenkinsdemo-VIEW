import React from 'react';
import ReactDOM from 'react-dom';
var numeral = require('numeral');
import WidgetGrid from './WidgetGrid';
import * as am4core from "../amcharts/core";
import * as am4charts from "../amcharts/charts";
import * as am4maps from "../amcharts/maps";
import am4geodata_usaAlbersLow from "@amcharts/amcharts4-geodata/usaAlbersLow";
import am4themes_animated from "../amcharts/themes/animated";
import am4themes_kelly from "../amcharts/themes/kelly";
import WidgetTransformer from './WidgetTransformer';
am4core.useTheme(am4themes_animated);

class WidgetRenderer {
    static render(element, widget) {
        let widgetTagName = element.tagName.toUpperCase();
        switch(widget.renderer) {
            case 'JsAggregate':
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
        function getDataContext(dataItem, propertyList) {
            let obj = {};
            propertyList.forEach(function(prop, index, array) {
                if (dataItem[prop]) {
                    obj[prop] = dataItem[prop];
                }
            });
            return obj;
        }

        //function dumpProperties(obj) {
        //    for (var prop in obj) {
        //        console.log(prop + ' => ' + obj[prop]);
        //    }
        //    //Object.keys(obj).forEach(function(key,index) {
        //    //    // key: the name of the object key
        //    //    // index: the ordinal position of the key within the object 
        //    //    console.log(key + ' => ' + obj[key]);
        //    //});
        //}

        var transformedConfig = WidgetTransformer.transform(configuration, data);
        configuration = transformedConfig.chartConfiguration;
        data = transformedConfig.chartData;

        let series = configuration.series;
        //if (!Array.isArray(series)) {
        //    throw 'Chart series should be array.';
        //}
        //if (0 === series.length) {
        //    throw 'Chart series is empty.';
        //}

        if (series) {
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
                            let dataContext = getDataContext(evt.target.dataItem, [
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
                            console.log("Clicked column => ", dataContext);
                        };
                    break;
                    case 'LineSeries':
                        if (!ser['segments']) {
                            ser['segments'] = {};
                        }
                        let segments = ser['segments'];
                        segments['interactionsEnabled'] = true;
                        if (!segments['events']) {
                            segments['events'] = {};
                        }
                        let segmentEvts = segments['events'];
                        segmentEvts['hit'] = function(evt) {
                            let dataContext = evt.target.dataItem.component.tooltipDataItem.dataContext;
                            console.log('Clicked line segment => ', dataContext);
                        };
    
                        if (!ser['bullets']) {
                            ser['bullets'] = {};
                        }
                        let bullets = ser['bullets'];
                        if (!bullets['events']) {
                            bullets['events'] = {};
                        }
                        let bulletEvts = bullets['events'];
                        bulletEvts['hit'] = function(evt) {
                            let dataContext = evt.target.dataItem.dataContext.value;
                            console.log('Clicked bullet => ', dataContext);
                        };
                    break;
                }
            });
        }

        let type = null;
        if (Array.isArray(series) && (series.length > 0)) {
            type = series[0].type;
        }
        let am4ChartType;
        if (type) {
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

                case 'FunnelSeries':
                case 'PyramidSeries':
                    am4ChartType = am4charts.SlicedChart;
                break;
            }
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

        let chart = null;
        if (am4ChartType) {
            chart = am4core.createFromConfig(configuration, canvasElement, am4ChartType);
            if (chart && data) {
                chart.data = data;
            }
        }
        else {
            let meta = configuration['oxzion-meta'];
            let chartType = meta ? meta['type'] : null;
            if (chartType) {
                switch(chartType) {
                    case 'map':
                        chart = WidgetRenderer.renderAmMap(configuration, canvasElement, data);
                    break;
                    default:
                        throw `Chart type "${chartType}" is not supported.`;
                }
            }
        }

        return chart;
    }

    static renderAmMap(configuration, canvasElement, data) {
        //-----------------------------------------------------------------------------------------
        // Code is based on https://codepen.io/team/amcharts/pen/5ae84826c9e2ab4772c9ef85021835c7
        //-----------------------------------------------------------------------------------------
        function processData(data, configuration) {
            let meta = configuration['oxzion-meta'];
            if (!meta) {
                throw 'Configuration should have "oxzion-meta" element.';
            }
            let country = meta['countryCode'];
            if (country) {
                country = country + '-';
            }
            let dataKeys = meta['dataKeys'];
            if (!dataKeys) {
                throw 'oxzion-meta configuration should have "dataKeys" element.';
            }
            let stateKey = dataKeys['state'];
            let valueKey = dataKeys['value'];

            let newData = [];
            let min = Number.MAX_VALUE;
            let max = Number.MIN_VALUE;
            data.forEach(function(item, index, array) {
                let key = item[stateKey];
                let value = item[valueKey];
                newData.push({
                    'id':country + key,
                    'value':value
                });
                max = Math.max(max, value);
                min = Math.min(min, value);
            });
            return {
                'data':newData,
                'max':max,
                'min':min
            }
        }

        let chart = am4core.create(canvasElement, am4maps.MapChart);
        chart.geodata = am4geodata_usaAlbersLow;
        chart.projection = new am4maps.projections.Mercator();
        let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        //Set min/max fill color for each area
        polygonSeries.heatRules.push({
            property: "fill",
            target: polygonSeries.mapPolygons.template,
            min: chart.colors.getIndex(1).brighten(1),
            max: chart.colors.getIndex(1).brighten(-0.3)
        });

        // Make map load polygon data (state shapes and names) from GeoJSON
        polygonSeries.useGeodata = true;

        let processedData = processData(data, configuration);
        polygonSeries.data = processedData['data'];

        // Set up heat legend
        let heatLegend = chart.createChild(am4maps.HeatLegend);
        heatLegend.series = polygonSeries;
        heatLegend.align = "right";
        heatLegend.width = am4core.percent(25);
        heatLegend.marginRight = am4core.percent(4);
        heatLegend.minValue = processedData['min'];
        heatLegend.maxValue = processedData['max'];

        let meta = configuration['oxzion-meta'];
        let legend = null;
        if (meta) {
            legend = meta['legend'];
        }
        if (legend) {
            let labels = legend['labels'];
            if (labels) {
                let min = labels['min'];
                if (min) {
                    let minRange = heatLegend.valueAxis.axisRanges.create();
                    minRange.value = heatLegend.minValue;
                    minRange.label.text = min;
                }
                let max = labels['max'];
                if (max) {
                    let maxRange = heatLegend.valueAxis.axisRanges.create();
                    maxRange.value = heatLegend.maxValue;
                    maxRange.label.text = max;
                }
            }
        }

        // Blank out internal heat legend value axis labels
        heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
            return "";
        });

        // Configure series tooltip
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.nonScalingStroke = true;
        polygonTemplate.strokeWidth = 0.5;
        let tooltipText = meta['tooltipText'];
        if (tooltipText) {
            polygonTemplate.tooltipText = tooltipText;
        }

        // Create hover state and set alternative fill color
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#3c5bdc");

        // Show tooltips only if the state has a value
        // (A tooltip will appear if tooltipText is not empty.)
        polygonTemplate.adapter.add("tooltipText", function(tooltipText, polygon) {
            if (isNaN(polygon.dataItem.dataContext.value)) {
                return "";
            }
            return tooltipText;
        });

        // When clicking a US State, if it has a numeric value:
        // 1. hide tooltip (use hit event handler)
        // 2. open URL if available (use url property, property binding, and adapter)
        polygonTemplate.events.on("hit", function(event) {
            // The original logic was if this state has a numeric value,
            // but a tooltip will only show if that's the case,
            // so we can just hide it regardless.
  
            // All these are ways to hide the tooltip, the actual tooltip
            // object is on the series, not the individual mapPolygons:
            // polygonSeries.tooltip.hide();
            // polygonSeries.hideTooltip();
            event.target.hideTooltip();
        });

        polygonTemplate.propertyFields.url = "modalUrl";
        polygonTemplate.urlTarget = "_self";
        // We can either now parse data before it's processed and prevent modalUrl
        // from being applied if the value DNE or isNaN,
        // OR!
        // We can use an adapter for url, reset it as needed, and override the cursor style.

        // This adapter will trigger on hit
        polygonTemplate.adapter.add("url", function(url, polygon) {
            // if data isn't ready, or value isn't a number, kill the url if it has one
            if (! polygon.dataItem || !polygon.dataItem.dataContext || isNaN(polygon.dataItem.dataContext.value)) {
                return "";
            }
            return url;
        });
        // When url is applied, hover cursor is changed to pointer
        polygonSeries.events.on("datavalidated", function() {
            polygonSeries.mapPolygons.each(function(polygon) {
                // Since we only set url via property binding, if it has an url
                // already, then it definitely has the dataItem.dataContext,
                // but maybe not a value.
                if (polygon.properties.url && isNaN(polygon.dataItem.dataContext.value)) {
                    polygon.cursorOverStyle = am4core.MouseCursorStyle.default;
                }
            });
        })

        if (meta['showStateName']) {
            // To create labels for our mapPolygons, we'll need a MapImageSeries.
            // The MapImage will serve as a container for our labels and is able
            // to be positioned on the map according to geographic coordinates.
            // (It is important to make an actual MapImageSeries, not attempt
            // to make a MapImage as a child of a MapPolygon.)
            let imageSeries = chart.series.push(new am4maps.MapImageSeries());
            let mapImageTemplate = imageSeries.mapImages.template;
            mapImageTemplate.propertyFields.latitude = "latitude";
            mapImageTemplate.propertyFields.longitude = "longitude";

            let labelTemplate = mapImageTemplate.createChild(am4core.Label);
            labelTemplate.text = "{id}";
            labelTemplate.horizontalCenter = "middle";
            labelTemplate.verticalCenter = "middle";
            labelTemplate.textAlign = "middle";
            labelTemplate.interactionsEnabled = false; // let hover pass through, this way a country's hover effect is maintained

            // Once a mapPolygon is loaded, it will calculate a rough, center coordinate,
            // and assign values to its immediate latitude and longitude properties.
            //
            // For States whose calculations are off, provide your own center coordinate,
            // e.g. for Idaho, Florida, etc.
            let longitude = {
                // polygonSeries.getPolygonById('US-TX').longitude
                // -100.0994
                "US-TX": -99,
                "US-FL": -81.65
            };
            var latitude = {
                // polygonSeries.getPolygonById('US-ID').latitude
                // 45.496849999999995
                "US-ID": 43.6
            };
            polygonSeries.events.once("datavalidated", function(){
                let imageData = [];
                polygonSeries.mapPolygons.each(function(polygon) {
                    let stateData = polygon.dataItem.dataContext;
                    let stateLabelData = {
                        latitude: latitude[stateData.id] || polygon.latitude,
                        longitude: longitude[stateData.id] || polygon.longitude,
                        id: stateData.id.substr(3) // stateData.id.replace(/US-/, '')
                    }
                    imageData.push(stateLabelData);
                });
                imageSeries.data = imageData;
            });
        }
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

