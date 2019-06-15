import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { FileUploader } from "@oxzion/gui";
import { SaveCancel, DateComponent } from "../components/index";
import Moment from "moment";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.url = this.core.config("wrapper.url");
    this.state = {
      ancInEdit: this.props.dataItem || null
    };
    this.fUpload = React.createRef();
  }

  valueChange = (field, event) => {
    let ancInEdit = { ...this.state.ancInEdit };
    ancInEdit[field] = event.target.value;
    this.setState({ ancInEdit: ancInEdit });
  };

  async getAnnouncementGroups(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let groupUsers = await helper.request(
      "v1",
      "/announcement/" + dataItem + "/group",
      {},
      "get"
    );
    return groupUsers;
  }

  async pushAnnouncementGroups(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addGroups = await helper.request(
      "v1",
      "/announcement/" + dataItem + "/save",
      {
        userid: dataObject
      },
      "post"
    );
    return addGroups;
  }

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
      "/announcement",
      {
        name: this.state.ancInEdit.name,
        media: fileCode,
        status: "1",
        description: this.state.ancInEdit.description,
        media_type: this.state.ancInEdit.media_type,
        start_date: new Moment(this.state.ancInEdit.start_date).format(),
        end_date: new Moment(this.state.ancInEdit.end_date).format()
      },
      "post"
    );
    return ancAddData;
  }

  async editAnnouncements(fileCode) {
    let helper = this.core.make("oxzion/restClient");
    let orgEditData = await helper.request(
      "v1",
      "/announcement/" + this.state.ancInEdit.id,
      {
        name: this.state.ancInEdit.name,
        media: fileCode,
        status: "1",
        description: this.state.ancInEdit.description,
        media_type: this.state.ancInEdit.media_type
      },
      "put"
    );
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
      this.pushFile().then(response => {
        var addResponse = response.data.filename[0];
        this.editAnnouncements(addResponse);
      });
    } else {
      this.pushFile().then(response => {
        var addResponse = response.data.filename[0];
        this.pushData(addResponse).then(response => {
          this.props.action(response.status);
        });
      });
    }
    this.props.cancel();
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <div className="container-fluid">
          <form onSubmit={this.handleSubmit} id="ancForm">
            <div className="form-group">
              <label>Announcement Title</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={this.state.ancInEdit.name || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Announcement Title"
                required={true}
              />
            </div>
            <div className="form-group text-area-custom">
              <label>Description</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                name="description"
                value={this.state.ancInEdit.description || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Announcement Description"
                style={{ marginTop: "5px", minHeight: "100px" }}
                required={true}
              />
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col-6">
                  <label>Media Type</label>
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
                  <label>Start Data</label>
                  <div>
                    <DateComponent
                      format={"dd-MMM-yyyy"}
                      value={this.state.ancInEdit.start_date}
                      change={e => this.valueChange("start_date", e)}
                      required={true}
                    />
                  </div>
                </div>
                <div className="col-3">
                  <label>End Date</label>
                  <div>
                    <DateComponent
                      format={"dd-MMM-yyyy"}
                      value={this.state.ancInEdit.end_date}
                      change={e => this.valueChange("end_date", e)}
                      required={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <FileUploader
              ref={this.fUpload}
              url={this.url}
              media={this.props.dataItem.media}
              title={"Upload Announcement Banner"}
              uploadID={"announcementLogo"}
            />
          </form>
        </div>
        <SaveCancel save="ancForm" cancel={this.props.cancel} />
      </Window>
    );
  }
}
