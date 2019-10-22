import React from 'react';
import ReactDOM from 'react-dom';
import {Overlay, Tooltip} from 'react-bootstrap';
import BaseChart from './baseChart';

class PieChart extends BaseChart {
    constructor(props) {
        super(props);
    }

    graphConfigurationToState = () => {
        this.setState((state) => {
            let configuration = this.state.configuration;
            //state.chartTitle = configuration.series[0].name;
            state.chartTitle = configuration.titles[0].text;
            state.categoryColumn = configuration.series[0].dataFields.category;
            state.valueColumn = configuration.series[0].dataFields.value;
            //IMPORTANT: amCharts pie chart has a bug - it does not display footer in the correct place. Therefore chart footer is not supported.
            //state.chartFooter = configuration.chartContainer.children[0].text;
            state.displayToolTip = configuration['cursor'] ? true : false;
            return state;
        });
    }
    
    stateToGraphConfiguration = () => {
        let configuration = this.state.configuration;
        configuration.series[0].name = this.state.chartTitle;
        configuration.titles[0].text = this.state.chartTitle;
        configuration.series[0].dataFields.category = this.state.categoryColumn;
        configuration.series[0].dataFields.value = this.state.valueColumn;
        //IMPORTANT: amCharts pie chart has a bug - it does not display footer in the correct place. Therefore chart footer is not supported.
        //configuration.chartContainer.children[0].text = this.state.chartFooter;
        if (this.state.displayToolTip) {
            configuration.series[0].slices.template.tooltipText = "{name}:[bold]{category} - {value}[/]";
        }
        else {
            configuration.series[0].slices.template.tooltipText = '';
        }
    }

    isUserInputValid = (field, value) => {
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

            case 'valueColumn':
                if (!value || ('' === value)) {
                    errorMessage = 'Value series column is needed';
                }
            break;
        }
        this.setErrorMessage(field, errorMessage);
        console.debug(`Input field '${field}' with value '${value}' valid? ` + !errorMessage);
        return !errorMessage;
    }

    render() {
        let thiz = this;
        function dataSetColumns() {
            let options = [];
            thiz.state.dataSetColumns.map((item, key) => {
                options.push(
                    <option value={item.value}>{item.label}</option>
                );
            });
            return options;
        }

        return (
            <>
                <div className="form-group col">
                    <div className="card" id="chartPropertyBox">
                        <div className="card-header">
                            Pie chart properties
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
                            { /* IMPORTANT: amCharts pie chart has a bug - it does not display footer in the correct place. Therefore chart footer is not supported.
                            <div className="form-group row">
                                <label htmlFor="chartFooter" className="col-4 col-form-label form-control-sm">Chart footer</label>
                                <div className="col-8">
                                    <input type="text" id="chartFooter" name="chartFooter" className="form-control form-control-sm" 
                                        onChange={this.inputChanged} readOnly={this.state.readOnly} onBlur={this.textFieldChanged} 
                                        value={this.state.chartFooter ? this.state.chartFooter : ''}/>
                                </div>
                            </div>
                            */ }
                            <div className="form-group row">
                                <label htmlFor="categoryColumn" className="col-4 col-form-label form-control-sm">Category series column</label>
                                <div className="col-8">
                                    <select id="categoryColumn" name="categoryColumn" ref="categoryColumn" className="form-control form-control-sm" 
                                        onChange={this.selectionChanged} disabled={this.state.readOnly} 
                                        value={this.state.categoryColumn ? this.state.categoryColumn : ''}>
                                        <option value="">-Select category column-</option>
                                        { dataSetColumns() }
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
                                <label htmlFor="valueColumn" className="col-4 col-form-label form-control-sm">Value series column</label>
                                <div className="col-8">
                                    <select id="valueColumn" name="valueColumn" ref="valueColumn" className="form-control form-control-sm" 
                                        onChange={this.selectionChanged} disabled={this.state.readOnly} 
                                        value={this.state.valueColumn ? this.state.valueColumn : ''}>
                                        <option value="">-Select value column-</option>
                                        { dataSetColumns() }
                                    </select>
                                    <Overlay target={this.refs.valueColumn} show={this.state.errors['valueColumn'] != null} placement="left">
                                        {props => (
                                        <Tooltip id="valueColumn-tooltip" {...props} className="error-tooltip">
                                            {this.state.errors['valueColumn']}
                                        </Tooltip>
                                        )}
                                    </Overlay>
                                </div>
                            </div>
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

export default PieChart;

