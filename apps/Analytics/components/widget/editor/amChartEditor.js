import WidgetRenderer from '../../widgetRenderer';
import React from 'react';
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';
import {Tabs, Tab, Overlay, Tooltip} from 'react-bootstrap';

class AmChartEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'chart',
            readOnly: true,
            queries: [],
            chartConfiguration: '',
            errors:{
                chartConfiguration:null,
                queries: []
            }
        };
        this.queryList = [];
        this.data = null;
        this.amChart = null;
        this.ERRORS = {
            CHART_CONFIGURATION_NEEDED : 'Chart configuration is needed',
            CHART_CONFIGURATION_INVALID_JSON : 'Chart configuration JSON is invalid',
            QUERY_NEEDED : 'Query should be selected'
        };
    }

    getState = () => {
        return {
            configuration:this.state.chartConfiguration,
            queries:this.state.queries
        }
    }

    chartConfigurationChanged = (evt) => {
        let thiz = this;
        let value = evt.target.value;
        this.setState((state) => {
            state.chartConfiguration = value;
            state.errors.chartConfiguration = ('' === value) ? thiz.ERRORS.CHART_CONFIGURATION_NEEDED : null;
            return state;
        });
        //IMPORTANT: Don't refresh chart preview when chartConfigurationChanged method is called. 
        //           It is too much to update preview for every key stroke when the user is typing the configuration.
        //           Therefore chart preview is updated when the configuration field loses focus OR when the "chart" tab comes back to focus.
    }

    querySelectionChanged = (evt, index) => {
        let thiz = this;
        let value = evt.target.value;
        this.setState((state) => {
            let queryObject = state.queries[index];
            queryObject.query = value;
            queryObject.configuration.filter = '';
            queryObject.configuration.grouping = '';
            state.errors.queries[index] = (value === '') ? thiz.ERRORS.QUERY_NEEDED : null;
            return state;
        },
        () => {
            thiz.refreshQueryPreview();
        });
    }

    refreshChartPreview = () => {
        let errorMessage = null;
        try {
            //Make sure chart configuratio is valid JSON
            let jsonChartConfiguration = JSON.parse(this.state.chartConfiguration);
            let previewElement = document.querySelector('div#chartPreview');
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
            state.errors.chartConfiguration = state.readOnly ? null : errorMessage;
            return state;
        });
    }

    refreshQueryPreview = () => {
        let previewElement = document.querySelector('div#queryPreview');
        previewElement.innerHTML = '' + new Date();
    }

    setWidgetData = (data) => {
        this.data = data;
    }

    setWidgetQueries = (queries) => {
        //TODO: Method body
    }

    makeReadOnly = (flag) => {
        this.setState({
            readOnly:flag
        });
    }

    areAllFieldsValid = () => {
        let isChartTabValid = this.isChartTabValid(this.state, false);
        let isQueryTabValid = this.isQueryTabValid(this.state, false);
        let thiz = this;
        switch(this.state.selectedTab) {
            case 'chart':
                if (isChartTabValid && !isQueryTabValid) {
                    this.configurationTabSelected('query', null);
                }
                else {
                    this.setState((state) => {
                        thiz.isChartTabValid(state);
                    });
                }
            break;
            case 'query':
                if (isQueryTabValid && !isChartTabValid) {
                    this.configurationTabSelected('chart', null);
                }
                else {
                    this.setState((state) => {
                        thiz.isQueryTabValid(state);
                    });
                }
            break;
        }
        return !(chartTabHasErrors || queryTabHasErrors);
    }

    isChartTabValid = (state, setErrorState = true) => {
        let isValid = true;

        let chartConfiguration = this.state.chartConfiguration;
        let errorMessage = null;
        if ('' === chartConfiguration) {
            isValid = false;
            errorMessage = this.ERRORS.CHART_CONFIGURATION_NEEDED;
        }
        else {
            try {
                //Make sure chart configuratio is valid JSON
                JSON.parse(chartConfiguration);
            }
            catch(jsonParseError) {
                isValid = false;
                console.error(jsonParseError);
                errorMessage = this.ERRORS.CHART_CONFIGURATION_INVALID_JSON;
            }
        }

        if (setErrorState) {
            this.setState((state) => {
                state.errors.chartConfiguration = state.readOnly ? null : errorMessage;
                return state;
            });
        }
        return isValid;
    }

    isQueryTabValid = (state, setErrorState = true) => {
        let queryErrors = state.errors.queries;
        let queries = state.queries;
        let isValid = true;
        for (let i=0; i < queries.length; i++) {
            if (queries[i].query === '') {
                if (setErrorState) {
                    queryErrors[i] = state.readOnly ? null : this.ERRORS.QUERY_NEEDED;
                }
                isValid = false;
            }
        }
        return isValid;
    }

    clearAllErrors = () => {
        var thiz = this;
        return new Promise((resolve) => {
            thiz.setState((state) => {
                state.errors.chartConfiguration = null;
                let queryErrors = state.errors.queries;
                for (let i=0; i < queryErrors.length; i++) {
                    queryErrors[i] = null;
                }
                return state;
            },
            () => {
                resolve();
            });
        });
    }

    configurationTabSelected = (eventKey, event) => {
        if (eventKey != 'chart') {
            if (this.amChart) {
                this.amChart.dispose();
                this.amChart = null;
            }
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
                }
                return state;
            },
            () => {
                switch(eventKey) {
                    case 'chart':
                        thiz.refreshChartPreview();
                    break;
                    case 'query':
                        thiz.refreshQueryPreview();
                    break;
                }
            });
        });
    }

    applyFilterToQuery = (index) => {
        let thiz = this;
        Swal.fire({
            title: 'Query filter',
            input: 'textarea',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            onOpen:function(element) {
                let query = thiz.state.queries[index];
                if (query) {
                    element.querySelector('textarea').value = query.configuration.filter;
                }
            },
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value === '') {
                        resolve();
                    }
                    else {
                        try {
                            //Parse to ensure JSON is valid.
                            JSON.parse(value);
                            resolve();
                        }
                        catch(error) {
                            resolve('Invalid JSON');
                        }
                    }
                });
            }
        }).then((result) => {
            if (!result.dismiss) {
                thiz.setState((state) => {
                    state.queries[index].configuration.filter = result.value;
                    return state;
                },
                () => {
                    thiz.refreshQueryPreview();
                });
            }
        });
    }

    applyGroupingToQuery = (index) => {
        let thiz = this;
        Swal.fire({
            title: 'Query column grouping',
            input: 'textarea',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            onOpen:function(element) {
                let query = thiz.state.queries[index];
                if (query) {
                    element.querySelector('textarea').value = query.configuration.grouping;
                }
            },
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value === '') {
                        resolve();
                    }
                    else {
                        try {
                            //Parse to ensure JSON is valid.
                            JSON.parse(value);
                            resolve();
                        }
                        catch(error) {
                            resolve('Invalid JSON');
                        }
                    }
                });
            }
        }).then((result) => {
            if (!result.dismiss) {
                thiz.setState((state) => {
                    state.queries[index].configuration.grouping = result.value;
                    return state;
                },
                () => {
                    thiz.refreshQueryPreview();
                });
            }
        });
    }

    addQueryToGivenState = (state, value) => {
        state.queries.push({
            query: value ? value : '', 
            configuration: {
                filter:'', 
                grouping:''
            }
        });
        state.errors.queries.push(null);
    }

    addQuery = (value) => {
        let thiz = this;
        this.setState((state) => {
            thiz.addQueryToGivenState(state, value);
            return state;
        });
    }

    deleteQuery = (index) => {
        let thiz = this;
        this.setState((state) => {
            state.queries.splice(index, 1);
            state.errors.queries.splice(index, 1);
            return state;
        });
    }

    componentDidMount() {
        let thiz = this;
        window.postDataRequest('analytics/query').
            then(function(response) {
                thiz.queryList = response.data;
                thiz.forceUpdate();
            }).
            catch(function(response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Failed to load queries. Please try after some time.'
                });
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
                        <div className="col-8" key={'qs-01-' + i}>
                            <select id={'query' + i} name={'query' + i} ref={'query' + i} className="form-control form-control-sm" 
                                onChange={(e) => {thiz.querySelectionChanged(e, i)}} disabled={thiz.state.readOnly} 
                                value={thiz.state.queries[i] ? thiz.state.queries[i].query : ''} key={'qs-02-' + i}>
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
                            <button type="button" className="btn btn-primary filter-query-button" title="Apply filter to query" 
                                onClick={() => thiz.applyFilterToQuery(i)} key={'qs-05-' + i} 
                                disabled={thiz.state.readOnly || (thiz.state.queries[i] ? (thiz.state.queries[i].query ? false : true) : true)}>
                                <span className="fa fa-filter" aria-hidden="true" key={'qs-06-' + i}></span>
                            </button>
                        </div>
                        <div className="col-1" key={'qs-07-' + i}>
                            <button type="button" className="btn btn-primary group-query-button" title="Apply grouping to query" 
                                onClick={() => thiz.applyGroupingToQuery(i)} key={'qs-08-' + i}
                                disabled={thiz.state.readOnly || (thiz.state.queries[i] ? (thiz.state.queries[i].query ? false : true) : true)}>
                                <span className="fa fa-users" aria-hidden="true" key={'qs-09-' + i}></span>
                            </button>
                        </div>
                        {(thiz.state.queries.length > 1) && 
                            <div className="col-1" key={'qs-10-' + i}>
                                <button type="button" className="btn btn-primary delete-query-button" title="Delete query" 
                                    onClick={() => thiz.deleteQuery(i)} key={'qs-11-' + i} disabled={thiz.state.readOnly}>
                                    <span className="fa fa-minus" aria-hidden="true" key={'qs-12-' + i}></span>
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
                                                <br/>
                                                <textarea id="chartConfiguration" name="chartConfiguration"  ref="chartConfiguration" 
                                                    className="form-control form-control-sm" style={{height:'260px', fontFamily:'Monospace'}} 
                                                    onChange={this.chartConfigurationChanged} value={this.state.chartConfiguration} 
                                                    onBlur={this.refreshChartPreview} disabled={this.state.readOnly}/>
                                                <Overlay id="chartConfiguration-overlay" target={this.refs.chartConfiguration} 
                                                    show={this.state.errors.chartConfiguration != null} placement="top">
                                                    {props => (
                                                    <Tooltip id="chartConfiguration-tooltip" {...props} className="error-tooltip">
                                                        {this.state.errors.chartConfiguration}
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
                            {(this.state.selectedTab === 'query') && 
                                <div id="queryPreview">
                                    <b>Query preview</b>
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

