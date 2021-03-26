
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { toODataString } from '@progress/kendo-data-query';
import { string } from 'prop-types';

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

    requestDataIfNeeded = () => {
        console.log(this.props.dataState)
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

        // add a way to fix the dollar sign which is created using toODataString function 

        var string1 = toODataString(dataStateCopy);
        string1 = string1.replace(/\$/g, '');
        console.log(string1);

        // change the check for the previous value not to return 
        if (this.pending || string1 === this.lastSuccess) {
            return;
        }

        this.pending = string1;
       
        // change the fetch to the helper function call that is required to make the calls to the backend for the data. 
        // fetch(this.baseUrl + this.pending, this.init)
        //     .then(response => response.json())
        //     .then(json => {
        //         this.lastSuccess = this.pending;
        //         this.pending = '';
        //         if (toODataString(this.props.dataState) === this.lastSuccess) {
        //             this.props.onDataRecieved.call(undefined, {
        //                 data: json.value,
        //                 total: json['@odata.count']
        //             });
        //         } else {
        //             this.requestDataIfNeeded();
        //         }
        //     });

        this.getWidgetByUuid(this.uuid, this.filterParams, this.pending).then(response => {
            console.log(response);
            this.lastSuccess = this.pending;
            this.pending = '';
            var string2 = toODataString(dataStateCopy)
            string2 = string2.replace(/\$/g, '');
            if (string2 === this.lastSuccess) {
                this.props.onDataRecieved.call(undefined, {
                    data: response.data.widget.data,
                    total: response.data.widget.total_count

                });
            }
            else
            {
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
