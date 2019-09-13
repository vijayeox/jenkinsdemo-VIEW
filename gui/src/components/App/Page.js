import React from "react";
import FormRender from "./FormRender";
import Document from "./Document.js";
import OX_Grid from "../../OX_Grid";
import DocumentViewer from "../../DocumentViewer";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./Styles/PageComponentStyles.scss";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.app;
    this.state = {
      pageContent: [],
      pageId: this.props.pageId,
      submission: this.props.submission
    };
    this.contentDiv = "root_" + this.appId + "_" + this.state.pageId;
    this.loadPage(this.props.pageId);
    this.itemClick = this.itemClick.bind(this);
    this.getFormContents = this.getFormContents.bind(this);
  }

  loadPage(pageId) {
    this.getPageContent(pageId).then(response => {
      if (response.status == "success") {
        this.setState({
          pageContent: this.renderContent(response.data.content)
        });
      } else {
        this.setState({ pageContent: this.renderContent([]) });
      }
    });
  }

  buttonAction = (action, key) => {
    action[key].page_id
      ? this.itemClick(undefined, action[key])
      : this.setState({
          pageContent: this.renderContent(action[key].content)
        });
  };

  itemClick = (dataItem, itemContent) => {
    this.props.updatePage(itemContent);
  };

  renderEmpty() {
    return [<div key={1} />];
  }

  renderButtons = (e, action) => {
    var actionButtons = [];
    Object.keys(action).map(function(key, index) {
      actionButtons.push(
        <abbr title={action[key].name} key={index}>
          <button
            type="button"
            className=" btn manage-btn k-grid-edit-command"
            onClick={() => this.buttonAction(action, key)}
          >
            {action[key].icon ? (
              <i className={action[key].icon + " manageIcons"}></i>
            ) : (
              action[key].name
            )}
          </button>
        </abbr>
      );
    }, this);
    return actionButtons;
  };

  prepareDataRoute = data => {
    if (typeof data == "string") {
      var result = data.replace("{{app_id}}", this.appId);
      return result;
    } else {
      return data;
    }
  };

  async getFormContents(form_data) {
    if (form_data.content) {
      return form_data.content;
    } else {
      let helper = this.core.make("oxzion/restClient");
      let formData = await helper.request(
        "v1",
        "/app/" + this.appId + "/form/" + form_data.form_id,
        {},
        "get"
      );
      return formData;
    }
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

  componentDidUpdate(prevProps) {
    if (this.props.pageId !== prevProps.pageId) {
      this.setState({ pageContent: [] });
      this.setState({ pageId: this.props.pageId });
      this.loadPage(this.props.pageId);
    }
  }

  renderContent(data) {
    var content = [];
    for (var i = 0; i < data.length; i++) {
      switch (data[i].type) {
        case "Form":
          content.push(
            <FormRender
              key={i}
              core={this.core}
              appId={this.appId}
              content={data[i].content}
              formId={data[i].form_id}
              config={this.menu}
            />
          );
          break;
        case "List":
          var itemContent = data[i].content;
          var columnConfig = itemContent.columnConfig;
          itemContent.actions
            ? columnConfig.push({
                title: "Actions",
                cell: e => this.renderButtons(e, itemContent.actions),
                filterCell: e => this.renderEmpty()
              })
            : null;
          var dataString = this.prepareDataRoute(itemContent.data);
          content.push(
            <OX_Grid
              key={i}
              osjsCore={this.core}
              data={dataString}
              // onRowClick={dataItem => {
              //   itemContent.actions
              //     ? this.itemClick(dataItem, itemContent.actions.view)
              //     : null;
              // }}
              filterable={itemContent.filterable}
              reorderable={itemContent.reorderable}
              resizable={itemContent.resizable}
              pageable={itemContent.pageable}
              sortable={itemContent.sortable}
              columnConfig={columnConfig}
            />
          );
          break;
        case "DocumentViewer":
          var itemContent = data[i].content;
          content.push(
            <DocumentViewer
              key={i}
              osjsCore={this.core}
              // url={itemContent.url}
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
    if (this.state.pageContent && this.state.pageContent.length > 0) {
      return (
        <div id={this.contentDiv} className="AppBuilderPage">
          {this.state.pageContent}
        </div>
      );
    }
    return (
      <div className="loaderAnimation">
        <Loader type="Circles" color="#00BFFF" height={100} width={100} />
      </div>
    );
  }
}

export default Page;
