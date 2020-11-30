import React from "react";
import PageContent from "./PageContent";
import TabSegment from "./TabSegment";

class EntityViewer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get();
    this.appId = this.props.appId;
    this.fileId = this.props.fileId;
    this.proc = this.props.proc;
    this.state = {
      content: this.props.content,
      fileData: this.props.fileData,
      entityId: null,
      dataReady: false
    };
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

  componentDidMount() {
    this.getFileDetails(this.props.fileId).then(fileData => {
      if(fileData.status == "success" &&fileData.data && fileData.data.entity_id){
        this.setState({entityId:fileData.data.entity_id,fileData: fileData.data});
        this.getEntityPage().then(entityPage => {
          console.log(entityPage);
          var content = this.constructTabs(entityPage.data,entityPage.data.enable_comments,entityPage.data.enable_documents);
          this.setState({content: content});
          this.setState({dataReady: true});
        });
      }
    });
  }
  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  constructTabs(page,enableComments,enableDocuments){
    var tabs = [];
    if(page && page.content){
      tabs.push({name:"View",uuid:this.uuidv4(),content: page.content});
    }
    if(enableComments != "0"){
      tabs.push({name:"Comments",uuid: this.uuidv4(),content: [{type:"Comment",url:this.fileId}]})
    }
    if(enableDocuments != "0"){
      tabs.push({name: "Documents",uuid:this.uuidv4(),content: [{type:"DocumentViewer",url:"file/"+this.fileId+"/document"}]});
    }
    console.log(tabs);
    return (<TabSegment appId={this.appId}
      core={this.core}
      appId={this.appId}
      proc={this.proc}
      tabs={tabs}
      pageId={this.uuidv4()}
      currentRow={this.state.fileData} />)
  }

  render() {
    if ( this.state.dataReady ) {
      return (
        <div className="contentDiv">
          {this.state.content}
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default EntityViewer;
