import React from "react";
import Page from "./components/App/Page";
import FormRender from "./components/App/FormRender";
import Breadcrumb from "./components/App/Breadcrumb";
import { createBrowserHistory } from 'history';

class Navigation extends React.Component {
  constructor(props) {
    const history = createBrowserHistory();
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.proc = this.props.proc;
    this.params = this.props.params;
    this.state = {
      selected: this.props.selected
    };
    this.homepage = null;
    this.child = React.createRef();
    this.breadcrumbDiv = this.appId+'_breadcrumbParent';
    this.contentDivID = this.appId+'_Content';
    this.getMenulist().then(response => {
      this.props.menuLoad(response['data']);
      this.homepage = response['data'][0];
      if(this.params && this.params.page){
        this.child.current.clearBreadcrumb();
        this.setState({selected:{page_id:this.params.page}});
        history.push("/");
      } else if(this.params && this.params.activityId){
        this.setState({selected:{activity_id:this.params.activityId}});
      } else if(this.proc && this.proc.args){
        if(typeof this.proc.args === 'string'){
          try {
            var appParams = JSON.parse(this.proc.args);
            if(appParams.type){
              this.postSubmitCallback = this.postSubmitCallback.bind(this);
              this.setState({selected:{type:appParams.type,page_id:appParams.pageId,pipeline:appParams.pipeline,workflow_id:appParams.workflowId,parentWorkflowInstanceId:appParams.workflowInstanceId,url:appParams.url,activityInstanceId:appParams.activityInstanceId}});
            }
          } catch(e){
            console.log("No params!");
            console.log(e);
            this.child.current.clearBreadcrumb();
            this.props.selectLoad(this.homepage);
          }
        } else {
          this.child.current.clearBreadcrumb();
          this.props.selectLoad(this.homepage);
        }
      } else {
        this.child.current.clearBreadcrumb();
        this.props.selectLoad(this.homepage);
      }
    });
  }
  async getMenulist() {
    let helper = this.core.make("oxzion/restClient");
    let menulist = await helper.request(
      "v1",
      "/app/" + this.appId + "/menu",
      {},
      "get"
      );
    return menulist;
  }

  componentWillReceiveProps(props){
    if(props.selected){
      this.setState({selected:props.selected});
      if(props.selected !== this.state.selected)
        this.child.current.clearBreadcrumb();
    }
  }
  postSubmitCallback = () => {
    this.props.selectLoad(this.homepage);
    this.child.current.clearBreadcrumb();
    history.push("/");
  }

  render() {
    const { expanded, selected } = this.state;
    return (
      <div className="PageRender">
      <div className={this.breadcrumbDiv}>
      <Breadcrumb ref={this.child} appId={this.appId} />
      </div>
      {this.state.selected.page_id ? (
        <Page
        pageId={this.state.selected.page_id}
        config={this.props.config}
        proc={this.props.proc}
        app={this.props.appId}
        core={this.core}
        />
        ) : null}
        {((this.state.selected.activityInstanceId && this.state.selected.activityInstanceId)||(this.state.selected.pipeline))? (
          <div id={this.contentDivID} className="AppBuilderPage">
          <FormRender
          postSubmitCallback={this.postSubmitCallback}
          core={this.core}
          appId={this.props.appId}
          activityInstanceId={this.state.selected.activityInstanceId}
          pipeline={this.state.selected.pipeline}
          />
          </div>
          ) : null }
          </div>
          );
  }
}
export default Navigation;
