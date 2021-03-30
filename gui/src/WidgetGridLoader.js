
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { toODataString } from '@progress/kendo-data-query';
import { string } from 'prop-types';
import { preparefilter } from './DashboardUtils'
import { filter } from '@progress/kendo-data-query/dist/npm/transducers';

export class WidgetGridLoader extends React.Component {

    constructor(props) {
        super(props);
        this.core = props.core;
        this.helper = this.core.make("oxzion/restClient");
        this.uuid = props.uuid;
        this.filterParams = props.filterParams;
    }

    lastSuccess = '';
    pending = '';
    gridfilterString = '';

    // function to create Grid Filter Parameters 
    // params - The default filterGrid event parameters that are triggered by gridstateChange event
    createFilterString = (gridFilterParams) => {
        let filterVal = []
        var filterString = ""
        for (var key of Object.keys(gridFilterParams)) {
            if (key == 'filters') {
                var gridFilterString = ""
                // Loop through each filter object and create elastic filters 
                let length = gridFilterParams[key].length;
                gridFilterParams[key].map((data, index) => {
                    // if only 1 filter is associated
                    if (index === 0) {
                        let gridFilterP = []
                        gridFilterP.push(data.field);
                        // Add more operators according to supported parameters. Change to switch if Many 
                        if (data.operator == 'contains') {
                            gridFilterP.push("LIKE");
                        } else if (data.operator == 'eq') {
                            gridFilterP.push("==")
                        } else {
                            gridFilterP.push("==");
                        }
                        gridFilterP.push(data.value);
                        // if only 1 object in the filters
                        if (index + 1 == length) {
                            gridFilterString = JSON.stringify(gridFilterP)
                            gridFilterP = []
                        } else {
                            filterVal.push(gridfilterP)
                            gridFilterP = []
                            gridFilterString = JSON.stringify(filterVal)
                        }
                    } else {
                        // if not the first object i.e. multiple filters 
                        filterVal.push("AND")
                        let gridFilterP = []
                        gridFilterP.push(data.field);
                        if (data.operator == 'contains') {
                            gridFilterP.push("==");
                        } else if (data.operator == 'eq') {
                            gridFilterP.push("==")
                        } else {
                            gridFilterP.push("==");
                        }
                        gridFilterP.push(data.value);
                        filterVal.push(gridFilterP)
                        gridFilterP = []
                        gridFilterString = JSON.stringify(filterVal)
                    }
                });
                filterString = gridFilterString
            }
        }
        console.log("The filter string looks like : ");
        console.log(filterString);
        return filterString
    }

    requestDataIfNeeded = () => {
        // use the datastate to generate required query and pass it to the check as well
        var dataStateCopy = {}

        if (this.props.dataState['filter'] != null) {
            dataStateCopy['filter_grid'] = this.props.dataState ? this.props.dataState['filter'] : null
        }
        if (this.props.dataState['skip'] != null) {
            dataStateCopy['skip'] = this.props.dataState ? this.props.dataState['skip'] : null
        }
        if (this.props.dataState['take'] != null) {
            dataStateCopy['take'] = this.props.dataState ? this.props.dataState['take'] : null
        }
        if (this.props.dataState['sort'] != null) {
            dataStateCopy['sort'] = this.props.dataState ? this.props.dataState['sort'] : null
        }
        if (this.props.dataState['group'] != null) {
            dataStateCopy['group'] = this.props.dataState ? this.props.dataState['group'] : null
        }
        var filtersApplied = ''
        let filterD = typeof (dataStateCopy['filter_grid'])
        if (filterD == "undefined") {
            // Since no filters are there, we can use the OData string 
            filtersApplied = toODataString(this.props.dataState);
            filtersApplied = filtersApplied.replace(/\$/g, '');
            filtersApplied = filtersApplied.replace('filter', 'filter_grid')
        } else {
            // call createFilterString to get the filter String required for filters 
            this.gridfilterString = this.createFilterString(dataStateCopy['filter_grid']);
            console.log(this.gridfilterString)
            filtersApplied = toODataString(this.props.dataState);
            filtersApplied = filtersApplied.replace(/\$/g, '');
            var filterSplit = filtersApplied.split(/&(.+)/)
            filtersApplied = filterSplit[1]
            filtersApplied = filtersApplied + "&filter=" + this.gridfilterString
        }
        console.log('final check before the filter request');
        console.log(filtersApplied);
        if (this.pending || filtersApplied === this.lastSuccess) {
            // change the check for the previous value not to return 
            return;
        }
        this.pending = filtersApplied;
        this.getWidgetByUuid(this.uuid, this.filterParams, this.pending).then(response => {
            this.lastSuccess = this.pending;
            this.pending = '';
            if (filtersApplied === this.lastSuccess) {
                this.props.onDataRecieved.call(undefined, {
                    data: response.data.widget.data,
                    total: response.data.widget.total_count
                });
            } else {
                this.requestDataIfNeeded();
            }
        });
    }
    async getWidgetByUuid(uuid, filterParams, gridParams) {
        let filterParameter = (filterParams && filterParams != [] && filterParams.length != 0) ? ("&filter=" + JSON.stringify(filterParams)) : ''
        // send this filters to widgets as well so that we can append those to the url that we are trying to create 
        let response = await this.helper.request(
            "v1",
            "analytics/widget/" + uuid + '?data=true' + filterParameter + "&" + gridParams,
            {},
            "get"
        );
        return response;
    }

    render() {
        this.requestDataIfNeeded();
        return this.pending && <LoadingPanel />;
    }
}

class LoadingPanel extends React.Component {
    render() {
        const loadingPanel = (
            <div className="k-loading-mask">
                <span className="k-loading-text">Loading</span>
                <div className="k-loading-image"></div>
                <div className="k-loading-color"></div>
            </div>
        );
        const gridContent = document && document.querySelector('.k-grid-content');
        return gridContent ? ReactDOM.createPortal(loadingPanel, gridContent) : loadingPanel;
    }
}
