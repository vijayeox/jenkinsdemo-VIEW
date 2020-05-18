import React from "react";
import "./Styles/commentsView.scss";
import defaultStyle from "./Styles/defaultMentionsStyle.js";
import { MentionsInput, Mention } from "react-mentions";
import Swal from "sweetalert2";
import { Button } from "@progress/kendo-react-buttons";

class CommentsView extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get().key;
    this.appId = this.props.appId;
    this.state = {
      fileData: this.props.fileData,
      dataReady: this.props.url ? false : true,
      commentsList: [],
      mentionData: [],
      value: "",
      fileId: "",
      userList: [],
    };
  }

  componentDidMount() {
    if (this.props.url != undefined) {
      this.setState({fileId:this.props.url});
      this.getFileDetails(this.props.url).then((response) => {
        if (response.status == "success") {
          if(response.data && response.data.length > 0){
            this.setState({
              commentsList: response.data
              ? this.formatFormData(response.data.map((i) => {
                              return { id: this.uuidv4(), text: i.text };
                            }))
              : []
            });
            this.setState({dataReady:true});
          } else {
            this.setState({commentsList:[]});
            this.setState({dataReady:true});
          }
        }
      });
    }
  }

  async getFileDetails(fileId) {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request(
      "v1",
      "file/"+ fileId +"/comment",
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
          filters: [{ field: "name", operator: "contains", value: term }],
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
    this.getFileDetails(this.props.url).then((response) => {
      if (response.status == "success") {
        this.setState({
          commentsList: response.data
            ? this.formatFormData(response.data.map((i) => {
                return { id: this.uuidv4(), text: i.text };
              }))
            : [],
          dataReady: true
        });
      }
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
      "file/"+ this.state.fileId +"/comment",
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
        parsedData[i]['text'] = typeof data[i]['text'] === "string" ? JSON.parse(data[i]['text']) : data[i]['text'] == undefined || data[i]['text'] == null ? "": data[i]['text'];
        if ( parsedData[i]['text'] == "" && data[i]['text'] && parsedData[key]['text'] != data[i]['text']) {
          parsedData[i]['text'] = data[i]['text'];
        }
        if (parsedData[key] == "[]" && data[i]['text']) {
          parsedData[i]['text'] = [];
        }
      } catch (error) {
        if (data[i]['text'] != undefined) {
          parsedData[i]['text'] = data[i]['text'];
        }
      }
    }
    return parsedData;
  }

  saveComment(stepBack) {
    console.log(this.state.mentionData);
    const comment = {};
    comment.text = JSON.stringify(newData);
    console.log(comment);
    this.saveComments(comment).then(() => {
      this.setState({
        mentionData: [],
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
        value: newValue,
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
              <Button
                primary={true}
                className="commentsSaveButton"
                onClick={() => {
                  this.saveComment();
                }}
              ><i className="fa fa-floppy-o"></i></Button>
            </div>
          </div>

          <div>
            <div id="chat-container">
              <div id="chat-message-list">
                {this.state.commentsList.map((commentItem) => {
                  console.log(commentItem.text);
                  return (
                    <div className="message-row other-message">
                      <img src={commentItem.icon} alt="avatar images" />
                      <div className="message-text">
                        <h4 className="header"> {commentItem.name}</h4>
                        {commentItem.text}
                      </div>
                      <div className="message-time">{commentItem.time}</div>
                    </div>
                  );
                })}
              </div>
              <button id="btn">
                <i className="fa fa-trash-o" style={{color:"red", fontSize:"30px", background:"none"}}></i>
              </button>
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
