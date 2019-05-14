import React from 'react';
import ReactDOM from 'react-dom';
import { toODataString } from '@progress/kendo-data-query';

export class Filterloader extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.url = this.props.url;
        this.baseUrl = 'http://jenkins.oxzion.com:8080/' + this.url + '$count=true&';
        this.init = {
        method: 'GET', accept: 'application/json',
        headers: {Authentication : 'Bearer ' + this.core.user.jwt}
    };
    }
    
    lastSuccess = '';
    pending = '';

    requestDataIfNeeded = () => {
        if (this.pending || toODataString(this.props.dataState) === this.lastSuccess) {
            return;
        }
        this.pending = toODataString(this.props.dataState);
        fetch(this.baseUrl + this.pending, this.init)
            .then(response => response.json())
            .then(json => {
                this.lastSuccess = this.pending;
                this.pending = '';
                if (toODataString(this.props.dataState) === this.lastSuccess) {
                    this.props.onDataRecieved.call(undefined, {
                        data: json.value,
                        total: json['@odata.count']
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


class LoadingPanel extends React.Component {
    render() {
        const loadingPanel = (
            <div class="k-loading-mask">
                <span class="k-loading-text">Loading</span>
                <div class="k-loading-image"></div>
                <div class="k-loading-color"></div>
            </div>
        );

        const gridContent = document && document.querySelector('.k-grid-content');
        return gridContent ? ReactDOM.createPortal(loadingPanel, gridContent) : loadingPanel;
    }
}
export default Filterloader;