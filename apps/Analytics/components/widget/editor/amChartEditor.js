import {WidgetRenderer} from '../../../GUIComponents';
import AbstractEditor from './abstractEditor';
import React from 'react';
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';
import {Tabs, Tab, Overlay, Tooltip} from 'react-bootstrap';

class AmChartEditor extends AbstractEditor {
    constructor(props) {
        super(props);
        this.state.selectedTab = 'chart';
        this.amChart = null;
        this.ERRORS = {
            CHART_CONFIGURATION_NEEDED : 'Chart configuration is needed',
            CHART_CONFIGURATION_INVALID_JSON : 'Chart configuration JSON is invalid',
            QUERY_NEEDED : 'Query should be selected',
            EXPRESSION_INVALID_JSON : 'Expression JSON is invalid',
        };
    }

    configurationChanged = (evt) => {
        let thiz = this;
        let value = evt.target.value;
        this.setState((state) => {
            state.configuration = value;
            state.errors.configuration = ('' === value) ? thiz.ERRORS.CHART_CONFIGURATION_NEEDED : null;
            return state;
        });
        //IMPORTANT: Don't refresh chart preview when configurationChanged method is called. 
        //           It is too much to update preview for every key stroke when the user is typing the configuration.
        //           Therefore chart preview is updated when the configuration field loses focus OR when the "chart" tab comes back to focus.
    }

    expressionBlurred = (evt) => {
        if (this.validateExpression()) {
            this.loadData(this.refreshQueryPreview());
        }
    }

    refreshChartPreview = () => {
        let cardBody = document.querySelector('div#previewBox div.card-body');
        let errorMessage = null;
        try {
            //Make sure chart configuratio is valid JSON
            let jsonChartConfiguration = JSON.parse(this.state.configuration);
            let previewElement = document.querySelector('div#chartPreview');
            previewElement.style.height = (cardBody.offsetHeight - 40) + 'px'; //-40px for border and margin around preview area.
            try {
                this.amChart = WidgetRenderer.renderAmCharts(previewElement, jsonChartConfiguration, this.data);
            }
            catch(renderError) {
                console.error(renderError);
                errorMessage = '' + renderError;
            }
        }
        catch(jsonParseError) {
            console.error(jsonParseError);
            errorMessage = this.ERRORS.CHART_CONFIGURATION_INVALID_JSON;
        }

        this.setState((state) => {
            state.errors.configuration = state.readOnly ? null : errorMessage;
            return state;
        });
    }

    refreshQueryPreview = () => {
        let cardBody = document.querySelector('div#previewBox div.card-body');
        let textArea = document.querySelector('textarea#queryPreviewText');
        textArea.style.height = (cardBody.offsetHeight - 40) + 'px'; //-40px for border and margin around textarea.
        let value = '';
        if (this.data) {
            value = JSON.stringify(this.data, null, '    ');
        }
        textArea.value = value;
    }

    isChartTabValid = (state, setErrorState = true) => {
        let isValid = true;

        let configuration = state.configuration;
        let errorMessage = null;
        if ('' === configuration) {
            isValid = false;
            errorMessage = this.ERRORS.CHART_CONFIGURATION_NEEDED;
        }
        else {
            try {
                //Make sure chart configuratio is valid JSON
                JSON.parse(configuration);
            }
            catch(jsonParseError) {
                isValid = false;
                console.error(jsonParseError);
                errorMessage = this.ERRORS.CHART_CONFIGURATION_INVALID_JSON;
            }
        }

        if (setErrorState) {
            state.errors.configuration = state.readOnly ? null : errorMessage;
        }
        return isValid;
    }

    isQueryTabValid = (state, setErrorState = true) => {
        let queryErrors = state.errors.queries;
        let queries = state.queries;
        let isValid = true;
        for (let i=0; i < queries.length; i++) {
            if (queries[i].uuid === '') {
                if (setErrorState) {
                    queryErrors[i] = state.readOnly ? null : this.ERRORS.QUERY_NEEDED;
                }
                isValid = false;
            }
        }
        return isValid;
    }

    isExpressionTabValid = (state, setErrorState = true) => {
        let isValid = true;
        let errorMessage = null;
        let expression = state.expression;
        if (expression) {
            try {
                //Make sure expression is valid JSON
                JSON.parse(expression);
            }
            catch(jsonParseError) {
                isValid = false;
                console.error(jsonParseError);
                errorMessage = this.ERRORS.EXPRESSION_INVALID_JSON;
            }
        }

        if (setErrorState) {
            state.errors.expression = errorMessage;
        }

        return isValid;
    }

