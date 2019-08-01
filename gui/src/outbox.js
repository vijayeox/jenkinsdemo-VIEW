import React from "react";
import Approve from "./approve";
import ReactDOM from "react-dom";
// import GridTemplate from "./GridTemplate.js";

class Outbox extends React.Component {
    constructor(props) {
        super(props);
        this.config = this.props.args;
        this.core = this.props.core;
        this.menu = this.props.config;
        this.state = {
            showForm: false
        }
        this.renderForm = this.renderForm.bind(this);
    }
    renderForm = () => {
        this.setState({ showForm: true });
        ReactDOM.render(
            <Approve args={this.core} />,
            document.getElementById("secform")
            )
        };
    render() {
        return (<div>
            <div id="secform" style={{ height: "inherit" }} />
                  <button onClick={this.renderForm}> Second Form </button>
               </div>
              );
        
    }
}

export default Outbox;