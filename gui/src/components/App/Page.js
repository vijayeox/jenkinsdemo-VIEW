import React from "react";
import FormRender from "./FormRender";
import Document from "./Document";
import OX_Grid from "../../OX_Grid";
import SearchPage from "./SearchPage";
import { Button, DropDownButton } from "@progress/kendo-react-buttons";
import DocumentViewer from "../../DocumentViewer";
import Dashboard from "../../Dashboard";
import Loader from "react-loader-spinner";
import moment from "moment";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./Styles/PageComponentStyles.scss";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.app;
    this.proc = this.props.proc;
    this.loader = this.core.make("oxzion/splash");

    this.contentDivID = "root_" + this.appId + "_" + this.props.pageId;
    let pageContent = [];
    this.state = {
      pageContent: pageContent,
      pageId: this.props.pageId,
      submission: this.props.submission,
      showLoader: false,
      fileId: null,
      currentRow: []
    };
    this.loadPage(this.props.pageId);
    this.updatePageView = this.updatePageView.bind(this);
  }

  componentDidMount() {
    document
      .getElementsByClassName(this.appId + "_breadcrumbParent")[0]
      .addEventListener("updatePageView", this.updatePageView, false);

  }

  componentDidUpdate(prevProps) {
    if (this.props.pageId !== prevProps.pageId) {
      var PageRenderDiv = document.querySelector(".PageRender")
      this.loader.show(PageRenderDiv)
      this.setState({ pageContent: [], pageId: this.props.pageId });
      this.loadPage(this.props.pageId);
    }
  }

  updatePageView(e) {
    this.setState({
      pageContent: e.detail
    });
  }

  loadPage(pageId) {
    this.getPageContent(pageId).then(response => {
      if (response.status == "success") {
        this.setState({
          pageContent: response.data.content
        });
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
      this.loader.destroy()
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
              onClick={() => this.buttonAction(action[key], e)}
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
    var url = config[0].content.route
    var dataString = this.prepareDataRoute(url, e);

    return <OX_Grid
      appId={this.appId}
      osjsCore={this.core}
      data={dataString}
      gridToolbar={config[0].content.toolbarTemplate}
      columnConfig={config[0].content.columnConfig}
    />
  }


  async buttonAction(action, rowData) {
    if (action.page_id) {
      this.loadPage(action.page_id);
    } else if (action.details) {
      this.setState({
        pageContent: []
      });
      var that = this;
      setTimeout(function () {
        action.details.every(async (item, index) => {
          if (item.type == "Update") {
            that.setState({
              showLoader: true
            });
            const response = await that.updateActionHandler(item, rowData);
            if (response.status == "success") {
              console.log(response);
            } else {
              that.setState({
                pageContent: action.details.slice(0, index)
              });
              return false;
            }
          } else if (item.type == "View") {
            that.setState({
              currentRow: rowData
            });
            if (item.params.uuid) {
              var fileId = that.replaceParams(item.params.uuid, rowData);
              that.setState({
                fileId: fileId
              });
              that.loadPage(item.params.page_id);
            }
          } else {
            let pageContent = that.state.pageContent;
            pageContent.push(item);
            that.setState({
              pageContent: pageContent,
              currentRow: rowData
            });
          }
        });
      }, 500);
      let ev = new CustomEvent("updateBreadcrumb", {
        detail: action,
        bubbles: true
      });
      document
        .getElementsByClassName(this.appId + "_breadcrumbParent")[0]
        .dispatchEvent(ev);
    }
    this.setState({
      showLoader: false
    });
  }

  updateActionHandler(details, rowData) {
    var that = this;
    return new Promise(resolve => {
      var queryRoute = that.replaceParams(details.params.url, rowData);
      that.updateCall(queryRoute, rowData).then(response => {
        that.setState({
          showLoader: false
        });
        resolve(response);
      });
    });
  }

  replaceParams(route, params) {
    if (!params) {
      return route;
    }
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
        route = route.replace(match, params[match.replace(/\{\{|\}\}/g, "")]);
      });
    }
    return route;
  }

  prepareDataRoute(route, params) {
    if (typeof route == "string") {
      if (!params) {
        params = {};
      }
      params['current_date'] = moment().format("YYYY-MM-DD");
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

  renderContent(data) {
    var content = [];
    for (var i = 0; i < data.length; i++) {
      switch (data[i].type) {
        case "Form":
          var dataString = this.prepareDataRoute(
            data[i].url,
            this.state.currentRow
          );
          // This workflow instance id corresponds to completed workflow instance
          var workflowInstanceId = this.replaceParams(
            data[i].workflowInstanceId,
            this.state.currentRow
          );
          content.push(
            <FormRender
              key={i}
              url={dataString}
              core={this.core}
              appId={this.appId}
              content={data[i].content}
              formId={data[i].form_id}
              config={this.menu}
              pipeline={data[i].pipeline}
              parentWorkflowInstanceId={workflowInstanceId}
              postSubmitCallback={this.stepBackBreadcrumb}
            />
          );
          break;
        case "List":
          var itemContent = data[i].content;
          var columnConfig = itemContent.columnConfig;
          if (itemContent.actions) {
            if (columnConfig[columnConfig.length - 1].title == "Actions") {
              null;
            } else {
              columnConfig.push({
                title: "Actions",
                cell: e => this.renderButtons(e, itemContent.actions),
                filterCell: {
                  type: "empty"
                }
              });
            }
          }
          var dataString = this.prepareDataRoute(itemContent.route, this.state.currentRow);
          console.log(this.state.currentRow)
          content.push(
            <OX_Grid
              rowTemplate={itemContent.expandable ? e => this.renderRow(e, itemContent.rowConfig) : null}
              appId={this.appId}
              key={i}
              osjsCore={this.core}
              data={dataString}
              gridDefaultFilters={
                itemContent.defaultFilter
                  ? this.replaceParams(itemContent.defaultFilter)
                  : null
              }
              gridOperations={itemContent.operations}
              gridToolbar={itemContent.toolbarTemplate}
              filterable={itemContent.filterable}
              reorderable={itemContent.reorderable}
              resizable={itemContent.resizable}
              pageable={itemContent.pageable}
              sortable={itemContent.sortable}
              columnConfig={columnConfig}
              expandable={itemContent.expandable}
            />
          );
          break;
        case "Search":
          var itemContent = JSON.parse(data[i].content);
          var columnConfig = itemContent.columnConfig;
          if (itemContent.actions) {
            if (columnConfig[columnConfig.length - 1].title == "Actions") {
              null;
            } else {
              columnConfig.push({
                title: "Actions",
                cell: e => this.renderButtons(e, itemContent.actions),
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
              content={itemContent}
              filterColumns={itemContent.filterColumns}
              appId={this.appId}
              entityId={itemContent.entityId}
              columnConfig={columnConfig}
            />
          );
          break;
        case "DocumentViewer":
          var itemContent = data[i].content;
          var url = "";
          let fileId = "";
          if (this.state.fileId) {
            fileId = this.state.fileId;
            url = "app/" + this.appId + "/file/" + fileId + "/document";
          } else {
            break;
          }
          content.push(
            <DocumentViewer
              appId={this.appId}
              key={i}
              core={this.core}
              url={url}
            />
          );
          break;
        case "Dashboard":
          content.push(
            <Dashboard
              appId={this.appId}
              key={i}
              core={this.core}
              content={data[i].content}
              proc={this.proc}
            />
          );
          break;
        default:
          content.push(
            <Document
              key={i}
              core={this.core}
              key={i}
              appId={this.appId}
              content={data[i].content}
              config={this.menu}
              fileId={this.state.fileId}
            />
          );
          break;
      }
    }
    if (content.length > 0) {
      return content;
    } else {
      content.push(<h2>No Content Available</h2>);
    }
    return content;
  }

  render() {
    if (
      this.state.pageContent &&
      this.state.pageContent.length > 0 &&
      !this.state.showLoader
    ) {
      this.loader.destroy()
      var pageRender = this.renderContent(this.state.pageContent);
      return (
        <div id={this.contentDivID} className="AppBuilderPage">
          {pageRender}
        </div>
      );
    }
    this.loader.show()
    return <></>
  }


}

export default Page;