    areAllFieldsValid = () => {
        function findInvalidTab(tabs) {
            let foundTab = null;
            tabs.forEach(function(tab) {
                let tabName = Object.keys(tab)[0];
                if (!tab[tabName]) {
                    foundTab = tabName;
                }
            });
            return foundTab;
        }

        let isChartTabValid = this.isChartTabValid(this.state, false);
        let isQueryTabValid = this.isQueryTabValid(this.state, false);
        let isExpressionTabValid = this.isExpressionTabValid(this.state, false);
        let thiz = this;
        let switchToTab = null;
        switch(this.state.selectedTab) {
            case 'chart':
                if (!isChartTabValid) {
                    this.setState((state) => {
                        thiz.isChartTabValid(state);
                    });
                }
                else {
                    switchToTab = findInvalidTab([{'query':isQueryTabValid}, {'expression':isExpressionTabValid}]);
                }
            break;
            case 'query':
                if (!isQueryTabValid) {
                    this.setState((state) => {
                        thiz.isQueryTabValid(state);
                    });
                }
                else {
                    switchToTab = findInvalidTab([{'expression':isExpressionTabValid}, {'chart':isChartTabValid}]);
                }
            break;
            case 'expression':
                if (!isExpressionTabValid) {
                    this.setState((state) => {
                        thiz.isExpressionTabValid(state);
                    });
                }
                else {
                    switchToTab = findInvalidTab([{'chart':isChartTabValid}, {'query':isQueryTabValid}]);
                }
            break;
        }
        if (switchToTab) {
            this.configurationTabSelected(switchToTab, null);
        }
        return (isChartTabValid && isQueryTabValid && isExpressionTabValid);
    }

    configurationTabSelected = (eventKey, event) => {
        if (eventKey != 'chart') {
            if (this.amChart) {
                this.amChart.dispose();
                this.amChart = null;
            }
        }
        let cardBody = null;
        let textArea = null;
        switch(eventKey) {
            case 'chart':
                cardBody = document.querySelector('div#propertyBox div.card-body');
                textArea = document.querySelector('textarea#configuration');
                textArea.style.height = (cardBody.offsetHeight - 80) + 'px'; //-80px for border and margin around textarea.
            break;
            case 'expression':
                cardBody = document.querySelector('div#propertyBox div.card-body');
                textArea = document.querySelector('textarea#expression');
                textArea.style.height = (cardBody.offsetHeight - 80) + 'px'; //-80px for border and margin around textarea.
            break;
        }

        let thiz = this;
        this.clearAllErrors().then(function() {
            thiz.setState((state) => {
                state.selectedTab = eventKey;
                switch(eventKey) {
                    case 'chart':
                        thiz.isChartTabValid(state);
                    break;
                    case 'query':
                        thiz.isQueryTabValid(state);
                    break;
                    case 'expression':
                        thiz.isExpressionTabValid(state);
                    break;
                }
                return state;
            },
            () => {
                switch(eventKey) {
                    case 'chart':
                        thiz.refreshChartPreview();
                    break;
                    case 'query':
                    case 'expression':
                        thiz.refreshQueryPreview();
                    break;
                }
            });
        });
    }

    componentWillUnmount() {
        if (this.amChart) {
            this.amChart.dispose();
            this.amChart = null;
        }
    }

    componentDidMount() {
        let thiz = this;
        this.loadQueries(function() {
            thiz.configurationTabSelected('chart');
        });
    }

