import './index.scss';
import {React,ReactDOM,  DocumentList} from "oxziongui";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.loader = this.core.make("oxzion/splash");
    this.userprofile = this.core ? this.core.make("oxzion/profile").get().key : undefined;
    console.log(this.userprofile);
    this.helper = this.core.make("oxzion/restClient");
    this.state = {
      tree: {},
      treeData: null,
      folderData: null,
      dataReady: false
    }
  }
  componentDidMount(){
    this.getApps().then((response) => {
      this.constructTreeData(response);
    });
  }
  onSelect = (keys, info) => {
    console.log(info)
    this.setState({folderData: info.node.children });
  };
  onExpand = (node) => {
    console.log("Trigger Expand");
  };
      
  async getApps(){
    let appsResponse = await this.helper.request("v1",'user/me/a+ap' ,{},"get")
    if (appsResponse.status == "success") {
      return appsResponse.data;
    }
  }
  async getEntities(appId){
    let entity = await this.helper.request("v1",'app/'+appId+'/entity' ,{},"get")
    if (entity.status == "success") {
      return entity.data;
    }
  }
  async getFiles(appId,entityId){
    let entity = await this.helper.request("v1",'app/'+appId+'/file/user/'+this.userprofile.uuid ,{entityName:entityId},"get")
    if (entity.status == "success") {
      return entity.data;
    }
  }
  async getFileAttachments(appId,fileId){
    let entity = await this.helper.request("v1",'app/'+appId+'/file/'+fileId+'/document' ,{},"get")
    if (entity.status == "success") {
      return entity.data;
    }
  }

  loadData = async(node) =>{
    console.log(node);
    var treeData = this.state.treeData;
    if(node.key.includes('app_')){
      var appId = node.key.split("_");
      var response = await this.getEntities(appId[1]);
      var entityList = [];
      if(response){
        for (let i = 0; i < response.length; i++) {
          const element = response[i];
          entityList.push({title:element.name,key: 'application_'+appId[1]+'_entity_'+element.name,isLeaf: false});
        }
        treeData = this.updateTreeData(treeData,node.key,entityList);
        console.log(treeData);
        this.setState({treeData: treeData});
        return;
      }
    }
    if(node.key.includes('entity_')){
      var entityId = node.key.split("_");
      var response = await this.getFiles(entityId[1],entityId[3])
      var fileList = [];
      if(response){
        for (let i = 0; i < response.length; i++) {
          const element = response[i];
          fileList.push({title:element.name,key: 'application_'+entityId[1]+'_attachmentfile_'+element.uuid,isLeaf: false});
        }
        treeData = this.updateTreeData(treeData,node.key,fileList);
        this.setState({treeData: treeData});
        return;
      }
    }
    if(node.key.includes('attachmentfile_')){
      var fileId = node.key.split("_");
      var response = await this.getFileAttachments(fileId[1],fileId[3])
      var fileFolders = [];
      if(response){
        for (const folder in response) {
          if (response.hasOwnProperty.call(response, folder)) {
            const ele = response[folder];
            var folderFiles = [];
            for (let i = 0; i < response[folder].value.length; i++) {
              const element = response[folder].value[i];
              folderFiles.push({title:element.name,key: 'application_'+fileId[1]+'_file_'+element.uuid,isLeaf: true});
            }
            fileFolders.push({title:folder,key:'filefolder_'+folder,children:folderFiles});
          }
        }
        treeData = this.updateTreeData(treeData,node.key,fileFolders);
        this.setState({treeData: treeData});
        return;
      }
    }
  }
  updateTreeData(list, key, children) {
    return list.map(node => {
      if (node.key === key) {
        console.log({...node, children });
        return {...node, children };
      }
      if (node.children) {
        return { ...node, children: this.updateTreeData(node.children, key, children) };
      }
      return node;
    });
  }
  constructTreeData(profile){
    var appsList = [];
    if(profile.apps){
      for (let i = 0; i < profile['apps'].length; i++) {
        const element = profile['apps'][i];
        if(element.type == '2'){
          appsList.push({title:element.name,key: 'app_'+element.uuid,isLeaf: false})
        }
      }
    }
    this.setState({treeData: [{title:'Applications',key:'application_folder',children:appsList}],dataReady:true})
  }
  render() {
    if(this.state.dataReady){
      return (<div id="root"><DocumentList core={this.core} treeData={this.state.treeData}
       loadData={this.loadData}
       onExpand={this.onExpand}
       folderData={this.state.folderData}
       onSelect={this.onSelect} /></div>);
    } else {
      return (<div id="root"></div>);
    }
  }
}
export default App;