import React from "react";
import JsxParser from "react-jsx-parser";

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.config = this.props.config;
    this.args = this.props.args;
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get();
    this.fileId = this.props.fileId;
    this.appId = this.props.appId;
    this.state = {
      content: this.props.content,
      dataReady: false
    };
  }
  componentDidMount() {
    if (this.fileId != undefined) {
      this.getFileDetails(this.fileId).then(response => {
        if (response.status == "success") {
          this.setState({
            content: this.parseFileData(this.state.content, response.data.data),
            dataReady: true
          });
        }
      });
    } else {
      this.setState({
        content: this.parseFileData(this.state.content, this.profile.key)
      });
    }
  }

  parseFileData(string, fileData) {
    return string.replace(/{{\s*([^}]*)\s*}}/g, function(m, $1) {
      return fileData[$1];
    });
  }

  async getFileDetails(fileId) {
    // call to api using wrapper
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request(
      "v1",
      "/app/" + this.appId + "/file/" + fileId + "/data",
      {},
      "get"
    );
    return fileContent;
  }

  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      this.setState({ content: this.props.content });
    }
  }

  render() {
    return this.fileId ? (
      this.state.dataReady && <JsxParser jsx={this.state.content} />
    ) : (
      <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
    );
  }
}

export default Document;
