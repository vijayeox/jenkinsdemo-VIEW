import React from "react";
import Page from "./components/App/Page";
import Breadcrumb from "./components/App/Breadcrumb";
import { createBrowserHistory } from 'history';

class Navigation extends React.Component {
  constructor(props) {
    const history = createBrowserHistory();
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.params = this.props.params;
    this.state = {
      selected: this.props.selected
    };
    this.child = React.createRef();
    this.homepage = null;
    this.getMenulist().then(response => {
      this.props.menuLoad(response['data']);
      this.homepage = response['data'][0];
      if(this.params.page){
        this.child.current.clearBreadcrumb();
        this.setState({selected:{page_id:this.params.page}});
        history.push("/");
      } else if(this.params.activityId){
        this.setState({selected:{activity_id:this.params.activityId}});
      } else {
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
  postSubmitCallback(){
    this.props.selectLoad(this.homepage);
  }

  render() {
    const { expanded, selected } = this.state;
    return (
      <div
          className="PageRender"
        >
          <div className="breadcrumbParent">
          <Breadcrumb ref={this.child} />
          </div>
          {this.state.selected.page_id ? (
            <Page
              pageId={this.state.selected.page_id}
              config={this.props.config}
              app={this.props.appId}
              core={this.core}
            />
          ) : null}
          {(this.state.selected.workflow_id && this.state.selected.activity_id)? (
           <div className="formContent">
            <FormRender
              postSubmitCallback={this.postSubmitCallback}
              core={this.core}
              appId={this.props.appId}
              activityInstanceId={this.state.selected.activity_id}
            />
          </div>
        ) : null }
        </div>
    );
  }
}
export default Navigation;
