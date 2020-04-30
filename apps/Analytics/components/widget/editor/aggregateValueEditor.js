import {WidgetRenderer} from '../../../GUIComponents';
import AbstractEditor from './abstractEditor';
import React from 'react';
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';
import {Tabs, Tab, Overlay, Tooltip} from 'react-bootstrap';
import Select from 'react-select'
class AggregateValueEditor extends AbstractEditor {
    constructor(props) {
        super(props);
        this.state.selectedTab = 'widget';
        this.ERRORS = {
            WIDGET_CONFIGURATION_INVALID_JSON : 'Widget configuration JSON is invalid',
            QUERY_NEEDED : 'Query should be selected',
            EXPRESSION_INVALID_JSON : 'Expression JSON is invalid'
        };
    }

    expressionBlurred = (evt) => {
        if (this.validateExpression()) {
            this.loadData(this.refreshQueryPreview());
        }
    }

    refreshWidgetPreview = () => {
        let cardBody = document.querySelector('div#previewBox div.card-body');
        let errorMessage = null;

        //Make sure widget configuratio is valid JSON
        let configuration = this.state.configuration;
        let jsonWidgetConfiguration = null;
        if (!configuration || ('' === configuration)) {
            jsonWidgetConfiguration = {}; //Empty configuration.
        }
        else {
            try {
                jsonWidgetConfiguration = JSON.parse(configuration);
            }
            catch(jsonParseError) {
                console.error(jsonParseError);
                errorMessage = this.ERRORS.WIDGET_CONFIGURATION_INVALID_JSON;
            }
        }

        //Render the preview.
        let previewElement = document.querySelector('div#widgetPreview');
        previewElement.style.height = (cardBody.offsetHeight - 40) + 'px'; //-40px for border and margin around preview area.
        try {
            let props = {}; //Props is the property list to override things like widget title, footer etc.
            WidgetRenderer.renderAggregateValue(previewElement, jsonWidgetConfiguration, props, this.data);
        }
        catch(renderError) {
            console.error(renderError);
            errorMessage = '' + renderError;
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
            value = '' + JSON.stringify(this.data); //Append to string to convert the value to string if at all it is a number.
        }
        textArea.value = value;
    }

    refreshViews = () => {
        //Nothing to do for now. Implement this method to refresh the widget display if there is
        //display/view update problem when the widget selection is changed in editor.
    }

    isWidgetTabValid = (state, setErrorState = true) => {
        let isValid = true;
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
        //If expression is invalid
        //state.errors.expression = this.ERRORS.EXPRESSION_INVALID_JSON;
        //isValid = false;
        return isValid;
    }

    isExpressionTabValid = (state, setErrorState = true) => {
        let isValid = true;
        let errorMessage = null;
        let expression = state.expression;
        if (expression && (expression !== '')) {
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

        let isWidgetTabValid = this.isWidgetTabValid(this.state, false);
        let isQueryTabValid = this.isQueryTabValid(this.state, false);
        let isExpressionTabValid = this.isExpressionTabValid(this.state, false);
        let thiz = this;
        let switchToTab = null;
        switch(this.state.selectedTab) {
            case 'widget':
                if (!isWidgetTabValid) {
                    this.setState((state) => {
                        thiz.isWidgetTabValid(state);
                    });
                }
                else {
                    switchToTab = findInvalidTab([{'widget':isWidgetTabValid}, {'expression':isExpressionTabValid}]);
                }
            break;
            case 'query':
                if (!isQueryTabValid) {
                    this.setState((state) => {
                        thiz.isQueryTabValid(state);
                    });
                }
                else {
                    switchToTab = findInvalidTab([{'expression':isExpressionTabValid}, {'widget':isWidgetTabValid}]);
                }
            break;
            case 'expression':
                if (!isExpressionTabValid) {
                    this.setState((state) => {
                        thiz.isExpressionTabValid(state);
                    });
                }
                else {
                    switchToTab = findInvalidTab([{'widget':isWidgetTabValid}, {'query':isQueryTabValid}]);
                }
            break;
        }
        if (switchToTab) {
            this.configurationTabSelected(switchToTab, null);
        }
        return (isWidgetTabValid && isQueryTabValid && isExpressionTabValid);
    }

    configurationTabSelected = (eventKey, event) => {
        let cardBody = null;
        let textArea = null;
        switch(eventKey) {
            case 'widget':
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
                    case 'widget':
                        thiz.isWidgetTabValid(state);
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
                    case 'widget':
                        thiz.refreshWidgetPreview();
                    break;
                    case 'query':
                    case 'expression':
                        thiz.refreshQueryPreview();
                    break;
                }
            });
        });
    }
    refreshPreview(){
        if (this.state.selectedTab === 'widget') {
            this.refreshWidgetPreview();
        }
        else if(this.state.selectedTab ==='query')
        {
            this.refreshQueryPreview()
        }
        else if(this.state.selectedTab === 'expression')
        {
            this.expressionBlurred()
        }
    }
    componentDidMount() {
        let thiz = this;
        this.loadQueries(function() {
            thiz.configurationTabSelected('widget');
        });
    }

    render() {
        let thiz = this;

        function getQuerySelectOptoins(keyPrefix) {
            let i=0;
            let options = [<option value="" key={keyPrefix + '00000000-0000-0000-0000-000000000000'}>-Select query-</option>];
            thiz.queryList.map((item, index) => {
                 // options.push(<option key={keyPrefix + item.uuid} value={item.uuid}>{item.name}</option>);
                 options.push({value:item.uuid,label:item.name})
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
                        <Select
                             key={'qs-02-' + i}
                             id={'query' + i} 
                             name={'query' + i}
                             ref={'query' + i}
                             onChange={(e) => { thiz.querySelectionChanged(e, i) }}
                             isDisabled={thiz.state.readOnly}
                             value={thiz.state.queries[i] ? getQuerySelectOptoins('qs-03-' + i).filter(
                                option => option.value == thiz.state.queries[i]['uuid']
                              ) : ''}
                            options={getQuerySelectOptoins('qs-03-' + i)}
                            />
                            {/* <select id={'query' + i} name={'query' + i} ref={'query' + i} className="form-control form-control-sm" 
                                onChange={(e) => {thiz.querySelectionChanged(e, i)}} disabled={thiz.state.readOnly} 
                                value={thiz.state.queries[i] ? thiz.state.queries[i].uuid : ''} key={'qs-02-' + i}>
                                { getQuerySelectOptoins('qs-03-' + i) }
                            </select> */}
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
                                    <Tab eventKey="widget" title="Widget">
                                        <div className="form-group row" style={{marginLeft:'0px', marginRight:'0px'}}>
                                            <div className="col-12 no-left-padding no-right-padding">
                                                <br/>
                                                <textarea id="configuration" name="configuration"  ref="configuration" 
                                                    className="form-control form-control-sm" style={{fontFamily:'Monospace'}} 
                                                    onChange={this.configurationChanged} value={this.state.configuration} 
                                                    onBlur={this.refreshWidgetPreview} disabled={this.state.readOnly} type="text"/>
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
                            Preview <span id="aggregateRefreshBtn" onClick={()=>this.refreshPreview()}><i class="fas fa-sync"></i></span>
                        </div>
                        <div className="card-body">
                            {(this.state.selectedTab === 'widget') && 
                                <div id="widgetPreview">
                                    <b>Widget preview</b>
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

export default AggregateValueEditor;

