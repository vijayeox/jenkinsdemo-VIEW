import React, { Component } from "react";
import './Sample.css';
import EditProfile from "./EditProfile";
import "jquery/dist/jquery.js";
import $ from "jquery";
import Img1 from './Img1.js';
import Webcam from './Webcam.js';

class Profile extends Component {
  componentDidMount() {
    $(document).ready(function () {
      $("#componentsBox").hide();
      $("#imageBox").hide();
      $("#webcamcomponent").hide();
    });
    $("#edit1").click(function () {
      $("#componentsBox").show(), $("#cardUi").hide();
    });

    $("#goBack").click(function () {
      $("#componentsBox").hide(), $("#cardUi").show();
    });



    $("#img1").click(function () {
      $("#cardUi").hide(),
        $("#imageBox").show(),
        $("#componentsBox").hide();
    });

    $("#goBack1").click(function () {
      $("#imageBox").hide(), $("#cardUi").show();
    });

    $("#webcam").click(function () {
      $("#cardUi").hide(),
        $("#webcamcomponent").show(),
        $("#componentsBox").hide();
    });

    $("#goBack2").click(function () {
      $("#webcamcomponent").hide(),       
            $("#cardUi").show();
    });

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, { inDuration: 250 });
  }
  constructor() {
    super();
    this.state = {
      file: ""
    };
    this.handleFileChange = this.handleFileChange.bind(this);
  }
  handleFileChange = event => {
    let url =
      event.target.files.length > 0
        ? URL.createObjectURL(event.target.files[0])
        : "";
    this.setState({
      file: url
    });
  };
  addDefaultSrc(ev) {
    ev.target.src = "./apps/Preferences/hicon.png";
  }
  handleChange = () => {
    <EditProfile />;
  };


  init() { }
  render() {
    return (
      <div>
        <div className="card" id="cardUi" ui-sref='forsaleitem({type:"interior"})'>
          <div className="row" id="cardwidth">
            <div className="col s12">
              <div className="col s3">
                <div className="file-field input-field img1">
                  <center>
                    <img
                      id="imgcrop"
                      src={this.state.file}
                      onError={this.addDefaultSrc}
                      height="150"
                      width="150"
                      className="circle responsive-img"
                    />

                  </center>
                  <center>
                    <label className="name">John Peter</label>
                    <br />
                    <label className="name">Sr.Developer</label>
                  </center>
                </div>
              </div>
              <div className="col s1" id="line" />
              <div className="col s4">
                <i className="fa fa-envelope" />
                <label id="label1">name@gmail.com</label>
                <br />

                <i className="fa fa-phone" />
                <label id="label1">+91 9123437764</label>
                <br />

                <i className="fa fa-location-arrow" />
                <div id="add">
                  <label id="label1">
                    sbdjfbskjdbgks jgrhoiwhtoighewotigheohtowhjoqjroqpotpoqjto3tojtgjlkgjlkfj
                </label>
                </div>
                <br />

                <i className="fa fa-map-marker" />
                <label id="label1" className="m-4">
                  India
                </label>
                <br />

                <i className="fa fa-birthday-cake" />
                <label id="label1">Feb 2nd</label>
                <br />

                <i className="fa fa-heart" />
                <label id="label1">dkgnlgnl</label>
                <br />
              </div>
              <div className="col s1"></div>
              <div className="col s2">

                <div id="edit1">
                  <a>
                    <i className="fa fa-edit" />
                    Edit
                </a>
                </div>

                <div>
                  <a className="waves-effect waves-light modal-trigger" href="#modal1">
                    <i className="fa fa-camera" />
                    Profile Pic
                  </a>
                  <div id="modal1" className="modal">
                    <div className="modal-content">
                      <h4>Choose appropriate method</h4>
                      <div id="img1">
                        <a className="waves-effect waves-light btn fa fa-image"> Choose from Gallery</a>
                      </div>
                      <br /><br />
                      <div id="webcam">
                        <a className="waves-effect waves-light btn fa fa-camera"> Take Picture</a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>


        </div>

        <div id="componentsBox">
          <EditProfile />

        </div>
        <div className="file-field input-field img1" id="imageBox">
          <Img1 />

        </div>
        <div className="file-field input-field webcam" id="webcamcomponent">
          <Webcam />

        </div>

      </div>
    );
  }
}
export default Profile;
