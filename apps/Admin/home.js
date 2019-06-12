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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      value: "1",
      windowSize: undefined
    };
    this.resizeEvent = this.resizeEvent.bind(this);
    document
      .getElementsByClassName("Window_Admin")[0]
      .addEventListener("windowResize", this.resizeEvent, false);
  }

  resizeEvent = e => {
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

      $('#componentsBox').on("click", ".goBack", function() {
        $("#componentsBox").hide(), $(".DashBG").show();
        ReactDOM.render(<div />, document.getElementById("componentsBox"));
      });
    });
    this.resizeEvent();
  }

  createBlock = () => {
    let table = [];

    if (this.state.value == 1) {
      table.push(
        <div key="1">
          <div style={{ display: "inline-grid" }}>
            <div className="block d1" onClick={this.orgClick}>
              <img src="apps/Admin/org.svg" className="moduleBtn App-logo" />
            </div>
            <div className="titles">Organization</div>
          </div>

          <div style={{ display: "inline-grid" }}>
            <div className="block d1" onClick={this.groupClick}>
              <img src="apps/Admin/group.svg" className="moduleBtn App-logo" />
            </div>
            <div className="titles">Groups</div>
          </div>

          <div style={{ display: "inline-grid" }}>
            <div className="block d1" onClick={this.prjClick}>
              <img
                src="apps/Admin/101-project.svg"
                className="moduleBtn App-logo"
              />
            </div>
            <div className="titles">Projects</div>
          </div>

          <div style={{ display: "inline-grid" }}>
            <div className="block d1" onClick={this.userClick}>
              <img
                src="apps/Admin/115-manager.svg"
                className="moduleBtn App-logo"
              />
            </div>
            <div className="titles">Users</div>
          </div>
          <div style={{ display: "inline-grid" }}>
            <div className="block d1" onClick={this.roleClick}>
              <img
                src="apps/Admin/005-workflow.svg"
                className="moduleBtn App-logo"
              />
            </div>
            <div className="titles">Roles</div>
          </div>

          <div style={{ display: "inline-grid" }}>
            <div className="block d1" onClick={this.announClick}>
              <img
                src="apps/Admin/131-laptop.svg"
                className="moduleBtn App-logo"
              />
            </div>
            <div className="titles">Announcements</div>
          </div>

          <div style={{ display: "inline-grid" }}>
            <div className="block d1" onClick={this.mailAdminClick}>
              <img
                src="apps/Admin/091-email-1.svg"
                className="App-logo"
                style={{width:"100%"}}
              />
            </div>
            <div className="titles">Mail Admin</div>
          </div>

          <div style={{ display: "inline-grid" }}>
            <div className="block d1" onClick={this.taskAdminClick}>
              <img
                src="apps/Admin/042-task.svg"
                className="App-logo"
                style={{width:"100%"}}
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
    ReactDOM.render(
      <Organization args={this.core} />,
      document.getElementById("componentsBox")
    );
  };

  groupClick = e => {
    ReactDOM.render(
      <Group args={this.core} />,
      document.getElementById("componentsBox")
    );
  };

  prjClick = e => {
    ReactDOM.render(
      <Project args={this.core} />,
      document.getElementById("componentsBox")
    );
  };

  userClick = e => {
    ReactDOM.render(
      <User args={this.core} />,
      document.getElementById("componentsBox")
    );
  };

  roleClick = e => {
    ReactDOM.render(
      <Role args={this.core} />,
      document.getElementById("componentsBox")
    );
  };

  announClick = e => {
    ReactDOM.render(
      <Announcement args={this.core} />,
      document.getElementById("componentsBox")
    );
  };

  appClick = e => {
    ReactDOM.render(
      <Application args={this.core} />,
      document.getElementById("componentsBox")
    );
  };

  mailAdminClick = e => {
    this.core.run("MailAdmin");
  };

  taskAdminClick = e => {
    this.core.run("TaskAdmin");
  };

  render() {
    return (
      <div
        style={{
          backgroundImage: "url(apps/Admin/wait.jpg)",
          backgroundSize: "cover",
          height: this.state.windowSize || "32rem"
        }}
      >
        <div className="DashBG" style={{ height: "100%" }}>
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
