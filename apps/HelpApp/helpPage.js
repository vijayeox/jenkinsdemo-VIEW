import './index.scss';
import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
//import ReactDOM from 'react-dom';
import { myObj } from './topic.json';

const baseUrl = process.env.SERVER;

class HelpPage extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.proc = this.props.args.proc;
    this.win = this.props.args.win;
    this.menuClick = this.menuClick.bind(this);
    this.appClick = this.appClick.bind(this);
    let args = this.proc.args && typeof this.proc.args === 'string' ? JSON.parse(this.proc.args) : this.proc.args; 
    this.state = { topic: args ? args.topic : null };
    this.proc.on('attention', (args, options) => {
      console.log('in helpapp received args');
      this.setState({topic : args.topic});
      this.win.focus();
      this.win.raise();
    });
  
  }

  menuClick() {
    console.log("In menuclick");
    var x = document.getElementById("myLinks");
    if (!x) {
      return;
    }
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  appClick(e) {
    console.log("inside handleClick");
    console.log(e.target.id);
    this.setState({ topic: e.target.id });
    this.menuClick();
  }

  render() {
    if (this.state.topic) {
      const styles = { width: '100%', height: 'calc(100% - 50px)', border: 0 };
      return (
        <div style={styles}>
          <Nav className="justify-content-end" activeKey="/home" >
            <div className="topnav active" >
              <div className="font-2_5em home">
                <i className="fa fa-home" onClick={this.appClick}></i>
              </div>
              <div className="links" id="myLinks">
                {myObj.map((CurrentValue, index) => {
                  return (
                    <a key={index} onClick={this.appClick} id={CurrentValue.id}>
                      {CurrentValue.name}</a>
                  )
                })}
              </div>
              <a href="javascript:void(0);" className="icon" onClick={this.menuClick}>
                <i className="fa fa-ellipsis-v"></i></a>
            </div>
          </Nav>
          <iframe style={styles} src={this.props.args.proc.resource(baseUrl + this.state.topic)} ></iframe>
        </div>
      );
    } else {
      return (
        <div className="container">
          <h3 className="topic-title">Help Topics</h3><hr/>
          {myObj.map((CurrentValue, index) => {
            return (
              <div className="help-menu" key={index} >
              <img src={CurrentValue.icon} />
                <h4 onClick={this.appClick} id={CurrentValue.id}>{CurrentValue.name}</h4>
              </div>
            )
          })}
        </div>
      );
    };
  }
}

export default HelpPage;