import React, { Component } from "react";
import { Tree, Row, Col, PageHeader } from "antd";
import './public/css/DocumentList.css';
import "antd/dist/antd.css";
import DocumentListDetails from './DocumentListDetails';

const { DirectoryTree } = Tree;

class DocumentList extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.state = {
      treeData: this.props.treeData,
      folderData: this.props.folderData
    };
  }
  componentDidUpdate(previousProps, prevState) {
    if (previousProps.treeData !== this.props.treeData) {
      this.setState({ treeData: this.props.treeData });
    }
    if (previousProps.folderData !== this.props.folderData) {
      this.setState({ folderData: this.props.folderData });
    }
  }

  render() {
  return (
    <div className="document-container">
      <PageHeader className="site-page-header" title="Document manager" />
      <Row className="document-row"> 
        <Col span={4} className="document-left-panel">
          <DirectoryTree 
            multiple
            onSelect={this.props.onSelect}
            onExpand={this.props.onExpand}
            loadData={this.props.loadData}
            treeData={this.state.treeData}
            folderData={this.state.folderData}
          />
        </Col>
        <Col span={20}>
            <DocumentListDetails folderData={this.state.folderData} core={this.core} />
        </Col>
      </Row>
    </div>
  );
}
}

export default DocumentList;
