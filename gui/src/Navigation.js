import React from "react";
import Page from "./components/App/Page";
import FormRender from "./components/App/FormRender";
import { createBrowserHistory } from "history";
import { Chip } from "@progress/kendo-react-buttons";
import Requests from "./Requests";
import Notification from "./Notification";

class Navigation extends React.Component {
  constructor(props) {
    const history = createBrowserHistory();
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.proc = this.props.proc;
    this.params = this.props.params;
    this.notif = React.createRef();
    this.pageClass = this.appId + "_page";
    this.pageDiv = this.appId + "_pages";
    this.appNavigationDiv = "navigation_" + this.appId;
    this.state = {
      selected: this.props.selected,
      customActions: [],
      pages: [],
    };
    this.homepage = null;
    this.breadcrumbDiv = this.appId + "_breadcrumbParent";
    this.contentDivID = this.appId + "_Content";
    if (this.props.menus && this.props.menus.length > 0) {
      this.props.menuLoad(this.props.menus);
      if (this.props.menus[0]) {
        this.homepage = this.props.menus[0];
      }
    } else {
      Requests.getMenulist(this.core,this.appId).then((response) => {
        this.props.menuLoad(response["data"]);
        if (response["data"] && response["data"][0]) {
          this.homepage = response["data"][0];
        }
        if (this.params && this.params.page) {
          this.setState({
            pages: [
              {
                pageId: this.params.page,
                title: this.params.pageTitle,
                icon: this.params.pageIcon,
              },
            ],
          });
          this.pageActive(this.params.page);
          history.push("/");
        } else if (this.params && this.params.fileId) {
          this.props.selectLoad(this.homepage);
          this.addPage({detail:{pageContent:[{type:"EntityViewer",fileId: this.params.fileId}],title: "View",icon: "fa fa-eye",fileId:this.params.fileId}})
          // this.pageActive(this.params.page);
          history.push("/");
        } else if (this.params && this.params.activityId) {
          this.setState({ selected: { activity_id: this.params.activityId } });
        } else if (this.proc && this.proc.args) {
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
                    activityInstanceId: appParams.activityInstanceId,
                  },
                });
                this.pageActive(appParams.pageId);
                history.push("/");
              } else {
                history.push("/");
                let ev = new CustomEvent("addPage", {
                  detail: { pageContent: appParams.detail },
                  bubbles: true,
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
  
  pageActive(pageId) {
    if (document.getElementById(pageId + "_page")) {
      document.getElementById(pageId + "_page").classList.remove("page-inactive");
      document.getElementById(pageId + "_page").classList.add("page-active");
    }
  }
  pageInActive(pageId) {
    if (document.getElementById(pageId + "_page")) {
      document.getElementById(pageId + "_page").classList.add("page-inactive");
      document.getElementById(pageId + "_page").classList.remove("page-active");
    }
  }
  componentDidMount() {
    document.getElementById(this.appNavigationDiv).addEventListener("addPage", this.addPage, false);
    document.getElementById(this.appNavigationDiv).addEventListener("stepDownPage", this.stepDownPage, false);
    document.getElementById(this.appNavigationDiv).addEventListener("selectPage", this.selectPage, false);
    document.getElementById(this.breadcrumbDiv).addEventListener("addcustomActions", this.addcustomActions, false);
  }

  addPage = (e) => {
    var pages = this.state.pages;
    var that = this;
    if(e.detail.fileId){
      var filePage = [{type:"EntityViewer",fileId:e.detail.fileId}]
      var pageContent = {pageContent: filePage,title: "View",icon: "fa fa-eye",fileId: e.detail.fileId};
      if(!this.checkIfEntityViewerPageExists(pageContent)){
        pages.push(pageContent)
      } else {
        pages.splice(pages.length - 1, 1);
        this.setState({
          pages: pages,
        });
        setTimeout(function(){ 
          that.addPage({detail: pageContent});
        }, 1000);
      }
    } else {
      if(!this.checkIfEntityViewerPageExists(e.detail)){
        pages.push(e.detail)
      } else {
        pages.splice(pages.length - 1, 1);
        this.setState({
          pages: pages,
        });
        setTimeout(function(){ 
          that.addPage({detail: e.detail});
        }, 1000);
        // this.addPage({detail: pageContent});
        // pages.push(e.detail);
      }
    }
    if (e.detail.parentPage && document.getElementById(e.detail.parentPage + "_page")) {
      this.pageInActive(e.detail.parentPage);
    } else {
      if(pages[pages.length - 2] && pages[pages.length - 2].pageId){
        pages.length > 0 ? this.pageInActive(pages[pages.length - 2].pageId) : null;
      }
    }
    this.setState({ pages: pages });
    this.resetCustomActions();
    this.props.selectLoad({});
  };
  selectPage = (e) => {
    this.resetCustomActions();
    this.pageActive(e.detail.parentPage);
  };
  addcustomActions = (e) => {
    this.setState({customActions:e.detail.customActions});
  };
  checkIfEntityViewerPageExists(page){
    var last_page_key = this.state.pages.length - 1;
    var pages = this.state.pages;
    if(this.state.pages[last_page_key] && this.state.pages[last_page_key].pageContent && this.state.pages[last_page_key].pageContent[0] && this.state.pages[last_page_key].pageContent[0].type=="EntityViewer" && page.pageContent && (page.pageContent[0].type=="Form" || page.pageContent[0].type=="Comment")){
      return true;
    }
    if(this.state.pages[last_page_key] && this.state.pages[last_page_key].pageContent && this.state.pages[last_page_key].pageContent[0] && this.state.pages[last_page_key].pageContent[0].type=="Form" && page.pageContent && (page.pageContent[0].type=="EntityViewer" || page.pageContent[0].type=="Comment")){
      return true;
    }
    if(this.state.pages[last_page_key] &&this.state.pages[last_page_key].pageContent  && this.state.pages[last_page_key].pageContent[0] && this.state.pages[last_page_key].pageContent[0].type=="Comment" && page.pageContent && (page.pageContent[0].type=="EntityViewer" || page.pageContent[0].type=="Form")){
      return true;
    }
    if(this.state.pages[last_page_key] &&this.state.pages[last_page_key].pageContent  && this.state.pages[last_page_key].pageContent[0] && this.state.pages[last_page_key].pageContent[0].type=="EntityViewer" && page.pageContent && page.pageContent[0].type=="EntityViewer"){
      return true;
    }
    return false;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selected != this.props.selected) {
      var item = this.props.selected;
      if (item && item.page_id) {
        this.setState({ pages: [],selected:this.props.selected });
        var page = [{ pageId: item.page_id, title: item.name }];
        this.setState({ pages: page },()=>{
          this.pageActive(item.page_id);
        });
      }
    }
  }

  stepDownPage = (e) => {
    if (this.state.pages.length == 1) {
      this.props.selectLoad(this.homepage);
    } else {
      let data = this.state.pages.slice();
      if (data.length > 1) {
        data.splice(data.length - 1, data.length);
        this.setState({
          pages: data,
        });
        this.pageActive(data[data.length - 1]["pageId"]);
      } else {
        this.props.selectLoad(this.homepage);
      }
    }
    this.resetCustomActions();
  };
  resetCustomActions(){
    this.setState({customActions:null});
    let ev = new CustomEvent("getCustomActions", {
      detail: {},
      bubbles: true,
    });
    var navigationElement = document.getElementById('navigation_'+this.appId);
    if(navigationElement && navigationElement.getElementsByClassName('page-active') && navigationElement.getElementsByClassName('page-active')[0] ){
      var foundElement = this.getElementInsideElement(navigationElement.getElementsByClassName('page-active')[0],'customActionsToolbar');
      if(foundElement){
        foundElement.dispatchEvent(ev);
      }
    }
  }
  resetPageCustomActions(){
    this.setState({customActions:[]});
  }
getElementInsideElement(baseElement, wantedElementID) {
  var elementToReturn;
  for (var i = 0; i < baseElement.childNodes.length; i++) {
      elementToReturn = baseElement.childNodes[i];
      if (elementToReturn.id == wantedElementID) {
          return elementToReturn;
      } else {
          elementToReturn = this.getElementInsideElement(elementToReturn, wantedElementID);
          if(elementToReturn){
            return elementToReturn;
          }
      }
  }
}
  breadcrumbClick = (currentValue, index) => {
    let data = this.state.pages.slice();
    data.splice(index + 1, data.length);
    this.setState({
      pages: data,
    });
    this.pageActive(currentValue.pageId);
    this.resetCustomActions();
  };

  renderBreadcrumbs = () => {
    var breadcrumbsList = [];
    this.state.pages.map((currentValue, index) => {
      var clickable = false;
      var childNode = " ";
      if (this.state.pages.length > 1 && index + 1 != this.state.pages.length) {
        clickable = true;
      }
      if(index != 0){
        childNode = <div
        style={{
          marginRight: "5px",
          marginLeft: "5px"
        }}
      > {'>'} </div>;
      }
      currentValue.title
        ? breadcrumbsList.push(
            <>
              {index == "0" ? null : ( <div style={{ marginRight: "5px" }} /> )}
              {childNode}
              <div value={""} disabled={!clickable} className={ clickable ? "activeBreadcrumb" : "disabledBreadcrumb" } type={clickable || index == 0 ? "none" : "info"} selected={false} >
                  <a onClick={() => { clickable ? this.breadcrumbClick(currentValue, index) : null;}}>
                    <i className={currentValue.icon} style={{ marginRight: "5px"}}></i>
                    {currentValue.title}
                  </a>
              </div>
            </>
          )
        : null;
    });
    return breadcrumbsList;
  };
  renderPages() {
    var pageList = [];
    var that = this;
    if (this.state.pages.length > 0) {
      this.state.pages.map((item, i) => {
        var pageId = item.pageId + "_page";
        var pageClasses = this.pageClass + " page-active";
        pageList.push(
          <div className={pageClasses} id={pageId}>
            <Page
              key={item.pageId}
              config={this.props.config}
              proc={this.props.proc}
              app={this.props.appId}
              core={this.core}
              fileId={item.fileId}
              pageId={item.pageId}
              notif={this.notif}
              params={item.params}
              pageContent={item.pageContent}
              currentRow={item.currentRow}
            />
          </div>
        );
      });
    }
    return pageList;
  }

  render() {
    const { expanded, selected } = this.state;
    return (
      <div id={this.appNavigationDiv} className="Navigation">
        <Notification ref={this.notif} />
        <div className={this.breadcrumbDiv + " breadcrumbHeader"} id={this.breadcrumbDiv}>
          {this.state.pages.length > 0 ? (
            <div className="row">
            <div className="breadcrumbs col-md-9">{this.renderBreadcrumbs()}</div><div className="col-md-3 customActions" id="customActions">{this.state.customActions}</div>
            </div>
          ) : null}
        </div>
        <div className={this.pageDiv} style={{ height: "calc(100% - 55px)" }}>
          {this.state.pages.length > 0 ? this.renderPages() : null}
          {(this.state.selected.activityInstanceId &&
            this.state.selected.activityInstanceId) ||
          this.state.selected.pipeline ? (
            <div id={this.contentDivID} className="AppBuilderPage">
              <FormRender
                core={this.core}
                appId={this.props.appId}
                notif={this.notif}
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
