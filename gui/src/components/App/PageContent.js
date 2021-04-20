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
import Page from "./Page";
import TabSegment from "./TabSegment";
import merge from "deepmerge";
import "./Styles/PageComponentStyles.scss";
import * as OxzionGUIComponents from "../../../index";
import ParameterHandler from "./ParameterHandler";
import PageNavigation from "../PageNavigation";
import EntityViewer from "./EntityViewer";

class PageContent extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.proc = this.props.proc;
    this.pageId = this.props.pageId;
    this.contentRef = React.createRef();
    this.params = this.props.params;
    this.notif = this.props.notif;
    this.userprofile = this.props.core.make("oxzion/profile").get().key;
    this.isTab = this.props.isTab;
    this.parentPage = this.props.parentPage ? this.props.parentPage : null;
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
      pageContent: this.props.pageContent ? this.props.pageContent : [],
      pageId: this.props.pageId,
      submission: this.props.submission,
      showLoader: false,
      fileData: this.props.fileData? this.props.fileData : {},
      fileId: this.props.fileId ? this.props.fileId : null,
      isMenuOpen: false,
      currentRow: this.props.currentRow ? this.props.currentRow : {},
      title: '',
      notif: this.notif,
      displaySection: 'DB',
      sectionData: null,
    };
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
      this.setState({ pageContent: this.props.pageContent });
    }
  }

  componentDidMount() {
    document.getElementById(this.contentDivID)
    ? document
        .getElementById(this.contentDivID)
        .addEventListener(
          "clickAction",
          (e) => this.buttonAction(e.detail, {}),
          false
        )
    : null;
  }

  renderButtons(e, action) {
    var actionButtons = [];
    Object.keys(action).map(function (key, index) {
      var row = e;
      var string = ParameterHandler.replaceParams(this.appId,action[key].rule, e);
      var _moment = moment;
      var profile = this.userprofile;
      string = string.replace(/moment/g, '_moment');
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
        pageId = {this.pageId}
        gridToolbar={config[0].content.toolbarTemplate}
        columnConfig={config[0].content.columnConfig}
      />
    );
  }

  async buttonAction(actionCopy, rowData) {
    var action = actionCopy;
    if (action.content){
      action.details = action.content;
    }
    var mergeRowData = this.props.currentRow ? {...this.props.currentRow, ...rowData} : rowData;
    if (action.page_id) {
      PageNavigation.loadPage(this.appId,this.pageId,action.page_id);
    } else if (action.details) {
      var pageDetails = this.state.pageContent;
      var that = this;
      var copyPageContent = [];
      if(rowData.rygRule){
        copyPageContent.push({type: "HTMLViewer" , content: rowData.rygRule, className: "rygBadge"});  
      }
      var checkForTypeUpdate = false;
      var updateBreadcrumb = true;
      var pageId = null;
      if (action.details.length > 0) {
        action.details.every(async (item, index) => {
          if (item.type == "Update") {
            var PageRenderDiv = document.getElementById(this.contentDivID);
            this.loader.show(PageRenderDiv ? PageRenderDiv : null);
            checkForTypeUpdate = true;
            const response = await that.updateActionHandler(item, mergeRowData);
            if (response.status == "success") {
              this.loader.destroy();
              if (item.successMessage) {
                Swal.fire({ icon: "success", title: item.successMessage, showConfirmButton: true });
              }
              item.params.successNotification ? that.notif.current.notify("Success", item.params.successNotification.length > 0 ? item.params.successNotification : "Update Completed", "success") : null;
              this.postSubmitCallback();
              this.setState({ showLoader: false });
            } else {
              this.loader.destroy();
              Swal.fire({ icon: "error", title: response.message, showConfirmButton: true });
              that.setState({ pageContent: pageDetails, showLoader: false });
              return false;
            }
          } else {
            if (item.params && item.params.page_id) {
              pageId = item.params.page_id;
              if (item.params.params) {
                var newParams = ParameterHandler.replaceParams(this.appId, item.params.params, mergeRowData);
                mergeRowData = { ...newParams, ...mergeRowData };
              }
              copyPageContent = [];
            } else {
              var pageContentObj = {};
              pageContentObj = ParameterHandler.replaceParams(this.appId,item, mergeRowData);
              copyPageContent.push(pageContentObj);
            }
          }
        });
        action.updateOnly ? null : PageNavigation.loadPage(this.appId,this.pageId, pageId, action.icon, true, action.name, mergeRowData, copyPageContent);
      }
    }
  }

  updateActionHandler(details, rowData) {
    var that = this;
    return new Promise((resolve) => {
      var queryRoute = ParameterHandler.replaceParams(that.appId,details.params.url, rowData);
      var postData = {};
      try {
        if (details.params.postData) {
          Object.keys(details.params.postData).map((i) => {
            postData[i] = ParameterHandler.replaceParams(that.appId, details.params.postData[i], rowData );
          });
        } else {
          Object.keys(details.params).map((i) => {
            postData[i] = ParameterHandler.replaceParams(that.appId, details.params[i], rowData );
          });
          postData = rowData;
        }
      } catch (error) {
        postData = rowData;
      }
      ParameterHandler.updateCall( this.core,this.appId, queryRoute, postData, details.params.disableAppId, details.method ).then((response) => {
          if (details.params.downloadFile && response.status == 200) {
              ParameterHandler.downloadFile(response).then((result) => {
                  that.setState({ showLoader: false });
                  var downloadStatus = result ? "success" : "failed";
                  resolve({ status: downloadStatus });
                });
          } else {
            that.setState({ showLoader: false });
            resolve(response);
          }
        });
    });
  }

  prepareDataRoute(route, params, disableAppId) {
    if (typeof route == "string") {
      if (!params) {
        params = {};
      }
      var result = ParameterHandler.replaceParams(this.appId,route, params);
      result = disableAppId ? result : "app/" + this.appId + "/" + result;
      return result;
    } else {
      return route;
    }
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

  postSubmitCallback() {
    let ev = new CustomEvent("handleGridRefresh", {
      detail: {hideLoader: true},
      bubbles: true
    });
    if (document.getElementById("navigation_" + this.appId)) {
      document.getElementById("navigation_" + this.appId).dispatchEvent(ev);
    }
  }

  renderContent(data) {
    var content = [];
    data.map((item, i) => {
      if (item.type == "Form") {
        var dataString = this.prepareDataRoute(item.url, this.state.currentRow);
        // This workflow instance id corresponds to completed workflow instance
        var workflowInstanceId = ParameterHandler.replaceParams(this.appId,
          item.workflowInstanceId,
          this.state.currentRow
        );
        var workflowId = ParameterHandler.replaceParams(this.appId,
          item.workflowId,
          this.state.currentRow
        );
        var activityInstanceId = ParameterHandler.replaceParams(this.appId,
          item.activityInstanceId,
          this.state.currentRow
        );
        var cacheId = ParameterHandler.replaceParams(this.appId,
          item.cacheId,
          this.state.currentRow
        );
        var urlPostParams = ParameterHandler.replaceParams(this.appId,
          item.urlPostParams,
          this.state.currentRow
        );
        var fileId = ParameterHandler.replaceParams(this.appId,item.fileId, this.state.currentRow);
        content.push(
          <FormRender
            {...item}
            key={i}
            url={item.url == '' ? undefined: dataString}
            urlPostParams={urlPostParams}
            core={this.core}
            proc={this.proc}
            appId={this.appId}
            postSubmitCallback={this.postSubmitCallback}
            fileId={fileId}
            formId={item.form_id}
            notif={this.notif}
            workflowId={workflowId}
            cacheId={cacheId}
            activityInstanceId={activityInstanceId}
            parentWorkflowInstanceId={workflowInstanceId}
            dataUrl={item.dataUrl ? this.prepareDataRoute(item.dataUrl, this.state.currentRow,true) : undefined}
          />
        );
      } else if (item.type == "List") {
        var itemContent = item.gridContent ? item.gridContent : item.content;
        var columnConfig = itemContent.columnConfig;
        // if (itemContent.actions) {
        //   if (columnConfig[columnConfig.length - 1].title == "Actions") {
        //     null;
        //   } else {
        //     columnConfig.push({
        //       title: "Actions",
        //       width: itemContent.actionsWidth ? itemContent.actionsWidth : "200px",
        //       cell: (e) => this.renderButtons(e, itemContent.actions),
        //       filterCell: {
        //         type: "empty"
        //       }
        //     });
        //   }
        // }
        var mergeRowData = this.props.params ? {...this.props.params, ...this.state.currentRow} : this.state.currentRow;
        var dataString = this.prepareDataRoute(
          itemContent.route,
          mergeRowData,
          itemContent.disableAppId
        );
        var urlPostParams = ParameterHandler.replaceParams(this.appId,
          item.urlPostParams,
          mergeRowData
        );
        var listOptions = itemContent.listOptions;
        var reorderable = false;
        if(listOptions && listOptions.reorderable == "true"){
          reorderable = true;
        } else {
          reorderable = false;
        }
        var sortable = false;
        if(listOptions && listOptions.sortable == "true"){
          sortable = true;
        } else {
          sortable = false;
        }
        var resizable = false;
        if(listOptions && listOptions.resizable == "true"){
          resizable = true;
        } else {
          resizable = false;
        }
        var that = this;
        if(itemContent.operations){
          if(itemContent.operations.actions){
            itemContent.operations.actions.map((action, j) => {
              var act = action;
              if(Array.isArray(act.details)){
                act.details.map((detail, k) => {
                  if(detail.params){
                    Object.keys(detail.params).map(function (key, index) {
                      detail.params[key] = ParameterHandler.replaceParams(that.appId,detail.params[key],mergeRowData);
                    });
                  }
                });
              }
            });
          }
        }
        var operations = ParameterHandler.replaceParams(this.appId,
          itemContent.operations,
          mergeRowData
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
            postSubmitCallback={this.postSubmitCallback}
            pageId={this.state.pageId}
            sortable={sortable}
            resizable={resizable}
            reorderable={reorderable}
            parentData={this.state.currentRow}
            pageId={this.pageId}
            notif={this.notif}
            urlPostParams={urlPostParams}
            gridDefaultFilters={
              itemContent.defaultFilters
                ? typeof itemContent.defaultFilters == "string"
                  ? JSON.parse(ParameterHandler.replaceParams(this.appId,itemContent.defaultFilters))
                  : ParameterHandler.replaceParams(this.appId,itemContent.defaultFilters)
                : undefined
            }
            gridOperations={operations}
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
            notif={this.notif}
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
        if (item.url) {
          url = ParameterHandler.replaceParams(this.appId,item.url, this.state.currentRow);
        }
        if (item.content) {
          url = ParameterHandler.replaceParams(this.appId,item.content, this.state.currentRow);
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
            notif={this.notif}
            currentRow={this.state.currentRow}
            {...item}
          />
        );
      } else if (item.type == "Comment") {
        var url;
        if (item.content) {
          url = ParameterHandler.replaceParams(this.appId,item.content, this.state.currentRow);
        } else {
          if (item.url) {
            url = ParameterHandler.replaceParams(this.appId,item.url, this.state.currentRow);
          }
        }
        var fileId;
        if(item.fileId){
          fileId = item.fileId;
        }
        console.log(item);
        content.push(
          <CommentsView
            appId={this.appId}
            key={i}
            core={this.core}
            url={url}
            notif={this.notif}
            fileId={fileId}
          />
        );
      } else if (item.type == "TabSegment") {
        content.push(
          <TabSegment
            appId={this.appId}
            core={this.core}
            appId={this.appId}
            notif={this.notif}
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
            notif={this.notif}
            content={item.content}
            proc={this.proc}
          />
        );
      } else if (item.type == "DashboardManager") {
        var uuid = item.content ? (item.content.uuid? item.content.uuid: null) : null;
        content.push(
          <DashboardManager
            appId={this.appId}
            uuid={uuid}
            content={item.content}
            notif={this.notif}
            args={this.core}
            key={i}
            content={item.content}
            setTitle={() => {}}
            proc={this.proc}
            editDashboard="EDB"
            hideEdit={true}
          />
        );
      } else if (item.type == "Page") {
        var mergeRowData = this.props.params ? {...this.props.params, ...item.params} : item.params;
        var params = ParameterHandler.replaceParams(this.appId,mergeRowData, this.state.currentRow);
        content.push(
          <Page
            key={item.page_id}
            config={this.props.config}
            proc={this.props.proc}
            isTab={this.isTab}
            parentPage={this.parentPage}
            app={this.props.appId}
            notif={this.notif}
            currentRow={this.state.currentRow}
            pageId={item.page_id}
            core={this.core}
            {...params}
          />
        );
      } else if (item.type == "Document" || item.type == "HTMLViewer") {
        var fileData = this.state.fileData? this.state.fileData : this.state.currentRow;
        var fileId = item.fileId ? item.fileId : item.uuid;
        content.push(
          <HTMLViewer
            key={i}
            core={this.core}
            key={i}
            appId={this.appId}
            url={
              item.url
                ? ParameterHandler.replaceParams(this.appId,item.url, this.state.currentRow)
                : undefined
            }
            fileId={fileId}
            content={item.content ? item.content : ""}
            fileData={fileData}
            notif={this.notif}
            className={item.className}
          />
        );
      }else if (item.type == "EntityViewer") {
        var fileId = this.props.fileId?this.props.fileId:this.state.currentRow.uuid;
        content.push(
          <EntityViewer
            key={i}
            core={this.core}
            key={i}
            appId={this.appId}
            proc={this.props.proc}
            fileId={fileId}
            notif={this.notif}
            fileData={this.state.currentRow}
            className={item.className}
          />
        );
      } else {
        if (this.extGUICompoents && this.extGUICompoents[item.type]) {
          this.externalComponent = this.extGUICompoents[item.type];
          item.params = ParameterHandler.replaceParams(this.appId,item.params, this.state.currentRow);
          let guiComponent = this.extGUICompoents && this.extGUICompoents[item.type] ? (
            <this.externalComponent
              {...item}
              key={i}
              components={OxzionGUIComponents}
              appId={this.appId}
              notif={this.notif}
              core={this.core}
              refresh={this.postSubmitCallback}
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
          {pageRender}
        </div>
      );
    } else {
      return <div id={this.contentDivID}></div>;
    }
  }
}

export default PageContent;
