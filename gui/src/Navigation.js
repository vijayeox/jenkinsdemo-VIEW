  import React from "react";
  import Page from "./components/App/Page";
  import FormRender from "./components/App/FormRender";
  import { createBrowserHistory } from "history";

  class Navigation extends React.Component {
    constructor(props) {
      const history = createBrowserHistory();
      super(props);
      this.core = this.props.core;
      this.appId = this.props.appId;
      this.proc = this.props.proc;
      this.params = this.props.params;
      this.pageClass = this.appId+"_page";
      this.pageDiv = this.appId+"_pages";
      this.appNavigationDiv = "navigation_"+this.appId;
      this.state = {
        selected: this.props.selected,
        pages: []
      };
      this.homepage = null;
      this.breadcrumbDiv = this.appId + "_breadcrumbParent";
      this.contentDivID = this.appId + "_Content";
      if(this.props.menus && this.props.menus.length > 0){
        this.props.menuLoad(this.props.menus);
        if(this.props.menus[0]){
          this.homepage = this.props.menus[0];
        }
      } else {
        this.getMenulist().then(response => {
            this.props.menuLoad(response["data"]);
            if(response['data'][0]){
              this.homepage = response["data"][0];
            }
          if (this.params && this.params.page) {
            this.setState({ pages: [{ pageId: this.params.page }] });
            this.pageActive(this.params.page);
            history.push("/");
          } else if (this.params && this.params.activityId) {
            this.setState({ selected: { activity_id: this.params.activityId } });
          } else if (this.proc && this.proc.args) { ``
            if (typeof this.proc.args === "string") {
              try {
                var appParams = JSON.parse(this.proc.args);
                if (appParams.type) {
                  this.setState({
                    selected: {
                      type: appParams.type,
                      page_id: appParams.pageId,
                      pipeline: appParams.pipeline,
                      workflow_id: appParams.workflowId,
                      parentWorkflowInstanceId: appParams.workflowInstanceId,
                      workflowInstanceId: appParams.workflowInstanceId,
                      url: appParams.url,
                      activityInstanceId: appParams.activityInstanceId
                    }
                  });
                  this.pageActive(appParams.pageId);
                  history.push("/");
                } else {
                  history.push("/");
                  let ev = new CustomEvent("addPage", {
                    detail: {pageContent:appParams.detail},
                    bubbles: true
                  });
                  document.getElementsByClassName(this.breadcrumbDiv)[0].dispatchEvent(ev);
                }
              } catch (e) {
                console.log("No params!");
                console.log(e);
                this.props.selectLoad(this.homepage);
              }
            } else {
              this.props.selectLoad(this.homepage);
            }
          } else {
            this.props.selectLoad(this.homepage);
          }
        });
      }
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
    pageActive(pageId){
      if(document.getElementById(pageId+"_page")){
        document.getElementById(pageId+"_page").classList.remove("page-inactive");
        document.getElementById(pageId+"_page").classList.add("page-active");
      }
    }
    pageInActive(pageId){
      if(document.getElementById(pageId+"_page")){
        document.getElementById(pageId+"_page").classList.add("page-inactive");
        document.getElementById(pageId+"_page").classList.remove("page-active");
      }
    }
    componentDidMount() {
        document.getElementById(this.appNavigationDiv).addEventListener("addPage",this.addPage,false);
        document.getElementById(this.appNavigationDiv).addEventListener("stepDownPage",this.stepDownPage,false);
        document.getElementById(this.appNavigationDiv).addEventListener("selectPage",this.selectPage,false);
      }

    addPage = e => {
      var pages = this.state.pages;
      if(e.detail.pageId){
        pages.push(e.detail);
      } else {
        pages.push(e.detail);
      }
      if(e.detail.parentPage && document.getElementById(e.detail.parentPage+"_page")){
        this.pageInActive(e.detail.parentPage);
      }
      this.setState({pages:pages});
    };
    selectPage = e => {
      this.pageActive(e.detail.parentPage);
    };

  componentWillReceiveProps(props) {
      if (props.selected) {
        var item = props.selected;
        if(item.page_id){
          var page = [{pageId:item.page_id,title:item.name}];
          this.setState({ pages: page });
          this.pageActive(item.page_id);
        }
    }
  }
  componentDidUpdate(prevProps){
    if(prevProps.selected != this.props.selected){
      var item = this.props.selected;
      if(item.page_id){
        var page = [{pageId:item.page_id,title:item.name}];
        this.setState({ pages: page });
        this.pageActive(item.page_id);
      }
    }
  }

  stepDownPage = e => {
    if (this.state.pages.length == 1) {
      this.props.selectLoad(this.homepage);
    } else {
        let data = this.state.pages.slice();
        if(data.length > 1){
          data.splice(data.length - 1, data.length);
          this.setState({
            pages: data
          });
          this.pageActive(data[data.length-1]['pageId']);
        } else {
            this.props.selectLoad(this.homepage);
        }
    }
  };

  breadcrumbClick = (currentValue, index) => {
    let data = this.state.pages.slice();
    data.splice(index + 1, data.length);
    this.setState({
      pages: data
    });
    this.pageActive(currentValue.pageId);
  };

  renderBreadcrumbs = () => {
    var content = [];
    this.state.pages.map((currentValue, index) => {
      var clickable = false;
      if (this.state.pages.length > 1 && index+1 != this.state.pages.length) {
        clickable = true;
      }
      currentValue.title
        ? content.push(
            <span className="breadcrumbs-item" key={index}>
              {index == "0" ? null : (
                <i
                  className="fa fa-chevron-right"
                  style={{
                    fontSize: "17px",
                    marginRight: "5px"
                  }}
                />
              )}
                {currentValue.icon ? (
                  <i
                    className={currentValue.icon}
                    style={{ fontSize: "17px" }}
                  ></i>
                ) : null}
                <a
                  style={{
                    cursor: clickable ? "pointer" : null
                  }}
                  onClick={() =>
                    clickable ? this.breadcrumbClick(currentValue, index) : null
                  }
                >
                  {currentValue.title}
                </a>
            </span>
          )
        : null;
    });
    return content;
  };
    renderPages(){
      var pageList = [];
      var that = this;
      if(this.state.pages.length > 0){
        this.state.pages.map((item, i) => {
          var pageId = item.pageId+"_page";
          var pageClasses = this.pageClass + ' page-active';
          pageList.push(
            <div className={pageClasses} id={pageId}>
            <Page
              key={item.pageId}
              config={this.props.config}
              proc={this.props.proc}
              app={this.props.appId}
              core={this.core}
              pageId={item.pageId}
              pageContent={item.pageContent}
              currentRow={item.currentRow}
            /></div>);
        });
      }
      return pageList;
    }

    render() {
      const { expanded, selected } = this.state;
      return (
        <div id={this.appNavigationDiv} className="Navigation">
          <div className={this.breadcrumbDiv}>
          {this.state.pages.length > 0 ? (
            <div className="breadcrumbs">{this.renderBreadcrumbs()}</div>
          ) : null}
          </div>
          <div className={this.pageDiv} style={{height: "calc(100% - 55px)"}}>
          {this.state.pages.length > 0?
          this.renderPages():null}
          {(this.state.selected.activityInstanceId &&
            this.state.selected.activityInstanceId) ||
          this.state.selected.pipeline ? ( 
            <div id={this.contentDivID} className="AppBuilderPage">
              <FormRender
                core={this.core}
                appId={this.props.appId}
                activityInstanceId={this.state.selected.activityInstanceId}
                workflowInstanceId={this.state.selected.workflowInstanceId}
                pipeline={this.state.selected.pipeline}
              />
            </div>
          ) : null}
          </div>
        </div>
      );
    }
  }
  export default Navigation;

  // The params to open a specific page must be sent in the following format:
  // http://localhost:8081/?app=DiveInsurance
                        //  &params= {
                                    //   "name": "Quote Approval",
                                    //   "detail": [{
                                    //     "type": "Form",
                                    //     "pipeline": {
                                    //       "activityInstanceId": "629256b1-82f4-11ea-ba01-bacc68b07eda",
                                    //       "workflowInstanceId": "5e8ea8c0-82f4-11ea-ba01-bacc68b07eda",
                                    //       "commands": [{
                                    //         "command": "claimForm"
                                    //       }, {
                                    //         "command": "instanceForm"
                                    //       }]
                                    //     }
                                    //   }]
                                    // }
