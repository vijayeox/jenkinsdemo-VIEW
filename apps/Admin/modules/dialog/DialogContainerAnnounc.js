import React from "react";
import {
  Dialog,
  DialogActionsBar
} from "@progress/kendo-react-dialogs";
import "@progress/kendo-ui";
import "jquery/dist/jquery.js";
import $ from "jquery";


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
      "/announcement", {
        id: this.state.ancInEdit.id,
        name: this.state.ancInEdit.name,
        media: "5c9dc73a439d5",
        status: "1",
        description: this.state.ancInEdit.description
      },
      "post"
    );
    return ancAddData;
  }

  async pushFile() {
    let helper = this.core.make("oxzion/restClient");
    let ancFile = await helper.request(
      "v1",
      "/attachment", {
        type: "ANNOUNCEMENT",
        files: 'C:\\Users\\VA_User\\Downloads\\batman__dark-wallpaper-1920x1080.jpg'
      },
      "post", {
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
      "/announcement/" + this.state.ancInEdit.id, {
        id: this.state.ancInEdit.id,
        name: this.state.ancInEdit.name,
        media: this.state.ancInEdit.media,
        status: this.state.ancInEdit.status,
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
    this.submitData();

    // var form = document.getElementById('file-form');
    // var fileSelect = document.getElementById('file-select');
    // var uploadButton = document.getElementById('upload-button');

    // uploadButton.innerHTML = 'Uploading...';

    // var files = fileSelect.files;

    // var formData = new FormData();

    // for (var i = 0; i < files.length; i++) {
    //   var file = files[i];

    //   // Add the file to the request.
    //   formData.append('files', file, file.name);
    // }
    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    // xhr.open('POST', 'http://jenkins.oxzion.com:8080/attachment', true);
    // xhr.setRequestHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE1NTM4NDMxODUsImp0aSI6IjVQQzlHYTQ5VlJrc1dzMDlZMXcxMkhVdHI5WUI0QnRLUU1sakpLOFhrdHM9IiwibmJmIjoxNTUzODQzMTg1LCJleHAiOjE1NTM5MTUxODUsImRhdGEiOnsidXNlcm5hbWUiOiJiaGFyYXRnIiwib3JnaWQiOiIxIn19.nBdYojwKTIsGqh4SfYQpRgIVKkir7AD6DTVZ8zITmwIjxN1xnA5OB2VcSPeZfTJd7293kaIDAc7TyVuKDqCTSQ");
    // xhr.send(formData);

  };

  submitData = event => {
    if (this.props.formAction == "edit") {
      this.editAnnouncements();
    } else {
      this.pushData().then(response => {
        var addResponse = response.data.id;
        this.props.action(addResponse);
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
          </form>

          {/* <form id="file-form" action="http://jenkins.oxzion.com:8080/attachment" method="POST">
            <input type="file" id="file-select" name="files" />
            <button type="submit" form="file-form" id="upload-button">Upload</button>
          </form> */}
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