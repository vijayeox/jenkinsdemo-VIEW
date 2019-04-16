import React from "react";
import ReactDOM from 'react-dom';
import {
  Dialog,
  DialogActionsBar
} from "@progress/kendo-react-dialogs";
import "@progress/kendo-ui";
import "jquery/dist/jquery.js";
import $ from "jquery";
import FileUploadWithPreview from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/file-upload-with-preview.min.css'

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.firstUpload = null;
    this.state = {
      ancInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false
    };
    this.pushFile = this.pushFile.bind(this);
  }

  componentDidMount() {
    M.AutoInit();
    $('.materialize-textarea').trigger('autoresize');
    M.updateTextFields();
    M.textareaAutoResize($("#ancDescription"));

    this.firstUpload = new FileUploadWithPreview('myFirstImage');
  }

  async pushData(fileCode) {
    let helper = this.core.make("oxzion/restClient");
    let ancAddData = await helper.request(
      "v1",
      "/announcement", {
        name: this.state.ancInEdit.name,
        media: fileCode,
        status: "1",
        description: this.state.ancInEdit.description
      },
      "post"
    );
    return ancAddData;
  }

  async pushFile(event) {
    var files = this.firstUpload.cachedFileArray[0];
    let helper = this.core.make("oxzion/restClient");
    let ancFile = await helper.request(
      "v1",
      "/attachment", {
        type: "ANNOUNCEMENT",
        files: files
      },
      "filepost"
    );
    return ancFile;
  }


  async editAnnouncements(fileCode) {
    let helper = this.core.make("oxzion/restClient");
    let orgEditData = await helper.request(
      "v1",
      "/announcement/" + this.state.ancInEdit.id, {
        id: this.state.ancInEdit.id,
        name: this.state.ancInEdit.name,
        media: this.state.ancInEdit.media,
        status: this.state.ancInEdit.status,
        description: this.state.ancInEdit.description,

        name: this.state.ancInEdit.name,
        media: fileCode,
        status: "1",
        description: this.state.ancInEdit.description

      },
      "put"
    );
  }

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.ancInEdit;
    edited[name] = value;

    this.setState({
      ancInEdit: edited
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.props.formAction == "edit") {
      this.pushFile().then(response => {
        var addResponse = response.data.filename[0];
        this.editAnnouncements(addResponse);
      });
    } else {
      this.pushFile().then(response => {
        var addResponse = response.data.filename[0];
        this.pushData(addResponse);
      });
    }
    this.props.save();
  };

  render() {
    return (
      <Dialog onClose={this.props.cancel}>
        <div className="row">
          <form
            className="col s12"
            onSubmit={this.handleSubmit}
            id="announcementForm"
          >
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="AncName"
                  type="text"
                  className="validate"
                  name="name"
                  value={this.state.ancInEdit.name || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="AncName">Announcement Title</label>
              </div>
            </div>


            <div className="row">
              <div className="input-field col s12">
                <textarea
                  id="ancDescription"
                  type="text"
                  className="materialize-textarea validate"
                  name="description"
                  value={this.state.ancInEdit.description || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="ancDescription">Description</label>
              </div>
            </div>
          </form>
      
          <div className="row">
            <div className="col s12">
              <div className="custom-file-container" data-upload-id="myFirstImage">
                <label><p>Upload Announcement Image
                  <a href="javascript:void(0)" id="clearAncImage" className="custom-file-container__image-clear" 
                   title="Clear Image">
                  <img style={{width:"30px"}} src="https://img.icons8.com/color/64/000000/cancel.png"/></a>
                  </p></label>
                <label className="custom-file-container__custom-file">
                  <input type="file" className="custom-file-container__custom-file__custom-file-input" 
                  id="customFile" accept="image/*" aria-label="Choose File" />
                  <span className="custom-file-container__custom-file__custom-file-control"></span>
                </label>
                <div className="custom-file-container__image-preview"></div>
              </div>
            </div>
          </div>

        </div>


        <DialogActionsBar args={this.core}>
          <button className="k-button" onClick={this.props.cancel}>
            Cancel
            </button>
          <button
            className="k-button k-primary"
            type="submit"
            form="announcementForm"
          >
            Save
            </button>
        </DialogActionsBar>
      </Dialog>
    );
  }
}