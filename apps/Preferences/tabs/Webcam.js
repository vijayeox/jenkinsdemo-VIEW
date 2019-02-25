import React, { Component } from "react";
import Camera from "react-html5-camera-photo";
import "./Sample.css";
class Webcam extends Component {
  enableWebcam = () => this.setState({ webcamEnabled: true });
  disableWebcam = () => this.setState({ webcamEnabled: false });

  constructor() {
    super();
    this.state = {
      img: "",
      webcamEnabled: false
    };
    this.onTakePhoto = this.onTakePhoto.bind(this);
  }
  onTakePhoto(dataUri) {
    this.setState({
      img: dataUri
    });
  }
  addDefaultSrc(ev) {
    ev.target.src = "./apps/Preferences/hicon.png";
  }


  render() {
    return (
      <div>
      <div className="row">
      <div className="col s3"><img id="imgcrop" src={this.state.img} height="150" width="150"  onError={this.addDefaultSrc}
 />  
</div> 
<div className="col s1">
        <button className="waves-effect waves-light btn">
          Save
        </button>
        </div>
</div>
<br/>
<br/>     

<div>
       {this.state.webcamEnabled ? (
          
          <Camera
            onTakePhoto={dataUri => {
              this.onTakePhoto(dataUri);
            }}
            idealResolution = {{width: 640, height: 480}}
  
          />
          
        ) : (
          <button type="button" id="imgsave" onClick={this.enableWebcam} className="waves-effect waves-light btn fa fa-camera"
          > Enable Webcam
          </button>
          
        )}
        </div>
<div>            </div>

        <div>
        <a
            className="waves-effect waves-light btn"
            id="goBack2"
            onClick={this.disableWebcam}
          >
            Back
          </a>
       
           </div>
      </div>
    );
  }
}

export default Webcam;