    render() {
        let thiz = this;

        function getQuerySelectOptoins(keyPrefix) {
            let i=0;
            let options = [<option value="" key={keyPrefix + '00000000-0000-0000-0000-000000000000'}>-Select query-</option>];
            thiz.queryList.map((item, index) => {
                options.push(<option key={keyPrefix + item.uuid} value={item.uuid}>{item.name}</option>);
            });
            return options;
        };

        function getQuerySelections() {
            let querySelections = [];
            let count = thiz.state.queries.length;
            if (0 === count) {
                thiz.addQueryToGivenState(thiz.state, null); //Render at least one query selection box.
                count = 1;
            }
            for (let i=0; i < count; i++) {
                querySelections.push(
                    <div className="form-group row" key={'qs-00-' + i}>
                        <div className="col-7" key={'qs-01-' + i}>
                            <select id={'query' + i} name={'query' + i} ref={'query' + i} className="form-control form-control-sm" 
                                onChange={(e) => {thiz.querySelectionChanged(e, i)}} disabled={thiz.state.readOnly} 
                                value={thiz.state.queries[i] ? thiz.state.queries[i].uuid : ''} key={'qs-02-' + i}>
                                { getQuerySelectOptoins('qs-03-' + i) }
                            </select>
                            <Overlay id={'query-overlay' + i} target={thiz.refs['query' + i]} show={thiz.state.errors.queries[i] != null} placement="right">
                                {props => (
                                <Tooltip id={'query-' + i + '-tooltip'} {...props} className="error-tooltip">
                                    {thiz.state.errors.queries[i]}
                                </Tooltip>
                                )}
                            </Overlay>
                        </div>
                        <div className="col-1" key={'qs-04-' + i}>
                            <button type="button" className="btn btn-primary query-customization-button filter-query-button" title="Apply filter to query" 
                                onClick={() => thiz.applyFilterToQuery(i)} key={'qs-05-' + i} 
                                disabled={thiz.state.queries[i] ? (thiz.state.queries[i].uuid ? false : true) : true}>
                                <span className="fa fa-filter" aria-hidden="true" key={'qs-06-' + i}></span>
                            </button>
                        </div>
                        <div className="col-1" key={'qs-07-' + i}>
                            <button type="button" className="btn btn-primary query-customization-button group-query-button" title="Apply grouping to query" 
                                onClick={() => thiz.applyGroupingToQuery(i)} key={'qs-08-' + i}
                                disabled={thiz.state.queries[i] ? (thiz.state.queries[i].uuid ? false : true) : true}>
                                <span className="fa fa-users" aria-hidden="true" key={'qs-09-' + i}></span>
                            </button>
                        </div>
                        <div className="col-1" key={'qs-10-' + i}>
                            <button type="button" className="btn btn-primary query-customization-button sort-query-button" title="Sort query result" 
                                onClick={() => thiz.applySortingToQuery(i)} key={'qs-11-' + i}
                                disabled={thiz.state.queries[i] ? (thiz.state.queries[i].uuid ? false : true) : true}>
                                <span className="fa fa-sort" aria-hidden="true" key={'qs-12-' + i}></span>
                            </button>
                        </div>
                        {(thiz.state.queries.length > 1) && 
                            <div className="col-1" key={'qs-13-' + i}>
                                <button type="button" className="btn btn-primary query-customization-button delete-query-button" title="Delete query" 
                                    onClick={() => thiz.deleteQuery(i)} key={'qs-14-' + i} disabled={thiz.state.readOnly}>
                                    <span className="fa fa-minus" aria-hidden="true" key={'qs-15-' + i}></span>
                                </button>
                            </div>
                        }
                    </div>
                );
            }
            return querySelections;
        }

        return (
            <>
                <div className="form-group col">
                    <div className="card" id="propertyBox">
                        <div className="card-header">
                            Configuration
                        </div>
                        <div className="card-body">
                            <div className="form-group row" style={{marginBottom:'0px'}}>
                                <Tabs activeKey={this.state.selectedTab} onSelect={this.configurationTabSelected}>
                                    <Tab eventKey="chart" title="Chart">
                                        <div className="form-group row" style={{marginLeft:'0px', marginRight:'0px'}}>
                                            <div className="col-12 no-left-padding no-right-padding">
                                                <textarea id="configuration" name="configuration"  ref="configuration" 
                                                    className="form-control form-control-sm" style={{fontFamily:'Monospace'}} 
                                                    onChange={this.configurationChanged} value={this.state.configuration} 
                                                    onBlur={this.refreshChartPreview} disabled={this.state.readOnly}/>
                                                <Overlay id="configuration-overlay" target={this.refs.configuration} 
                                                    show={this.state.errors.configuration != null} placement="top">
                                                    {props => (
                                                    <Tooltip id="configuration-tooltip" {...props} className="error-tooltip">
                                                        {this.state.errors.configuration}
                                                    </Tooltip>
                                                    )}
                                                </Overlay>
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="query" title="Query">
                                        <br/>
                                        { getQuerySelections() }
                                        <div className="col-1" style={{paddingLeft:'0px'}}>
                                            <button type="button" className="btn btn-primary add-query-button" title="Add query" 
                                                onClick={() => this.addQuery()} disabled={this.state.readOnly}>
                                                <span className="fa fa-plus" aria-hidden="true"></span>
                                            </button>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="expression" title="Expression">
                                        <div className="form-group row" style={{marginLeft:'0px', marginRight:'0px'}}>
                                            <div className="col-12 no-left-padding no-right-padding">
                                                <textarea id="expression" name="expression"  ref="expression" 
                                                    className="form-control form-control-sm" style={{fontFamily:'Monospace'}} 
                                                    onChange={this.expressionChanged} value={this.state.expression} 
                                                    onBlur={this.expressionBlurred} disabled={this.state.readOnly}/>
                                                <Overlay id="expression-overlay" target={this.refs.expression} 
                                                    show={this.state.errors.expression != null} placement="top">
                                                    {props => (
                                                    <Tooltip id="expression-tooltip" {...props} className="error-tooltip">
                                                        {this.state.errors.expression}
                                                    </Tooltip>
                                                    )}
                                                </Overlay>
                                            </div>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group col">
                    <div className="card" id="previewBox">
                        <div className="card-header">
                            Preview
                        </div>
                        <div className="card-body">
                            {(this.state.selectedTab === 'chart') && 
                                <div id="chartPreview">
                                    <b>Chart preview</b>
                                </div>
                            }
                            {((this.state.selectedTab === 'query') || (this.state.selectedTab === 'expression')) && 
                                <div id="queryPreview">
                                    <textarea id="queryPreviewText" name="queryPreviewText" 
                                        className="form-control form-control-sm" style={{fontFamily:'Monospace'}} 
                                        value="" disabled={true}/>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default AmChartEditor;

