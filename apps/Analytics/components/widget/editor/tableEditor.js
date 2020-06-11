import {WidgetRenderer} from '../../../GUIComponents';
import AbstractEditor from './abstractEditor';
import React from 'react';
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';
import {Tabs, Tab, Overlay, Tooltip,Form,Row,Col,Button} from 'react-bootstrap';
import Select from 'react-select'
class TableEditor extends AbstractEditor {
    constructor(props) {
        super(props);
        this.state.selectedTab = 'table';
        this.state.selectableWidgetOptions = props.selectableWidgetOptions;

        this.ERRORS = {
            TABLE_CONFIGURATION_NEEDED : 'Table configuration is needed',
            TABLE_CONFIGURATION_INVALID_JSON : 'Table configuration JSON is invalid',
            QUERY_NEEDED : 'Query should be selected',
            EXPRESSION_INVALID_JSON : 'Expression JSON is invalid',
        };
    }

    configurationChanged = (evt) => {
        let thiz = this;
        let value = evt.target.value;
        this.setState((state) => {
            state.configuration = value;
            state.errors.configuration = ('' === value) ? thiz.ERRORS.TABLE_CONFIGURATION_NEEDED : null;
            return state;
        });
        //IMPORTANT: Don't refresh table preview when configurationChanged method is called. 
        //           It is too much to update preview for every key stroke when the user is typing the configuration.
        //           Therefore table preview is updated when the configuration field loses focus OR when the "table" tab comes back to focus.
    }

    expressionBlurred = (evt) => {
        if (this.validateExpression()) {
            this.loadData(this.refreshQueryPreview());
        }
    }

