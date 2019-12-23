import React, { Component } from "react";
import osjs from "osjs";
let helper = osjs.make("oxzion/restClient");
import "./public/css/documentViewer.scss";

export default class DocumentViewer extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.state = {
      numPages: null,
      pageNumber: 1,
      scale: 1.0,
      selectedDocument: "",
      documentsList: []
    };
    this.getDocumentsList = this.getDocumentsList.bind(this);
    this.loader = this.core.make("oxzion/splash");
    this.baseUrl = this.core.config('wrapper.url');
  }

  async getDocumentsListService(url) {
    let response = await helper.request("v1", "/" + url, {}, "get");
    return response;
  }

  getDocumentsList = () => {
    if (this.props.url) {
      this.loader.show();
      this.getDocumentsListService(this.props.url).then(response => {
        this.loader.destroy();
        var documentsList = [];
        if(response.data.field_value){
          Object.keys(response.data.field_value).forEach(function(key,index) {
            documentsList.push(response.data.field_value[key]);
          });
        this.setState(
          {
            documentsList:
              documentsList && documentsList.length > 0 ? documentsList : []
          },
          () => {
            if (this.state.documentsList.length > 0) {
              this.setState({
                selectedDocument: this.state.documentsList[0]
              });
            }
          }
        );
        }
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.getDocumentsList();
    }
  }

  componentDidMount() {
    this.getDocumentsList();
  }

  handleDocumentClick = doc => {
    this.setState({
      selectedDocument: doc
    });
  };

  displayDocumentData = documentData => {
    var url;
    if (documentData.type == "pdf") {
      url = this.core.config('ui.url')+"/ViewerJS/#" + this.baseUrl+this.appId+'/'+documentData;
    } else if (documentData.type == "image") {
      url = documentData;
    } else {
      url = this.core.config('ui.url')+"/ViewerJS/#" + this.baseUrl+this.appId+'/'+documentData;
    }
    return <iframe src={url} className="iframeDoc" key={url}></iframe>;
  };

  render() {
    const { documentsList } = this.state;
    if (documentsList && documentsList.length > 0) {
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
                            ? "fa fa-file-pdf-o"
                            : doc.type == "image"
                            ? "fa fa-picture-o"
                            : "fa fa-file-pdf-o")
                        }
                      ></i>
                      <br></br>
                      {doc.substring(doc.lastIndexOf('/')+1)}
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
        return <p>No files to display.</p>;
      }
    } else return <p>No files to display.</p>;
  }
}
