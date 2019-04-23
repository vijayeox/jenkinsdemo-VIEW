import React from "react";
import ReactDOM from 'react-dom';
import {
  Window,
  Dialog,
  DialogActionsBar
} from "@progress/kendo-react-dialogs";
import "@progress/kendo-ui";
import { DatePicker } from '@progress/kendo-react-dateinputs';
import Moment from "moment";
import "jquery/dist/jquery.js";
import $ from "jquery";
import FileUploadWithPreview from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/file-upload-with-preview.min.css'

import { MultiSelectComponent, CheckBoxSelection, Inject } from '@syncfusion/ej2-react-dropdowns';
import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../node_modules/@syncfusion/ej2-react-inputs/styles/material.css";
import "../../node_modules/@syncfusion/ej2-react-dropdowns/styles/material.css";
import "../../node_modules/@syncfusion/ej2-react-buttons/styles/material.css";


export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.firstUpload = null;
    this.state = {
      DOAInEdit: undefined,
      DOEInEdit: undefined,
      ancInEdit: this.props.dataItem || null,
      groupsList: [],
      selectedGroups: [],
      visibleDialog: false,
      show: false,

    };
    this.pushFile = this.pushFile.bind(this);
    this.captureSelectedGroups = this.captureSelectedGroups.bind(this);
    this.checkFields = { text: 'groupName', value: 'groupid' };

  }


  componentWillMount() {
    if (this.props.formAction === "add") {
    } else {
      let ancInEdittemp = { ...this.state.ancInEdit };
      if (this.state.ancInEdit.start_date == "0000-00-00 00:00:00" || this.state.ancInEdit.end_date == "0000-00-00 00:00:00") {
        if (this.state.ancInEdit.start_date == "0000-00-00 00:00:00") {
          ancInEdittemp.start_date = "";
          this.setState({ ancInEdit: ancInEdittemp });
          this.setState({ DOAInEdit: "" });
        }
        else {
          const DOADate = this.state.ancInEdit.start_date;
          const DOAiso = new Moment(DOADate, 'YYYY-MM-DD').format();
          const DOAkendo = new Date(DOAiso);

          ancInEdittemp.start_date = DOAkendo;
          this.setState({ ancInEdit: ancInEdittemp });
          this.setState({ ancInEdit: DOAiso });
        }
        if (this.state.ancInEdit.end_date == "0000-00-00 00:00:00") {
          ancInEdittemp.end_date = null;
          this.setState({ ancInEdit: ancInEdittemp });
          this.setState({ DOEInEdit: null });
        }
        else {
          const DOEDate = this.state.ancInEdit.end_date;
          const DOEiso = new Moment(DOEDate, 'YYYY-MM-DD').format();
          const DOEkendo = new Date(DOEiso);

          ancInEdittemp.end_date = DOEkendo;
          this.setState({ ancInEdit: ancInEdittemp });
          this.setState({ ancInEdit: DOEiso });
        }
      }
      else {
        const DOADate = this.state.ancInEdit.start_date;
        const DOEDate = this.state.ancInEdit.end_date;
        const DOAiso = new Moment(DOADate, 'YYYY-MM-DD').format();
        const DOEiso = new Moment(DOEDate, 'YYYY-MM_DD').format();
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


  componentDidMount() {
    M.AutoInit();
    $('.materialize-textarea').trigger('autoresize');
    M.updateTextFields();
    M.textareaAutoResize($("#ancDescription"));

    this.firstUpload = new FileUploadWithPreview('myFirstImage');
    if (this.props.formAction == "edit") {
      this.addGroups();
    }
    else {
      this.getGroupData().then(response => {
        var tempUsers = [];
        for (var i = 0; i <= response.data.length - 1; i++) {
          var groupName = response.data[i].name;
          var groupid = response.data[i].id;
          tempUsers.push({ groupid: groupid, groupName: groupName });
        }
        this.setState({
          groupsList: tempUsers
        });
      });
    }
  }

  handleDOEChange = (event) => {
    let ancInEdit = { ...this.state.ancInEdit };
    ancInEdit.end_date = event.target.value;
    this.setState({ ancInEdit: ancInEdit })

    var DOEiso = new Moment(event.target.value).format();
    this.setState({ DOEInEdit: DOEiso });
  }

  handleDOAChange = (event) => {
    let ancInEdit = { ...this.state.ancInEdit };
    ancInEdit.start_date = event.target.value;
    this.setState({ ancInEdit: ancInEdit })

    var DOAiso = new Moment(event.target.value).format();
    this.setState({ DOAInEdit: DOAiso });
  }

  async getGroupData() {
    let helper = this.core.make("oxzion/restClient");
    let groupData = await helper.request("v1", "/group", {}, "get");
    return groupData;
  }

  async getAnnouncementGroups(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let groupUsers = await helper.request(
      "v1", "/announcement/" + dataItem + "/group", {}, "get");
    return groupUsers;
  }

  async pushAnnouncementGroups(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addGroups = await helper.request("v1", "/announcement/" + dataItem + "/save",
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

  addGroups = () => {

    this.getAnnouncementGroups(this.state.ancInEdit.id).then(response => {
      var tempAnnouncementGroups = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var groupid = response.data[i].id;
        tempAnnouncementGroups.push(groupid);
      }
      this.setState({
        selectedGroups: tempAnnouncementGroups
      });
    })

    this.getGroupData().then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var groupName = response.data[i].name;
        var groupid = response.data[i].id;
        tempUsers.push({ groupid: groupid, groupName: groupName });
      }
      this.setState({
        groupsList: tempUsers
      });
    });
  }

  captureSelectedGroups(e) {
    this.setState({
      selectedGroups: e.value
    })
  }


  sendTheData = () => {
    var temp1 = this.state.selectedGroups;
    var temp2 = [];
    for (var i = 0; i <= temp1.length - 1; i++) {
      var gid = { "id": temp1[i] };
      temp2.push(gid);
    }
    this.pushAnnouncementGroups(this.state.ancInEdit.id, JSON.stringify(temp2));

    this.setState({
      visible: !this.state.visible,
      groupsList: [],
      value: [],
      pushAnnouncementGroups: []
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
      <Window onClose={this.props.cancel}
        draggable={false} stage={"FULLSCREEN"} style={{ width: "53rem" }}>
        <div className="row">
          <div className="col s5">
            <div className="custom-file-container" data-upload-id="myFirstImage">
              <label><p>Upload Announcement Image
                  <a href="javascript:void(0)" id="clearAncImage" className="custom-file-container__image-clear"
                  title="Clear Image">
                  <img style={{ width: "30px" }} src="https://img.icons8.com/color/64/000000/cancel.png" /></a>
              </p></label>
              <div className="custom-file-container__image-preview"></div>
              <label className="custom-file-container__custom-file">
                <input type="file" className="custom-file-container__custom-file__custom-file-input"
                  id="customFile" accept="image/*" aria-label="Choose File" />
                <span className="custom-file-container__custom-file__custom-file-control"></span>
              </label>

            </div>
          </div>

          <form
            className="col s"
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
                  className="k-textarea validate"
                  name="description"
                  value={this.state.ancInEdit.description || ""}
                  onChange={this.onDialogInputChange}
                  required={true}
                />
                <label htmlFor="ancDescription">Description</label>
              </div>
            </div>

            <div className="row">
              <label id="label1">Date Of Announcement</label>
              <div className="col s12 example-col" id="datecol">
                <DatePicker
                  format={"dd-MMM-yyyy"}
                  value={this.state.ancInEdit.start_date}
                  required={true}
                  onChange={this.handleDOAChange}
                />
              </div>
            </div>

            <div className="row">
              <label id="label1">Date Of Expire</label>
              <div className="col s12 example-col" id="datecol">
                <DatePicker
                  format={"dd-MMM-yyyy"}
                  value={this.state.ancInEdit.end_date}
                  onChange={this.handleDOEChange}
                  required={true}
                />
              </div>
            </div>

            <div className="row">
              <label id="label1">Groups</label>
              <div className='control-section col-lg-8' style={{ paddingLeft: "10px" }}>
                <div id="multigroup">
                  <MultiSelectComponent id="checkbox"
                    dataSource={this.state.groupsList}
                    value={this.state.selectedGroups}
                    change={this.captureSelectedGroups}
                    fields={this.checkFields}
                    mode="CheckBox"
                    placeholder="Click to add Groups"
                    showDropDownIcon={true}
                    openOnClick="false"
                    filterBarPlaceholder="Search Groups"
                    popupHeight="350px">
                    <Inject services={[CheckBoxSelection]} />
                  </MultiSelectComponent>
                </div>
              </div>
            </div>
          </form>
          <div style={{ float: "right", marginTop: "20px", marginRight: "8%" }}>
            <button className="btn waves-effect red" onClick={this.props.cancel}>
              Cancel
            </button>
            <button
              className="btn waves-effect green"
              type="submit"
              form="announcementForm"
              style={{ marginLeft: "10px", width: "85px" }}
            >
              Save
            </button>
          </div>
        </div>
      </Window>
    );
  }
}