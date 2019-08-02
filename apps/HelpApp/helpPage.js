import './index.scss';
import React, { Component } from 'react';
import { DropdownButton, Dropdown, Nav, NavDropdown } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const baseUrl = process.env.SERVER;
class HelpPage extends Component {
  constructor(props) {
    super(props);
    this.menuClick = this.menuClick.bind(this);
    this.appClick = this.appClick.bind(this);
    this.state = { topic: null};
  }

  menuClick() {
    console.log("In menuclick");
    var x = document.getElementById("myLinks");
    if(!x){
      return;
    }
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
  appClick(e) {
    // Create an iframe
    console.log("inside handleClick");
    console.log(document.getElementById("crm").href);
    // const iframe = document.createElement('iframe');
    // iframe.style.width = '100%';
    // iframe.style.height = '100%';
    // console.log(proc.resource(baseUrl));
    const topic =e.target.id;
    console.log(baseUrl);
    this.setState({ topic});
    this.menuClick();
  }

  render() {
    console.log(this.state);
    if(this.state.topic){
      const styles = {width:'100%', height:'100%',border:0};
      return (   
        <div style={styles}>
          <Nav className="justify-content-end" activeKey="/home" >      
            
              <div className="topnav active" >
                <div className="font-2_5em home">
                  <i className="fa fa-home" onClick={this.appClick} ></i>
                </div>
                <div className="links" id="myLinks">
                  <a href="#" onClick={this.appClick} id="crm">CRM</a>
                  <a href="#" onClick={this.appClick} >Task</a>
                </div>
                <a href="javascript:void(0);" className="icon" onClick={this.menuClick}>
                  <i className="fa fa-ellipsis-v"></i></a>
              </div>
            
          </Nav>
          <iframe style={styles} src={this.props.args.proc.resource(baseUrl + this.state.topic)} ></iframe>
        </div>
      );
    }else{
      return (
      <div className="container">
        <h3 className="topic-title">Help Topics</h3>
        <a href="#"><h4 onClick={this.appClick} id="crm">CRM</h4></a>
        <a href="#"><h4 onClick={this.appClick} >Task</h4></a>
      </div>
      );
    }
      // <Nav className="justify-content-end" activeKey="/home" >        
      //   <DropdownButton id="dropdown-basic-button" drop="left" iconClass='fa fa-ellipsis-v'>
      //   <Dropdown.Item as="button" onClick={this.handleClick} eventKey="crm">CRM</Dropdown.Item>
      //   <Dropdown.Item as="button" eventKey="task">Task</Dropdown.Item>
      // </DropdownButton>
      // </Nav>
    ;
  }
}

//onClick={this.handleClick}

export default HelpPage;