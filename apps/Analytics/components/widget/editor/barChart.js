import React from 'react';
import ReactDOM from 'react-dom';
import {Overlay, Tooltip} from 'react-bootstrap';
import BaseChart from './baseChart';

class BarChart extends BaseChart {
    constructor(props) {
        super(props);
        if (this.state.configuration) {
            this.graphConfigurationToState(true);
            this.state.seriesCount = this.state.configuration.yAxes.length;
        }
        else {
            this.state.seriesCount = 1;
        }
    }

    graphConfigurationToState = (dontCallSetState) => {
        var configuration = this.state.configuration;
        //this.state.chartTitle = configuration.series[0].name;
        this.state.chartTitle = configuration.titles[0].text;
        this.state.categoryColumn = configuration.series[0].dataFields.categoryX;
        //configuration.xAxes[0].dataFields.category;
        this.state.categoryLabel = configuration.xAxes[0].title.text;
        this.state.valueColumn0 = configuration.series[0].dataFields.valueY;
        this.state.valueLabel0 = configuration.yAxes[0].title.text;
        this.state.chartFooter = configuration.chartContainer.children[0].text;
        this.state.displayToolTip = configuration['cursor'] ? true : false;
        if (!dontCallSetState) {
            this.setState((state) => {
                return this.state;
            });
        }
    }

