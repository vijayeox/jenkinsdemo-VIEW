import React from 'react';
import ReactDOM from 'react-dom';
import Swal from "sweetalert2";
import '../../../../../gui/src/public/css/sweetalert.css';

class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.chart = null;
    }

    static getChartJsonTemplate() {
        return {
            'series':[{
                'type':'ColumnSeries',
                'name':'${columnSeriesName}',
                'dataFields': {
                    'valueY':'${valueColumn}',
                    'categoryX':'${categoryColumn}'
                },
                'tooltipText':'{name}:[bold]{categoryX} - {valueY}[/]'
            }],
            'xAxes':[{
                'type':'CategoryAxis',
                'dataFields':{
                    'category':'${categoryColumn}'
                },
                'title':{
                    'text':'${categoryAxisTitle}'
                },
                'renderer':{
                    'grid': {
                        'template': {
                            'location':0
                        }
                    },
                    'minGridDistance':1
                }
            }],
            'yAxes': [{
                'type':'ValueAxis',
                'title':{
                    'text':'${valueAxisTitle}'
                }
            }],
            'cursor': {
                'type':'XYCursor'
            }
        };
    }

    componentDidMount() {
        let thiz = this;
        window.postDataRequest('analytics/widget/' + this.props.widgetId, {}).
            then(function(response) {
                var chart = am4core.createFromConfig(response.configuration, document.querySelector('div#chartPreview'), am4charts.XYChart);
                chart.data = response.data;
                thiz.chart = chart;
            }).
            catch(function(response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Could not load widget. Please try after some time.'
                });
            });
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
                <>
                    <div className="form-group col">
                        <label>Bar chart properties</label>
                        <div className="form-control">
                            <div className="form-row">
                                <div className="form-group col">
                                    Column1
                                </div>
                                <div className="form-group col">
                                    Column2
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group col">
                        <label>Preview</label>
                        <div id="chartPreview" className="form-control" style={{height:'300px'}}>
                        </div>
                    </div>
                </>
        );
    }
}

export default BarChart;

