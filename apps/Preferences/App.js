import React, { Component } from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import ChangePassword from "./tabs/ChangePassword.js";
import Preferences from "./tabs/Preferences.js";
import EditProfile from "./tabs/EditProfile.js";
import Themes from "./tabs/Themes";
import Background from "./tabs/Background";

class App extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.win = this.props.win;
    this.state = {
      fields: {}
    };
    this.profile = {};

    this.getProfile().then(response => {
      this.setState({ fields: response.data });
    });
  }

  async getProfile() {
    // call to api using wrapper
    let userprofile = await this.core.make("oxzion/profile").get();
    return userprofile;
  }

  render() {
    return (
      <Tabs defaultTab="vertical-tab-one">
        <TabList className="tabLayout">
          <Tab tabFor="vertical-tab-one">
            <i className="fas fa-user-circle" />
            <span>Edit Profile</span>
          </Tab>
          <Tab tabFor="vertical-tab-two">
            <i className="fas fa-key" />
            <span>Change Password</span>
          </Tab>
          <Tab tabFor="vertical-tab-three">
            <i className="fas fa-user-cog" />
            <span>Preferences</span>
          </Tab>
          <Tab tabFor="vertical-tab-four">
            <i className="fas fa-image" />
            <span>Background</span>
          </Tab>
          <Tab tabFor="vertical-tab-five">
            <i className="fas fa-desktop" />
            <span>Themes</span>
          </Tab>
        </TabList>
        <TabPanel
          tabId="vertical-tab-one"
          className="tab1"
          render={({ selected }) =>
            selected ? <EditProfile args={this.core} /> : null
          }
        ></TabPanel>
        <TabPanel
          tabId="vertical-tab-two"
          className="tab1"
          render={({ selected }) => (selected ? <ChangePassword args={this.core}/> : null)}
        ></TabPanel>
        <TabPanel
          tabId="vertical-tab-three"
          className="tab1"
          render={({ selected }) =>
            selected ? <Preferences args={this.core} /> : null
          }
        ></TabPanel>
        <TabPanel
          tabId="vertical-tab-four"
          className="tab1"
          render={({ selected }) =>
            selected ? <Background args={this.core} win={this.win} /> : null
          }
        ></TabPanel>
        <TabPanel
          tabId="vertical-tab-five"
          className="tab1"
          render={({ selected }) =>
            selected ? <Themes args={this.core} /> : null
          }
        ></TabPanel>
      </Tabs>
    );
  }
}

export default App;
