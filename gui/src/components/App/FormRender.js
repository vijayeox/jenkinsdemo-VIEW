import "../../public/css/formstyles.scss";
import {Formio} from 'formiojs';
import React from 'react';
import 'bootstrap';

class FormRender extends React.Component  {
  constructor(props){
    super(props);
    this.core = this.props.core;
    this.state = {
      form: null,
      appId: this.props.appId,
      workflowId: null,
      workflowInstanceId: this.props.workflowInstanceId,
      activityInstanceId: this.props.activityInstanceId,
      activityId: this.props.activityId,
      instanceId: this.props.instanceId,
      formId: this.props.formId,
      content: this.props.content,
      data: this.props.data,
      page: this.props.page
    }
    this.formDivID = "formio_"+this.state.formId;
  }
  async getWorkflow() {
    // call to api using wrapper
    let helper = this.core.make('oxzion/restClient');
    let pageContent = await helper.request('v1','/app/'+this.state.appId+'/form/' + this.state.formId+'/workflow', {}, 'get' );
    return pageContent;
  }
  async getActivity() {
    // call to api using wrapper
    let helper = this.core.make('oxzion/restClient');
    let formContent = await helper.request('v1','/activity/'+this.state.activityInstanceId+'/form', {}, 'get' );
    return formContent;
  }
  async getInstanceData() {
    // call to api using wrapper
    // let helper = this.core.make('oxzion/restClient');
    // let pageContent = await helper.request('v1','/app/'+this.state.appId+'/form/' + this.state.formId+'/workflow', {}, 'get' );
    // return pageContent;
  }
  async saveForm(data) {
    let helper = this.core.make('oxzion/restClient');
    let route = "";
    let method = "post";
    if(this.state.workflowId){
      route = "/workflow/"+this.state.workflowId;
      if(this.state.activityInstanceId ){
        route = "/workflow/"+this.state.workflowId+"/activity/"+this.state.activityInstanceId;
        method = "post";
        if(this.state.instanceId){
          route = "/workflow/"+this.state.workflowId+"/activity/"+this.state.activityId+"/instance/"+this.state.instanceId;
          method = "put";
        }
      }
    } else {
      route = "/app/"+this.state.appId+"/form/"+this.state.formId+"/file";
      method = "post";
      if(this.state.instanceId){
        route = "/app/"+this.state.appId+"/form/"+this.state.formId+"/file/"+this.state.instanceId;
        method = "put";
      }
    }
    let response = await helper.request("v1", route, data, method);
    return response;
  }
  loadWorkflow(){
    if(this.state.formId){
      this.getWorkflow().then(response => {
        if(response.status == 'success' && response.data.workflow_id){
          this.setState({ workflowId: response.data.workflow_id });
          this.setState({ activityId: response.data.activity_id });
          this.createForm();
        }
      });
    }
    if(this.state.activityInstanceId){
      this.getActivity().then(response => {
        if(response.status == 'success'){
          this.setState({workflowInstanceId:response.data.workflow_instance_id});
          this.setState({ workflowId: response.data.workflow_id });
          this.setState({ activityId: response.data.activity_id });
          this.setState({ data: JSON.parse(response.data.data) });
          this.setState({ content: response.data.template });
          this.createForm();
        }
      });
    }
    if(this.state.instanceId){
      this.getInstanceData().then(response => {
        if(response.status == 'success' && response.data.workflow_id){
          this.setState({workflowInstanceId:response.data.workflow_instance_id});
          this.setState({ workflowId: response.data.workflow_id });
          this.setState({ activityId: response.data.activity_id });
          this.setState({ data: JSON.parse(response.data.data) });
          this.setState({ content: response.data.template });
          this.createForm();
        }
      });
    }
  }
  createForm(){
    let that =this
    if(this.state.content && !this.state.form){
      var formCreated = Formio.createForm(document.getElementById(this.formDivID), this.state.content).then(function(form){
       form.on('render', function(){
        if(that.state.data){
          form.setSubmission(that.state.data);
        }
        if(that.state.page){
          form.setPage(that.state.page);
        }
       });
       form.on('prevPage',function(prevPage,submission){
        that.setState({page:prevPage});
       });
       form.on('nextPage',function(nextPage,submission){
        that.setState({page:nextPage});
       });
       form.on('submit', function(submission) {
        that.saveForm(submission.data);
      });
       form.on('change', function(changed) {
        console.log('Form was changed', changed);
      });
     });
    }
  }
  componentDidMount(){
    this.loadWorkflow();
  }

async PushDataPOST(api, method, item, body) {
  if (method == "put") {
    let response = await helper.request(
      "v1",
      "/" + api + "/" + item,
      body,
      "filepost"
    );
    return response;
  } else if (method == "post") {
    let response = await helper.request("v1", "/" + api, body, "filepost");
    return response;
  }
}
  render(){
    return (<div className="form-render" id={this.formDivID}></div>);
  }
};
export default FormRender;