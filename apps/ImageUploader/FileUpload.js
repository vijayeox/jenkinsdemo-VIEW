import React, { Component }  from "react";
import ReactDom from "react-dom";
import AvatarPicker from "material-ui-avatar-picker";
import createReactClass from "create-react-class";
import { Button } from "@material-ui/core";
import './Imageuploader.css';

class FileUpload extends Component {

  constructor(props){
    super(props);
    this.state = {
      savedImg: props.savedImg,
      previewOpen: false,
      img: null,  
      profile : {}
    };
    this.handleFile=this.handleFile.bind(this);
  }
  handleFile(e) {
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];
    if (!file) return;
    reader.onload = function(e) {
      ReactDom.findDOMNode(self.refs.userInput).value = '';
      self.props.handleFileChange(e.target.result,file);
    };
    reader.readAsDataURL(file);
  }

  render(){
    return (
      <input ref="userInput" className="pickimage" type="file" accept="image/*" onChange={this.handleFile} />
      );
  }
}

export default FileUpload;
