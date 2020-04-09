import React, { Component } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import { Card, Button } from "react-bootstrap";
import "./public/css/documentViewer.scss";

export default class DocumentViewer extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.state = {
      selectedDocument: undefined,
      documentsList: undefined,
      documentTypes: [],
      activeCard: ""
    };
    this.loader = this.core.make("oxzion/splash");
    this.helper = this.core.make("oxzion/restClient");
    this.baseUrl = this.core.config("wrapper.url");
    this.getDocumentsList = this.getDocumentsList.bind(this);
    this.getDocumentsList();
  }

  async getDocumentsListService(url) {
    let response = await this.helper.request(
      "v1",
      "/app/" + this.appId + "/" + url,
      {},
      "get"
    );

    return response;
  }

  getDocumentsList = () => {
    if (this.props.url) {
      this.loader.show();
      this.getDocumentsListService(this.props.url).then(response => {
        if (response.data) {
          var documentsList = {};
          var documentTypes = Object.keys(response.data);
          this.setState({ documentTypes: documentTypes });
          documentTypes.map((docType, index) => {
            if (response.data[docType] && response.data[docType].length > 0) {
              documentsList[docType] = response.data[docType];
            }
          });
          if (Object.keys(documentsList).length > 0) {
            if (
              documentsList[documentTypes[0]] &&
              documentsList[documentTypes[0]][0]
            ) {
              this.setState({
                documentsList: documentsList,
                selectedDocument: documentsList[documentTypes[0]][0],
                activeCard: documentTypes[0]
              });
            } else {
              for (var i = 0; i < documentTypes.length; i++) {
                if (
                  documentsList[documentTypes[i]] &&
                  documentsList[documentTypes[i]][0]
                ) {
                  this.setState({
                    documentsList: documentsList,
                    selectedDocument: documentsList[documentTypes[i]][0],
                    activeCard: documentTypes[i]
                  });
                  break;
                }
              }
            }
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
    if (this.state.documentTypes) {
      this.state.documentTypes.map((docType, index) => {
        this.state.documentsList[docType]
          ? accordionHTML.push(
              <Card key={index}>
                <Card.Header>
                  <CustomToggle
                    eventKey={docType}
                    currentSelected={this.state.activeCard}
                    update={(item) => {
                      this.setState({
                        activeCard: item,
                        selectedDocument: this.state.documentsList[item][0]
                      });
                    }}
                  >
                    {docType}
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey={docType}>
                  <Card.Body>
                    {this.state.documentsList[docType].map((doc, i) => {
                      return (
                        <Card
                          className="docItems"
                          onClick={(e) => {
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
                              {doc.originalName.length > 30
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
    var displayTitle = title.substring(0, 26) + type;
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
            <Accordion defaultActiveKey={this.state.documentTypes[0]}>
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

function CustomToggle(props) {
  return (
    <Button
      variant="primary"
      onClick={
        props.currentSelected !== props.eventKey
          ? useAccordionToggle(props.eventKey, () =>
              props.update.call(undefined, props.eventKey)
            )
          : null
      }
    >
      <i
        className={
          props.currentSelected == props.eventKey
            ? "docIcon fa fa-caret-right rotate90"
            : "docIcon fa fa-caret-right"
        }
      ></i>
      {props.children}
    </Button>
  );
}
