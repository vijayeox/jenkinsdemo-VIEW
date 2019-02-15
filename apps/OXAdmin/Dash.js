import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "jquery/dist/jquery.js";
import $ from "jquery";
import osjs from "osjs";

import Org from "./modules/Org";
import Prj from "./modules/Prj";
import User from "./modules/User";
import Group from "./modules/Group";

class Dash extends React.Component {
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
          $("#organisation").fadeIn(),
          $("#groupPage").hide(),
          $("#project").hide(),
          $("#userPage").hide();
      });

      $("#groupButton").click(function() {
        $(".DashBG").fadeOut(),
          $("#componentsBox").show(),
          $("#organisation").hide(),
          $("#groupPage").fadeIn(),
          $("#project").hide(),
          $("#userPage").hide();
      });

      $("#prjButton").click(function() {
        $(".DashBG").fadeOut(),
          $("#componentsBox").show(),
          $("#project").show(),
          $("#userPage").hide(),
          $("#organisation").hide(),
          $("#groupPage").hide();
      });

      $("#userButton").click(function() {
        $(".DashBG").fadeOut(),
          $("#componentsBox").show(),
          $("#project").hide(),
          $("#organisation").hide(),
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
        <div className="DashBG" style={{ marginBottom: "200px" }}>
          <center>
            <div className="container">
              <div className="jumbotron" id="set1">
                <h1 className="mainHead">Admin Control Center</h1>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div>
                <div id="d1">
                  <img
                    src="apps/OXAdmin/org.svg"
                    className="img-fluid"
                    id="orgButton"
                    alt="Responsive image"
                    onClick={this.onItemClick}
                  />
                </div>
                <h5>Organisation</h5>
              </div>

              <div>
                <div id="d1">
                  <img
                    src="apps/OXAdmin/group.svg"
                    className="img-fluid"
                    id="groupButton"
                    alt="Responsive image"
                  />
                </div>
                <h5>Groups</h5>
              </div>

              <div>
                <div id="d1">
                  <img
                    src="apps/OXAdmin/101-project.svg"
                    className="img-fluid"
                    id="prjButton"
                    alt="Responsive image"
                  />
                </div>
                <h5>Projects</h5>
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <div>
                <div id="d1">
                  <img
                    src="apps/OXAdmin/115-manager.svg"
                    className="img-fluid"
                    id="userButton"
                    alt="Responsive image"
                  />
                </div>
                <h5>User</h5>
              </div>

              <div>
                <div id="d1">
                  <img
                    src="apps/OXAdmin/056-development-1.svg"
                    className="img-fluid"
                    alt="Responsive image"
                  />
                </div>
                <h5>App Builder</h5>
              </div>
            </div>
          </center>
        </div>
        <div id="componentsBox">
          <Org args={this.core} />
          <Prj />
          <Group />
          <User />
        </div>
      </div>
    );
  }
}
export default Dash;
