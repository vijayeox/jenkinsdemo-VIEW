import React, { Component } from 'react';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import ChangePassword from './tabs/ChangePassword.js';
import Preferences from './tabs/Preferences.js';
import Profile from './tabs/Profile.js';
import './tabs/Sample.css';

class App extends Component {
  constructor(props) {
    super(props);
  //  this.core = this.props.args;
    this.state = {
      height : this.props.args.windows[0].$content.scrollHeight
    }
  }

  init() {
  }
  componentDidMount() {
    var self=this;
    if(this.props.args){
      this.props.args.windows[0].$content.addEventListener('windowResized', function (e) {
        self.setState({height:e.detail.dimensions.height})
      }, false)
    }
  }

  render() {
    return (
      <Tabs defaultTab="vertical-tab-one">
      <TabList>
      <Tab tabFor="vertical-tab-one"><i className="fa fa-user-circle"></i><span className="tabHeader">Profile</span></Tab>
      <Tab tabFor="vertical-tab-two"><i className="fa fa-key"></i><span className="tabHeader">Change Password</span></Tab>
      <Tab tabFor="vertical-tab-three"><i className="fa fa-cogs"></i><span className="tabHeader">Preferences</span></Tab>
      </TabList>
      <TabPanel tabId="vertical-tab-one" className="tab1">
      <Profile /* args = {this.core}*/ />
      </TabPanel>
      <TabPanel tabId="vertical-tab-two" className="tab1">
      <ChangePassword />
      </TabPanel>
      <TabPanel tabId="vertical-tab-three" className="tab1">
      <Preferences />
      </TabPanel>
      
      </Tabs>
      );
  }
}

export default App;