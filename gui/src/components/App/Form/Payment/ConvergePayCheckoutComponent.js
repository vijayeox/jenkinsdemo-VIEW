import _ from 'lodash';
import Validator from 'formiojs/components/Validator';
import BaseComponent from 'formiojs/components/base/Base';
import Formio from 'formiojs/Formio';

export default class ConvergePayCheckoutComponent extends BaseComponent {
  constructor(component, options, data) {
    component.label = 'Pay';
    super(component, options, data);
    this.data = data;
    window.addEventListener('paymentDetails', function (e) {
      Formio.requireLibrary('paywithconverge', 'PayWithConverge', e.detail.js_url, true);
    },true);
    window.addEventListener('getPaymentToken', function (e) {
      document.getElementById('cardPayment').style.display = 'block';
      document.getElementById('confirmOrder').style.display = 'none';
      document.getElementById('convergepay-firstname').disabled = true;
      document.getElementById('convergepay-lastname').disabled = true;
      document.getElementById('convergepay-token').value = e.detail.token;
    },true);
  }
  elementInfo() {
    const info = super.elementInfo();
    info.type = 'input';
    info.attr.type = 'hidden';
    info.changeEvent = 'change';
    return info;
  }

  getValue() {
    return this.dataValue;
  }

  setValue(value, flags) {
    flags = this.getFlags.apply(this, arguments);
    return this.updateValue(flags);
  }
  /**
   * Set CSS classes for pending authorization
   */

   authorizePending() {
    this.addClass(this.element, 'convergepay-submitting');
    this.removeClass(this.element, 'convergepay-error');
    this.removeClass(this.element, 'convergepay-submitted');
  }
  /**
   * Set CSS classes and display error when error occurs during authorization
   * @param {Object} resultError - The result error returned by convergepay API.
   */
   authorizeError(resultError) {
    this.removeClass(this.element, 'convergepay-submitting');
    this.addClass(this.element, 'convergepay-submit-error');
    this.removeClass(this.element, 'convergepay-submitted');

    if (!this.lastResult) {
      this.lastResult = {};
    }
    this.lastResult.error = resultError;
    this.setValue(this.getValue(), {
      changed: true
    });
  }
    /**
   * Set CSS classes and save token when authorization successed
   * @param {Object} result - The result returned by convergepay API.
   */
   authorizeDone(result) {
    this.removeClass(this.element, 'convergepay-submit-error');
    this.removeClass(this.element, 'convergepay-submitting');
    this.addClass(this.element, 'convergepay-submitted');
    // Store token in hidden input
    this.setValue(result.token);
    this.paymentDone = true;
  }

  elementInfo() {
    const info = super.elementInfo();
    info.type = 'input';
    info.attr.type = 'hidden';
    info.changeEvent = 'change';
    return info;
  }

