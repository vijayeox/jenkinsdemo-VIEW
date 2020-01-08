import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form'
import Formio from 'formiojs/Formio';
import Components from 'formiojs/components/Components';

export default class ConvergePayCheckoutComponent extends Base {
  constructor(component, options, data) {
    component.label = 'Pay';
    super(component, options, data);
    this.data = data;
    this.form = this.getRoot();
    window.addEventListener('paymentDetails', function (e) {
      Formio.requireLibrary('paywithconverge', 'PayWithConverge', e.detail.js_url, true);
      e.stopPropagation();
     document.getElementById('confirmOrder').addEventListener("click",function(event){
      var evt = new CustomEvent('requestPaymentToken', {detail:{firstname: document.getElementById('convergepay-firstname').value,lastname: document.getElementById('convergepay-lastname').value,amount: document.getElementById('convergepay-amount').value}});
      window.dispatchEvent(evt);
      event.stopPropagation();
    },true);
    document.getElementById('makePayment').addEventListener("click",function(event){
      event.stopPropagation();
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
    },true);
    window.addEventListener('getPaymentToken', function (e) {
      document.getElementById('cardPayment').style.display = 'block';
      document.getElementById('confirmOrder').style.display = 'none';
      document.getElementById('convergepay-firstname').disabled = true;
      document.getElementById('convergepay-lastname').disabled = true;
      document.getElementById('convergepay-token').value = e.detail.token;
    },true);
  }
  static schema(...extend) {
    return Base.schema({
      label: 'Payment',
      type: 'convergepay'
    }, ...extend);
  }
    static builderInfo = {
    title: 'Payment',
    group: 'basic',
    icon: 'fa fa-dollar',
    weight: 70,
    schema: ConvergePayCheckoutComponent.schema()
  }
  elementInfo() {
    return super.elementInfo();
  }
  build() {
    console.log(this);
    super.build(element);
  }
  rebuild(){
    super.rebuild();
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
  buttonClicked(){
    console.log('buttonClicked');
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
render(children) {
  var merchanttxnid = this.renderTemplate('input', { 
    input: {
      type: 'input',
      ref: `convergepay-merchanttxnid`,
      attr: {
        type: 'hidden',
        key:'convergepay-merchanttxnid',
        id:'convergepay-merchanttxnid',
        hideLabel: 'true',
        value: 'EOXVantage',
        class:"form-control"
      }
    }
  });
  var convergepayToken = this.renderTemplate('input', { 
    input: {
      type: 'input',
      ref: `convergepay-token`,
      attr: {
        type: 'hidden',
        key:'convergepay-token',
        id:'convergepay-token',
        hideLabel: 'true',
        class:"form-control"
      }
    }
  });
    var firstname = this.renderTemplate('input', { 
      input: {
        type: 'input',
        ref: `convergepay-firstname`,
        attr: {
          type: 'textfield',
          key:'convergepay-firstname',
          class:'form-control',
          lang:'en',
          id:'convergepay-firstname',
          placeholder:'First Name',
          hideLabel: 'true'
        }
      }
    });
    var lastname = this.renderTemplate('input', { 
      input: {
        type: 'input',
        ref: `convergepay-lastname`,
        attr: {
          type: 'textfield',
          key:'convergepay-lastname',
          class:'form-control',
          lang:'en',
          id:'convergepay-lastname',
          placeholder:'Last Name',
          hideLabel: 'true'
        }
      }
    });
    var amount = this.renderTemplate('input', { 
      input: {
        type: 'input',
        ref: `convergepay-amount`,
        attr: {
          type: 'textfield',
          key:'convergepay-amount',
          class:'form-control',
          disabled:true,
          lang:'en',
          id:'convergepay-amount',
          placeholder:'Amount to be payed',
          hideLabel: 'true',
          value: this.data['amount']
        }
      }
    });
    var row = `<div class="convergepay"><div class="row">
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

    var convergePaycard = this.renderTemplate('input', { 
      input: {
        type: 'input',
        ref: `convergepay-card`,
        attr: {
          type: 'textfield',
          key:'convergepay-card',
          class:'form-control',
          lang:'en',
          id:'convergepay-card',
          placeholder:'Please enter your card Number',
          hideLabel: 'true'
        }
      }
    });
    var cvv2 = this.renderTemplate('input', { 
      input: {
        type: 'input',
        ref: `convergepay-cvv`,
        attr: {
          type: 'textfield',
          key:'convergepay-cvv',
          class:'form-control',
          lang:'en',
          id:'convergepay-cvv',
          placeholder:'Please Enter CVV',
          hideLabel: 'true'
        }
      }
    });

    var expiryMonth = this.renderTemplate('input', { 
      input: {
        type: 'input',
        ref: `convergepay-exp`,
        attr: {
          type: 'month',
          key:'convergepay-exp',
          id:'convergepay-exp',
          hideLabel: 'true',
          class:"form-control",
          format: 'yymm'
        }
      }
    });
    var paymentPanel = `<div class="mb-2 card border panel panel-primary" style="display:none;" id="cardPayment">
        <div class="card-header bg-primary panel-heading"><div ref="header" class="card-header bg-primary">
    <span class="mb-0 card-title">
      Card Details
    </span>
  </div></div>
        <div id="paymentPanel" class="card-body">
    <div class="row">
    <div class="col-md-12">
    <div class="form-group">
    ${convergePaycard}
    </div>
    </div>
    </div>
    <div class="row">
    <div class="col-md-6"> 
    <div class="form-group">
    ${cvv2}
    </div>
    </div>
    <div class="col-md-6"> 
    <div class="form-group">
    ${expiryMonth}
    </div>
    </div>
    </div></div><div class="row">
    <div class="col-md-12">
    <div class="form-group">
    ${convergepayToken}
    </div>
    </div>
    </div>
    ${merchanttxnid}
    <div class="convergepay-success" style="display:none;">Payment successful!</div>
    <button style="display:block;" action="submit" id="makePayment" class="btn btn-success" label="Pay">Complete Application</button>
    </div></div>`;
    var component = super.render(row+paymentPanel);
    return component;
  }
  static editForm = editForm
}