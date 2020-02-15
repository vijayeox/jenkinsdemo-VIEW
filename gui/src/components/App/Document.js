import React from "react";

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.config = this.props.config;
    this.args = this.props.args;
    this.core = this.props.core;
    this.fileId = this.props.fileId;
    this.appId = this.props.appId;
    this.state = {
      content: this.props.content,
      fileData: {},
      dataReady: false
    };
  }
  componentDidMount() {
    if (this.fileId != undefined) {
      this.getFileDetails(this.fileId).then(response => {
        if (response.status == "success") {
          this.setState({
            fileData: response.data.data,
            dataReady: true
          });
          this.setState({
            content: this.parseFileData(this.state.content)
          })
        } else {
          this.setState({ fileData: [] });
        }
      });
    }
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

  parseFileData(string) {
    console.log(this.state.fileData);
    var that = this;
    if (this.state.fileData) {
      return string.replace(/{{\s*([^}]*)\s*}}/g, function(m, $1) {
        return that.state.fileData[$1];
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      this.setState({ content: this.props.content });
    }
  }

  render() {
    return this.fileId ? (
      this.state.dataReady && (
        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
      )
    ) : (
      <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
    );
  }
}

export default Document;