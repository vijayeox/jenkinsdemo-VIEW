import React from 'react';
import ReactDOM from 'react-dom';
import Swal from "sweetalert2";
import '../../../../../gui/src/public/css/sweetalert.css';

class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.widget;
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

    alignmentChanged = (e) => {
        let thiz = this;
        let align = e.target.value;
//        this.setState((state, props) => {
//            return {align:align};
//        },
//        () => {
//        });
        this.setState({
            align: align
        },
        () => {
            thiz.props.updateParentState('widget', thiz.state);
        });
    }

    inputChanged = (e) => {
        let thiz = this;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [e.target.name]:value,
            modified:true
        },
        () => {
            thiz.props.updateParentState('widget', thiz.state);
        });
    }

    componentDidMount() {
        let thiz = this;
        window.postDataRequest('analytics/widget/' + this.state.id, {}).
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
                    <div className="card" id="chartProperty">
                        <div className="card-header">
                            Bar chart properties
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <label htmlFor="chartAlignment" className="col-4 col-form-label form-control-sm">Chart alignment</label>
                                <div className="col-8">
                                    <div className="btn-group btn-group-sm btn-group-toggle" data-toggle="buttons">
                                        <label className={'btn btn-info' + 
                                            ((!this.state.align || this.state.align === 'left' || this.state.align === '') ? ' active' : '')}>
                                            <input type="radio" name="chartAlignment" value="left" autoComplete="off" 
                                                checked={!this.state.align || (this.state.align === 'left') || (this.state.align === '')} 
                                                onChange={this.alignmentChanged} disabled={this.state.readOnly}/> Left
                                        </label>
                                        <label className={'btn btn-info' + ((this.state.align === 'center') ? ' active' : '')}>
                                            <input type="radio" name="chartAlignment" value="center" autoComplete="off" 
                                                checked={this.state.align === 'center'} onChange={this.alignmentChanged} disabled={this.state.readOnly}/> Center
                                        </label>
                                        <label className={'btn btn-info' + ((this.state.align === 'right') ? ' active' : '')}>
                                            <input type="radio" name="chartAlignment" value="right" autoComplete="off" 
                                                checked={this.state.align === 'right'} onChange={this.alignmentChanged} disabled={this.state.readOnly}/> Right
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="chartTitle" className="col-4 col-form-label form-control-sm">Chart title</label>
                                <div className="col-8">
                                    <input type="text" id="chartTitle" name="chartTitle" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} value="Chart title" readOnly={this.state.readOnly}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="chartFooter" className="col-4 col-form-label form-control-sm">Chart footer</label>
                                <div className="col-8">
                                    <input type="text" id="chartFooter" name="chartFooter" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} value="Chart footer" readOnly={this.state.readOnly}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="categoryColumn" className="col-4 col-form-label form-control-sm">Category series column</label>
                                <div className="col-8">
                                    <select id="categoryColumn" name="categoryColumn" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} readOnly={this.state.readOnly}>
                                        <option value="">-Select category column-</option>
                                        <option value="">Column A</option>
                                        <option value="">Column B</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="categoryLabel" className="col-4 col-form-label form-control-sm">Category series label</label>
                                <div className="col-8">
                                    <input type="text" id="categoryLabel" name="categoryLabel" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} value="Category label" readOnly={this.state.readOnly}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="valueColumn0" className="col-4 col-form-label form-control-sm">Value series column</label>
                                <div className="col-6">
                                    <select id="valueColumn0" name="valueColumn0" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} readOnly={this.state.readOnly}>
                                        <option value="">-Select value column-</option>
                                        <option value="">Column A</option>
                                        <option value="">Column B</option>
                                    </select>
                                </div>
                                <div className="col-2">
                                    <button type="button" className="btn btn-primary add-series-button" title="Add value series">
                                        <span className="fa fa-plus-square" aria-hidden="true"></span>
                                    </button>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="valueLabel0" className="col-4 col-form-label form-control-sm">Value series label</label>
                                <div className="col-8">
                                    <input type="text" id="valueLabel0" name="valueLabel0" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} value="Value series label" readOnly={this.state.readOnly}/>
                                </div>
                            </div>
                            { /* Begin add value series. */ }
                            { /* End add value series. */ }
                            <div className="form-group row">
                                <label className="form-check-label col-4 col-form-label form-control-sm" htmlFor="displayToolTip">Display tool-tip</label>
                                <div className="col-8">
                                    <input type="checkbox" id="displayToolTip" name="displayToolTip" onChange={this.inputChanged} disabled={this.state.readOnly}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group col">
                    <div className="card">
                        <div className="card-header">
                            Preview
                        </div>
                        <div className="card-body">
                            <div id="chartPreview">
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default BarChart;

