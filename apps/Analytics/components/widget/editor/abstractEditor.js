
import React from 'react';
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';

class AbstractEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: null,
            readOnly: true,
            queries: [],
            configuration: '',
            expression: '',
            errors:{
                configuration:null,
                expression: null,
                queries: []
            }
        };
        this.queryList = [];
        this.data = null;
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
                        'filter': configuration ? (configuration.filter ? JSON.parse(configuration.filter) : null) : null,
                        'grouping': configuration ? (configuration.grouping ? JSON.parse(configuration.grouping) : null) : null,
                        'sort': configuration ? (configuration.sort ? JSON.parse(configuration.sort) : null) : null
                    }
                });
            });
        }
        
        return {
            configuration:this.state.configuration ? JSON.parse(this.state.configuration) : null,
            expression:this.state.expression ? JSON.parse(this.state.expression) : null,
            queries:queries
        }
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
        var thiz = this;
        this.setState((state) => {
            state.configuration = widgetData.configuration ? JSON.stringify(widgetData.configuration, null, '    ') : '';
            state.expression = widgetData.expression ? JSON.stringify(widgetData.expression, null, '    ') : '';
            state.queries = queries;
            return state;
        }, 
        () => {
            thiz.refreshViews();
        });
    }

    makeReadOnly = (flag) => {
        this.setState({
            readOnly:flag
        });
    }

    configurationChanged = (evt) => {
        let value = evt.target.value;
        this.setState({
            configuration : value
        });
    }

    expressionChanged = (evt) => {
        let value = evt.target.value;
        this.setState({
            expression : value
        });
    }

    validateExpression = () => {
        let expression = this.state.expression;
        if (!expression || (expression === '')) {
            return;
        }

        let errorMessage = null;
        try {
            JSON.parse(expression);
        }
        catch(jsonParseError) {
            errorMessage = this.ERRORS.EXPRESSION_INVALID_JSON;
        }

        this.setState((state) => {
            state.errors.expression = errorMessage;
            return state;
        });
        return errorMessage ? false : true;
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
            thiz.loadData(thiz.refreshQueryPreview());
        });
    }

    clearAllErrors = () => {
        var thiz = this;
        return new Promise((resolve) => {
            thiz.setState((state) => {
                state.errors.configuration = null;
                state.errors.expression = null;
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
                    thiz.loadData(thiz.refreshQueryPreview());
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
                    thiz.loadData(thiz.refreshQueryPreview());
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
                    thiz.loadData(thiz.refreshQueryPreview());
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
        },
        () => {
            thiz.loadData(thiz.refreshQueryPreview());
        });
    }

    loadData = (postLoadCallback) => {
        let thiz = this;
        let params = {
            'queries':this.state.queries
        };
        window.postDataRequest('analytics/query/data', params).
            then(function(responseData) {
                thiz.data = responseData.query.data;
                if (postLoadCallback) {
                    postLoadCallback();
                }
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

    loadQueries = (postLoadCallback) => {
        let thiz = this;
        window.postDataRequest('analytics/query').
            then(function(response) {
                thiz.queryList = response.data;
                thiz.forceUpdate();
                if (postLoadCallback) {
                    postLoadCallback();
                }
            }).
            catch(function(response) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Failed to load queries. Please try after some time.'
                });
            });
    }
}

export default AbstractEditor;
