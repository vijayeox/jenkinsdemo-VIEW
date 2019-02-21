import React, { Component } from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import ChangePassword from "./tabs/ChangePassword.js";
import Preferences from "./tabs/Preferences.js";
import Profile from "./tabs/Profile.js";
import "./tabs/Sample.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    console.log(this.core);
    this.state = {
      //  height : this.core.args.windows[0].$content.scrollHeight
    };
    this.profile={};

    this.getProfile().then(response => {
      this.setState({ fields: response.data });
      //console.log("from state");
     //console.log(this.state.fields.id);

    //  console.log(this.profile);
    
  });
  this.changePassword=this.changePassword.bind(this);
}
async getProfile() {
  // call to api using wrapper
  let helper = this.core.make("oxzion/restClient");
  let userprofile = await helper.request("v1", "/user/me/a", {}, "get");
  // console.log("from profile");
  // console.log(profile);
  return userprofile;
}


async changePassword(formData){
  let helper = this.core.make("oxzion/restClient");
  let response = await helper.request("v1","/user/me/changepassword",formData,"post");
  return response;
}

  init() {}

  componentDidMount() {
    //   var self=this;
    //   if(this.props.args){
    //     this.props.args.windows[0].$content.addEventListener('windowResized', function (e) {
    //       self.setState({height:e.detail.dimensions.height})
    //     }, false)
    //   }
    var El = document.getElementById("click1");
    if (El) {
      El.addEventListener(
        "click",
        function() {
          document.getElementById("cardUi").style.display = "";
          document.getElementById("componentsBox").style.display = "none";
          document.getElementById("imageBox").style.display = "none";
          document.getElementById("webcamcomponent").style.display = "none";
        },
        false
      );
    }
  }

  render() {
    return (
      <Tabs defaultTab="vertical-tab-one">
        <TabList>
          <div id="click1">
            <Tab tabFor="vertical-tab-one">
              <i className="fa fa-user-circle" id="iconi" />
              <span className="tabHeader">Profile</span>
            </Tab>
          </div>
          <Tab tabFor="vertical-tab-two">
            <i className="fa fa-key" id="iconi" />
            <span className="tabHeader">Change Password</span>
          </Tab>
          <Tab tabFor="vertical-tab-three">
            <i className="fa fa-cogs" id="iconi" />
            <span className="tabHeader">Preferences</span>
          </Tab>
        </TabList>
        <TabPanel tabId="vertical-tab-one" className="tab1">
          <Profile args={this.core} />
        </TabPanel>
        <TabPanel tabId="vertical-tab-two" className="tab1">
        <ChangePassword changePassword={this.changePassword} />
        </TabPanel>
        <TabPanel tabId="vertical-tab-three" className="tab1">
          <Preferences />
        </TabPanel>
      </Tabs>
    );
  }
}

export default App;
