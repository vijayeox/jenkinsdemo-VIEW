import React, { Component }  from "react";
import ReactDom from "react-dom";
import AvatarPicker from "material-ui-avatar-picker";
import createReactClass from "create-react-class";
import { Button } from "@material-ui/core";
import './Imageuploader.css';
import FileUpload from './FileUpload';
import ReactNotification from "react-notifications-component";

class ImagePicker extends Component {
  constructor(props) {
    super(props);
    self = this;
    this.core = this.props.args;
    this.userprofile = this.core.make('oxzion/profile').get();
    this.state = {
      savedImg: this.userprofile.key.icon,
      previewOpen: false,
      img: null,
      fields:{} 
    };
    this.core.on("oxzion/profile:updated",function(){
      this.setState({
         savedImg:this.userprofile.key.icon
      })
    })
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRequestHide=this.handleRequestHide.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.addNotificationFail = this.addNotificationFail.bind(this);
    this.notificationDOMRef = React.createRef();
  } 

  addNotification() {
    this.notificationDOMRef.current.addNotification({
      message: "Uploaded Successfully",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  addNotificationFail(serverResponse) {
    this.notificationDOMRef.current.addNotification({
      message: "Operation Unsuccessfull" + serverResponse,
      type: "danger",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }


  handleFileChange(dataURI) {
    this.setState({
      img: dataURI,
      savedImg: this.state.savedImg,
      previewOpen: true,
    });
  }
  handleSave(dataURI) {
    this.setState({
      previewOpen: false,
      img: null,
      savedImg: dataURI
    });
  }

  handleRequestHide() {
    this.setState({
      previewOpen: false
    });
  }
  async handleSubmit(event) {
   event.preventDefault();
   var str=this.state.savedImg;
   if(str.startsWith("data:image/")) {
     const formData = {};
     formData.file=this.state.savedImg;
     this.state.fields.file=formData.file;
     Object.keys(this.state.fields).map(key => {
      formData[key] = this.state.fields[key];
    });
     let helper = this.core.make("oxzion/restClient");
     let uploadresponse = await helper.request(
      "v1",
      "/user/profile",
      formData,
      "post"
      );
     if (uploadresponse.status == "error") {
         this.addNotificationFail(uploadresponse.message);
    }
    else{
         this.addNotification();
      this.core.make('oxzion/profile').update();
    }
  } 
}

render () {
  const style=!this.props.visible?{
      "display":"none"}:{};

    const dataImg = this.state.savedImg.indexOf('data') != -1 ? {} : {"display" : "none"};
    const urlImg = this.state.savedImg.indexOf('data') != -1 ? {"display" : "none"} : {};  
    return (
      <div className="bgimg" style={style}>
      <ReactNotification ref={this.notificationDOMRef}/>
      
      <form onSubmit={this.handleSubmit}>

      <center> <div className="avatar-photo">
      <Button color="white disabled">Pick an Image</Button>
      <br/>

      <FileUpload handleFileChange={this.handleFileChange}/>
      <img src={this.state.savedImg + '?' + (new Date()).getTime()} style={urlImg}
        name="file" height="200" width="200" className="imgupload"/> 
      
      <img src={this.state.savedImg} style={dataImg}
        name="file" height="200" width="200" className="imgupload"/> 
      
      <div style={{paddingTop:'10px'}}>
      <button className="waves-effect waves-light black btn imgsave2" type="submit">
      Save
      </button>

      <a className="waves-effect waves-light black btn" id="goBack1" style={{paddingLeft:'10px'}}>Back</a>
      </div>

      </div>
      {this.state.previewOpen &&
        <AvatarPicker
        onRequestHide={this.handleRequestHide}
        previewOpen={this.state.previewOpen}
        onSave={this.handleSave}
        image={this.state.img}
        width={300}
        height={300}
        />          
      }
      </center>
      <br/>
      </form>
      </div>
      );
  }
}

export default ImagePicker;
