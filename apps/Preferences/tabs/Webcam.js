import React, { Component } from "react";
import Camera,{IMAGE_TYPES} from "react-html5-camera-photo";
import "./Sample.css";
class Webcam extends Component {
  enableWebcam = () => this.setState({ webcamEnabled: true });
  disableWebcam = () => this.setState({ webcamEnabled: false });

  constructor(props) {
    super(props);
        this.core = this.props.args;
        this.userprofile = this.core.make('oxzion/profile').get();

    this.state = {
      img: "",
      webcamEnabled: false,
      // profileImage:{}
      fields:{}
    };
    this.onTakePhoto = this.onTakePhoto.bind(this);
    this.addDefaultSrc=this.addDefaultSrc.bind(this);
            this.handleSubmit=this.handleSubmit.bind(this);

      }

    onTakePhoto(dataUri) {
      this.setState({
      img: dataUri
     });
   }

   addDefaultSrc(ev) {
    ev.target.src = this.userprofile.key.icon
    }

    handleSubmit(event) {
       event.preventDefault();
       const formData = {};

     formData.file=this.state.img;
     this.state.fields.file=formData.file;
      Object.keys(this.state.fields).map(key => {
        formData[key] = this.state.fields[key];
      });

      console.log(formData);
     let helper = this.core.make("oxzion/restClient");

      let uploadresponse = helper.request(
        "v1",
        "/user/profile",
        formData,
        "post"
      );
      if (uploadresponse.status == "error") {
        alert(uploadresponse.message);
      }else{
        alert("Successfully Updated");
   
   }

     
   }


   render() {
    return (
      <div>
            <form onSubmit={this.handleSubmit}>

      <div className="row">
      <div className="col s3"><img id="imgcrop" name="file" src={this.state.img} height="150" width="150"  onError={this.addDefaultSrc}
      />  
    </div> 
    <div className="col s1">
        <button className="waves-effect waves-light btn" type="submit">
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
            imageType = {IMAGE_TYPES.PNG}

  
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
                   </form>

      </div>
    );
  }
}

export default Webcam;
