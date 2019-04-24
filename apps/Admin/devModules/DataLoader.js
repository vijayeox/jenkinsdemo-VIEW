import React from 'react';
import { toODataString } from '@progress/kendo-data-query';
import LoadingPanel from "./LoadingPanel";

export class DataLoader extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.url = this.props.url;
    }
    async getData(url) {
        let helper = this.core.make("oxzion/restClient");
        let data = await helper.request("v1", "/"+this.url, {}, "get");
        return data;
    }
    requestDataIfNeeded = () => {
        if (this.pending || toODataString(this.props.dataState) === this.lastSuccess) {
            return;
        }
        this.pending = toODataString(this.props.dataState);
        this.getData(this.url).then(response => {
            this.lastSuccess = this.pending;
            this.pending = '';
            if (toODataString(this.props.dataState) === this.lastSuccess) {
                this.props.onDataRecieved.call(undefined, {
                    data: response.data.data,
                    total:response.data.length
                });
            } else {
                this.requestDataIfNeeded();
            }
        });
    }

    render() {
        this.requestDataIfNeeded();
        return this.pending && <LoadingPanel />;
    }
}
export default DataLoader;