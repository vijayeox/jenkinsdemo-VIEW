import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.js';
import $ from 'jquery';

import Org from './modules/Org';   
import Prj from './modules/Prj';   
import User from './modules/User';   
import Group from './modules/Group';   


class Dash extends React.Component {

  componentDidMount() {
    $(document).ready(function () {
      $("#componentsBox").hide();

      $("#orgButton").click(function () {
        $(".DashBG").hide(),
        $("#componentsBox").show(),
        $("#organisation").show(),
        $("#groupPage").hide(),
        $("#project").hide()

      });

      $("#groupButton").click(function () {
        $(".DashBG").hide(),
        $("#componentsBox").show(),
        $("#groupPage").show(),
        $("#project").hide(),
        $("#organisation").hide()

      });

      $("#prjButton").click(function () {
        $(".DashBG").hide(),
        $("#componentsBox").show(),
        $("#project").show(),
        $("#organisation").hide(),
        $("#groupPage").hide()

      });
      

      $("#goBack").click(function () {
        $("#componentsBox").hide(),
        $(".DashBG").show()
      });

      
      $("#goBack2").click(function () {
        $("#componentsBox").hide(),
        $(".DashBG").show()
      });

      $("#goBack3").click(function () {
        $("#componentsBox").hide(),
        $(".DashBG").show()
      });

    });
  }



  render() {
    return (
      <div>

        <div className="DashBG">
          <center>
            <div className="container">
              <div className="jumbotron" id="set1" >
                <h1 className="mainHead">Admin Control Center</h1>
              </div>
            </div>


            <div className="d-flex justify-content-center">

              <div>
                <div id="d1">
                  <img src="icons/svg/org.svg" className="img-fluid" id="orgButton" alt="Responsive image" onClick={this.onItemClick} />
                </div>
                <h5>Organisation</h5>
              </div>

              <div>
                <div id="d1">
                  <img src="icons/svg/group.svg" className="img-fluid" id="groupButton" alt="Responsive image" />
                </div>
                <h5>Groups</h5>
              </div>

              <div>
                <div id="d1">
                  <img src="icons/svg/101-project.svg" className="img-fluid" id="prjButton"  alt="Responsive image" />
                </div>
                <h5>Projects</h5>
              </div>

            </div>

            <div className="d-flex justify-content-center">
              <div>
                <div id="d1">

                  <img src="icons/svg/115-manager.svg" className="img-fluid" alt="Responsive image" />

                </div>
                <h5>User</h5>

              </div>

              <div>
                <div id="d1">

                  <img src="icons/svg/056-development-1.svg" className="img-fluid" alt="Responsive image" />

                </div>
                <h5>App Builder</h5>

              </div>

            </div>

          </center>

        </div>
<div id="componentsBox">
<Org/>
<Prj/>
<Group/>
</div>

      </div>
    )
  }
}


export default Dash;
