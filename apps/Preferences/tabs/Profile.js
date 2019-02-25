import React, { Component } from "react";
// import "./Sample.css";
import EditProfile from "./EditProfile";
import Img1 from "./Img1.js";
import Webcam from "./Webcam.js";
// import { relativeTimeRounding } from "moment";

class Profile extends Component {
  constructor(props) {
    super(props);
   this.core = this.props.args;
     
   
   this.state = {
     
     userprofile:"",
     file: "",
     dateString:"",
     date1:"",
     refereshPage:false
   };

   this.getUserProfile().then(response => {
    this.setState({userprofile :response.data});
    console.log(this.state.userprofile);

  });
    
   this.handleFileChange = this.handleFileChange.bind(this);
   this.formatDate=this.formatDate.bind(this);
   this.refereshandler=this.refereshandler.bind(this);
  }

formatDate(string){
    var options = {  day: 'numeric', month: 'long' };
    return new Date(string).toLocaleDateString([],options);
}
  
refereshandler=()=>{
  this.setState({
      refereshPage:true
  });
  this.getUserProfile().then(response => {
    this.setState({userprofile :response.data});

  });


}
 

  async getUserProfile() {
    
    // call to api using wrapper
    let helper = this.core.make('oxzion/restClient');
    let userprofile = await helper.request('v1','/user/me/m', {}, 'get' );
    console.log(userprofile);

    return userprofile;
  }


    
  componentDidMount() {
    function ready(fn) {
      if (
        document.attachEvent
          ? document.readyState === "complete"
          : document.readyState !== "loading"
      ) {
        fn();
      } else {
        document.addEventListener("DOMContentLoaded", fn);
      }
    }
    ready(function() {
      document.getElementById("editProfileBox").style.display = "none";
      document.getElementById("imageBox").style.display = "none";
      document.getElementById("webcamcomponent").style.display = "none";
    });

    var myEl = document.getElementById("edit1");
    if (myEl) {
      myEl.addEventListener(
        "click",
        function() {
          document.getElementById("editProfileBox").style.display = "";
          document.getElementById("cardUi").style.display = "none";
        },
        false
      );
    }
    var myEl1 = document.getElementById("goBack");
    if (myEl1) {
      myEl1.addEventListener(
        "click",
        function() {
          document.getElementById("editProfileBox").style.display = "none";
          document.getElementById("cardUi").style.display = "";
        },
        false
      );
    }


    var myEl2 = document.getElementById("img1");
    if (myEl2) {
      myEl2.addEventListener(
        "click",
        function() {
          document.getElementById("cardUi").style.display = "none";
          document.getElementById("imageBox").style.display = "";
          document.getElementById("editProfileBox").style.display = "none";
        },
        false
      );
    }

    var myEl3 = document.getElementById("goBack1");
    if (myEl3) {
      myEl3.addEventListener(
        "click",
        function() {
          document.getElementById("imageBox").style.display = "none";
          document.getElementById("cardUi").style.display = "";
        },
        false
      );
    }

    var myEl4 = document.getElementById("webcam");
    if (myEl4) {
      myEl4.addEventListener(
        "click",
        function() {
          document.getElementById("cardUi").style.display = "none";
          document.getElementById("webcamcomponent").style.display = "";
          document.getElementById("editProfileBox").style.display = "none";
        },
        false
      );
    }

    var myEl5 = document.getElementById("goBack2");
    if (myEl5) {
      myEl5.addEventListener(
        "click",
        function() {
          document.getElementById("webcamcomponent").style.display = "none";
          document.getElementById("cardUi").style.display = "";
        },
        false
      );
    }

    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems, { inDuration: 250 });
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

  init() {}

  render() {


   this.dateString = this.state.userprofile.dob;
    this.date1= this.formatDate(this.dateString);

    return (
      <div>
      <div>
        <div
          className="card"
          id="cardUi"
          ui-sref='forsaleitem({type:"interior"})'>
          <div className="row" id="cardwidth">
            <div className="col s12">
              <div className="col s2">
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
                    <label className="name">{this.state.userprofile.name}</label>
                    <br />
                    <label className="name">{this.state.userprofile.designation}</label>
                  </center>

                </div>
              </div>
              <div className="col s1" id="line" />
              <div className="col s4">
                <i className="fa fa-envelope" id="iconi" />
                <label id="label1">{this.state.userprofile.email}</label>
                <br/>

                <i className="fa fa-phone" id="iconi" />
                <label id="label1">{this.state.userprofile.phone}</label>
                <br />
                
                <div id="add">
                <i className="fa fa-location-arrow"/>
                <label id="label1">
                {this.state.userprofile.address}
                  </label>
                </div>
                <br />

                <i className="fa fa-map-marker" id="iconi" />
                <label id="label1" className="m-4">
                {this.state.userprofile.country}
                </label>
                <br/>

                <i className="fa fa-birthday-cake" id="iconi" />
                <label id="label1">{this.date1}</label> 
                <br/>

                <i className="fa fa-heart" id="iconi" />
                <label id="label1">{this.state.userprofile.interest}</label>
                <br/>

              </div>
              <div className="col s1" />
              <div className="col s2">
                <div id="edit1">
                  <a>
                    <i className="fa fa-edit" id="iconi" />
                    Edit
                  </a>
                </div>

                <div>
                  <a
                    className="waves-effect waves-light modal-trigger"
                    href="#modal1"
                  >
                    <i className="fa fa-camera" id="iconi" />
                    Profile Pic
                  </a>
                  <div id="modal1" className="modal">
                    <div className="modal-content">
                      <h3>Choose appropriate method</h3>
                      <div id="img1">
                        <a href="#!" className="modal-close waves-effect waves-light btn fa fa-image">
                          {" "}
                          Choose from Gallery
                        </a>
                      </div>
                      <br />
                      <br />
                      <div id="webcam">
                        <a href="#!" className="modal-close waves-effect waves-light btn fa fa-camera">
                          {" "}
                          Take Picture
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="editProfileBox">

          <EditProfile args={this.core} action={this.refereshandler}/>

        </div>
        <div className="file-field input-field img1" id="imageBox">
          <Img1 />
        </div>
        <div className="file-field input-field webcam" id="webcamcomponent">
          <Webcam />
        </div>
      </div>

</div>
    );
  }
  

}
export default Profile;