    refreshTablePreview = () => {
        let cardBody = document.querySelector('div#previewBox div.card-body');
        let errorMessage = null;
        let jsonTableConfiguration = null;
        let config = this.state.configuration;
        if (!config || (0 === config.length)) {
            errorMessage = this.ERRORS.TABLE_CONFIGURATION_NEEDED;
        }
        else {
            try {
                //Make sure table configuratio is valid JSON
                jsonTableConfiguration = JSON.parse(config);
            }
            catch(jsonParseError) {
                console.error(jsonParseError);
                errorMessage = this.ERRORS.TABLE_CONFIGURATION_INVALID_JSON;
            }
        }

        if (!errorMessage) {
            let previewElement = document.querySelector('div#tablePreview');
            if (previewElement) {
                //Remove and cleanup ReactJS rendered DOM nodes.
                ReactDOM.unmountComponentAtNode(previewElement);
                //Remove child nodes under previewElement.
                let children = previewElement.children;
                for (let i=0; i < children.length; i++) {
                    children[i].remove();
                }
            }
            previewElement.style.height = (cardBody.offsetHeight - 40) + 'px'; //-40px for border and margin around preview area.
            previewElement.style.width = (cardBody.offsetWidth- 40) + 'px'; //-40px for border and margin around preview area.
            try {
                WidgetRenderer.renderTable(previewElement, jsonTableConfiguration, this.data);
            }
            catch(renderError) {
                console.error(renderError);
                errorMessage = '' + renderError;
            }
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

    refreshViews = () => {
        //Nothing to do for now. Implement this method to refresh the table if there is
        //table update problem when the widget selection is changed.
        let configuration = JSON.parse(this.state.configuration)
        let hasDrillDown = (configuration && configuration["oxzion-meta"] && configuration["oxzion-meta"]["drillDown"]) ? true : false
        if (hasDrillDown) {
            this.initializeDrillDownValues(configuration)
        }
        else {
            this.setState({ drillDownFilter: '', drillDownWidget: '', drillDownWidgetTitle: '', drillDownWidgetFooter: '', hasMaxDepth: false, drillDownMaxDepth: -1 })
        }
    }

    isTableTabValid = (state, setErrorState = true) => {
        let isValid = true;

        let configuration = state.configuration;
        let errorMessage = null;
        if ('' === configuration) {
            isValid = false;
            errorMessage = this.ERRORS.TABLE_CONFIGURATION_NEEDED;
        }
        else {
            try {
                //Make sure table configuratio is valid JSON
                JSON.parse(configuration);
            }
            catch(jsonParseError) {
                isValid = false;
                console.error(jsonParseError);
                errorMessage = this.ERRORS.TABLE_CONFIGURATION_INVALID_JSON;
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

        let isTableTabValid = this.isTableTabValid(this.state, false);
        let isQueryTabValid = this.isQueryTabValid(this.state, false);
        let isExpressionTabValid = this.isExpressionTabValid(this.state, false);
        let thiz = this;
        let switchToTab = null;
        switch(this.state.selectedTab) {
            case 'table':
                if (!isTableTabValid) {
                    this.setState((state) => {
                        thiz.isTableTabValid(state);
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
                    switchToTab = findInvalidTab([{'expression':isExpressionTabValid}, {'table':isTableTabValid}]);
                }
            break;
            case 'expression':
                if (!isExpressionTabValid) {
                    this.setState((state) => {
                        thiz.isExpressionTabValid(state);
                    });
                }
                else {
                    switchToTab = findInvalidTab([{'table':isTableTabValid}, {'query':isQueryTabValid}]);
                }
            break;
        }
        if (switchToTab) {
            this.configurationTabSelected(switchToTab, null);
        }
        return (isTableTabValid && isQueryTabValid && isExpressionTabValid);
    }

    configurationTabSelected = (eventKey, event) => {
        let cardBody = null;
        let textArea = null;
        switch(eventKey) {
            case 'table':
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
                    case 'table':
                        thiz.isTableTabValid(state);
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
                    case 'table':
                        thiz.refreshTablePreview();
                    break;
                    case 'query':
                    case 'expression':
                        thiz.refreshQueryPreview();
                    break;
                }
            });
        });
    }

    componentDidMount() {
        let thiz = this;
        this.loadQueries(function() {
            thiz.configurationTabSelected('table');
        });
    }
    refreshPreview(){
        if (this.state.selectedTab === 'table') {
            this.refreshTablePreview();
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
                                    <Tab eventKey="table" title="Table">
                                        <div className="form-group row" style={{marginLeft:'0px', marginRight:'0px'}}>
                                            <div className="col-12 no-left-padding no-right-padding">
                                                <textarea id="configuration" name="configuration"  ref="configuration" 
                                                    className="form-control form-control-sm" style={{fontFamily:'Monospace'}} 
                                                    onChange={this.configurationChanged} value={this.state.configuration} 
                                                    onBlur={this.refreshTablePreview} disabled={this.state.readOnly}/>
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
                                    <Tab eventKey="drilldown" title="Drill Down">
                                        <div className="drilldown-div">
                                            <Form.Group as={Row}>
                                                <Form.Label column lg="3">Filter</Form.Label>
                                                <Col lg="9">
                                                    <Form.Control
                                                        as="textarea"
                                                        name="drillDownFilter"
                                                        onChange={(e) => this.handleDrillDownInputChange(e)}
                                                        value={this.state.drillDownFilter}
                                                        disabled={this.state.readOnly}
                                                    />
                                                    <Form.Text className="text-muted errorMsg">
                                                        {this.state.errors.drillDown["drillDownFilter"]}
                                                    </Form.Text>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column md="3" lg="3">Widget</Form.Label>
                                                <Col md="3" lg="3">
                                                    <Select
                                                        placeholder="Type"
                                                        name="drillDownWidgetType"
                                                        id="drillDownWidgetType"
                                                        onChange={(e) => this.handleSelect(e, "drillDownWidgetType")}
                                                        value={this.state.drillDownWidgetType ? this.state.drillDownWidgetType : ""}
                                                        options={this.widgetTypes}
                                                        isDisabled={this.state.readOnly}
                                                    />
                                                </Col>
                                                <Col md="6" lg="6">
                                                    <Select
                                                        placeholder="Choose Widget"
                                                        name="drillDownWidget"
                                                        id="drillDownWidget"
                                                        isDisabled={this.state.readOnly}
                                                        onChange={(e) => this.handleSelect(e, "drillDownWidget")}
                                                        value={this.props.selectableWidgetOptions.filter(option => option.value == this.state.drillDownWidget)}
                                                        options={this.state.filteredWidgetList.length > 0 ? this.state.filteredWidgetList : this.props.selectableWidgetOptions}
                                                    />
                                                    <Form.Text className="text-muted errorMsg">
                                                        {this.state.errors.drillDown["drillDownWidget"]}
                                                    </Form.Text>

                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column lg="3">Title</Form.Label>
                                                <Col lg="9">
                                                    <Form.Control
                                                        type="text"
                                                        name="drillDownWidgetTitle"
                                                        onChange={(e) => this.handleDrillDownInputChange(e)}
                                                        value={this.state.drillDownWidgetTitle || ''}
                                                        disabled={this.state.readOnly}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column lg="3">Footer</Form.Label>
                                                <Col lg="9">
                                                    <Form.Control
                                                        type="text"
                                                        name="drillDownWidgetFooter"
                                                        onChange={(e) => this.handleDrillDownInputChange(e)}
                                                        value={this.state.drillDownWidgetFooter || ''}
                                                        disabled={this.state.readOnly}
                                                    />

                                                </Col>
                                            </Form.Group>
                                            {this.state.hasMaxDepth &&
                                                <Form.Group as={Row}>
                                                    <Form.Label column lg="3">Max Depth</Form.Label>
                                                    <Col lg="9">
                                                        <Form.Control
                                                            as="select"
                                                            name="drillDownMaxDepth"
                                                            value={this.state.drillDownMaxDepth ? this.state.drillDownMaxDepth : -1}
                                                            onChange={(e) => this.handleDrillDownInputChange(e)}
                                                            disabled={this.state.readOnly}
                                                        >
                                                            <option key="-1" value={-1}></option>
                                                            <option key="2" value={2}>2</option>
                                                            <option key="3" value={3}>3</option>
                                                            <option key="4" value={4}>4</option>
                                                        </Form.Control>
                                                        <Form.Text className="text-muted errorMsg">
                                                            {this.state.errors.drillDown["drillDownMaxDepth"]}
                                                        </Form.Text>
                                                    </Col>
                                                </Form.Group>}

                                            <Button variant="primary" type="button" disabled={this.state.readOnly} onClick={() => this.ApplyDrillDown("table")}>
                                                Apply DrillDown
                                            </Button>

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
                            Preview <span id="tableRefreshBtn" title="Refresh" style={{cursor:"pointer"}} onClick={()=>this.refreshPreview()}><i className="fas fa-sync"></i></span>
                        </div>
                        <div className="card-body">
                            {(this.state.selectedTab === 'table') && 
                                <div id="tablePreview">
                                    <b>Table preview</b>
                                </div>
                            }
                            {((this.state.selectedTab === 'query')|| (this.state.selectedTab === 'expression')) && 
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

export default TableEditor;

