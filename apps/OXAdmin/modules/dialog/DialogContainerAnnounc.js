import React, { Component } from "react";
import ReactDOM from "react-dom";

import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import "../../public/js/materialize.js";
import "../../public/js/filepond.js";
import "@progress/kendo-ui";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      ancInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show: false
    };
  }

  componentDidMount() {
    M.AutoInit();
    M.updateTextFields();
  }

  async pushData() {
    let helper = this.core.make("oxzion/restClient");
    let ancAddData = await helper.request(
      "v1",
      "/announcement",
      {
        id: this.state.ancInEdit.id,
        name: this.state.ancInEdit.name,
        media: this.state.ancInEdit.media,
        status: this.state.ancInEdit.status
      },
      "post"
    );
    return ancAddData;
  }

  async pushFile() {
    let helper = this.core.make("oxzion/restClient");
    let ancFile = await helper.request(
      "v1",
      "/attachment",
      {
        type: "ANNOUNCEMENT",
        files: 'C:\\Users\\VA_User\\Downloads\\batman__dark-wallpaper-1920x1080.jpg'
      },
      "post",
      {
        contentType: false,
 mimeType: "multipart/form-data",
      }
    );
    return ancFile;
  }


  async editAnnouncements() {
    let helper = this.core.make("oxzion/restClient");
    let orgEditData = await helper.request(
      "v1",
      "/announcement/" + this.state.ancInEdit.id,
      {
        id: this.state.ancInEdit.id,
        name: this.state.ancInEdit.name,
        media: this.state.ancInEdit.media,
        status: this.state.ancInEdit.status
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
    this.submitData();
  };

  submitData = event => {
    if (this.props.formAction == "edit") {
      this.editAnnouncements();
    } else {
      this.pushFile().then(response => {
        var addResponse = response.data.id;
        this.props.action(addResponse);
      });
    }
    this.props.save();
  };

  render() {

    return (
      <Validator>
        <Dialog onClose={this.props.cancel}>
          <div className="row">
            <form
              className="col s12"
              onSubmit={this.submitData}
              id="announcementForm"
            >
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="ancID"
                    type="text"
                    className="validate"
                    name="id"
                    value={this.state.ancInEdit.id || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="ancID">ID</label>
                </div>
              </div>

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
                  <input
                    id="ancStatus"
                    type="text"
                    className="validate"
                    name="status"
                    value={this.state.ancInEdit.status || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="ancStatus">Status</label>
                </div>
              </div>


              <div className="row">
                <div className="col s12">
                  <FilePond
                    server={
                      {
                        url:'http://jenkins.oxzion.com:8080/attachment',
                        process:{
                          ondata: (fd) => {
                            fd.append('type', 'ANNOUNCEMENT');
                            fd.append('files', 'C:\\Users\\VA_User\\Downloads\\batman__dark-wallpaper-1920x1080.jpg');
                            return fd;
                          },
                          method:'POST',
                          headers: {Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE1NTI1NDc3MjAsImp0aSI6IkhiRWR4UEV5aHNRS0hrWDY1eWRidEpMbkdqeHZIbE1jeEZJcStuVHhDMk09IiwibmJmIjoxNTUyNTQ3NzIwLCJleHAiOjE1NTI2MTk3MjAsImRhdGEiOnsidXNlcm5hbWUiOiJiaGFyYXRnIiwib3JnaWQiOiIxIn19.rj0ufa_9iw8NdO4-o3sY5b6rTpOfS9t1bLY8hoA5uR7A6tLMnTY4-2RHI_GebToFY2_rFIvXUDdP0qtn5Alu8A'}
                        }
                      }
                    }
                    allowMultiple={true}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    oninit={() => this.handleInit() }
                  />
                </div>
              </div>
            </form>
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
      </Validator>
    );
  }
}
