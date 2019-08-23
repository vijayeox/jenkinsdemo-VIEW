import React from 'react';
import ReactDOM from 'react-dom';
import {dashboard as section} from './metadata.json';
import JavascriptLoader from './components/javascriptLoader';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.state = {
        };
    }

    render() {
        return(
            <div className="dashboard">
                <h3>Dashboard</h3>
            </div>
        );
    }
}

export default Dashboard;

