import React, { Component } from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import ChangePassword from "./tabs/ChangePassword.js";
import Preferences from "./tabs/Preferences.js";
import EditProfile from "./tabs/EditProfile.js";
import Profile from "./tabs/Profile.js";
import "./tabs/Preferences.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    console.log(this.core);
    this.state = {
  
      fields:{}
      //  height : this.core.args.windows[0].$content.scrollHeight
    };
    this.profile={};

    this.getProfile().then(response => {
      this.setState({ fields: response.data });
  });
  this.changePassword=this.changePassword.bind(this);
}
async getProfile() {
  // call to api using wrapper
  let userprofile = await this.core.make("oxzion/profile").get();
  return userprofile;
}


async changePassword(formData){
  let helper = this.core.make("oxzion/restClient");
  let response = await helper.request("v1","/user/me/changepassword",formData,"post");
  return response;
}

  init() {}

  render() {
    return (
      <Tabs defaultTab="vertical-tab-one">
        <TabList style={{width:"100%",backgroundImage:"url(./apps/Preferences/bg3.jpg)"}}>
          <div id="click1">
            <Tab tabFor="vertical-tab-one" style={{color:"white"}}>
              <i className="fa fa-user-circle" id="iconj" />
              <span className="tabHeader">EditProfile</span>
            </Tab>
          </div>
          <Tab tabFor="vertical-tab-two" style={{color:"white"}}>
            <i className="fa fa-key" id="iconj" />
            <span className="tabHeader">Change Password</span>
          </Tab>
          <Tab tabFor="vertical-tab-three" style={{color:"white"}}>
            <i className="fa fa-cogs" id="iconj" />
            <span className="tabHeader">Preferences</span>
          </Tab>
        </TabList>
        <TabPanel tabId="vertical-tab-one" className="tab1" style={{width:"100%",backgroundImage:"url(./apps/ImageUploader/bg.png)"}}>
          <EditProfile args={this.core} />
        </TabPanel>
        <TabPanel tabId="vertical-tab-two" className="tab1" style={{width:"100%",backgroundImage:"url(./apps/ImageUploader/bg.png)"}}>
        <ChangePassword changePassword={this.changePassword} />
        </TabPanel>
        <TabPanel tabId="vertical-tab-three" className="tab1" style={{width:"100%",backgroundImage:"url(./apps/ImageUploader/bg.png)"}} >
          <Preferences args={this.core}/>
        </TabPanel>
      </Tabs>
    );
  }
}

export default App;
