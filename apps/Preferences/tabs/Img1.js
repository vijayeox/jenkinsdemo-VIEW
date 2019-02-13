import React from "react";
import ReactDom from "react-dom";
import AvatarPicker from "material-ui-avatar-picker";
import createReactClass from "create-react-class";
import { Button } from "@material-ui/core";
import './Sample.css';

var Img1 = createReactClass({
  getInitialState: function() {
    return {
      previewOpen: false,
      img: null,
      savedImg: "http://www.placekitten.com/400/400"
    };
  },
  handleFileChange: function(dataURI) {
    this.setState({
      img: dataURI,
      savedImg: this.state.savedImg,
      previewOpen: true
    });
  },
  handleSave: function(dataURI) {
    this.setState({
      previewOpen: false,
      img: null,
      savedImg: dataURI
    });
    console.log(this.state.img);
  },
  handleRequestHide: function() {
    this.setState({
      previewOpen: false
    });
  },
  render () {
    return (
      <div>
        <div className="avatar-photo">
          <Button color="primary">Pick an Image</Button>
          <br/>
          <FileUpload handleFileChange={this.handleFileChange} />
          
          <img src={this.state.savedImg}  height="300"  className="imgupload"/>          
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
     
        <br/>
        <button className="waves-effect waves-light btn" id="imgsave">
          Save
        </button>

        <div>
        <a className="waves-effect waves-light btn" id="goBack1">Back</a>
        </div>
      
      </div>
    );
  }
});

var FileUpload = createReactClass({

  handleFile: function(e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    if (!file) return;

    reader.onload = function(img) {
      ReactDom.findDOMNode(this.refs.in).value = '';
      this.props.handleFileChange(img.target.result);
    }.bind(this);
    reader.readAsDataURL(file);
  },

  render: function() {
    return (
      <input ref="in" type="file" accept="image/*" onChange={this.handleFile} />
    );
  }
});

export default Img1;
