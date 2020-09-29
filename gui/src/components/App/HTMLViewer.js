import React from "react";
import JsxParser from "react-jsx-parser";
import moment from "moment";

class HTMLViewer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get();
    this.appId = this.props.appId;
    this.state = {
      content: this.props.content,
      fileData: this.props.fileData,
      dataReady: this.props.url ? false : true
    };
  }

  async getFileDetails(url) {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request(
      "v1",
      "/app/" + this.appId + "/" + url,
      {},
      "get"
    );
    return fileContent;
  }

  componentDidMount() {
    if (this.props.url != undefined) {
      this.getFileDetails(this.props.url).then(response => {
        if (response.status == "success") {
          this.setState({
            fileData: response.data.data,
            dataReady: true
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      this.setState({ content: this.props.content });
    }
  }

  render() {
    return (
      this.state.dataReady && (
        <JsxParser className ={this.props.className}
          jsx={this.state.content}
          bindings={{
            data: this.state.fileData ? this.state.fileData : {},
            item: this.state.fileData ? this.state.fileData : {},
            moment: moment,
            profile: this.profile.key
          }}
        />
      )
    );
  }
}

export default HTMLViewer;
