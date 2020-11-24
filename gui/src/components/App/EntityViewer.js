import React from "react";

class EntityViewer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get();
    this.appId = this.props.appId;
    this.state = {
      content: this.props.content,
      fileData: this.props.fileData,
      dataReady: this.props.fileId ? false : true
    };
  }

  async getFileDetails(fileId) {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request("v1","/app/" + this.appId + "/file/" + fileId + "/data" ,{},"get");
    return fileContent;
  }
  async getEntityPage(url) {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request("v1","/app/" + this.appId + "/entity/"+this.entityId+"/page",{},"get");
    return fileContent;
  }

  componentDidMount() {

  }

  render() {
    
  }
}

export default EntityViewer;
