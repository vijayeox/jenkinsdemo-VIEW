import React, { Component } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Card, Button } from "react-bootstrap";
import "./public/css/documentViewer.scss";

export default class DocumentViewer extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.state = {
      selectedDocument: undefined,
      documentsList: undefined
    };
    this.loader = this.core.make("oxzion/splash");
    this.helper = this.core.make("oxzion/restClient");
    this.baseUrl = this.core.config("wrapper.url");
    this.documentTypes = this.props.params.documentTypes;
    this.getDocumentsList = this.getDocumentsList.bind(this);
    this.getDocumentsList();
  }

  async getDocumentsListService(url) {
    let response = await this.helper.request("v1", "/" + url, {}, "get");
    return response;
  }

  getDocumentsList = () => {
    if (this.props.url) {
      this.loader.show();
      this.getDocumentsListService(this.props.url).then(response => {
        if (response.data) {
          var documentsList = {};
          this.documentTypes.map((docType, index) => {
            if (
              response.data[docType.field] &&
              response.data[docType.field].length > 0
            ) {
              documentsList[docType.field] = response.data[docType.field];
            }
          });
          if (Object.keys(documentsList).length > 0) {
            this.setState({
              documentsList: documentsList,
              selectedDocument: documentsList[this.documentTypes[0].field][0]
            });
          }
          this.loader.destroy();
        }
      });
    }
  };

  componentDidMount() {
    if (this.state.selectedDocument) {
      var documentViewerDiv = document.querySelector(".docViewerWindow");
      this.loader.show(documentViewerDiv);
    }
  }

  generateDocumentList() {
    var accordionHTML = [];
    if (this.documentTypes) {
      this.documentTypes.map((docType, index) => {
        this.state.documentsList[docType.field]
          ? accordionHTML.push(
              <Card key={index}>
                <Card.Header>
                  <Accordion.Toggle as={Button} eventKey={docType.field}>
                    {docType.title}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={docType.field}>
                  <Card.Body>
                    {this.state.documentsList[docType.field].map((doc, i) => {
                      return (
                        <Card
                          className="docItems"
                          onClick={e => {
                            doc.file != this.state.selectedDocument.file
                              ? this.handleDocumentClick(doc)
                              : null;
                          }}
                          key={i}
                        >
                          <div
                            className={
                              doc.file == this.state.selectedDocument.file
                                ? "docListBody borderActive"
                                : "docListBody border"
                            }
                          >
                            <i
                              className={"docIcon " + this.getDocIcon(doc.type)}
                            ></i>
                            <p>
                              {doc.originalName.length > 20
                                ? this.chopFileName(doc.originalName)
                                : doc.originalName}
                            </p>
                          </div>
                        </Card>
                      );
                    })}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            )
          : null;
      });
    }
    return accordionHTML;
  }

  getDocIcon(type) {
    var type = type.split("/")[1].toLowerCase();
    if (type == "png" || type == "jpg" || type == "jpeg") {
      return "fa fa-picture-o";
    } else if (type == "pdf") {
      return "fa fa-file-pdf-o";
    } else if (type == "mp4" || type == "avi") {
      return "fa fa-file-video-o";
    } else if (
      type == "odt" ||
      type == "odp" ||
      type == "ods" ||
      type == "doc" ||
      type == "docx"
    ) {
      return "fa fa-file-word-o";
    } else {
      return "fa fa-file-o";
    }
  }

  chopFileName = title => {
    let type = "...." + title.split(".")[1];
    var displayTitle = title.substring(0, 20) + type;
    return displayTitle;
  };

  handleDocumentClick = doc => {
    var documentViewerDiv = document.querySelector(".docViewerWindow");
    this.loader.show(documentViewerDiv);
    this.setState({
      selectedDocument: doc
    });
  };

  displayDocumentData = documentData => {
    var url;
    var type = documentData.type.split("/")[1].toLowerCase();
    if (type == "png" || type == "jpg" || type == "jpeg") {
      url = this.baseUrl + this.appId + "/" + documentData.file;
      return (
        <React.Fragment>
          <img
            onLoad={() => this.loader.destroy()}
            className="img-fluid"
            style={{ height: "100%" }}
            src={url}
          />
          <a href={url} download className="image-download-button">
            <i class="fa fa-download" aria-hidden="true"></i>
            Download
          </a>
        </React.Fragment>
      );
    } else if (type == "mp4" || type == "avi") {
      url = this.baseUrl + this.appId + "/" + documentData.file;
      return (
        <video
          autoplay
          muted
          preload
          controls
          width="100%"
          onCanPlay={this.loader.destroy()}
        >
          <source src={url} type={"video/" + type} />
          Sorry, your browser doesn't support embedded videos.
        </video>
      );
    } else if (
      type == "pdf" ||
      type == "odt" ||
      type == "odp" ||
      type == "ods"
    ) {
      url =
        this.core.config("ui.url") +
        "/ViewerJS/#" +
        this.baseUrl +
        this.appId +
        "/" +
        documentData.file;
      return (
        <iframe
          onLoad={() => {
            setTimeout(() => {
              this.loader.destroy();
            }, 800);
          }}
          key={Math.random() * 20}
          src={url}
          className="iframeDoc"
        ></iframe>
      );
    } else {
      url = this.baseUrl + this.appId + "/" + documentData.file;
      window.open(url, "_self");
      var url2 =
        this.core.config("ui.url") + "/ViewerJS/images/unsupported_file.png";
      this.loader.destroy();
      return (
        <img className="img-fluid" style={{ height: "100%" }} src={url2} />
      );
    }
  };

  render() {
    const { documentsList } = this.state;
    if (documentsList) {
      return (
        <div className="docViewerComponent">
          <div className="col-md-3 docListDiv">
            <Accordion defaultActiveKey={this.documentTypes[0].field}>
              {this.generateDocumentList()}
            </Accordion>
          </div>
          <div className="col-md-9 border docViewerWindow">
            {this.state.selectedDocument ? (
              this.displayDocumentData(this.state.selectedDocument)
            ) : (
              <p>No files to display.</p>
            )}
          </div>
        </div>
      );
    } else {
      return <p>No files to display.</p>;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.getDocumentsList();
    }
  }
}
