
import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import "@progress/kendo-ui";
import FileUploadWithPreview from 'file-upload-with-preview';
import "sass-loader!./public/scss/file-upload-with-preview.min.css";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.proc = this.props.proc;
    this.state = {
      appInEdit: this.props.dataItem || null,
      workflowId: this.props.workflowId || null,
      visibleDialog: false,
      windowWidth: this.proc.windows[0].$content.offsetWidth,
      windowHeight: this.proc.windows[0].$content.offsetHeight,
      top:0,
      left:0,
      show: false
    };
    this.pushFile = this.pushFile.bind(this);
  }

  componentDidMount() {
    M.AutoInit();
    M.updateTextFields();
    this.firstUpload = new FileUploadWithPreview('myFirstImage');
  }
  async pushFile(event) {
    var files = this.firstUpload.cachedFileArray[0];
    let helper = this.core.make("oxzion/restClient");
    let ancFile = await helper.request(
      "v1",
      "/attachment", {
        type: "APP",
        files: files
      },
      "filepost"
      );
    return ancFile;
  }

  async pushData(fileCode,url,method) {
    let helper = this.core.make("oxzion/restClient");
    let startup_options = [];
    if(this.state.appInEdit.autostart){
      startup_options.autostart = this.state.appInEdit.autostart;
    }
    if(this.state.appInEdit.hidden){
      startup_options.hidden = this.state.appInEdit.hidden;
    }
    let orgAddData = await helper.request(
      "v1",
      url,
      {
        name: this.state.appInEdit.name,
        type: "2",
        category: this.state.appInEdit.category,
        description:this.state.appInEdit.description,
        logo: fileCode,
        startup_options:JSON.stringify(startup_options)
      },
      method
      );
    return orgAddData;
  }

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.appInEdit;
    edited[name] = value;
    this.setState({
      appInEdit: edited
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    if (this.props.formAction == "edit") {
      this.pushFile().then(response => {
        var addResponse = response.data.filename[0];
        this.pushData(addResponse,"/app/"+this.state.appInEdit.id,"put");
      });
    } else {
      this.pushFile().then(response => {
        var addResponse = response.data.filename[0];
        this.pushData(addResponse,"/app","post");
      });
      }
      this.props.save();
    };

    render() {
      return (
        <Validator>
        <Window onClose={this.props.cancel} draggable={false} >
        <Grid container spacing={24}>
        <Grid item xs={4}>
        <div className="custom-file-container" data-upload-id="myFirstImage">
        <label><p>Upload App Logo
        <a href="javascript:void(0)" id="clearAncImage" className="custom-file-container__image-clear" 
        title="Clear Image">
        <img style={{width:"30px"}} src="https://img.icons8.com/color/64/000000/cancel.png"/></a>
        </p></label>

        <div className="custom-file-container__image-preview"></div>


        <label className="custom-file-container__custom-file">
        <input type="file" className="custom-file-container__custom-file__custom-file-input" 
        id="customFile" accept="image/*" aria-label="Choose File" />
        <span className="custom-file-container__custom-file__custom-file-control"></span>
        </label>
        </div>
        </Grid>
        <Grid item xs={8}>
        <form
        onSubmit={this.submitData}
        id="applicationForm"
        >
        <Grid container spacing={24}>
        <Grid item xs={12}>
        <TextField
        id="appName"
        type="text"
        fullWidth
        className="validate"
        name="name"
        label="Application Name"
        value={this.state.appInEdit.name || ""}
        onChange={this.onDialogInputChange}
        required={true}
        />
        </Grid>
        </Grid>


        <Grid container spacing={24} style={{display:'none'}} >
        <Grid item xs={12}>
        <TextField
        id="type"
        type="text"
        label="type"
        fullWidth
        className="validate"
        name="type"
        value="2"
        onChange={this.onDialogInputChange}
        />
        </Grid>
        </Grid>
        <Grid container spacing={24}>
        <Grid item xs={12}>
        <TextField
        id="appDescription"
        label="Description"
        name="description"
        rowsMax="4"
        fullWidth
        value={this.state.appInEdit.description || ""}
        onChange={this.onDialogInputChange}
        required={true}
        />
        </Grid>
        </Grid>


        <Grid container spacing={24}>
        <Grid item xs={12}>
        <TextField
        id="appCategory"
        className="validate"
        name="category"
        label="Category"
        fullWidth
        value={this.state.appInEdit.category || ""}
        onChange={this.onDialogInputChange}
        required={true}
        />
        </Grid>
        </Grid>
        <Grid container spacing={24}>
        <Grid item xs={12}>
        <FormControlLabel
        control={
          <Checkbox
          id="autostart"
          type="checkbox"
          className="switch"
          name="autostart"
          checked={this.state.appInEdit.autostart || ""}
          onChange={this.onDialogInputChange}
          />
        }
        label="Auto Start?"
        />
        </Grid>
        </Grid>
        <Grid container spacing={24}>
        <Grid item xs={12}>
        <FormControlLabel
        control={
          <Checkbox
          id="hidden"
          type="checkbox"
          className="switch"
          name="hidden"
          checked={this.state.appInEdit.hidden || ""}
          onChange={this.onDialogInputChange}
          />
        }
        label="Hidden"
        />
        </Grid>
        </Grid>
        <Grid container spacing={24}>
        <Grid item xs={6}>
        <Button variant="contained" color="primary" onClick={this.props.cancel}>
        Cancel
        </Button>
        <Button variant="contained" color="secondary" 
        type="submit"
        form="applicationForm"
        >
        Save
        </Button>
        </Grid>
        </Grid>
        </form>
        </Grid>
        </Grid>
        </Window>
        </Validator>
        );
      }
    }
