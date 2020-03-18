import Base from "formiojs/components/_classes/component/Component";
import editForm from "formiojs/components/table/Table.form";
import Formio from "formiojs/Formio";
import Components from "formiojs/components/Components";

export default class ConvergePayCheckoutComponent extends Base {
  constructor(component, options, data) {
    component.label = "Pay";
    super(component, options, data);
    this.data = data;
    this.form = this.getRoot();
    var that = this;
    var getPaymentToken = function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.detail.token == false || e.detail.token == undefined) {
        var evt = new CustomEvent("tokenFailure", {
          cancelable: true,
          detail: {
            message: "Unable to reach the Payment Gateway please try again!",
            error: true
          }
        });
        that.form.element.dispatchEvent(evt);
        return;
      }
      document.getElementById("cardPayment").style.display = "block";
      document.getElementById("confirmOrder").style.display = "none";
      document.getElementById("convergepay-firstname").disabled = true;
      document.getElementById("convergepay-lastname").disabled = true;
      var paymentData = {
        ssl_txn_auth_token: e.detail.token
      };
      var callback = {
        onError: function(error) {
          document.getElementById("cardPayment").style.display = "none";
          document.getElementById("confirmOrder").style.display = "block";
          document.getElementById("confirmOrder").disabled = false;
          document.getElementById("convergepay-firstname").disabled = false;
          document.getElementById("convergepay-lastname").disabled = false;
          document.getElementById("convergepay-token").value = "";
          var evt = new CustomEvent("paymentError", {
            cancelable: true,
            detail: { message: error.errorMessage, data: error }
          });
          that.form.element.dispatchEvent(evt);
          that.form.element.addEventListener(
            "getPaymentToken",
            getPaymentToken,
            false
          );
        },
        onCancelled: function() {
          document.getElementById("cardPayment").style.display = "none";
          document.getElementById("confirmOrder").style.display = "block";
          document.getElementById("convergepay-firstname").disabled = false;
          document.getElementById("confirmOrder").disabled = false;
          document.getElementById("convergepay-lastname").disabled = false;
          document.getElementById("convergepay-token").value = "";
          var evt = new CustomEvent("paymentCancelled", {
            cancelable: true,
            detail: { message: "Payment Cancelled By User", data: {} }
          });
          that.form.element.dispatchEvent(evt);
          that.form.element.addEventListener(
            "getPaymentToken",
            getPaymentToken,
            false
          );
        },
        onDeclined: function(response) {
          document.getElementById("cardPayment").style.display = "none";
          document.getElementById("confirmOrder").style.display = "block";
          document.getElementById("convergepay-firstname").disabled = false;
          document.getElementById("confirmOrder").disabled = false;
          document.getElementById("convergepay-lastname").disabled = false;
          document.getElementById("convergepay-token").value = "";
          var evt = new CustomEvent("paymentDeclined", {
            cancelable: true,
            detail: { message: response.errorMessage, data: response }
          });
          that.form.element.dispatchEvent(evt);
          that.form.element.addEventListener(
            "getPaymentToken",
            getPaymentToken,
            false
          );
        },
        onApproval: function(response) {
          console.log("Approval Code=" + response["ssl_approval_code"]);
          console.log("approval:" + JSON.stringify(response, null, "\t"));
          var evt = new CustomEvent("paymentSuccess", {
            cancelable: true,
            detail: { data: response, status: response.ssl_token_response }
          });
          that.form.element.dispatchEvent(evt);
        }
      };
      var evt = new CustomEvent("paymentPending", {
        cancelable: true,
        detail: { message: "Payment is Processing Please wait" }
      });
      that.form.element.dispatchEvent(evt);
      PayWithConverge.open(paymentData, callback);
      that.form.element.removeEventListener(
        "getPaymentToken",
        getPaymentToken,
        false
      );
    };

    var paymentDetails = function(e) {
      Formio.requireLibrary(
        "paywithconverge",
        "PayWithConverge",
        e.detail.js_url,
        true
      );
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (document.getElementById("confirmOrder")) {
        var confirmOrder = function(event) {
          document.getElementById("confirmOrder").disabled = true;
          var evt = new CustomEvent("requestPaymentToken", {
            cancelable: true,
            detail: {
              firstname: document.getElementById("convergepay-firstname").value,
              lastname: document.getElementById("convergepay-lastname").value,
              amount: document.getElementById("convergepay-amount").value
            }
          });
          that.form.element.dispatchEvent(evt);
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        };
        document.getElementById("confirmOrder").onclick = null;
        document.getElementById("confirmOrder").onclick = confirmOrder;
      }
    };
    this.form.element.removeEventListener(
      "paymentDetails",
      paymentDetails,
      false
    );
    this.form.element.addEventListener("paymentDetails", paymentDetails, false);
    this.form.element.addEventListener(
      "getPaymentToken",
      getPaymentToken,
      false
    );
  }
  static schema(...extend) {
    return Base.schema(
      {
        label: "Payment",
        type: "convergepay"
      },
      ...extend
    );
  }
  static builderInfo = {
    title: "Payment",
    group: "basic",
    icon: "fa fa-dollar",
    weight: 70,
    schema: ConvergePayCheckoutComponent.schema()
  };
  elementInfo() {
    return super.elementInfo();
  }
  build() {
    console.log(this);
    super.build(element);
  }
  rebuild() {
    super.rebuild();
  }
  /**
   * Set CSS classes for pending authorization
   */
  authorizePending() {
    this.addClass(this.element, "convergepay-submitting");
    this.removeClass(this.element, "convergepay-error");
    this.removeClass(this.element, "convergepay-submitted");
  }
  /**
   * Set CSS classes and display error when error occurs during authorization
   * @param {Object} resultError - The result error returned by convergepay API.
   */
  authorizeError(resultError) {
    this.removeClass(this.element, "convergepay-submitting");
    this.addClass(this.element, "convergepay-submit-error");
    this.removeClass(this.element, "convergepay-submitted");
    if (!this.lastResult) {
      this.lastResult = {};
    }
    this.lastResult.error = resultError;
    this.setValue(this.getValue(), {
      changed: true
    });
  }
  buttonClicked() {
    console.log("buttonClicked");
  }
  /**
   * Set CSS classes and save token when authorization successed
   * @param {Object} result - The result returned by convergepay API.
   */
  authorizeDone(result) {
    this.removeClass(this.element, "convergepay-submit-error");
    this.removeClass(this.element, "convergepay-submitting");
    this.addClass(this.element, "convergepay-submitted");
    // Store token in hidden input
    this.setValue(result.token);
    this.paymentDone = true;
  }
  render(children) {
    var merchanttxnid = this.renderTemplate("input", {
      input: {
        type: "input",
        ref: `convergepay-merchanttxnid`,
        attr: {
          type: "hidden",
          key: "convergepay-merchanttxnid",
          id: "convergepay-merchanttxnid",
          hideLabel: "true",
          value: "EOXVantage",
          class: "form-control"
        }
      }
    });
    var convergepayToken = this.renderTemplate("input", {
      input: {
        type: "input",
        ref: `convergepay-token`,
        attr: {
          type: "hidden",
          key: "convergepay-token",
          id: "convergepay-token",
          hideLabel: "true",
          class: "form-control"
        }
      }
    });
    var firstname = this.renderTemplate("input", {
      input: {
        type: "input",
        ref: `convergepay-firstname`,
        attr: {
          type: "textfield",
          key: "convergepay-firstname",
          class: "form-control",
          lang: "en",
          id: "convergepay-firstname",
          placeholder: "First Name",
          hideLabel: "true"
        }
      }
    });
    var lastname = this.renderTemplate("input", {
      input: {
        type: "input",
        ref: `convergepay-lastname`,
        attr: {
          type: "textfield",
          key: "convergepay-lastname",
          class: "form-control",
          lang: "en",
          id: "convergepay-lastname",
          placeholder: "Last Name",
          hideLabel: "true"
        }
      }
    });
    var that = this;
    function renderWithPrefix(prefix) {
      that.component.prefix = "$";
      var ret = that.renderTemplate("input", {
        input: {
          type: "input",
          ref: `convergepay-amount`,
          attr: {
            type: "textfield",
            key: "convergepay-amount",
            class: "form-control",
            disabled: true,
            lang: "en",
            id: "convergepay-amount",
            placeholder: "Amount to be payed",
            hideLabel: "true",
            value: that.data["amount"]
          }
        }
      });
      that.component.prefix = "";
      return ret;
    }
    var amount = renderWithPrefix("$");
    var row = `<div class="convergepay">
    <div style="display:flex">
    <div class="col-md-7" style="padding-left:0px">
    <p style="padding: 10px; background-color: #cec8c8; color:red; border-radius: 5px; margin-top:8px;"> Note : &nbsp; We only accept Visa, Mastercard and American Express cards.</p>
    </div>
    <div class="col-md-5">
    <img src="./apps/DiveInsurance/img/cards_image.jpg" class="img-fluid" style="height: 60px;float: right;">
    </div>
    </div>
    <div class="row"><div class="col-md-12">Please enter your name as per card details</div></div><br/>
    <div class="row">
    <div class="col-md-6"> 
    <div class="form-group">
    ${firstname}
    </div>
    </div>
    <div class="col-md-6"> 
    <div class="form-group">
    ${lastname}
    </div>
    </div>
    </div>
    <div class="row">
    <div class="col-md-12"> 
    <div class="form-group">
    ${amount}
    </div>
    </div>
    </div>
    <button style="display:block;" action="button" id="confirmOrder" onClick="buttonClicked();" class="btn btn-success" label="Confirm Order">Confirm Order</button>
    </div>`;
    var paymentPanel = `<div class="mb-2 card border panel panel-primary" style="display:none;" id="cardPayment">
    <div id="paymentPanel" class="card-body">
    ${convergepayToken}
    ${merchanttxnid}
    <div class="row">
    <div class="convergepay-success" style="display:none;">Payment successful!</div></div></div></div>
    </div>`;
    var component = super.render(row + paymentPanel);
    return component;
  }
  static editForm = editForm;
}
