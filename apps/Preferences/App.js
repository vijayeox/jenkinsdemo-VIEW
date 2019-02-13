import React, { Component } from 'react';
import { render } from 'react-dom';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import EditProfile from './tabs/EditProfile.js';
import ChangePassword from './tabs/ChangePassword.js';
import UpdateProfileIcon from './tabs/UpdateProfileIcon.js';
import Preferences from './tabs/Preferences.js';

class App extends Component {
  constructor(props) {
    super(props);
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
      <Tabs defaultTab="vertical-tab-one" vertical>
      <TabList>
      <Tab tabFor="vertical-tab-one"><i className="fa fa-home"></i><span className="tabHeader">Profile</span></Tab>
      <Tab tabFor="vertical-tab-two"><i className="fa fa-home"></i><span className="tabHeader">Edit Profile</span></Tab>
      <Tab tabFor="vertical-tab-three"><i className="fa fa-home"></i><span className="tabHeader">Change Password</span></Tab>
      <Tab tabFor="vertical-tab-four"><i className="fa fa-person"></i><span className="tabHeader">Update Profile Picture</span></Tab>
      <Tab tabFor="vertical-tab-five"><i className="fa fa-cogs"></i><span className="tabHeader">Preferences</span></Tab>
      </TabList>
      <TabPanel style={{height: this.state.height}} tabId="vertical-tab-one">
      <p>Tab 1 content</p>
      </TabPanel>
      <TabPanel style={{height: this.state.height}} tabId="vertical-tab-two">
      <EditProfile />
      </TabPanel>
      <TabPanel style={{height: this.state.height}} tabId="vertical-tab-three">
      <ChangePassword />
      </TabPanel>
      <TabPanel style={{height: this.state.height}} tabId="vertical-tab-four">
      <UpdateProfileIcon />
      </TabPanel>
      <TabPanel style={{height: this.state.height}} tabId="vertical-tab-five">
      <Preferences />
      </TabPanel>
      </Tabs>
      );
  }
}

export default Profile;