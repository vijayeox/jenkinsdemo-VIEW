import React from "react";
import FormRender from "./FormRender";
import ReactDOM from "react-dom";
import Document from "./Document.js";
import OX_Grid from "../../OX_Grid";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

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
              core={this.core}
              appId={this.appId}
              content={data[i].content}
              formId={data[i].form_id}
              config={this.menu}
            />
          );
          break;
        case "List":
          var itemContent = JSON.parse(data[i].content);
          content.push(
            <OX_Grid
              osjsCore={this.core}
              data={itemContent.data}
              filterable={itemContent.filterable}
              reorderable={itemContent.reorderable}
              resizable={itemContent.resizable}
              pageable={itemContent.pageable}
              sortable={itemContent.sortable}
              columnConfig={itemContent.columnConfig}
            />
          );
          break;
        default:
          content.push(
            <Document
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
      return <div id={this.contentDiv}>{this.state.pageContent}</div>;
    }
    return <Loader type="Circles" color="#00BFFF" height={100} width={100} />;
  }
}

export default Page;
