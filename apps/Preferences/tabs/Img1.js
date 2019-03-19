import React, { Component }  from "react";
import ReactDom from "react-dom";
import AvatarPicker from "material-ui-avatar-picker";
import createReactClass from "create-react-class";
import { Button } from "@material-ui/core";
import './Sample.css';
import FileUpload from './FileUpload';


class Img1 extends Component {
  constructor(props) {
    super(props);
        self = this;
        this.core = this.props.args;
        // this.userprofile = this.core.make('oxzion/profile').get();
        this.state = {
          // savedImg: this.userprofile.key.icon,
          previewOpen: false,
          img: null,
          fields:{} 
        };
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleRequestHide=this.handleRequestHide.bind(this);
        // this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
 } 


  handleFileChange(dataURI) {
    this.setState({
      img: dataURI,
      savedImg: this.state.savedImg,
      previewOpen: true
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

 // handleChange(e) {
 //    let fields = this.state.fields;
 //    fields[e.target.name] = e.target.src;
 //    this.setState({
 //      fields
 //    });
 //  }

    handleSubmit(event) {
      // return event=>{
       event.preventDefault();
// let formData = new FormData();
// formData.append('file',event.target.file.src);
        // console.log(this.state.image);
      const formData = {};

      formData.file=this.state.savedImg;
       this.state.fields.file=formData.file;
      Object.keys(this.state.fields).map(key => {
        formData[key] = this.state.fields[key];
      });

      // console.log(formData);
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

  render () {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <div className="avatar-photo">
          <Button color="primary">Pick an Image</Button>
          <br/>
          <FileUpload handleFileChange={this.handleFileChange} />
          <img src={this.state.savedImg} name="file" height="200" width="200" className="imgupload"/>          
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
        <button className="waves-effect waves-light btn" id="imgsave" type="submit">
          Save
        </button>

        <div>
            <a className="waves-effect waves-light btn" id="goBack1">Back</a>
        </div>
        </form>
      </div>
    );
  }

}

export default Img1;
