import React, { Component } from "react";
import ImagePicker from './ImagePicker.js';
import Webcam from './Webcam.js';
import ReactDOM from 'react-dom';
class Imagewindow extends Component {

  constructor(props){
    super(props);
    this.core=this.props.args;
    this.userprofile = this.core.make('oxzion/profile').get();
    this.state={
      imageBox:false,
      webcamcomponent:false,
      imageWindowWrapper:true
    }
 }

  componentDidMount() {

    function ready(fn) {
      if (
        document.attachEvent
        ? document.readyState === "complete"
        : document.readyState !== "loading"
        ) 
      {
        fn();
      } else {
        document.addEventListener("DOMContentLoaded", fn);
      }
    }
    self=this;

    ready(function() {
       self.setState({
           imageBox:false,
           webcamcomponent:false
       })
        // document.getElementById("imageBox").style.display = "none";
        // document.getElementById("webcamcomponent").style.display = "none";
    });


    var myEl2 = document.getElementById("img1");
    if (myEl2) {
      myEl2.addEventListener(
        "click",
        function() {
           self.setState({
           imageBox:true,
           webcamcomponent:false,
           // imageWindowWrapper:false
         })
          // document.getElementById("imageBox").style.display = "";
          // document.getElementById("webcamcomponent").style.display = "none";
          document.getElementById("imageWindowWrapper").style.display = "none";
        },
        false
        );
    }

    var myEl3 = document.getElementById("goBack1");
    if (myEl3) {
      myEl3.addEventListener(
        "click",
        function() {
          self.setState({
           imageBox:false,
           webcamcomponent:false,
           // imageWindowWrapper:true
         })
          // document.getElementById("imageBox").style.display = "none";
          document.getElementById("imageWindowWrapper").style.display = "";
        },
        false
        );
    }

    var myEl4 = document.getElementById("webcam");
    if (myEl4) {
      myEl4.addEventListener(
        "click",
        function() {
          self.setState({
           imageBox:false,
           webcamcomponent:true,
           // imageWindowWrapper:false
         })
          // document.getElementById("webcamcomponent").style.display = "";
          // document.getElementById("imageBox").style.display = "none";
          document.getElementById("imageWindowWrapper").style.display = "none";
        },
        false
        );
    }

    var myEl5 = document.getElementById("goBack2");
    if (myEl5) {
      myEl5.addEventListener(
        "click",
        function() {
          self.setState({
           imageBox:false,
           webcamcomponent:false,
           // imageWindowWrapper:true
         })
          // document.getElementById("webcamcomponent").style.display = "none";
          document.getElementById("imageWindowWrapper").style.display = "";
        },
        false
        );
    }
}

render() {
    // const style=!this.state.visible?{"display":"none"}:{};

  return (

   <div className="bgimg" style={{height:"100%"}}>    
   <div id="imageWindowWrapper" style={{height:"100%",width:"100%",backgroundImage:"url(./apps/ImageUploader/bg.png)"}} onClick={this.refresh}>
   <center><div id="img1" style={{float:"left",width:"50%"}}>
   <img id="imgcrop1" 
   src="./apps/ImageUploader/gallery.png" 
   alt="hjfdjsafjs"
   className="responsive-img imagelabel"
   style={{cursor:"pointer"}}/>
   <h5 className="imagelabel" style={{cursor:"pointer"}}>Choose from gallery</h5>
   </div>
   </center>
   <center> 
   <div id="webcam" style={{float:"right",width:"50%"}}>
   <img id="imgcrop1"
   src="./apps/ImageUploader/camera.png"
   className="responsive-img imagelabel" style={{cursor:"pointer"}}/>
   <h5 className="imagelabel1" style={{cursor:"pointer"}}>Take Picture</h5>

   </div>
   </center>
   </div>
   <div className="file-field input-field img1" id="imageBox">
   <ImagePicker args={this.core} visible={this.state.imageBox}/>
   </div>
   <div className="file-field input-field webcam" id="webcamcomponent">
   <Webcam args={this.core} visible={this.state.webcamcomponent}/>
   </div>
   </div>
   );
}
}
export default Imagewindow ;


