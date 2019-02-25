import React, { Component } from "react";
import ReactDOM from "react-dom";

import "../public/scss/app.css";
import "../public/scss/kendo.css";
import "../../public/materialize.js";

import { FaArrowLeft } from "react-icons/fa";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faPlusCircle);

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

    this.state = {
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    M.select();
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  createBlock = () => {
    let table = [];
    for (let i = 0; i < this.state.value; i++) {
      table.push(<div class="block">1. name of the company</div>);
    }
    return table;
  };

  render() {
    return (
      <div id="project">
        <center>
          <h3>Responsive Tiles</h3>

          <select id="dropdown" onChange={this.handleChange}>
            <option value="N/A">N/A</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <div class="container">{this.createBlock()}</div>
        </center>
      </div>
    );
  }
}

export default Project;
