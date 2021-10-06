import React from "react";
import "../../public/css/InvoiceViewer.scss";



class InvoiceViewer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get();
    this.appId = this.props.appId;
    this.helper = this.core.make("oxzion/restClient");
    this.baseUrl = this.core.config("wrapper.url");
    this.loader = this.core.make('oxzion/splash');
    this.state = {
      invoiceData: this.props.invoiceData,
      showPDF:false
    };
  }

    
    displayInvoiceData(invoiceData)
    {

        var invoiceId = invoiceData['entity_id'] != null?invoiceData['invoiceUuid']:invoiceData['uuid'];
        var pdfPath = invoiceData['invoicePDFPath'] == null? invoiceData['account_id']+"/invoice/"+invoiceData['app_id']+"/"+invoiceId+".pdf":invoiceData['invoicePDFPath'];

        var url =
        this.baseUrl +
        "app/" +
        this.appId +
        "/document/" +
        invoiceId+ ".pdf" +
        "?docPath=" +
        pdfPath;

      return (
        <div className="pdf-frame">
          {/* {this.attachmentOperations(documentData, true, true)} */}
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
        </div>
      );
    }

  render() {
    
    return (
          <div className="row justify-content-center docViewerComponent">
          <div className="col-md-9 border docViewerWindow">
            {this.displayInvoiceData(this.state.invoiceData)}
          </div>
        </div>
    )
  }
}





export default InvoiceViewer;