import React from 'react';
import ReactDOM from 'react-dom';
import {Overlay, Tooltip} from 'react-bootstrap';
import CategoryValueChart from './categoryValueChart';

class LineChart extends CategoryValueChart {
    constructor(props) {
        super(props);
        this.propertyEditorTitle = 'Line chart properties';
    }

    graphConfigurationToState = () => {
        this.setState((state) => {
            let configuration = this.state.configuration;
            //state.chartTitle = configuration.series[0].name;
            state.chartTitle = configuration.titles[0].text;
            state.categoryColumn = configuration.series[0].dataFields.categoryX;
            //configuration.xAxes[0].dataFields.category;
            state.categoryLabel = configuration.xAxes[0].title.text;
            state.valueColumn0 = configuration.series[0].dataFields.valueY;
            state.valueLabel0 = configuration.yAxes[0].title.text;
            state.chartFooter = configuration.chartContainer.children[0].text;
            state.displayToolTip = configuration['cursor'] ? true : false;
            state.seriesCount = configuration.yAxes.length;
            return state;
        });
    }

    stateToGraphConfiguration = () => {
        let configuration = this.state.configuration;
        configuration.series[0].name = this.state.chartTitle;
        configuration.titles[0].text = this.state.chartTitle;
        configuration.series[0].dataFields.categoryX = this.state.categoryColumn;
        configuration.xAxes[0].dataFields.category = this.state.categoryColumn;
        configuration.xAxes[0].title.text = this.state.categoryLabel;
        configuration.series[0].dataFields.valueY = this.state.valueColumn0;
        configuration.yAxes[0].title.text = this.state.valueLabel0;
        configuration.chartContainer.children[0].text = this.state.chartFooter;
        if (this.state.displayToolTip) {
            configuration['cursor'] = {'type':'XYCursor'};
            configuration.series[0]['tooltipText'] = "{name}:[bold]{categoryX} - {valueY}[/]";
        }
        else {
            delete configuration['cursor'];
            delete configuration.series[0]['tooltipText'];
        }
    }
}

export default LineChart;

