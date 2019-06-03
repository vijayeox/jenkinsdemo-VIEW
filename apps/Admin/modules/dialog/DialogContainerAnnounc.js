import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Moment from "moment";
import TextareaAutosize from "react-textarea-autosize";
import { PushData } from "../components/apiCalls";
import { FileUploader } from "@oxzion/gui";
import { SaveCancel } from "../components/saveCancel";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.url = this.core.config("wrapper.url");
    this.firstUpload = null;
    this.state = {
      DOAInEdit: undefined,
      DOEInEdit: undefined,
      ancInEdit: this.props.dataItem || null
    };
  }

  componentWillMount() {
    if (this.props.formAction === "add") {
    } else {
      let ancInEdittemp = { ...this.state.ancInEdit };
      if (
        this.state.ancInEdit.start_date == "0000-00-00 00:00:00" ||
        this.state.ancInEdit.end_date == "0000-00-00 00:00:00"
      ) {
        if (this.state.ancInEdit.start_date == "0000-00-00 00:00:00") {
          ancInEdittemp.start_date = "";
          this.setState({ ancInEdit: ancInEdittemp });
          this.setState({ DOAInEdit: "" });
        } else {
          const DOADate = this.state.ancInEdit.start_date;
          const DOAiso = new Moment(DOADate, "YYYY-MM-DD").format();
          const DOAkendo = new Date(DOAiso);

          ancInEdittemp.start_date = DOAkendo;
          this.setState({ ancInEdit: ancInEdittemp });
          this.setState({ ancInEdit: DOAiso });
        }
        if (this.state.ancInEdit.end_date == "0000-00-00 00:00:00") {
          ancInEdittemp.end_date = null;
          this.setState({ ancInEdit: ancInEdittemp });
          this.setState({ DOEInEdit: null });
        } else {
          const DOEDate = this.state.ancInEdit.end_date;
          const DOEiso = new Moment(DOEDate, "YYYY-MM-DD").format();
          const DOEkendo = new Date(DOEiso);

          ancInEdittemp.end_date = DOEkendo;
          this.setState({ ancInEdit: ancInEdittemp });
          this.setState({ ancInEdit: DOEiso });
        }
      } else {
        const DOADate = this.state.ancInEdit.start_date;
        const DOEDate = this.state.ancInEdit.end_date;
        const DOAiso = new Moment(DOADate, "YYYY-MM-DD").format();
        const DOEiso = new Moment(DOEDate, "YYYY-MM_DD").format();
        const DOAkendo = new Date(DOAiso);
        const DOEkendo = new Date(DOEiso);

        let ancInEdit = { ...this.state.ancInEdit };
        ancInEdit.start_date = DOAkendo;
        ancInEdit.end_date = DOEkendo;
        this.setState({ ancInEdit: ancInEdit });

        this.setState({ DOAInEdit: DOAiso });
        this.setState({ DOEInEdit: DOEiso });
      }
    }
  }

  handleDOEChange = event => {
    let ancInEdit = { ...this.state.ancInEdit };
    ancInEdit.end_date = event.target.value;
    this.setState({ ancInEdit: ancInEdit });

    var DOEiso = new Moment(event.target.value).format();
    this.setState({ DOEInEdit: DOEiso });
  };

  handleDOAChange = event => {
    let ancInEdit = { ...this.state.ancInEdit };
    ancInEdit.start_date = event.target.value;
    this.setState({ ancInEdit: ancInEdit });

    var DOAiso = new Moment(event.target.value).format();
    this.setState({ DOAInEdit: DOAiso });
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
        media_type: this.state.ancInEdit.media_type
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
      "/attachment",
      {
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
      <Window onClose={this.props.cancel}>
        <div className="container-fluid">
          <form>
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
            <div className="form-group">
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
                    <DatePicker
                      format={"dd-MMM-yyyy"}
                      value={this.state.ancInEdit.start_date}
                      onChange={this.handleDOAChange}
                      required={true}
                    />
                  </div>
                </div>
                <div className="col-3">
                  <label>End Date</label>
                  <div>
                    <DatePicker
                      format={"dd-MMM-yyyy"}
                      value={this.state.ancInEdit.end_date}
                      defaultValue={new Date()}
                      onChange={this.handleDOEChange}
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
        <SaveCancel save={this.submitData} cancel={this.props.cancel} />
      </Window>
    );
  }
}
