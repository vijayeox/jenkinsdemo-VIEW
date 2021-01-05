import React from "react";
import "./Styles/commentsView.scss";
import defaultStyle from "./Styles/defaultMentionsStyle.js";
import { MentionsInput, Mention } from "react-mentions";
import Swal from "sweetalert2";
import { Button } from "@progress/kendo-react-buttons";
import moment from "moment";

class CommentsView extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get().key;
    this.appId = this.props.appId;
    this.loader = this.core.make("oxzion/splash");
    this.userTimezone = this.profile.timezone ? this.profile.timezone : moment.tz.guess();
    this.userDateFormat = this.profile.preferences.dateformat ? this.profile.preferences.dateformat : "YYYY/MM/DD";
    this.currentUserId = this.profile.uuid;
    var fileId = this.props.url ? this.props.url : null;
    fileId = this.props.fileId ? this.props.fileId : fileId;
    console.log(fileId);
    this.state = {
      fileData: this.props.fileData,
      entityConfig: null,
      dataReady: this.props.url ? false : true,
      commentsList: [],
      entityId: null,
      mentionData: [],
      value: "",
      fileId: fileId,
      userList: []
    };
  }

  componentDidMount() {
    this.loader.show();
    this.getFileDetails(this.state.fileId).then(fileData => {
      if(fileData.status == "success" && fileData.data && fileData.data.entity_id){
        var file = fileData.data.data ? fileData.data.data : fileData.data;
        this.setState({ entityId:fileData.data.entity_id,fileData: file });
        this.getEntityPage().then(entityPage => {
          this.setState({entityConfig: entityPage.data});
          this.generateViewButton();
          this.fetchCommentData();
        });
      }
    });
  }

  async getComments() {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request("v1", "file/" + this.state.fileId + "/comment", {}, "get");
    return fileContent;
  }

  async getData(api, term) {
    if (term) {
      var query = { filter: { logic: "and", filters: [{ field: "name", operator: "contains", value: term }] }, skip: 0, take: 10 };
    } else {
      var query = { skip: 0, take: 20 };
    }
    let helper = this.core.make("oxzion/restClient");
    let response = await helper.request("v1", "/" + api + "?" + "filter=[" + JSON.stringify(query) + "]", {}, "get");
    return response;
  }
 async getFileDetails(fileId) {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request("v1","/app/" + this.appId + "/file/" + fileId + "/data" ,{},"get");
    return fileContent;
  }
  async getEntityPage() {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request("v1","/app/" + this.appId + "/entity/"+this.state.entityId+"/page",{},"get");
    return fileContent;
  }
  fetchCommentData() {
    this.getComments().then((response) => {
      if (response.status == "success") {
        this.setState({ commentsList: response.data ? this.formatFormData( response.data.map((i) => { return { id: this.uuidv4(), text: i.text, name: i.name, time: i.time, user_id: i.userId }; }) ) : [], dataReady: true }); 
      }
      this.loader.destroy();
    });
  }
  generateViewButton(){
    let gridToolbarContent = [];
    let filePage = [{type: "EntityViewer",fileId: this.state.fileId}];
    let pageContent = {pageContent: filePage,title: "View",icon: "far fa-list-alt",fileId:this.state.fileId};
    let editPageContent = {pageContent: [{type: "Form",form_id:this.state.entityConfig.form_uuid,name:this.state.entityConfig.form_name,fileId:this.state.fileId}],title: "Edit",icon: "far fa-pencil"}
    gridToolbarContent.push(<Button title={"View"} className={"toolBarButton"} primary={true} onClick={(e) => this.updatePageContent(pageContent)} ><i className={"far fa-list-alt"}></i></Button>);
    gridToolbarContent.push(<Button title={"Edit"} className={"toolBarButton"} primary={true} onClick={(e) => this.updatePageContent(editPageContent)} ><i className={"fa fa-pencil"}></i></Button>);
    let ev = new CustomEvent("addcustomActions", { detail: { customActions: gridToolbarContent }, bubbles: true });
    document.getElementById(this.appId+"_breadcrumbParent").dispatchEvent(ev);
  }
  getUserData = (query, callback) => {
    query && this.getData("users/list", query).then((response) => {
      var tempUsers = response.data.map((user) => ({
        display: user.username,
        id: user.uuid,
        name: user.name
      }));
      this.setState({ userList: tempUsers }, callback(tempUsers) );
    });
  };

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function ( c ) {
      var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8; return v.toString(16);
    });
  }

  async saveComments(data) {
    let helper = this.core.make("oxzion/restClient");
    let fileData = await helper.request("v1", "file/" + this.state.fileId + "/comment", data, "post" );
    return fileData;
  }
  formatFormData(data) {
    var parsedData = [];
    for (var i = 0; i < data.length; i++) {
      try {
        parsedData[i] = data[i];
        parsedData[i]["text"] = typeof data[i]["text"] === "string" ? JSON.parse(data[i]["text"]) : data[i]["text"] == undefined || data[i]["text"] == null ? "" : data[i]["text"];
        if (parsedData[i]["text"] == "" && data[i]["text"] && parsedData[key]["text"] != data[i]["text"]) {
          parsedData[i]["text"] = data[i]["text"];
        }
        if (parsedData[key] == "[]" && data[i]["text"]) {
          parsedData[i]["text"] = [];
        }
      } catch (error) {
        if (data[i]["text"] != undefined) {
          parsedData[i]["text"] = data[i]["text"];
        }
      }
    }
    return parsedData;
  }

  saveComment(stepBack) {
    this.loader.show();
    this.saveComments({ text: this.state.value }).then(() => {
      this.setState({ mentionData: {}, value: "" });
      this.fetchCommentData();
    });
  }

  renderButtons(e, action) {
    var actionButtons = [];
    Object.keys(action).map(function (key, index) {
      actionButtons.push(<abbr title={action[key]} key={index}>
          <Button primary={true}
            className=" btn manage-btn k-grid-edit-command"
            onClick={() => this.buttonAction(action[key], e)}
            style={{ width: "auto" }} >
            <i className={"fa fa-trash-o manageIcons"}></i>
          </Button>
        </abbr>
      );
    }, this);
    return actionButtons;
  }

  buttonAction(action, rowData) {
    action == "Delete" ? this.deleteRecord(rowData) : null;
  }

  deleteRecord = (item) => {
    Swal.fire({
      title: "Would You Like To Delete the comment?",
      confirmButtonText: "Delete",
      confirmButtonColor: "#275362",
      showCancelButton: true,
      cancelButtonColor: "#7b7878",
      target: ".PageRender"
    }).then((result) => {
      if (result.value) {
        const commentsList = this.state.commentsList.slice();
        const index = commentsList.findIndex((p) => p.id === item.id);
        if (index !== -1) {
          commentsList.splice(index, 1);
          this.setState({ commentsList: commentsList }, () => { this.saveComment(false); });
        }
      }
    });
  };

  handleChange = (event, newValue, newPlainTextValue, mentions) => {
    if (newValue.length < 1000) {
      this.setState({
        value: newPlainTextValue,
        mentionData: { newValue, newPlainTextValue, mentions }
      });
    }
  };
  updatePageContent = (config) => {
    let eventDiv = document.getElementById("navigation_" + this.appId);
    let ev2 = new CustomEvent("addPage", {
      detail: config,
      bubbles: true
    });
    eventDiv.dispatchEvent(ev2);
  };

  render() {
    var that = this;
    if (this.state.dataReady) {
      // console.log(dataReady);
      return (
        <div className="commentsPage">
            <div id="chat-container">
              <div id="chat-message-list" key={this.state.fileId}>
                {this.state.commentsList.map((commentItem) => {
                  var image = this.core.config("wrapper.url") + "user/profile/" + commentItem.user_id
                  if(commentItem.user_id == that.currentUserId){
                  return (
                    <div className="msg">
      <div className="msg-img" style={{ background: `url(${image})`,backgroundSize: "contain" }}></div>
                    <div className="msg-bubble right-msg">
                      <div className="msg-info">
                        <div className="msg-info-name">{commentItem.name}</div>
                        <div className="msg-info-time">{moment
                                                .utc(commentItem.time, "YYYY-MM-DD HH:mm:ss")
                                                .clone()
                                                .tz(this.userTimezone)
                                                .format(this.userDateFormat + " - HH:mm:ss")}</div>
                      </div>

                      <div className="msg-text" dangerouslySetInnerHTML={{__html : commentItem.text}}>
                      </div>
                    </div>
                  </div>
                  );
                  } else {
                    return (
                    <div className="msg left-msg">
      <div className="msg-img" style={{ background: `url(${image})`,backgroundSize: "contain" }}></div>
                    <div className="msg-bubble">
                      <div className="msg-info">
                        <div className="msg-info-name">{commentItem.name}</div>
                        <div className="msg-info-time">{moment
                                                .utc(commentItem.time, "YYYY-MM-DD HH:mm:ss")
                                                .clone()
                                                .tz(this.userTimezone)
                                                .format(this.userDateFormat + " - HH:mm:ss")}</div>
                      </div>

                      <div className="msg-text" dangerouslySetInnerHTML={{__html : commentItem.text}}>
                      </div>
                    </div>
                  </div>
                  );
                  }
                })}
              </div>
            </div>
             <div className="msger-inputarea">
            <div className="flexCol commentBox">
              <MentionsInput
                value={this.state.value}
                onChange={this.handleChange}
                markup="@{{__type__||__id__||__display__}}"
                placeholder="Type a comment here..."
                className="mentions"
                style={defaultStyle}
              >
                <Mention
                  trigger="@"
                  markup="@[__display__](user:__name__)"
                  displayTransform={(id, username) => `@${username}`}
                  renderSuggestion={(suggestion,search, highlightedDisplay, index, focused) => (
                    <div className={`user ${focused ? 'focused' : ''}`}>
                      @{suggestion.display} - ({suggestion.name})
                    </div>
                  )}
                  data={this.getUserData}
                  className="mentions__mention"
                  style={{ backgroundColor: "#cee4e5" }}
                />
              </MentionsInput>
              <div style={{ padding: "5px" }}>
                {this.state.value.length + "/1000"}
              </div>
            </div>
                <Button
                  primary={true}
                  className="commentsSaveButton"
                  disabled={this.state.value.length == 0 ? true : false}
                  onClick={() => {
                    this.saveComment();
                  }}
                >
                  <i className="fa fa-paper-plane"></i>
                </Button>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default CommentsView;
