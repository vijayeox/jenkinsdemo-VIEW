import {React,ReactDOM,ReactWebTabs} from "oxziongui";
import ChangePassword from "./tabs/ChangePassword.js";
import Preferences from "./tabs/Preferences.js";
import EditProfile from "./tabs/EditProfile.js";
import Themes from "./tabs/Themes";
import Background from "./tabs/Background";

class App extends React.Component {
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
      <ReactWebTabs.Tabs defaultTab="vertical-tab-one">
        <ReactWebTabs.TabList className="tabLayout">
          <ReactWebTabs.Tab tabFor="vertical-tab-one">
            <i className="fa fa-user-circle" />
            <span>Edit Profile</span>
          </ReactWebTabs.Tab>
          <ReactWebTabs.Tab tabFor="vertical-tab-two">
            <i className="fa fa-key" />
            <span>Change Password</span>
          </ReactWebTabs.Tab>
          <ReactWebTabs.Tab tabFor="vertical-tab-three">
            <i className="fa fa-cog" />
            <span>Preferences</span>
          </ReactWebTabs.Tab>
        </ReactWebTabs.TabList>
        <ReactWebTabs.TabPanel
          tabId="vertical-tab-one"
          className="tab1"
          render={({ selected }) =>
            selected ? <EditProfile args={this.core} /> : null
          }
        ></ReactWebTabs.TabPanel>
        <ReactWebTabs.TabPanel
          tabId="vertical-tab-two"
          className="tab1"
          render={({ selected }) => (selected ? <ChangePassword args={this.core}/> : null)}
        ></ReactWebTabs.TabPanel>
        <ReactWebTabs.TabPanel
          tabId="vertical-tab-three"
          className="tab1"
          render={({ selected }) =>
            selected ? <Preferences args={this.core} /> : null
          }
        ></ReactWebTabs.TabPanel>
        <ReactWebTabs.TabPanel
          tabId="vertical-tab-four"
          className="tab1"
          render={({ selected }) =>
            selected ? <Background args={this.core} win={this.win} /> : null
          }
        ></ReactWebTabs.TabPanel>
        <ReactWebTabs.TabPanel
          tabId="vertical-tab-five"
          className="tab1"
          render={({ selected }) =>
            selected ? <Themes args={this.core} /> : null
          }
        ></ReactWebTabs.TabPanel>
      </ReactWebTabs.Tabs>
    );
  }
}

export default App;
