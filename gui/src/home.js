import React from "react";
import Approve from "./approve";
import ReactDOM from "react-dom";
// import GridTemplate from "./GridTemplate.js";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.config = this.props.args;
        this.core = this.props.core;
        this.menu = this.props.config;
        this.state = {
            showForm: false
        }
    }
   
    render() {
        return ('homeee');
        
    }
}

export default Home;