  build() {
    super.build();
    var merchanttxnid = this.ce('input', {
      type: 'hidden',
      key:'convergepay-merchanttxnid',
      id:'convergepay-merchanttxnid',
      hideLabel: 'true',
      class:"form-control"
    });
    var convergepayToken = this.ce('input', {
      type: 'hidden',
      key:'convergepay-token',
      id:'convergepay-token',
      hideLabel: 'true',
      class:"form-control"
    });

    this.element = this.ce('div', {
      class: 'convergepay'
    });
    this.createLabel(this.element);
    var firstname = this.ce('input', {
      type: 'textfield',
      key:'convergepay-firstname',
      class:'form-control',
      lang:'en',
      id:'convergepay-firstname',
      placeholder:'First Name',
      hideLabel: 'true'
    });
    var lastname = this.ce('input', {
      type: 'textfield',
      key:'convergepay-lastname',
      class:'form-control',
      lang:'en',
      id:'convergepay-lastname',
      placeholder:'Last Name',
      hideLabel: 'true'
    });

    var col2left = this.ce('div', {
      class: 'col-md-6'
    });
    var col2right = this.ce('div', {
      class: 'col-md-6'
    });
    var col2rightGroup = this.ce('div', {
      class: 'form-group'
    });
    var col2leftGroup = this.ce('div', {
      class: 'form-group'
    });
    col2rightGroup.appendChild(lastname);
    col2right.appendChild(col2rightGroup);
    col2leftGroup.appendChild(firstname);
    col2left.appendChild(col2leftGroup);

    var row2 = this.ce('div', {
      class: 'row'
    });
    row2.appendChild(col2left);
    row2.appendChild(col2right);

    this.element.appendChild(row2);
    console.log(this.data);
    var amount = this.ce('input', {
      type: 'textfield',
      key:'convergepay-amount',
      class:'form-control',
      disabled:true,
      lang:'en',
      id:'convergepay-amount',
      placeholder:'Amount to be payed',
      hideLabel: 'true',
      value: this.data['amount']
    });

    var amountGroup = this.ce('div', {
      class: 'form-group'
    });
    amountGroup.appendChild(amount);
    this.element.appendChild(amountGroup);

    var confirmOrder = this.ce('div', {
      class: 'btn btn-success',
      id: 'confirmOrder',
      input: true,
      label: 'Confirm Order',
      disableOnInvalid: false,
      action: 'button',
      block: 'false',
      style: 'display:block',
      text: 'Confirm Order'
    }, this.t("Confirm Order"));
    confirmOrder.addEventListener("click",function(event){
      var evt = new CustomEvent('requestPaymentToken', {detail:{firstname: document.getElementById('convergepay-firstname').value,lastname: document.getElementById('convergepay-lastname').value,amount: document.getElementById('convergepay-amount').value}});
      window.dispatchEvent(evt);
      event.stopPropagation();
    },true);
    this.element.appendChild(confirmOrder);

    var paymentPanel = this.ce('div', {
      class: 'form-group',
      id: 'paymentPanel'
    });
    var convergePaycard = this.ce('input', {
      type: 'textfield',
      key:'convergepay-card',
      class:'form-control',
      lang:'en',
      id:'convergepay-card',
      placeholder:'Please enter your card Number',
      hideLabel: 'true'
    });
    var cvv2 = this.ce('input', {
      type: 'textfield',
      key:'convergepay-cvv',
      class:'form-control',
      lang:'en',
      id:'convergepay-cvv',
      placeholder:'Please Enter CVV',
      hideLabel: 'true'
    });

    var expiryMonth = this.ce('input', {
      type: 'month',
      key:'convergepay-exp',
      id:'convergepay-exp',
      hideLabel: 'true',
      class:"form-control",
      format: 'yymm'
    });
    var colleft = this.ce('div', {
      class: 'col-md-6'
    });
    var colright = this.ce('div', {
      class: 'col-md-6'
    });
    var colrightGroup = this.ce('div', {
      class: 'form-group'
    });
    var colleftGroup = this.ce('div', {
      class: 'form-group'
    });
    colrightGroup.appendChild(expiryMonth);
    colright.appendChild(colrightGroup);
    colleft.appendChild(cvv2);
    colleft.appendChild(colleftGroup);

    var row = this.ce('div', {
      class: 'row'
    });
    row.appendChild(colleft);
    row.appendChild(colright);
    var row3 = this.ce('div', {
      class: 'row'
    });
    var col3 = this.ce('div', {
      class: 'col-md-12'
    });
    var formgroup3 = this.ce('div', {
      class: 'form-group'
    });
    formgroup3.appendChild(convergePaycard);
    col3.appendChild(formgroup3);
    row3.appendChild(col3);
    paymentPanel.appendChild(row3);
    paymentPanel.appendChild(row);
    paymentPanel.appendChild(convergepayToken);
    paymentPanel.appendChild(merchanttxnid);
    const successLabel = 'Payment successful';
    var convergePaySuccess = this.ce('div', {
      class: 'convergepay-success',
      style: 'display: none'
    }, this.t(successLabel));
    paymentPanel.appendChild(convergePaySuccess);
    var paymentButton = this.ce('button', {
      class: 'btn btn-success',
      id: 'confirmOrder',
      label: 'Pay',
      action: 'submit',
      style: 'display:block',
      text: 'Pay'
    }, this.t("Complete Application"));
    paymentButton.addEventListener("click",function(event){
      var token = document.getElementById('convergepay-token').value;
      var card = document.getElementById('convergepay-card').value;
      var exp = document.getElementById('convergepay-exp').value;
      var expiryDate = new Date(exp);
      var cvv = document.getElementById('convergepay-cvv').value;
      var gettoken = "Y";
      var addtoken = "Y";
      var firstname = document.getElementById('convergepay-firstname').value;
      var lastname = document.getElementById('convergepay-lastname').value;
      var merchanttxnid = document.getElementById('convergepay-merchanttxnid').value;
      var paymentData = {
        ssl_txn_auth_token: token,
        ssl_card_number: card,
        ssl_exp_date: ('0'+(expiryDate.getMonth()+1)).slice(-2)+expiryDate.getFullYear().toString().substr(-2),
        ssl_get_token: gettoken,
        ssl_add_token: addtoken,
        ssl_first_name: firstname,
        ssl_last_name: lastname,
        ssl_cvv2cvc2: cvv,
        ssl_merchant_txn_id: merchanttxnid
      };
      var callback = {
        onError: function (error) {
          document.getElementById('cardPayment').style.display = 'none';
          document.getElementById('confirmOrder').style.display = 'block';
          document.getElementById('convergepay-firstname').disabled = false;
          document.getElementById('convergepay-lastname').disabled = false;
          document.getElementById('convergepay-token').value = "";
          var evt = new CustomEvent('paymentError', {detail:{message: error.errorMessage,data:error}});
          window.dispatchEvent(evt);
        },
        onDeclined: function (response) {
          document.getElementById('cardPayment').style.display = 'none';
          document.getElementById('confirmOrder').style.display = 'block';
          document.getElementById('convergepay-firstname').disabled = false;
          document.getElementById('convergepay-lastname').disabled = false;
          document.getElementById('convergepay-token').value = "";
          var evt = new CustomEvent('paymentDeclined', {detail:{message: response.errorMessage,data:response}});
          window.dispatchEvent(evt);
        },
        onApproval: function (response) {
          console.log("Approval Code=" + response['ssl_approval_code']);
          console.log("approval:"+JSON.stringify(response, null, '\t'));
          var evt = new CustomEvent('paymentSuccess', {detail:{data: response,status: response.ssl_token_response}});
          window.dispatchEvent(evt);
        }
      };
      var evt = new CustomEvent('paymentPending', {detail:{message:"Payment is Processing Please wait" }});
      window.dispatchEvent(evt);
      ConvergeEmbeddedPayment.pay(paymentData, callback);
    },true);
    var cardPayment = this.ce('div', {
      class: 'mb-2 card border panel panel-primary',
      style: 'display: none',
      id: 'cardPayment'
    });
    var cardHeader = this.ce('div', {
      class: 'card-header bg-primary panel-heading'
    });
    var cardBody = this.ce('div', {
      class: 'card-body panel-body'
    });
    var cardHeaderText = this.ce('h4', {
      class: 'mb-0 card-title panel-title'
    }, this.t("Card Details"));
    cardHeader.appendChild(cardHeaderText);
    cardPayment.appendChild(cardHeader);
    cardPayment.appendChild(cardBody);
    paymentPanel.appendChild(paymentButton);
    cardBody.appendChild(paymentPanel);
    this.element.appendChild(cardPayment);
    // Add container for pay button
    var that = this;
  }
}

if (typeof global === 'object' && global.Formio && global.Formio.registerComponent) {
  global.Formio.registerComponent('convergepay', ConvergePayCheckoutComponent);
}