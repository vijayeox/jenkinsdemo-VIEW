import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Organization from "./modules/Organization";
import Project from "./modules/Project";
import User from "./modules/User";
import Group from "./modules/Group";
import Role from "./modules/Roles";
import Announcement from "./modules/Announcement";
import Application from "./modules/Application";
import { slide as Menu } from "react-burger-menu";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      value: "1",
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

  createBlock = () => {
    let table = [];
    if (this.state.value == 1) {
      table.push(
        <div key="1">
          <div
            style={{ display: "inline-grid" }}
            className="moduleBtn"
            onClick={this.orgClick}
          >
            <div className="block d1">
              <img src="apps/Admin/org.svg" className="App-logo" />
            </div>
            <div className="titles">Organization</div>
          </div>

          <div
            style={{ display: "inline-grid" }}
            className="moduleBtn"
            onClick={this.userClick}
          >
            <div className="block d1">
              <img src="apps/Admin/115-manager.svg" className="App-logo" />
            </div>
            <div className="titles">Users</div>
          </div>

          <div
            style={{ display: "inline-grid" }}
            className="moduleBtn"
            onClick={this.roleClick}
          >
            <div className="block d1">
              <img src="apps/Admin/005-workflow.svg" className="App-logo" />
            </div>
            <div className="titles">Roles</div>
          </div>

          <div
            style={{ display: "inline-grid" }}
            className="moduleBtn"
            onClick={this.groupClick}
          >
            <div className="block d1">
              <img src="apps/Admin/group.svg" className="App-logo" />
            </div>
            <div className="titles">Groups</div>
          </div>

          <div
            style={{ display: "inline-grid" }}
            className="moduleBtn"
            onClick={this.prjClick}
          >
            <div className="block d1">
              <img src="apps/Admin/101-project.svg" className="App-logo" />
            </div>
            <div className="titles">Projects</div>
          </div>

          <div
            style={{ display: "inline-grid" }}
            className="moduleBtn"
            onClick={this.announClick}
          >
            <div className="block d1">
              <img src="apps/Admin/131-laptop.svg" className="App-logo" />
            </div>
            <div className="titles">Announcements</div>
          </div>

          <div style={{ display: "inline-grid" }} onClick={this.mailAdminClick}>
            <div className="block d1">
              <img
                src="apps/Admin/091-email-1.svg"
                className="App-logo"
                style={{ width: "100%" }}
              />
            </div>
            <div className="titles">Mail Admin</div>
          </div>

          <div style={{ display: "inline-grid" }} onClick={this.taskAdminClick}>
            <div className="block d1">
              <img
                src="apps/Admin/042-task.svg"
                className="App-logo"
                style={{ width: "100%" }}
              />
            </div>
            <div className="titles">Task Admin</div>
          </div>

          {/* <div style={{ display: "inline-grid" }}>
            <div className="block d1" onClick={this.appClick}>
              <img
                src="apps/Admin/102-production.svg"
                className="moduleBtn App-logo"
              />
            </div>
            <div className="titles">Apps</div>
          </div> */}
        </div>
      );
    }

    return table;
  };

  orgClick = e => {
    this.hideMenu();
    ReactDOM.render(
      <Organization args={this.core} menu={this.showMenu} />,
      document.getElementById("componentsBox")
    );
  };

  groupClick = e => {
    this.hideMenu();
    ReactDOM.render(
      <Group args={this.core} menu={this.showMenu} />,
      document.getElementById("componentsBox")
    );
  };

  prjClick = e => {
    this.hideMenu();
    ReactDOM.render(
      <Project args={this.core} menu={this.showMenu} />,
      document.getElementById("componentsBox")
    );
  };

  userClick = e => {
    this.hideMenu();
    ReactDOM.render(
      <User args={this.core} menu={this.showMenu} />,
      document.getElementById("componentsBox")
    );
  };

  roleClick = e => {
    this.hideMenu();
    ReactDOM.render(
      <Role args={this.core} menu={this.showMenu} />,
      document.getElementById("componentsBox")
    );
  };

  announClick = e => {
    this.hideMenu();
    ReactDOM.render(
      <Announcement args={this.core} menu={this.showMenu} />,
      document.getElementById("componentsBox")
    );
  };

  appClick = e => {
    this.hideMenu();
    ReactDOM.render(
      <Application args={this.core} menu={this.showMenu} />,
      document.getElementById("componentsBox")
    );
  };

  mailAdminClick = e => {
    this.hideMenu();
    this.core.run("MailAdmin");
  };

  taskAdminClick = e => {
    this.hideMenu();
    this.core.run("TaskAdmin");
  };

  render() {
    return (
      <div
        id="admin-outer-container"
        style={{
          backgroundColor: "#ffffff",
          backgroundSize: "cover",
          height: this.state.windowSize || "32rem"
        }}
      >
        <Menu
          width={"28%"}
          isOpen={this.state.showMenu}
          disableAutoFocus
          pageWrapId={"admin-page-wrap"}
          outerContainerId={"admin-outer-container"}
          customBurgerIcon={false}
          onStateChange={e => {
            this.setState({
              showMenu: e.isOpen
            });
          }}
          styles={{
            bmMenuWrap: {
              position: "absolute"
            },
            bmOverlay: {
              height: this.state.windowSize,
              display: this.state.showMenu ? "flex" : "none"
            },
            bmMenu: { height: this.state.windowSize }
          }}
        >
          <div onClick={this.showMainPage} style={{ paddingLeft: "0px" }}>
            <div className="titles" style={{ textAlign: "center" }}>
              Main Page
            </div>
          </div>

          <div className="dashIcons" style={{ display: "flex" }}>
            {this.createBlock()}
          </div>
        </Menu>

        <div className="DashBG" style={{ height: "100%" }} id="admin-page-wrap">
          <div
            style={{ height: "100%", display: "flex", alignItems: "center" }}
          >
            <div className="dashIcons">{this.createBlock()}</div>
          </div>
        </div>
        <div id="componentsBox" style={{ height: "inherit" }} />
      </div>
    );
  }
}
export default Home;