    stateToGraphConfiguration = () => {
        var configuration = this.state.configuration;
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

    validateUserInput = (field, value) => {
        if (value && (typeof value === 'string')) {
            value = value.trim();
        }
        let errorMessage = null;
        switch(field) {
            case 'chartTitle':
                if (!value || ('' === value)) {
                    errorMessage = 'Chart title is needed';
                }
            break;

            case 'categoryColumn':
                if (!value || ('' === value)) {
                    errorMessage = 'Category series column is needed';
                }
            break;

            case 'categoryLabel':
                if (!value || ('' === value)) {
                    errorMessage = 'Category series label is needed';
                }
            break;

            default:
                if (field.substring(0, 11) == 'valueColumn') {
                    if (!value || ('' === value)) {
                        errorMessage = 'Value series column is needed';
                    }
                }
                else if (field.substring(0, 10) == 'valueLabel') {
                    if (!value || ('' === value)) {
                        errorMessage = 'Value series label is needed';
                    }
                }
            break;
        }
        this.setErrorMessage(field, errorMessage);
    }

    addValueSeries = (e) => {
        //this.setState({
        //    seriesCount:this.state.seriesCount+1
        //});
    }

    removeValueSeries = (e) => {
        this.setState({
            seriesCount:this.state.seriesCount-1
        });
    }

    render() {
        let thiz = this;

        function dataSetColumns(keySeed) {
            let i=0;
            let options = [];
            thiz.state.dataSetColumns.map((item, key) => {
                options.push(
                    <option key={'' + keySeed + '-' + i++} value={item.value}>{item.label}</option>
                );
            });
            return options;
        }

        function getValueSeriesContent() {
            let valueSeriesContent = [];
            for (let i=0; i < thiz.state.seriesCount; i++) {
                valueSeriesContent.push(
                    <div key={'00-' + i}>
                        <div className="form-group row" key={'01-' + i}>
                            <label htmlFor={'valueColumn' + i} className="col-4 col-form-label form-control-sm" key={'02-' + i}>Value series column</label>
                            <div className="col-6" key={'03-' + i}>
                                <select id={'valueColumn' + i} name={'valueColumn' + i} ref={'valueColumn' + i} className="form-control form-control-sm" 
                                    onChange={thiz.selectionChanged} disabled={thiz.state.readOnly} 
                                    value={thiz.state['valueColumn' + i] ? thiz.state['valueColumn' + 0] : ''} key={'04-' + i}>
                                    <option value="" key={'05-' + i}>-Select value column-</option>
                                    { dataSetColumns('series-' + i) }
                                </select>
                                <Overlay target={thiz.refs['valueColumn' + i]} show={thiz.state.errors['valueColumn' + i] != null} placement="left">
                                    {props => (
                                    <Tooltip id={'valueColumn' + i + '-tooltip'} {...props} className="error-tooltip">
                                        {thiz.state.errors['valueColumn' + i]}
                                    </Tooltip>
                                    )}
                                </Overlay>
                            </div>
                            { (i === 0) && 
                            <div className="col-2" key={'08-' + i}>
                                <button type="button" className="btn btn-primary add-series-button" title="Add value series" 
                                    onClick={thiz.addValueSeries} key={'09-' + i}>
                                    <span className="fa fa-plus-square" aria-hidden="true" key={'10-' + i}></span>
                                </button>
                            </div>
                            }
                            { (i > 0) &&
                            <div className="col-2" key={'08-' + i}>
                                <button type="button" className="btn btn-primary remove-series-button" title="Remove value series" 
                                    onClick={() => thiz.removeValueSeries(i)} key={'09-' + i}>
                                    <span className="fa fa-minus-square" aria-hidden="true" key={'10-' + i}></span>
                                </button>
                            </div>
                            }
                        </div>
                        <div className="form-group row" key={'11-' + i}>
                            <label htmlFor={'valueLabel' + i} className="col-4 col-form-label form-control-sm" key={'12-' + i}>Value series label</label>
                            <div className="col-8" key={'13-' + i}>
                                <input type="text" id={'valueLabel' + i} name={'valueLabel' + i} ref={'valueLabel' + i} className="form-control form-control-sm" 
                                    onChange={thiz.inputChanged} readOnly={thiz.state.readOnly} onBlur={thiz.textFieldChanged} 
                                    value={thiz.state['valueLabel' + i] ? thiz.state['valueLabel' + i] : ''} key={'14-' + i}/>
                                <Overlay target={thiz.refs['valueLabel' + i]} show={thiz.state.errors['valueLabel' + i] != null} placement="left">
                                    {props => (
                                    <Tooltip id={'valueLabel' + i + '-tooltip'} {...props} className="error-tooltip">
                                        {thiz.state.errors['valueLabel' + i]}
                                    </Tooltip>
                                    )}
                                </Overlay>
                            </div>
                        </div>
                    </div>
                );
            }
            return valueSeriesContent;
        }

        return (
            <>
                <div className="form-group col">
                    <div className="card" id="chartPropertyBox">
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
                                            <input type="radio" name="align" value="left" autoComplete="off" 
                                                checked={this.state.align ? ((this.state.align === 'left') || (this.state.align === '')) : false} 
                                                onChange={this.selectionChanged}/> Left
                                        </label>
                                        <label className={'btn btn-info' + ((this.state.align === 'center') ? ' active' : '')}>
                                            <input type="radio" name="align" value="center" autoComplete="off" 
                                                checked={this.state.align ? (this.state.align === 'center') : false} 
                                                onChange={this.selectionChanged}/> Center
                                        </label>
                                        <label className={'btn btn-info' + ((this.state.align === 'right') ? ' active' : '')}>
                                            <input type="radio" name="align" value="right" autoComplete="off" 
                                                checked={this.state.align ? (this.state.align === 'right') : false} 
                                                onChange={this.selectionChanged}/> Right
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="chartTitle" className="col-4 col-form-label form-control-sm">Chart title</label>
                                <div className="col-8">
                                    <input type="text" id="chartTitle" name="chartTitle" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} readOnly={this.state.readOnly} onBlur={this.textFieldChanged}
                                        value={this.state.chartTitle ? this.state.chartTitle : ''}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="chartFooter" className="col-4 col-form-label form-control-sm">Chart footer</label>
                                <div className="col-8">
                                    <input type="text" id="chartFooter" name="chartFooter" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} readOnly={this.state.readOnly} onBlur={this.textFieldChanged} 
                                        value={this.state.chartFooter ? this.state.chartFooter : ''}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="categoryColumn" className="col-4 col-form-label form-control-sm">Category series column</label>
                                <div className="col-8">
                                    <select id="categoryColumn" name="categoryColumn" ref="categoryColumn" className="form-control form-control-sm" 
                                        onChange={this.selectionChanged} disabled={this.state.readOnly} 
                                        value={this.state.categoryColumn ? this.state.categoryColumn : ''}>
                                        <option value="">-Select category column-</option>
                                        { dataSetColumns('category') }
                                    </select>
                                    <Overlay target={this.refs.categoryColumn} show={this.state.errors.categoryColumn != null} placement="left">
                                        {props => (
                                        <Tooltip id="categoryColumn-tooltip" {...props} className="error-tooltip">
                                            {this.state.errors.categoryColumn}
                                        </Tooltip>
                                        )}
                                    </Overlay>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="categoryLabel" className="col-4 col-form-label form-control-sm">Category series label</label>
                                <div className="col-8">
                                    <input type="text" id="categoryLabel" name="categoryLabel" ref="categoryLabel" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} readOnly={this.state.readOnly} onBlur={this.textFieldChanged} 
                                        value={this.state.categoryLabel ? this.state.categoryLabel : ''}/>
                                    <Overlay target={this.refs.categoryLabel} show={this.state.errors.categoryLabel != null} placement="left">
                                        {props => (
                                        <Tooltip id="categoryLabel-tooltip" {...props} className="error-tooltip">
                                            {this.state.errors.categoryLabel}
                                        </Tooltip>
                                        )}
                                    </Overlay>
                                </div>
                            </div>
                            { getValueSeriesContent() }
                            <div className="form-group row">
                                <label className="form-check-label col-4 col-form-label form-control-sm" htmlFor="displayToolTip">Display tool-tip</label>
                                <div className="col-8">
                                    <input type="checkbox" id="displayToolTip" name="displayToolTip" onChange={this.selectionChanged} 
                                        disabled={this.state.readOnly} checked={this.state.displayToolTip ? this.state.displayToolTip : false}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group col">
                    <div className="card" id="chartPreviewBox">
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

