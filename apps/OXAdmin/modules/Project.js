import React, { Component } from "react";
import ReactDOM from "react-dom";

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

    this.state = {
      value: "1"
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    M.AutoInit();
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  openComponent(event) {
    this.setState({
      value: event.target.value
    });
  }

  createBlock = () => {
    let table = [];
    for (let i = 0; i < this.state.value; i++) {
      table.push(
        <div id="d1" className="block">
          <img
            src="apps/OXAdmin/group.svg"
            className="App-logo"
            onClick={this.openComponent}
          />
        </div>
      );
    }
    return table;
  };

  render() {
    return (
      <div id="project">
        <center>
          <div className="input-field col s6">
            <select defaultValue="1" id="dropdown" onChange={this.handleChange}>
              <option value="" disabled>
                Choose your option
              </option>
              <option value="2">Employee</option>
              <option value="3">IT Support</option>
              <option value="4">Manager</option>
              <option value="6">Admin</option>
              <option value="8">Super Admin</option>
            </select>
            <label>Select Role</label>
          </div>
          <div className="container">{this.createBlock()}</div>
        </center>
      </div>
    );
  }
}

export default Project;
