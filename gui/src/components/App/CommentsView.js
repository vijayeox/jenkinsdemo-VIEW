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
    this.userTimezone = this.profile.timezone
      ? this.profile.timezone
      : moment.tz.guess();
    this.userDateFormat = this.profile.preferences.dateformat
      ? this.profile.preferences.dateformat
      : "YYYY/MM/DD";
    this.state = {
      fileData: this.props.fileData,
      dataReady: this.props.url ? false : true,
      commentsList: [],
      mentionData: [],
      value: "",
      fileId: this.props.url,
      userList: []
    };
  }

  componentDidMount() {
    this.loader.show();
    this.fetchCommentData();
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
      var query = {
        skip: 0,
        take: 20
      };
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

  fetchCommentData() {
    this.getComments().then((response) => {
      if (response.status == "success") {
        this.setState({
          commentsList: response.data
            ? this.formatFormData(
                response.data.map((i) => {
                  return {
                    id: this.uuidv4(),
                    text: i.text,
                    name: i.name,
                    time: i.time,
                    user_id: i.userId
                  };
                })
              )
            : [],
          dataReady: true
        });
      }
      this.loader.destroy();
    });
  }

  getUserData = (query, callback) => {
    query &&
      this.getData("users/list", query).then((response) => {
        var tempUsers = response.data.map((user) => ({
          display: user.name,
          id: user.uuid
        }));
        this.setState(
          {
            userList: tempUsers
          },
          callback(tempUsers)
        );
      });
  };

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
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
    return parsedData;
  }

  saveComment(stepBack) {
    this.loader.show();
    this.saveComments({ text: this.state.value }).then(() => {
      this.setState({
        mentionData: {},
        value: ""
      });
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
            className=" btn manage-btn k-grid-edit-command"
            onClick={() => this.buttonAction(action[key], e)}
            style={{
              width: "auto"
            }}
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
          this.setState(
            {
              commentsList: commentsList
            },
            () => {
              this.saveComment(false);
            }
          );
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

  render() {
    if (this.state.dataReady) {
      // console.log(dataReady);
      return (
        <div className="commentsPage">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="flexCol col-11 commentBox">
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
                  displayTransform={(id, name) => `@${name}`}
                  data={this.getUserData}
                  className="mentions__mention"
                  style={{ backgroundColor: "#cee4e5" }}
                />
              </MentionsInput>
              <div style={{ padding: "5px" }}>
                {this.state.value.length + "/1000"}
              </div>
            </div>
            <div className="col-1 flexCol" style={{ justifyContent: "center" }}>
              <abbr
                title={
                  this.state.value.length == 0
                    ? "Please enter a comment to save."
                    : null
                }
              >
                <Button
                  primary={true}
                  className="commentsSaveButton"
                  disabled={this.state.value.length == 0 ? true : false}
                  onClick={() => {
                    this.saveComment();
                  }}
                >
                  <i className="fa fa-floppy-o"></i>
                </Button>
              </abbr>
            </div>
          </div>

          <div>
            <div id="chat-container">
              <div id="chat-message-list">
                {this.state.commentsList.map((commentItem) => {
                  return (
                    <article className="row">
                      <div className="col-md-1 col-sm-1 hidden-xs">
                        <figure className="thumbnail">
                          <img
                            src={
                              this.core.config("wrapper.url") +
                              "user/profile/" +
                              commentItem.user_id
                            }
                            alt={commentItem.name}
                          />
                          <figcaption className="text-center">
                            {commentItem.name}
                          </figcaption>
                        </figure>
                      </div>
                      <div className="col-md-11 col-sm-11">
                        <div className="panel panel-default arrow left">
                          <div className="panel-body">
                            <div className="comment-post">
                              <p>{commentItem.text}</p>
                            </div>
                            <header className="text-right">
                              <time
                                className="comment-date"
                                datetime={
                                  // moment(commentItem.time)
                                  // .tz(this.userTimezone)
                                  // .format(this.userDateFormat + " - HH:mm:ss")}
                                  moment
                                    .utc(
                                      commentItem.time,
                                      "YYYY-MM-DD HH:mm:ss"
                                    )
                                    .clone()
                                    .tz(this.userTimezone)
                                }
                              >
                                <i className="fa fa-clock-o"></i>
                                {moment
                                  .utc(commentItem.time, "YYYY-MM-DD HH:mm:ss")
                                  .clone()
                                  .tz(this.userTimezone)
                                  .format("YYYY-MM-DD HH:mm:ss")}
                              </time>
                            </header>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default CommentsView;
