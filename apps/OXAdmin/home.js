import React from "react";

import "jquery/dist/jquery.js";
import $ from "jquery";

import Organization from "./modules/Organization";
import Project from "./modules/Project";
import User from "./modules/User";
import Group from "./modules/Group";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  componentDidMount() {
    $(document).ready(function() {
      $("#componentsBox").hide();

      $("#orgButton").click(function() {
        $(".DashBG").fadeOut(),
          $("#componentsBox").show(),
          $("#organization").fadeIn(),
          $("#groupPage").hide(),
          $("#project").hide(),
          $("#userPage").hide();
      });

      $("#groupButton").click(function() {
        $(".DashBG").fadeOut(),
          $("#componentsBox").show(),
          $("#organization").hide(),
          $("#groupPage").fadeIn(),
          $("#project").hide(),
          $("#userPage").hide();
      });

      $("#prjButton").click(function() {
        $(".DashBG").fadeOut(),
          $("#componentsBox").show(),
          $("#project").show(),
          $("#userPage").hide(),
          $("#organization").hide(),
          $("#groupPage").hide();
      });

      $("#userButton").click(function() {
        $(".DashBG").fadeOut(),
          $("#componentsBox").show(),
          $("#project").hide(),
          $("#organization").hide(),
          $("#groupPage").hide(),
          $("#userPage").show();
      });

      $("#goBack").click(function() {
        $("#componentsBox").hide(), $(".DashBG").show();
      });

      $("#goBack2").click(function() {
        $("#componentsBox").hide(), $(".DashBG").show();
      });

      $("#goBack3").click(function() {
        $("#componentsBox").hide(), $(".DashBG").show();
      });

      $("#goBack4").click(function() {
        $("#componentsBox").hide(), $(".DashBG").show();
      });

      $("#goBack5").click(function() {
        $("#componentsBox").hide(), $(".DashBG").show();
      });
    });
  }

  render() {
    return (
      <div>
        <div
          className="DashBG"
          style={{
            paddingBottom: "200px",
            backgroundImage: "url(apps/OXAdmin/wait.jpg)",
            backgroundSize: "auto"
          }}
        >
          <center>
            <div>
              <div id="adminHeader">Admin Control Center</div>
            </div>
            <div className="row" id="appRow">
              <div className="col s4">
                <div id="d1">
                  <img
                    src="apps/OXAdmin/org.svg"
                    className="App-logo"
                    id="orgButton"
                    alt="Responsive image"
                    onClick={this.onItemClick}
                  />
                </div>
                <p> Organization </p>
              </div>
              <div className="col s4">
                <div id="d1">
                  <img
                    src="apps/OXAdmin/group.svg"
                    className="App-logo"
                    id="groupButton"
                    alt="Responsive image"
                  />
                </div>
                <p>Groups</p>
              </div>

              <div className="col s4">
                <div id="d1">
                  <img
                    src="apps/OXAdmin/101-project.svg"
                    className="App-logo"
                    id="prjButton"
                    alt="Responsive image"
                  />
                </div>
                <p>Tiles</p>
              </div>
            </div>

            <div className="row" id="appRow">
              <div className="col s4">
                <div id="d1">
                  <img
                    src="apps/OXAdmin/115-manager.svg"
                    className="App-logo"
                    id="userButton"
                    alt="Responsive image"
                  />
                </div>
                <p>Users</p>
              </div>

              <div className="col s4">
                <div id="d1">
                  <img
                    src="apps/OXAdmin/005-workflow.svg"
                    className="App-logo"
                    id="userButton"
                    alt="Responsive image"
                  />
                </div>
                <p>Privileges</p>
              </div>

              <div className="col s4">
                <div id="d1">
                  <img
                    src="apps/OXAdmin/056-development-1.svg"
                    className="App-logo"
                    alt="Responsive image"
                  />
                </div>
                <p>App Builder</p>
              </div>
            </div>
          </center>
        </div>
        <div id="componentsBox">
          <Organization args={this.core} />
          <Project />
          <Group />
          <User args={this.core} />
        </div>
      </div>
    );
  }
}
export default Home;
