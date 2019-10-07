/* globals ConvergePayCheckout */
import _ from 'lodash';
import Validator from 'formiojs/components/Validator';
import BaseComponent from 'formiojs/components/base/Base';
import Formio from 'formiojs/Formio';
 
export default class ConvergePayCheckoutComponent extends BaseComponent {
  constructor(component, options, data) {
    component.label = 'Pay';
    super(component, options, data);
    const src = 'https://api.demo.convergepay.com/hosted-payments/Checkout.js';
    this.convergepayCheckoutReady = Formio.requireLibrary('convergepayCheckout', 'ConvergePayCheckout', src, true);
    this.componentAction = this.component.action;
    this.component.action = 'event';
    this.lastResult = null;
    this.paymentDone = false;
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
   * Handle event dispatched by ConvergePay library
   * @param {Object} token - The token returned by ConvergePay.
   */
  onToken(token) {
    this.setValue(token.id);
    // In case of submit, submit the form
    if (this.componentAction === 'submit') {
      this.emit('submitButton');
    }
    else {
      this.addClass(this.element, 'btn-success');
      this.disabled = true;
    }
  }
 
  /**
   * Handle customEvent event on the button
   * @param {Object} event - The event returned by ButtonComponent.
   */
  onClickButton(event) {
    // Return if component call is not the current component
    if (this.component.key !== event.component.key) {
      return;
    }
    if (this.componentAction === 'submit') {
      // In case of submit, validate the form before opening button
      if (this.root.isValid(event.data, true)) {
        this.handler.open(popupConfiguration);
      }
      else {
        // If the form is not valid, submit it to draw errors
        this.emit('submitButton');
      }
    }
    else {
      this.handler.open(popupConfiguration);
    }
  }
 
  build() {
    // Build button
  this.element = this.ce('div', {
    class: 'convergepay'
  });
  this.createLabel(this.element);
  var convergePaycard = this.ce('input', {
    type: 'textfield',
    key:'convergepay-card',
    class:'form-control',
    lang:'en',
    id:'convergepay-card',
    placeholder:'Please enter your card Number',
    hideLabel: 'true'
  });
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
  var row = this.ce('div', {
    class: 'row'
  });
  var colleft = this.ce('div', {
    class: 'col-md-6'
  });
  var colright = this.ce('div', {
    class: 'col-md-6'
  });
  var row2 = this.ce('div', {
    class: 'row'
  });
  var col2left = this.ce('div', {
    class: 'col-md-6'
  });
  var col2right = this.ce('div', {
    class: 'col-md-6'
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

  var amount = this.ce('input', {
    type: 'textfield',
    key:'convergepay-amount',
    class:'form-control',
    disabled:true,
    lang:'en',
    id:'convergepay-amount',
    placeholder:'Amount to be payed',
    hideLabel: 'true'
  });
  var expiryMonth = this.ce('input', {
    type: 'month',
    key:'convergepay-expiry-month',
    id:'convergepay-expiry-month',
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
  colright.appendChild(expiryMonth);
  colleft.appendChild(cvv2);
  row.appendChild(colleft);
  row.appendChild(colright);

  col2right.appendChild(lastname);
  col2left.appendChild(firstname);
  row2.appendChild(col2left);
  row2.appendChild(col2right);

  this.element.appendChild(convergePaycard);
  this.element.appendChild(row);
  this.element.appendChild(row2);
  this.element.appendChild(amount);

    super.build();
    const successLabel = this.component.payButton.successLabel || 'Payment successful';
    this.convergePaySuccess = this.ce('div', {
      class: 'convergepay-success',
      style: 'display: none'
    }, this.t(successLabel));
    this.element.appendChild(this.convergePaySuccess);
    this.convergepayElementPayButton = this.ce('div', {
        class: 'convergepay-paybutton'
      });
      this.element.appendChild(this.convergepayElementPayButton);

      const separatorLabel = 'Or';
      this.convergepaySeparator = this.ce('div', {
        class: 'convergepay-separator',
        style: 'display: none'
      }, this.t(separatorLabel));
      this.element.appendChild(this.convergepaySeparator);
    // In case of submit, add event listeners
    if (this.componentAction === 'submit') {
      this.on('submitButton', () => {
        this.loading = true;
        this.disabled = true;
      }, true);
      this.on('submitDone', () => {
        this.loading = false;
        this.disabled = false;
      }, true);
      this.on('change', (value) => {
        this.loading = false;
        this.disabled = (this.component.disableOnInvalid && !this.root.isValid(value.data, true));
      }, true);
      this.on('error', () => {
        this.loading = false;
      }, true);
    }
 
    // When convergepay checkout is ready, create the handler and add event listeners
    this.convergepayCheckoutReady.then(() => {
      console.log(this);
      this.on('customEvent', this.onClickButton.bind(this), true);
      this.addEventListener(window, 'popstate', () => {
        this.handler.close();
      });
    });
  }
}
 
if (typeof global === 'object' && global.Formio && global.Formio.registerComponent) {
  global.Formio.registerComponent('convergepay', ConvergePayCheckoutComponent);
}