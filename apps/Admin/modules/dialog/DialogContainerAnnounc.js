import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import scrollIntoView from "scroll-into-view-if-needed";
import { FileUploader, Notification } from "@oxzion/gui";
import { SaveCancel, DateComponent } from "../components/index";
import Moment from "moment";
import { FaUserLock } from "react-icons/fa";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.url = this.core.config("wrapper.url");
    this.state = {
      ancInEdit: this.props.dataItem || {
        media_type: "image"
      }
    };
    this.fUpload = React.createRef();
    this.notif = React.createRef();
    this.imageExists = this.props.dataItem.media ? true : false;
  }

  valueChange = (field, event) => {
    let ancInEdit = { ...this.state.ancInEdit };
    ancInEdit[field] = event.target.value;
    this.setState({ ancInEdit: ancInEdit });
  };

  async pushFile(event) {
    var files = this.fUpload.current.firstUpload.cachedFileArray[0];
    let helper = this.core.make("oxzion/restClient");
    let ancFile = await helper.request(
      "v1",
      "/attachment",
      {
        type: "ANNOUNCEMENT",
        files: files
      },
      "filepost"
    );
    return ancFile;
  }

  async pushData(fileCode) {
    let helper = this.core.make("oxzion/restClient");
    let ancAddData = await helper.request(
      "v1",
      "organization/" + this.props.selectedOrg + "/announcement",
      {
        name: this.state.ancInEdit.name,
        media: fileCode,
        status: "1",
        description: this.state.ancInEdit.description,
        media_type: this.state.ancInEdit.media_type,
        start_date: new Moment(this.state.ancInEdit.start_date).format(
          "YYYY-MM-DD"
        ),
        end_date: new Moment(this.state.ancInEdit.end_date).format("YYYY-MM-DD")
      },
      "post"
    );
    return ancAddData;
  }

  async editAnnouncements(fileCode) {
    let helper = this.core.make("oxzion/restClient");
    let orgEditData = await helper.request(
      "v1",
      "/announcement/" + this.state.ancInEdit.uuid,
      {
        name: this.state.ancInEdit.name,
        media: fileCode,
        status: "1",
        description: this.state.ancInEdit.description,
        media_type: this.state.ancInEdit.media_type,
        start_date: new Moment(this.state.ancInEdit.start_date).format(
          "YYYY-MM-DD"
        ),
        end_date: new Moment(this.state.ancInEdit.end_date).format("YYYY-MM-DD")
      },
      "put"
    );
    return orgEditData;
  }

  sendTheData = () => {
    var temp1 = this.state.selectedGroups;
    var temp2 = [];
    for (var i = 0; i <= temp1.length - 1; i++) {
      var gid = { id: temp1[i] };
      temp2.push(gid);
    }
    this.pushAnnouncementGroups(this.state.ancInEdit.id, JSON.stringify(temp2));

    this.setState({
      visible: !this.state.visible,
      groupsList: [],
      value: [],
      pushAnnouncementGroups: []
    });
  };

  media_typeChange = event => {
    let ancInEdit = { ...this.state.ancInEdit };
    ancInEdit.media_type = event.target.value;
    this.setState({ ancInEdit: ancInEdit });
  };

  editTriggerFunction(file) {
    this.editAnnouncements(file).then(response => {
      if (response.status == "success") {
        this.props.action(response.status);
        this.props.cancel();
      } else if (
        response.errors[0].exception.message.indexOf("name_UNIQUE") >= 0
      ) {
        this.notif.current.duplicateEntry();
      } else {
        this.notif.current.failNotification(
          "Error",
          response.message ? response.message : null
        );
      }
    });
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
    if (this.props.formAction == "put") {
      if (this.fUpload.current.firstUpload.cachedFileArray.length == 0) {
        this.editTriggerFunction(this.props.dataItem.media);
      } else {
        this.pushFile().then(response => {
          var addResponse = response.data.filename[0];
          this.editTriggerFunction(addResponse);
        });
      }
    } else {
      if (this.fUpload.current.firstUpload.cachedFileArray.length == 0) {
        var elm = document.getElementsByClassName("ancBannerUploader")[0];
        scrollIntoView(elm, {
          scrollMode: "if-needed",
          block: "center",
          behavior: "smooth",
          inline: "nearest"
        });
        this.notif.current.customWarningNotification(
          "No Media Selected",
          "Please select a banner for the Announcement."
        );
      } else {
        this.pushFile().then(response => {
          var addResponse = response.data.filename[0];
          this.pushData(addResponse).then(response => {
            this.props.action(response.status);
            if (response.status == "success") {
              this.props.cancel();
            } else if (
              response.errors[0].exception.message.indexOf("name_UNIQUE") >= 0
            ) {
              this.notif.current.duplicateEntry();
            } else {
              this.notif.current.failNotification(
                "Error",
                response.message ? response.message : null
              );
            }
          });
        });
      }
    }
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <Notification ref={this.notif} />
        <div className="container-fluid">
          <form onSubmit={this.handleSubmit} id="ancForm">
            {this.props.diableField ? (
              <div className="read-only-mode">
                <h5>(READ ONLY MODE)</h5>
                <FaUserLock />
              </div>
            ) : null}
            <div className="form-group">
              <label className="required-label">Announcement Title</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={this.state.ancInEdit.name || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Announcement Title"
                required={true}
                readOnly={this.props.diableField ? true : false}
              />
            </div>
            <div className="form-group text-area-custom">
              <label className="required-label">Description</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                name="description"
                value={this.state.ancInEdit.description || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Announcement Description"
                style={{ marginTop: "5px", minHeight: "100px" }}
                required={true}
                readOnly={this.props.diableField ? true : false}
              />
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col-6">
                  <label className="required-label">Media Type</label>
                  <div className="pt-2">
                    <span className="col-6">
                      <input
                        type="radio"
                        id="iRadio"
                        name="media_type"
                        value="image"
                        className="k-radio"
                        onChange={this.media_typeChange}
                        checked={this.state.ancInEdit.media_type == "image"}
                        required
                        disabled={this.props.diableField ? true : false}
                      />
                      <label
                        className="k-radio-label pl-4 radioLabel"
                        htmlFor="iRadio"
                      >
                        Image
                      </label>
                    </span>
                    <span className="col-4">
                      <input
                        type="radio"
                        id="vRadio"
                        name="media_type"
                        value="video"
                        className="k-radio pl-2"
                        onChange={this.media_typeChange}
                        checked={this.state.ancInEdit.media_type == "video"}
                        required
                        disabled={this.props.diableField ? true : false}
                      />
                      <label
                        className="k-radio-label pl-4 radioLabel"
                        htmlFor="vRadio"
                      >
                        Video
                      </label>
                    </span>
                  </div>
                </div>
                <div className="col-3">
                  <label className="required-label">Start Data</label>
                  <div>
                    <DateComponent
                      format={this.props.userPreferences.dateformat}
                      value={this.state.ancInEdit.start_date}
                      min={new Date()}
                      max={
                        new Date(
                          new Date().getTime() + 365 * 24 * 60 * 60 * 1000
                        )
                      }
                      change={e => this.valueChange("start_date", e)}
                      required={true}
                      disabled={this.props.diableField ? true : false}
                    />
                  </div>
                </div>
                <div className="col-3">
                  <label className="required-label">End Date</label>
                  <div>
                    <DateComponent
                      format={this.props.userPreferences.dateformat}
                      value={this.state.ancInEdit.end_date}
                      min={new Date()}
                      max={
                        new Date(
                          new Date().getTime() + 365 * 24 * 60 * 60 * 1000
                        )
                      }
                      change={e => this.valueChange("end_date", e)}
                      required={true}
                      disabled={this.props.diableField ? true : false}
                    />
                  </div>
                </div>
              </div>
            </div>
            {this.props.diableField ? (
              <div style={{ margin: "50px" }} />
            ) : (
              <div className="ancBannerUploader">
                <FileUploader
                  ref={this.fUpload}
                  media_URL={
                    this.props.dataItem.media
                      ? this.url + "resource/" + this.props.dataItem.media
                      : undefined
                  }
                  media_type={this.state.ancInEdit.media_type}
                  title={"Upload Announcement Banner"}
                  uploadID={"announcementLogo"}
                />
              </div>
            )}
          </form>
        </div>
        <SaveCancel
          save="ancForm"
          cancel={this.props.cancel}
          hideSave={this.props.diableField}
        />
      </Window>
    );
  }
}
