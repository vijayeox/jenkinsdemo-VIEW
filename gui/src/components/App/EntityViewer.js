import React from "react";
import PageContent from "./PageContent";
import TabSegment from "./TabSegment";
import { Button, DropDownButton } from "@progress/kendo-react-buttons";
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
      dataReady: false,
      editButton: null,
      entityConfig: null,
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
  updatePageContent = (config) => {
    let eventDiv = document.getElementById("navigation_" + this.appId);
    let ev2 = new CustomEvent("addPage", {
      detail: config,
      bubbles: true
    });
    eventDiv.dispatchEvent(ev2);
  };
  generateEditButton(){
    if(this.state.entityConfig && !this.state.entityConfig.has_workflow){
      let gridToolbarContent = [];
      let filePage = [{type: "Form",form_id:this.state.entityConfig.form_uuid,name:this.state.entityConfig.form_name,fileId:this.props.fileId}];
      let pageContent = {pageContent: filePage,title: "Edit",icon: "far fa-pencil"}
      gridToolbarContent.push(<Button title={"Edit"} className={"toolBarButton"} primary={true} onClick={(e) => this.updatePageContent(pageContent)} ><i className={"fa fa-pencil"}></i></Button>);
      let ev = new CustomEvent("addcustomActions", {
        detail: { customActions: gridToolbarContent },
        bubbles: true,
      });
      document.getElementById(this.appId+"_breadcrumbParent").dispatchEvent(ev);
    }
  }
    
  componentDidMount() {
      this.getFileDetails(this.props.fileId).then(fileData => {
        if(fileData.status == "success" && fileData.data && fileData.data.entity_id){
          var file = fileData.data.data ? fileData.data.data : fileData.data;
          this.setState({ entityId:fileData.data.entity_id,fileData: file });
          this.getEntityPage().then(entityPage => {
            this.setState({entityConfig: entityPage.data});
            this.generateEditButton();
            var content = this.constructTabs(entityPage.data,entityPage.data.enable_comments,entityPage.data.enable_documents);
            this.setState({content: content});
            this.setState({dataReady: true});
          });
        }
      });
  }
  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
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
      tabs.push({name: "Attachments",uuid:this.uuidv4(),content: [{type:"DocumentViewer",url:"file/"+this.fileId+"/document"}]});
    }
    return (<TabSegment appId={this.appId} core={this.core} appId={this.appId} proc={this.proc} tabs={tabs} pageId={this.uuidv4()} currentRow={this.state.fileData} />);
  }
          
  render() {
    if ( this.state.dataReady) {
        return (<div className="contentDiv">{this.state.content}</div>);
      } else {
        return <div></div>;
      }
    }
  }
          
export default EntityViewer;
          