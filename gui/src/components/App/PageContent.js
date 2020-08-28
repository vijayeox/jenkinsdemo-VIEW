import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import moment from "moment";
import Swal from "sweetalert2";
import FormRender from "./FormRender";
import HTMLViewer from "./HTMLViewer";
import CommentsView from "./CommentsView";
import OX_Grid from "../../OX_Grid";
import SearchPage from "./SearchPage";
import RenderButtons from "./RenderButtons";
import Notification from "../../Notification";
import DocumentViewer from "../../DocumentViewer";
import Dashboard from "../../Dashboard";
import Page from "./Page";
import TabSegment from "./TabSegment";
import merge from "deepmerge";
import "./Styles/PageComponentStyles.scss";
import * as OxzionGUIComponents from "../../../index.js";

class PageContent extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.proc = this.props.proc;
    this.pageId = this.props.pageId;
    this.contentRef = React.createRef();
    this.notif = React.createRef();
    this.userprofile = this.props.core.make("oxzion/profile").get().key;
    this.isTab = this.props.isTab;
    this.parentPage = this.props.parentPage?this.props.parentPage:null;
    this.loader = this.core.make("oxzion/splash");
    this.fetchExternalComponents().then((response) => {
      this.extGUICompoents = response.guiComponent
        ? response.guiComponent
        : undefined;
        this.setState({
          showLoader: false
        });
    });
    this.contentDivID = "content_" + this.appId + "_" + this.props.pageId;
    this.state = {
      pageContent: this.props.pageContent?this.props.pageContent:[],
      pageId: this.props.pageId,
      submission: this.props.submission,
      showLoader: false,
      fileId: this.props.fileId?this.props.fileId:null,
      isMenuOpen: false,
      currentRow: this.props.currentRow?this.props.currentRow:{},
      title: '',
      displaySection: 'DB',
      sectionData: null,
    };
  }

  async getPageContent() {
    let helper = this.core.make("oxzion/restClient");
    let page = await helper.request("v1","/app/" + this.appId + "/page/"+this.pageId,{},"get");
    return page;
  }
  async fetchExternalComponents() {
    return await import("../../externals/" + this.appId + "/index.js");
  }

  componentDidUpdate(prevProps) {
    if (this.props.pageContent !== prevProps.pageContent) {
      var PageRenderDiv = document.querySelector(".PageRender");
      this.loader.show(PageRenderDiv);
      this.fetchExternalComponents().then((response) => {
        this.extGUICompoents = response.guiComponent
          ? response.guiComponent
          : undefined;
      });
      this.setState({pageContent:this.props.pageContent});
    }
  }

  renderButtons(e, action) {
    var actionButtons = [];
    Object.keys(action).map(function (key, index) {
      var row = e; 
      var string = this.replaceParams(action[key].rule, e);
      var _moment = moment;
      var profile = this.userprofile;
      string = string.replace(/moment/g,'_moment');
      var showButton = eval(string);
      var buttonStyles = action[key].icon
        ? {
          width: "auto"
        }
        : {
          width: "auto",
          // paddingTop: "5px",
          color: "white",
          fontWeight: "600"
        };
      showButton ? actionButtons.push(
          <abbr title={action[key].name} key={index}>
            <Button
              primary={true}
              className=" btn manage-btn k-grid-edit-command"
              onClick={() => {
                action[key].confirmationMessage
                  ? Swal.fire({
                    title: action[key].confirmationMessage,
                    confirmButtonText: "Agree",
                    confirmButtonColor: "#275362",
                    showCancelButton: true,
                    cancelButtonColor: "#7b7878",
                    target: ".PageRender"
                  }).then((result) => {
                    result.value ? this.buttonAction(action[key], e) : null;
                  }) : action[key].details ? this.buttonAction(action[key], e) : null;
              }}
              style={buttonStyles}
            >
              {action[key].icon ? (<i className={action[key].icon + " manageIcons"}></i>) : (action[key].name)}
            </Button>
          </abbr>
        ) : null;
    }, this);
    return actionButtons;
  }

  renderRow(e, config) {
    var url = config[0].content.route;
    var dataString = this.prepareDataRoute(url, e);

    return (
      <OX_Grid
        appId={this.appId}
        osjsCore={this.core}
        data={dataString}
        gridToolbar={config[0].content.toolbarTemplate}
        columnConfig={config[0].content.columnConfig}
      />
    );
  }
  loadPage(pageId, icon, hideLoader,name,currentRow,pageContent) {
   var parentPage = this.pageId;
   if(this.isTab=="true"){
     parentPage = this.parentPage;
   }
   let ev = new CustomEvent("addPage", {
     detail: {pageId:pageId,title:name,icon:icon,nested:true,currentRow:currentRow,parentPage:parentPage,pageContent:pageContent},
     bubbles: true
   });
   document.getElementById("navigation_"+this.appId).dispatchEvent(ev);
   this.loader.destroy();
 }

  async buttonAction(action, rowData) {
    if (action.page_id) {
      this.loadPage(action.page_id);
    } else if (action.details) {
      var pageDetails = this.state.pageContent;
      var that = this;
      var copyPageContent = [];
      var fileId;
      var checkForTypeUpdate = false;
      var updateBreadcrumb = true;
      var pageId =null;
      if(action.details.length > 0){
        action.details.every(async (item, index) => {
          var copyItem = JSON.parse(JSON.stringify(item));
          if (item.type == "Update") {
            var PageRenderDiv = document.getElementById(this.contentDivID);
            this.loader.show(PageRenderDiv ? PageRenderDiv : null);
            checkForTypeUpdate = true;
            const response = await that.updateActionHandler(item, rowData);
            if (response.status == "success") {
              this.loader.destroy();
              item.params.successNotification
                ? that.notif.current.notify(
                    "Success",
                    item.params.successNotification.length > 0
                      ? item.params.successNotification
                      : "Update Completed",
                    "success"
                  )
                : null;
              this.setState({
                showLoader: false
              });
            } else {
              this.loader.destroy();
              Swal.fire({
                icon: "error",
                title: response.message,
                showConfirmButton: true
              });
              that.setState({
                pageContent: pageDetails,
                showLoader: false
              });
              return false;
            }
          } else {
            if (item.params && item.params.page_id) {
              pageId=item.params.page_id;
              copyPageContent = [];
            } else {
              var pageContentObj={};
              pageContentObj = this.replaceParams(item,rowData);
              copyPageContent.push(pageContentObj);
            }
          }
        });
        action.updateOnly ? null : this.loadPage(pageId, action.icon, true,action.name,rowData,copyPageContent);
      }
    }
  }

  updateActionHandler(details, rowData) {
    var that = this;
    return new Promise((resolve) => {
      var queryRoute = that.replaceParams(details.params.url, rowData);
      that.updateCall(queryRoute, rowData).then((response) => {
        that.setState({
          showLoader: false
        });
        resolve(response);
      });
    });
  }

  replaceParams(route, params) {
    var finalParams = merge(params ? params : {}, {
      current_date: moment().format("YYYY-MM-DD"),
      fileId: this.state.fileId ? this.state.fileId : null,
      appId: this.appId
    });
    if (typeof route == "object") {
      var final_route = JSON.parse(JSON.stringify(route));
      Object.keys(route).map((item) => {
        if (/\{\{.*?\}\}/g.test(route[item])) {
          if (finalParams[item]) {
            final_route[item] = finalParams[item];
          } else {
            if (item == "appId") {
              final_route[item] = this.appId;
            } else if (item == "fileId" && this.state.fileId) {
              final_route[item] = this.state.fileId;
            } else {
              final_route[item] = route[item];
            }
          }
        } else {
          final_route[item] = route[item];
        }
      });
      return final_route;
    } else {
      var regex = /\{\{.*?\}\}/g;
      let m;
      var matches=[];
      do {
        m = regex.exec(route)
        if(m){
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          // The result can be accessed through the `m`-variable.
        matches.push(m);
        }
      } while (m);
      matches.forEach((match, groupIndex) => {
        var param = match[0].replace("{{", "");
        param = param.replace("}}", "");
        if(finalParams[param] !=undefined){
          route = route.replace(
            match[0],
            finalParams[param]
          );
        } else {
          route = route.replace(
            match[0],
            null
          );
        }
      });
      return route;
    }
  }

  prepareDataRoute(route, params, disableAppId) {
    if (typeof route == "string") {
      if (!params) {
        params = {};
      }
      var result = this.replaceParams(route, params);
      result = disableAppId ? result : "app/" + this.appId + "/" + result;
      return result;
    } else {
      return route;
    }
  }

  async updateCall(route, body) {
    let helper = this.core.make("oxzion/restClient");
    let formData = await helper.request(
      "v1",
      "/app/" + this.appId + "/" + route,
      body,
      "post"
    );
    return formData;
  }

  async getPageContent(pageId) {
    // call to api using wrapper
    let helper = this.core.make("oxzion/restClient");
    let pageContent = await helper.request(
      "v1",
      "/app/" + this.appId + "/page/" + pageId,
      {},
      "get"
    );
    return pageContent;
  }

  setTitle = (title) => {
    this.setState({ title: title });
  }


  hideMenu = () => {
    this.setState({ isMenuOpen: false });
  };

  switchSection = (section, data) => {
    this.hideMenu();
    this.setState({
      displaySection: section,
      sectionData: data
    });

  }
  editDashboard = (data) => {
    this.switchSection('EDB', data);
  }

  postSubmitCallback(){
    let ev = new CustomEvent("handleGridRefresh", {
      detail: {},
      bubbles: true
    });
    if(document.getElementById("navigation_" + this.appId)){
      document.getElementById("navigation_" + this.appId).dispatchEvent(ev);
    }
  }

  renderContent(data) {
    var content = [];
    data.map((item, i) => {
      if (item.type == "Form") {
        var dataString = this.prepareDataRoute(item.url, this.state.currentRow);
        // This workflow instance id corresponds to completed workflow instance
        var workflowInstanceId = this.replaceParams(
          item.workflowInstanceId,
          this.state.currentRow
        );
        var workflowId = this.replaceParams(
          item.workflowId,
          this.state.currentRow
        );
        var activityInstanceId = this.replaceParams(
          item.activityInstanceId,
          this.state.currentRow
        );
        var cacheId = this.replaceParams(
          item.cacheId,
          this.state.currentRow
        );
        var urlPostParams = this.replaceParams(
          item.urlPostParams,
          this.state.currentRow
        );
        var fileId = this.replaceParams(item.fileId, this.state.currentRow);
        content.push(
          <FormRender
            key={i}
            url={dataString}
            urlPostParams={urlPostParams}
            core={this.core}
            proc={this.proc}
            appId={this.appId}
            postSubmitCallback={this.postSubmitCallback}
            data={item.data}
            content={item.content}
            fileId={fileId}
            formId={item.form_id}
            page={item.page}
            pipeline={item.pipeline}
            workflowId={workflowId}
            cacheId={cacheId}
            isDraft={item.isDraft}
            activityInstanceId={activityInstanceId}
            parentWorkflowInstanceId={workflowInstanceId}
          />
        );
      } else if (item.type == "List") {
        var itemContent = item.content;
        var columnConfig = itemContent.columnConfig;
        if (itemContent.actions) {
          if (columnConfig[columnConfig.length - 1].title == "Actions") {
            null;
          } else {
            columnConfig.push({
              title: "Actions",
              width: itemContent.actionsWidth ? itemContent.actionsWidth : "200px",
              cell: (e) => this.renderButtons(e, itemContent.actions),
              filterCell: {
                type: "empty"
              }
            });
          }
        }
        var dataString = this.prepareDataRoute(
          itemContent.route,
          this.state.currentRow,
          itemContent.disableAppId
        );
        var urlPostParams = this.replaceParams(
          item.urlPostParams,
          this.state.currentRow
        );
        content.push(
          <OX_Grid
            rowTemplate={
              itemContent.expandable
                ? (e) => this.renderRow(e, itemContent.rowConfig)
                : null
            }
            appId={this.appId}
            key={i}
            parentDiv={this.contentDivID}
            osjsCore={this.core}
            data={dataString}
            pageId={this.state.pageId}
            parentData={this.state.currentRow}
            urlPostParams={urlPostParams}
            gridDefaultFilters={
              itemContent.defaultFilters
                ? typeof itemContent.defaultFilters == "string"
                  ? JSON.parse(this.replaceParams(itemContent.defaultFilters))
                  : this.replaceParams(itemContent.defaultFilters)
                : undefined
            }
            gridOperations={itemContent.operations}
            gridToolbar={itemContent.toolbarTemplate}
            columnConfig={columnConfig}
            {...itemContent}
          />
        );
      } else if (item.type == "Search") {
        var placeholder = item.content.placeholder;
        var columnConfig = item.content.columnConfig;
        if (item.content.actions) {
          if (columnConfig[columnConfig.length - 1].title == "Actions") {
            null;
          } else {
            columnConfig.push({
              title: "Actions",
              cell: (e) => this.renderButtons(e, item.content.actions),
              filterCell: {
                type: "empty"
              }
            });
          }
        }
        content.push(
          <SearchPage
            key={i}
            core={this.core}
            content={item.content}
            filterColumns={item.content.filterColumns}
            appId={this.appId}
            entityId={item.content.entityId}
            columnConfig={columnConfig}
            placeholder={placeholder}
            {...item.content}
          />
        );
      } else if (item.type == "DocumentViewer") {
        var url;
        if(item.url){
          url = this.replaceParams(item.url, this.state.currentRow);
        }
        if(item.content){
          url = this.replaceParams(item.content, this.state.currentRow);
        }
        content.push(
          <DocumentViewer
            appId={this.appId}
            key={i}
            core={this.core}
            url={url}
          />
        );
      } else if (item.type == "RenderButtons") {
        content.push(
          <RenderButtons
            appId={this.appId}
            key={i}
            ref={this.contentRef}
            core={this.core}
            pageId={this.state.pageId}
            currentRow={this.state.currentRow}
            {...item}
          />
        );
      } else if (item.type == "Comment") {
        var url;
        if(item.content){
          url = this.replaceParams(item.content, this.state.currentRow);
        } else {
          if(item.url){
            url = item.url;
          }
        }
        content.push(
          <CommentsView
            appId={this.appId}
            key={i}
            core={this.core}
            url={url}
          />
        );
      } else if (item.type == "TabSegment") {
        content.push(
          <TabSegment
            appId={this.appId}
            core={this.core}
            appId={this.appId}
            proc={this.props.proc}
            tabs={item.content.tabs}
            pageId={this.state.pageId}
            currentRow={this.state.currentRow}
          />
        );
      } else if (item.type == "Dashboard") {
        content.push(
          <Dashboard
            appId={this.appId}
            key={i}
            core={this.core}
            content={item.content}
            proc={this.proc}
          />
        );
      } else if (item.type == "Page") {
        content.push(
          <Page
            key={item.page_id}
            config={this.props.config}
            proc={this.props.proc}
            isTab={this.isTab}
            parentPage={this.parentPage}
            app={this.props.appId}
            currentRow={this.state.currentRow}
            pageId={item.page_id}
            core={this.core}
          />
        );
      } else if (item.type == "Document" || item.type == "HTMLViewer") {
        content.push(
          <HTMLViewer
            key={i}
            core={this.core}
            key={i}
            appId={this.appId}
            url={
              item.url
                ? this.replaceParams(item.url, this.state.currentRow)
                : undefined
            }
            content={item.content ? item.content : ""}
            fileData={this.state.currentRow}
          />
        );
      } else {
        if(this.extGUICompoents && this.extGUICompoents[item.type]){
          this.externalComponent = this.extGUICompoents[item.type];
          let guiComponent = this.extGUICompoents && this.extGUICompoents[item.type] ? (
              <this.externalComponent
                {...item}
                key={i}
                components={OxzionGUIComponents}
                appId={this.appId}
                core={this.core}
              ></this.externalComponent>
            ) : (
                <h3 key={i}>The component used is not available.</h3>
              );
          content.push(guiComponent);
        } else {
          content.push(<h3 key={i}>The component used is not available.</h3>);
        }
      }
    });
    if (content.length > 0) {
      this.loader.destroy();
    } else {
      content.push(<h2>No Content Available</h2>);
      this.loader.destroy();
    }
    return content;
  }

  render() {
    if (
      this.state.pageContent &&
      this.state.pageContent.length > 0 &&
      !this.state.showLoader
    ) {
      this.loader.destroy();
      var pageRender = this.renderContent(this.state.pageContent);
      return (
        <div id={this.contentDivID} className="contentDiv">
          <Notification ref={this.notif} />
          {pageRender}
        </div>
      );
    } else {
      return <div id={this.contentDivID}></div>;
    }
  }
}

export default PageContent;
