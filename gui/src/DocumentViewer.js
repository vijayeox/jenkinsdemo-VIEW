import React, { Component } from "react";
import osjs from "osjs";
let helper = osjs.make("oxzion/restClient");
import "./public/css/documentViewer.scss";

export default class DocumentViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
      scale: 1.0,
      selectedDocument: "",
      documentsList: [
        {
          name: "sample doc 1",
          url: "https://www.jianjunchen.com/papers/CORS-USESEC18.slides.pdf",
          type: "pdf"
        },
        {
          name: "sample doc 2",
          url:
            "https://buildmedia.readthedocs.org/media/pdf/flask-cors/latest/flask-cors.pdf",
          type: "pdf"
        },
        {
          name: "sample image 1",
          url: "https://mdn.mozillademos.org/files/14295/CORS_principle.png",
          type: "image"
        },
        {
          name: "sample image 2",
          url:
            "https://image.shutterstock.com/image-photo/sample-wood-chipboard-wooden-laminate-600w-1343662607.jpg",
          type: "image"
        },
        {
          name: "sample image 3",
          url:
            "https://image.shutterstock.com/image-photo/sample-colorful-wood-laminate-veneer-260nw-1344802439.jpg",
          type: "image"
        },
        {
          name: "sample image 1",
          url: "https://mdn.mozillademos.org/files/14295/CORS_principle.png",
          type: "image"
        },
        ,
        {
          name: "sample doc 2",
          url:
            "https://buildmedia.readthedocs.org/media/pdf/flask-cors/latest/flask-cors.pdf",
          type: "pdf"
        },
        {
          name: "sample image 1",
          url: "https://mdn.mozillademos.org/files/14295/CORS_principle.png",
          type: "image"
        },
        {
          name: "sample image 2",
          url:
            "https://image.shutterstock.com/image-photo/sample-wood-chipboard-wooden-laminate-600w-1343662607.jpg",
          type: "image"
        },
        {
          name: "sample image 3",
          url:
            "https://image.shutterstock.com/image-photo/sample-colorful-wood-laminate-veneer-260nw-1344802439.jpg",
          type: "image"
        }
      ]
    };
    this.getDocumentsList = this.getDocumentsList.bind(this);
  }

  async getDocumentsListService(url) {
    let response = await helper.request("v1", "/" + url, {}, "get");
    return response;
  }

  getDocumentsList = () => {
    // if (this.props.url) {
    //   this.getDocumentsListService(this.props.url).then(response => {
    //     this.setState(
    //       {
    //         documentsList: response.data
    //       },
    //       () => {
    //         if (this.state.documentsList.length > 0) {
    //           this.setState({
    //             selectedDocument: this.state.documentsList[0]
    //           });
    //         }
    //       }
    //     );
    //   });
    // }
    if (this.state.documentsList.length > 0) {
      this.setState({
        selectedDocument: this.state.documentsList[0]
      });
    }
  };

  componentDidMount() {
    this.getDocumentsList();
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.getDocumentsList();
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  handleDocumentClick = doc => {
    this.setState({
      selectedDocument: doc
    });
  };

  handleDocumentScale = value => {
    var scale = this.state.scale;
    scale += value;
    if (scale >= 0.5) {
      this.setState({
        scale: scale
      });
    }
  };

  displayDocumentData = documentData => {
    var url = documentData.url;
    if (documentData.type == "pdf") {
      url =
        "http://localhost:8081/ViewerJS/#" +
        documentData.url;
    }
    return <iframe src={url} className="iframeDoc" key={url}></iframe>;
  };

  render() {
    const { documentsList } = this.state;
    if (documentsList.length > 0) {
      if (documentsList.length > 1) {
        return (
          <div className="row">
            <div className="col-md-2 docListDiv">
              {documentsList.map((doc, index) => {
                return (
                  <div className="card docList" key={index}>
                    <div
                      className={
                        this.state.selectedDocument == doc
                          ? "card-body docListBody borderActive"
                          : "card-body docListBody border"
                      }
                      onClick={e => {
                        this.handleDocumentClick(doc);
                      }}
                    >
                      <i
                        className={
                          "docIcon " +
                          (doc.type == "pdf"
                            ? "fas fa-file-pdf"
                            : doc.type == "image"
                            ? "far fa-file-image"
                            : "far fa-file")
                        }
                      ></i>
                      <br></br>
                      {doc.name}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-md-10 border">
              {this.displayDocumentData(this.state.selectedDocument)}
            </div>
          </div>
        );
      } else if (documentsList.length == 1) {
        return (
          <div className="row">
            <div className="col-md-12 border">
              {this.displayDocumentData(this.state.selectedDocument)}
            </div>
          </div>
        );
      } else {
        return "";
      }
    }
  }
}
