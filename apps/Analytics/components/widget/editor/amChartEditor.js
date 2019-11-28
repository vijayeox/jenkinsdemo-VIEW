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
            configuration: '',
            errors:{
                configuration:null,
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
        //IMPORTANT: query object in the array this.state.queries is a mixed mode object.
        //    query.uuid, query.configuration are objects. JSON data in query.configuration.filter,
        //    query.configuration.grouping and query.configuration.sort are JSON strings coming from 
        //    form fields. Here we convert those JSON strings to java objects.
        let queries = [];
        if (this.state.queries) {
            this.state.queries.forEach(function(query, index) {
                let configuration = query['configuration'];
                queries.push({
                    'uuid':query['uuid'],
                    'configuration':{
                        'filter': configuration.filter ? JSON.parse(configuration.filter) : null,
                        'grouping': configuration.grouping ? JSON.parse(configuration.grouping) : null,
                        'sort': configuration.sort ? JSON.parse(configuration.sort) : null
                    }
                });
            });
        }
        
        return {
            configuration:JSON.parse(this.state.configuration),
            queries:queries
        }
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

    querySelectionChanged = (evt, index) => {
        let thiz = this;
        let value = evt.target.value;
        this.setState((state) => {
            let queryObject = state.queries[index];
            queryObject.uuid = value;
            queryObject.configuration.filter = '';
            queryObject.configuration.grouping = '';
            queryObject.configuration.sort = '';
            state.errors.queries[index] = (value === '') ? thiz.ERRORS.QUERY_NEEDED : null;
            return state;
        },
        () => {
            thiz.refreshQueryPreview();
        });
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

    setWidgetData = (widgetData) => {
        this.data = widgetData.data;
        let queries = [];
        if (widgetData.queries) {
            widgetData.queries.forEach(function(query, index) {
                let configuration = query.configuration;
                queries.push({
                    'uuid':query.uuid,
                    'configuration':{
                        'filter': configuration.filter ? JSON.stringify(configuration.filter, null, '    ') : '',
                        'grouping': configuration.grouping ? JSON.stringify(configuration.grouping, null, '') : '',
                        'sort': configuration.sort ? JSON.stringify(configuration.sort, null, '') : ''
                    }
                });
            });
        }
        this.setState((state) => {
            state.configuration = widgetData.configuration ? JSON.stringify(widgetData.configuration, null, '    ') : '';
            state.queries = queries;
            return state;
        });
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
        return (isChartTabValid && isQueryTabValid);
    }

    isChartTabValid = (state, setErrorState = true) => {
        let isValid = true;

        let configuration = this.state.configuration;
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

    clearAllErrors = () => {
        var thiz = this;
        return new Promise((resolve) => {
            thiz.setState((state) => {
                state.errors.configuration = null;
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
        if (eventKey === 'chart') {
            let cardBody = document.querySelector('div#propertyBox div.card-body');
            let textArea = document.querySelector('textarea#configuration');
            textArea.style.height = (cardBody.offsetHeight - 80) + 'px'; //-80px for border and margin around textarea.
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
                    let value = query.configuration.filter;
                    let inputbox = element.querySelector('textarea');
                    inputbox.value = value ? value : '';
                    inputbox.disabled = thiz.state.readOnly;
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
                    state.queries[index].configuration.filter = (result.value === '') ? null : result.value;
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
            input: 'text',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            onOpen:function(element) {
                let query = thiz.state.queries[index];
                if (query) {
                    let value = query.configuration.grouping;
                    let inputbox = element.querySelector('input[type="text"]');
                    inputbox.value = value ? value : '';
                    inputbox.disabled = thiz.state.readOnly;
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
                    state.queries[index].configuration.grouping = (result.value === '') ? null : result.value;
                    return state;
                },
                () => {
                    thiz.refreshQueryPreview();
                });
            }
        });
    }

    applySortingToQuery = (index) => {
        let thiz = this;
        Swal.fire({
            title: 'Query sorting',
            input: 'text',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            onOpen:function(element) {
                let query = thiz.state.queries[index];
                if (query) {
                    let value = query.configuration.sort;
                    let inputbox = element.querySelector('input[type="text"]');
                    inputbox.value = value ? value : '';
                    inputbox.disabled = thiz.state.readOnly;
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
                    state.queries[index].configuration.sort = (result.value === '') ? null : result.value;
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
            uuid: value ? value : '', 
            configuration: {
                filter:'', 
                grouping:'',
                sort:''
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

    loadData = () => {
        let thiz = this;
        let params = {
            'queries':this.queries
        };
        window.postDataRequest('analytics/query/data', params).
            then(function(responseData) {
                thiz.data = responseData.data;
            }).
            catch(function(responseData) {
                console.error('Could not load data.');
                console.error(responseData);
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Could not load data. Please try after some time.'
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
        window.postDataRequest('analytics/query').
            then(function(response) {
                thiz.queryList = response.data;
                thiz.forceUpdate();
                thiz.configurationTabSelected('chart');
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

