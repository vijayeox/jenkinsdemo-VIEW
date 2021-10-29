import React from "react";
class Payment extends React.Component {
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
      paymentData: this.props.paymentData,
      paymentClient: this.props.paymentClient?this.props.paymentClient:null,
      paymentForm: this.props.paymentForm?this.props.paymentForm:null
    };
  }

    componentDidMount()
    {
      if(this.state.paymentData['app_id'] && this.state.paymentData['uuid'])
      {
        var clientAppId = this.state.paymentData['app_id'];
        var invoiceUuid = this.state.paymentData['uuid'];
        var that = this;
        this.getGatewayClient(clientAppId).then((paymentClient)=>{
          that.setState({paymentClient:paymentClient});
          if(paymentClient == "FTNI")
          {
            that.createPaymentTransaction(invoiceUuid).then((transactionData)=>{
              that.setState({paymentForm:transactionData['directFormHtml']});
              window.addEventListener('message', that.handleMessage, false);

            });

          }
        });


      }
    }
    

    renderPaymentForm()
    {

      if(this.state.paymentClient == "FTNI")
      {
        return (
          <iframe
          onLoad={() => {
            setTimeout(() => {
              this.loader.destroy();
            }, 800);
          }}
          key={Math.random() * 20}
          srcDoc={this.state.paymentForm}
          className="iframeDoc"
          ></iframe>
        );
      }

    }


    handleMessage(event) {  
      if(event.data == "STEP_DOWN_PAGE"){
        let ev = new CustomEvent("stepDownPage", {
          detail: {},
          bubbles: true
        });
        var paymentElement = document.querySelector(".docViewerWindow");
        var appId = paymentElement.className.split("_")[1];
        if (document.getElementById("navigation_" + appId)) {
            document.getElementById("navigation_" + appId).dispatchEvent(ev);
        }
      }
      else if(event.data == "TRANSACTION_COMPLETE") {
        var win = window.open("about:blank", "_self");
        win.close();
      }
    }

    async getGatewayClient(appId)
    {
      let helper = this.core.make("oxzion/restClient");
      let gatewayClient = await helper.request( "v1", "/app/" + appId + "/paymentgateway", {}, "get");
      if(gatewayClient['data']&& gatewayClient['data'][0]['payment_client'])
      {
        return gatewayClient['data'][0]['payment_client'];
      }
      else {
        return null;

      }
    }

    async createPaymentTransaction(invoiceUuid)
    {
      let helper = this.core.make("oxzion/restClient");
      let transactionData = await helper.request( "v1", "/billing/payment", {
        "invoiceId":invoiceUuid
      }, "post");
      console.log(transactionData);
      return transactionData['data'];
    }

  render() {
    
    return (
          <div className="row justify-content-center docViewerComponent">
          <div className={"col-md-9 border docViewerWindow payment_"+this.appId}>
            {(this.state.paymentClient && this.state.paymentData)? this.renderPaymentForm(this.state.paymentData):null}
          </div>
        </div>
    )
  }
}





export default Payment;