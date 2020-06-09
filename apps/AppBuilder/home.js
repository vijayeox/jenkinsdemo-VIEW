import {React,ReactDOM ,FormBuilder} from "oxziongui";
import $ from "jquery";
import Organization from "./modules/Organization";
import Project from "./modules/Project";
import User from "./modules/User";
import Group from "./modules/Group";
import Role from "./modules/Roles";
import Announcement from "./modules/Announcement";
import Errorlog from "./modules/Errorlog";
import { slide as Menu } from "react-burger-menu";


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.userProfile = this.core.make("oxzion/profile").get();
    this.userProfile = this.userProfile.key;
    this.state = {
      windowSize: undefined,
      showMenu: false
    };
    this.resizeEvent = this.resizeEvent.bind(this);
    document
      .getElementsByClassName("Window_Admin")[0]
      .addEventListener("windowResize", this.resizeEvent, false);
    this.hideMenu = this.hideMenu.bind(this);
  }

  resizeEvent = () => {
    let that = this;
    window.setTimeout(() => {
      var screen = document
        .querySelector(".Window_Admin")
        .querySelector(".osjs-window-content").clientHeight;
      that.setState({ windowSize: screen });
    }, 100);
  };

  componentDidMount() {
    $(document).ready(function() {
      $("#componentsBox").hide();

      $(document).on("click", ".moduleBtn", function() {
        $(".DashBG").fadeOut(), $("#componentsBox").show();
      });

      $(document).on("click", ".moduleBtn", function() {
        $(".DashBG").fadeOut(), $("#componentsBox").show();
      });
    });
    this.resizeEvent();
  }

  showMainPage = () => {
    this.hideMenu();
    $("#componentsBox").hide(), $(".DashBG").show();
    ReactDOM.render(<div />, document.getElementById("componentsBox"));
  };

  hideMenu = () => {
    this.setState({
      showMenu: false
    });
  };

  showMenu = () => {
    this.setState({
      showMenu: true
    });
  };

  launchExternalApp = appName => {
    this.hideMenu();
    this.core.run(appName);
  };
  
  errorLogAdminClick = e => {
    this.hideMenu();
    ReactDOM.render(
      React.createElement(Errorlog, {
        args: this.core,
        userProfile: this.userProfile,
        menu: this.showMenu
      }),
      document.getElementById("componentsBox")
    );
  };

  render() {
    return (
      <div style={{overflowY: 'scroll',maxHeight: '100vh'}}>
        <FormBuilder />
      </div>
    );
  }
}
export default Home;
