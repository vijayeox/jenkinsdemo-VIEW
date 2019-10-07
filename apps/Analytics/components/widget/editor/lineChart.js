import React from 'react';
import ReactDOM from 'react-dom';
import BaseChart from './baseChart';

class LineChart extends BaseChart {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="form-group col">
                    <div className="card" id="chartProperty">
                        <div className="card-header">
                            Line chart properties
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
                                                onChange={this.selectionChanged} disabled={this.state.readOnly}/> Left
                                        </label>
                                        <label className={'btn btn-info' + ((this.state.align === 'center') ? ' active' : '')}>
                                            <input type="radio" name="align" value="center" autoComplete="off" 
                                                checked={this.state.align ? (this.state.align === 'center') : false} onChange={this.selectionChanged} 
                                                disabled={this.state.readOnly}/> Center
                                        </label>
                                        <label className={'btn btn-info' + ((this.state.align === 'right') ? ' active' : '')}>
                                            <input type="radio" name="align" value="right" autoComplete="off" 
                                                checked={this.state.align ? (this.state.align === 'right') : false} onChange={this.selectionChanged} 
                                                disabled={this.state.readOnly}/> Right
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
                            </div>
                            <div className="form-group row">
                            </div>
                            <div className="form-group row">
                            </div>
                            <div className="form-group row">
                            </div>
                            { /* Begin add value series. */ }
                            { /* End add value series. */ }
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

export default LineChart;

