import React from "react";
import "./Styles/commentsView.scss";
import defaultStyle from "./Styles/defaultMentionsStyle.js";
import { MentionsInput, Mention } from "react-mentions";
import Swal from "sweetalert2";
import { Button } from "@progress/kendo-react-buttons";
import moment from "moment";
import emojisData from "./Emoji.json";
import FileAttachment from "./FileAttachment";
import CommentsAttachments from "./CommentsAttachments";

class CommentsView extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get().key;
    this.appId = this.props.appId;
    this.loader = this.core.make("oxzion/splash");
    this.userTimezone = this.profile.timezone
      ? this.profile.timezone
      : moment.tz.guess();
    this.userDateFormat = this.profile.preferences.dateformat
      ? this.profile.preferences.dateformat
      : "YYYY/MM/DD";
    this.currentUserId = this.profile.uuid;
    var fileId = this.props.url ? this.props.url : null;
    fileId = this.props.fileId ? this.props.fileId : fileId;
    this.state = {
      fileData: this.props.fileData,
      entityConfig: null,
      dataReady: this.props.url ? false : true,
      commentsList: {},
      entityId: null,
      mentionData: [],
      value: "",
      fileId: fileId,
      userList: [],
      emojis: [],
      showModal: false,
      imageDetails: {}
    };
  }

  componentDidMount() {
    this.loader.show();
    this.getFileDetails(this.state.fileId).then(fileData => {
      if (
        fileData.status == "success" &&
        fileData.data &&
        fileData.data.entity_id
      ) {
        var file = fileData.data.data ? fileData.data.data : fileData.data;
        this.setState({ entityId: fileData.data.entity_id, fileData: file });
        this.getEntityPage().then(entityPage => {
          if (entityPage.status == "success") {
            this.setState({ entityConfig: entityPage.data });
            this.generateViewButton(entityPage.data.enable_auditlog);
            this.fetchCommentData();
          }
        });
      }
    });
    this.setState({ emojis: emojisData });
  }

  async getComments() {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request(
      "v1",
      "file/" + this.state.fileId + "/comment",
      {},
      "get"
    );
    return fileContent;
  }

  async getData(api, term) {
    if (term) {
      var query = {
        filter: {
          logic: "and",
          filters: [{ field: "name", operator: "contains", value: term }]
        },
        skip: 0,
        take: 10
      };
    } else {
      var query = { skip: 0, take: 20 };
    }
    let helper = this.core.make("oxzion/restClient");
    let response = await helper.request(
      "v1",
      "/" + api + "?" + "filter=[" + JSON.stringify(query) + "]",
      {},
      "get"
    );
    return response;
  }
  async getFileDetails(fileId) {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request(
      "v1",
      "/app/" + this.appId + "/file/" + fileId + "/data",
      {},
      "get"
    );
    return fileContent;
  }
  async getEntityPage() {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request(
      "v1",
      "/app/" + this.appId + "/entity/" + this.state.entityId + "/page",
      {},
      "get"
    );
    return fileContent;
  }

  processResponse(response) {
    let res = {};
    let data = [],
      fileName = [];
    response.data.map((i, index) => {
      data.push({
        id: this.uuidv4(),
        text: i.text,
        name: i.name,
        time: i.time,
        user_id: i.userId,
        comment_id: i.commentId
      });
      res["data"] = data;
      i.attachments &&
        i.attachments.map(j => {
          fileName.push(j.name);
          res["data"][index]["fileName"] = fileName;
        });
      fileName = [];
    });
    return this.formatFormData(res["data"]);
  }

  fetchCommentData() {
    this.getComments().then(response => {
      if (response.status == "success") {
        this.setState({
          commentsList: response.data ? this.processResponse(response) : {},
          dataReady: true
        });
      }
      this.loader.destroy();
    });
  }
  generateViewButton(enableAuditLog) {
    let gridToolbarContent = [];
    let filePage = [{ type: "EntityViewer", fileId: this.state.fileId }];
    let pageContent = {
      pageContent: filePage,
      title: "View",
      icon: "fa fa-eye",
      fileId: this.state.fileId
    };
    gridToolbarContent.push(
      <Button
        title={"View"}
        className={"toolBarButton"}
        primary={true}
        onClick={e => this.updatePageContent(pageContent)}
      >
        <i className={"fa fa-eye"}></i>
      </Button>
    );
    if (this.state.entityConfig && !this.state.entityConfig.has_workflow) {
      filePage = [
        {
          type: "Form",
          form_id: this.state.entityConfig.form_uuid,
          name: this.state.entityConfig.form_name,
          fileId: this.state.fileId
        }
      ];
      let pageContent = {
        pageContent: filePage,
        title: "Edit",
        icon: "far fa-pencil"
      };
      gridToolbarContent.push(
        <Button
          title={"Edit"}
          className={"toolBarButton"}
          primary={true}
          onClick={e => this.updatePageContent(pageContent)}
        >
          <i className={"fa fa-pencil"}></i>
        </Button>
      );
    }
    if (enableAuditLog) {
      gridToolbarContent.push(
        <Button
          title={"Audit Log"}
          className={"toolBarButton"}
          primary={true}
          onClick={e => this.callAuditLog()}
        >
          <i className={"fa fa-history"}></i>
        </Button>
      );
    }
    let ev = new CustomEvent("addcustomActions", {
      detail: { customActions: gridToolbarContent },
      bubbles: true
    });
    document.getElementById(this.appId + "_breadcrumbParent").dispatchEvent(ev);
  }
  getUserData = (query, callback) => {
    query &&
      this.getData("users/list", query).then(response => {
        var tempUsers = response.data.map(user => ({
          display: user.username,
          id: user.uuid,
          name: user.name
        }));
        this.setState({ userList: tempUsers }, callback(tempUsers));
      });
  };

  queryEmojis = (query, callback) => {
    if (query.length < 2) return;

    const emojiObject = this.state.emojis;
    const matches = emojiObject.emojis.filter(emoji => {
      return emoji.shortname.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    return matches.map(emoji => ({
      id: emoji.emoji,
      name: emoji.shortname
    }));
  };

  bubbleEmoticonCheck(input) {
    const emojiObject = this.state.emojis;
    var regex = /\:(.*?)\:/g;
    var matched = input.match(regex);
    var emoticon;
    if (matched) {
      for (var i = 0; i < matched.length; i++) {
        const match = emojiObject.emojis
          .filter(emoji => {
            return emoji.shortname
              .toLowerCase()
              .startsWith(matched[i].toLowerCase());
          })
          .slice(0, 1);
        if (Object.keys(match).length !== 0) {
          emoticon = match.map(mapped => mapped.emoji);
          input = input.replace(matched[i], emoticon);
        }
      }
    }
    return input;
  }

  emojiCheck() {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|[\u200D])/g;
    var input = this.state.value;
    var matched = input.match(regex);
    if (matched) {
      for (var i = 0; i < matched.length; i++) {
        var j = this.emojiUnicode(matched[i]);
        input = input.replace(matched[i], j);
      }
      this.state.value = input;
    }
  }

  emojiUnicode(emoji) {
    if (emoji.length >= 1) {
      const pairs = [];
      for (var i = 0; i < emoji.length; i++) {
        if (emoji.charCodeAt(i) >= 0xd800 && emoji.charCodeAt(i) <= 0xdbff) {
          if (
            emoji.charCodeAt(i + 1) >= 0xdc00 &&
            emoji.charCodeAt(i + 1) <= 0xdfff
          ) {
            pairs.push(
              (emoji.charCodeAt(i) - 0xd800) * 0x400 +
                (emoji.charCodeAt(i + 1) - 0xdc00) +
                0x10000
            );
          }
        } else if (
          emoji.charCodeAt(i) < 0xd800 ||
          emoji.charCodeAt(i) > 0xdfff
        ) {
          pairs.push(emoji.charCodeAt(i));
        }
      }
      emoji = "";
      for (var i = 0; i < pairs.length; i++) {
        if (pairs[i] == "8205") {
          emoji += "&zwj;";
        } else {
          emoji += "&#" + pairs[i] + ";";
        }
      }
      return emoji;
    }
  }

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  async saveComments(data) {
    let helper = this.core.make("oxzion/restClient");
    let fileData = await helper.request(
      "v1",
      "file/" + this.state.fileId + "/comment",
      data,
      "post"
    );
    return fileData;
  }
  formatFormData(data) {
    var parsedData = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        try {
          parsedData[i] = data[i];
          parsedData[i]["text"] =
            typeof data[i]["text"] === "string"
              ? JSON.parse(data[i]["text"])
              : data[i]["text"] == undefined || data[i]["text"] == null
              ? ""
              : data[i]["text"];
          if (
            parsedData[i]["text"] == "" &&
            data[i]["text"] &&
            parsedData[key]["text"] != data[i]["text"]
          ) {
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
      actionButtons.push(
        <abbr title={action[key]} key={index}>
          <Button
            primary={true}
            className=' btn manage-btn k-grid-edit-command'
            onClick={() => this.buttonAction(action[key], e)}
            style={{ width: "auto" }}
          >
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

  deleteRecord = item => {
    Swal.fire({
      title: "Would You Like To Delete the comment?",
      confirmButtonText: "Delete",
      confirmButtonColor: "#275362",
      showCancelButton: true,
      cancelButtonColor: "#7b7878",
      target: ".PageRender"
    }).then(result => {
      if (result.value) {
        const commentsList = this.state.commentsList.slice();
        const index = commentsList.findIndex(p => p.id === item.id);
        if (index !== -1) {
          commentsList.splice(index, 1);
          this.setState({ commentsList: commentsList }, () => {
            this.saveComment(false);
          });
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
  updatePageContent = config => {
    let eventDiv = document.getElementById("navigation_" + this.appId);
    let ev2 = new CustomEvent("addPage", {
      detail: config,
      bubbles: true
    });
    eventDiv.dispatchEvent(ev2);
  };

  setModalShow(flag, imageDetails, index) {
    console.log("CLICKINGGGGGGG");
    this.setState({
      showModal: flag,
      imageDetails: { data: imageDetails, index }
    });
  }
  render() {
    var that = this;
    if (this.state.dataReady) {
      return (
        <div className='commentsPage'>
          <FileAttachment
            show={this.state.showModal}
            onHide={() => this.setModalShow(false, null)}
            imageDetails={this.state.imageDetails}
          />
          <div id='chat-container'>
            <div id='chat-message-list' key={this.state.fileId}>
              {this.state.commentsList &&
                this.state.commentsList.length > 0 &&
                this.state.commentsList
                  .slice(0)
                  .reverse()
                  .map(commentItem => {
                    commentItem.text = this.bubbleEmoticonCheck(
                      commentItem.text
                    );
                    var image =
                      this.core.config("wrapper.url") +
                      "user/profile/" +
                      commentItem.user_id;
                    if (commentItem.user_id == that.currentUserId) {
                      return (
                        <div className='msg right-msg'>
                          <div
                            className='msg-img'
                            style={{
                              background: `url(${image})`,
                              backgroundSize: "contain"
                            }}
                          ></div>
                          <div className='msg-bubble'>
                            <div className='msg-info'>
                              <div className='msg-info-name'>
                                {commentItem.name}
                              </div>
                              <div className='msg-info-time'>
                                {moment
                                  .utc(commentItem.time, "YYYY-MM-DD HH:mm:ss")
                                  .clone()
                                  .tz(this.userTimezone)
                                  .format(this.userDateFormat + " - HH:mm:ss")}
                              </div>
                            </div>
                            <div
                              className='msg-text'
                              dangerouslySetInnerHTML={{
                                __html: commentItem.text
                              }}
                            ></div>
                            {commentItem.fileName &&
                              commentItem.fileName.map((fileName, index) => {
                                return (
                                  <CommentsAttachments
                                    config={this.core.configuration}
                                    restClient={this.core.make(
                                      "oxzion/restClient"
                                    )}
                                    commentData={commentItem}
                                    fileName={fileName}
                                    index={index}
                                  />
                                );
                              })}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className='msg left-msg'>
                          <div
                            className='msg-img'
                            style={{
                              background: `url(${image})`,
                              backgroundSize: "contain"
                            }}
                          ></div>
                          <div className='msg-bubble'>
                            <div className='msg-info'>
                              <div className='msg-info-name'>
                                {commentItem.name}
                              </div>
                              <div className='msg-info-time'>
                                {moment
                                  .utc(commentItem.time, "YYYY-MM-DD HH:mm:ss")
                                  .clone()
                                  .tz(this.userTimezone)
                                  .format(this.userDateFormat + " - HH:mm:ss")}
                              </div>
                            </div>

                            <div
                              className='msg-text'
                              dangerouslySetInnerHTML={{
                                __html: commentItem.text
                              }}
                            ></div>
                            {commentItem.fileName &&
                              commentItem.fileName.map((fileName, index) => {
                                return (
                                  <CommentsAttachments
                                    config={this.core.configuration}
                                    commentData={commentItem}
                                    fileName={fileName}
                                    index={index}
                                  />
                                );
                              })}
                          </div>
                        </div>
                      );
                    }
                  })}
            </div>
          </div>
          <div className='msger-inputarea'>
            <div className='flexCol commentBox'>
              <MentionsInput
                value={this.state.value}
                onChange={this.handleChange}
                markup='@{{__type__||__id__||__display__}}'
                placeholder='Type a comment here...'
                className='mentions'
                style={defaultStyle}
                allowSpaceInQuery={true}
              >
                <Mention
                  trigger={RegExp("(?:^|\\s)(@*([^@]*))$")}
                  markup='@[__display__](user:__name__)'
                  displayTransform={(id, username) => `@${username}`}
                  renderSuggestion={(
                    suggestion,
                    search,
                    highlightedDisplay,
                    index,
                    focused
                  ) => (
                    <div className={`user ${focused ? "focused" : ""}`}>
                      @{suggestion.display} - ({suggestion.name})
                    </div>
                  )}
                  data={this.getUserData}
                  className='mentions__mention'
                  style={{ backgroundColor: "#cee4e5" }}
                />
                <Mention
                  trigger=':'
                  renderSuggestion={(
                    suggestion,
                    search,
                    highlightedDisplay,
                    index,
                    focused
                  ) => (
                    <div className={`user ${focused ? "focused" : ""}`}>
                      {suggestion.id} {suggestion.name}
                    </div>
                  )}
                  data={this.queryEmojis}
                  className='mentions__mention'
                  style={{ backgroundColor: "#cee4e5" }}
                />
              </MentionsInput>
              <div style={{ padding: "5px" }}>
                {this.state.value.length + "/1000"}
              </div>
            </div>
            <Button
              primary={true}
              className='commentsSaveButton'
              disabled={this.state.value.length == 0 ? true : false}
              onClick={() => {
                this.emojiCheck();
                this.saveComment();
              }}
            >
              <i className='fa fa-paper-plane'></i>
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
