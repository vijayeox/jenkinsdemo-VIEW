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
import DocumentViewer from "../../DocumentViewer";
import DashboardManager from "../../DashboardManager";
import merge from "deepmerge";
import "./Styles/PageComponentStyles.scss";
import * as OxzionGUIComponents from "../../../index.js";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.app;
    this.proc = this.props.proc;
    this.loader = this.core.make("oxzion/splash");
    this.fetchExternalComponents().then((response) => {
      this.extGUICompoents = response.guiComponent
        ? response.guiComponent
        : undefined;
    });

    this.contentDivID = "root_" + this.appId + "_" + this.props.pageId;
    let pageContent = [];
    this.state = {
      pageContent: pageContent,
      pageId: this.props.pageId,
      submission: this.props.submission,
      showLoader: false,
      fileId: null,
      currentRow: {},
      title: '',
      displaySection: 'DB',
      sectionData: null,
    };
    this.props.pageId ? this.loadPage(this.props.pageId) : null;
    this.updatePageView = this.updatePageView.bind(this);
  }

  componentDidMount() {
    document
      .getElementsByClassName(this.appId + "_breadcrumbParent")[0]
      .addEventListener("updatePageView", this.updatePageView, false);
    var PageRenderDiv = document.querySelector(".PageRender");
    this.loader.show(PageRenderDiv);
  }

  async fetchExternalComponents() {
    return await import("../../externals/" + this.appId + "/index.js");
  }

  componentDidUpdate(prevProps) {
    if (this.props.pageId !== prevProps.pageId) {
      var PageRenderDiv = document.querySelector(".PageRender");
      this.loader.show(PageRenderDiv);
      this.setState({ pageContent: [], pageId: this.props.pageId });
      this.loadPage(this.props.pageId);
    }
  }

  updatePageView(e) {
    var breadCrumbUpdate = false;
    if (e.detail.details && e.detail.name) {
      breadCrumbUpdate = true;
      let ev = new CustomEvent("updateBreadcrumb", {
        detail: e.detail,
        bubbles: true
      });
      document
        .getElementsByClassName(this.appId + "_breadcrumbParent")[0]
        .dispatchEvent(ev);
    }
    this.setState({
      pageContent: breadCrumbUpdate ? e.detail.details : e.detail
    });
  }

  loadPage(pageId, icon, hideLoader) {
    this.getPageContent(pageId).then((response) => {
      if (response.status == "success") {
        this.setState(
          {
            pageContent: response.data.content
          },
          hideLoader ? this.setState({ showLoader: false }) : null
        );
        let responseContent = response.data;
        icon ? (responseContent.icon = icon) : null;
        let ev = new CustomEvent("updateBreadcrumb", {
          detail: response.data,
          bubbles: true
        });
        document
          .getElementsByClassName(this.appId + "_breadcrumbParent")[0]
          .dispatchEvent(ev);
      } else {
        this.setState({ pageContent: [] });
      }
      this.loader.destroy();
    });
  }

  renderButtons(e, action) {
    var actionButtons = [];
    Object.keys(action).map(function (key, index) {
      var string = this.replaceParams(action[key].rule, e);
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
      showButton
        ? actionButtons.push(
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
                  })
                  : this.buttonAction(action[key], e);
              }}
              style={buttonStyles}
            >
              {action[key].icon ? (
                <i className={action[key].icon + " manageIcons"}></i>
              ) : (
                  action[key].name
                )}
            </Button>
          </abbr>
        )
        : null;
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

  async buttonAction(action, rowData) {
    if (action.page_id) {
      this.loadPage(action.page_id);
    } else if (action.details) {
      var pageDetails = this.state.pageContent;
      this.setState({
        pageContent: [],
        showLoader: true
      });
      var that = this;
      var copyPageContent = [];
      var fileId;
      var checkForTypeUpdate = false;
      var updateBreadcrumb = true;
      action.details.every(async (item, index) => {
        var copyItem = JSON.parse(JSON.stringify(item));
        if (item.type == "Update") {
          checkForTypeUpdate = true;
          const response = await that.updateActionHandler(item, rowData);
          if (response.status == "success") {
            this.setState({
              showLoader: false
            });
          } else {
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
          if (item.params) {
            if (item.params.page_id) {
              updateBreadcrumb = false;
              checkForTypeUpdate = true;
              this.loadPage(item.params.page_id, action.icon, true);
            }
          }
          if (item.url) {
            copyItem.url = that.replaceParams(item.url, rowData);
          }
          if (item.urlPostParams) {
            copyItem.urlPostParams = that.replaceParams(
              item.urlPostParams,
              rowData
            );
          }
          copyPageContent.push(copyItem);
        }
      });
      if (updateBreadcrumb) {
        let ev = new CustomEvent("updateBreadcrumb", {
          detail: action,
          bubbles: true
        });
        document
          .getElementsByClassName(this.appId + "_breadcrumbParent")[0]
          .dispatchEvent(ev);
      }
    }
    this.setState((prevState) => ({
      fileId: fileId,
      showLoader: checkForTypeUpdate ? true : false,
      currentRow: merge(prevState.currentRow, rowData),
      pageContent: copyPageContent
    }));
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
              final_route[item] = null;
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
      while ((m = regex.exec(route)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          // console.log(`Found match, group ${groupIndex}: ${match}`);
          route = route.replace(
            match,
            finalParams[match.replace(/\{\{|\}\}/g, "")]
          );
        });
      }
      return route;
    }
  }

  prepareDataRoute(route, params) {
    if (typeof route == "string") {
      if (!params) {
        params = {};
      }
      var result = this.replaceParams(route, params);
      result = "app/" + this.appId + "/" + result;
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

  stepBackBreadcrumb = () => {
    let ev = new CustomEvent("stepDownPage", {
      detail: {},
      bubbles: true
    });
    document
      .getElementsByClassName(this.appId + "_breadcrumbParent")[0]
      .dispatchEvent(ev);
  };

  setTitle = (title) => {
    this.setState({ title: title });
  }

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
        var fileId = this.replaceParams(item.fileId, this.state.currentRow);
        content.push(
          <FormRender
            key={i}
            url={dataString}
            urlPostParams={item.urlPostParams}
            core={this.core}
            appId={this.appId}
            content={item.content}
            fileId={fileId}
            formId={item.form_id}
            page={item.page}
            pipeline={item.pipeline}
            parentWorkflowInstanceId={workflowInstanceId}
            postSubmitCallback={this.stepBackBreadcrumb}
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
            osjsCore={this.core}
            data={dataString}
            parentData={this.state.currentRow}
            urlPostParams={item.urlPostParams}
            gridDefaultFilters={
              itemContent.defaultFilters
                ? JSON.parse(this.replaceParams(itemContent.defaultFilters))
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
        content.push(
          <DocumentViewer
            appId={this.appId}
            key={i}
            core={this.core}
            url={item.url}
          />
        );
      } else if (item.type == "RenderButtons") {
        content.push(
          <RenderButtons
            appId={this.appId}
            key={i}
            core={this.core}
            {...item}
          />
        );
      } else if (item.type == "Comment") {
        content.push(
          <CommentsView
            appId={this.appId}
            key={i}
            core={this.core}
            postSubmitCallback={this.stepBackBreadcrumb}
            url={item.url}
          />
        );
      } else if (item.type == "Dashboard") {
        content.push(
          <DashboardManager
            args={this.core}
            proc={this.props.proc}
            setTitle={this.setTitle}
            editDashboard={this.editDashboard}
          />
        );
      } else if (item.type == "Document" || item.type == "HTMLViewer") {
        content.push(
          <HTMLViewer
            key={i}
            core={this.core}
            key={i}
            appId={this.appId}
            content={item.content}
            url={item.url}
            fileData={item.useRowData ? this.state.currentRow : undefined}
          />
        );
      } else {
        this.externalComponent = this.extGUICompoents[item.type];
        let guiComponent =
          this.extGUICompoents && this.extGUICompoents[item.type] ? (
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
        <div id={this.contentDivID} className="AppBuilderPage">
          {pageRender}
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Page;

