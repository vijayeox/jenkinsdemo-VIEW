import React, { Component } from "react";
import { FolderOutlined, FolderFilled } from "@ant-design/icons";
import { Row, Col } from "antd";
import "antd/dist/antd.css";
import './public/css/DocumentListDetails.css';

  class DocumentListDetails extends React.Component {
    constructor(props) {
      super(props);
      this.core = this.props.core;
      this.state = {
        folderData : this.props.folderData
      };
    }
    componentDidUpdate(previousProps, prevState) {
      if (previousProps.folderData !== this.props.folderData) {
        this.setState({ folderData: this.props.folderData });
        console.log('Folder Data has changed.')
      }
    }
  render(){
    return (
      <div>
        <Row>
          {this.state.folderData ? (
            this.state.folderData.map((document, index) => (
              <div className="each-folder">
                <Col span={8}>
                  <FolderFilled style={{ fontSize: "5rem", color: "#40a9ff" }} />
                </Col>
                <div key={index}>{document.title}</div>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </Row>
      </div>
    );
  }
};

export default DocumentListDetails;
