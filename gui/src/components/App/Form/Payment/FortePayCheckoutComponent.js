import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form'
import Formio from 'formiojs/Formio';
import moment from 'moment';
import $ from 'jquery';

export default class FortePayCheckoutComponent extends Base { 
    constructor(component, options, data) {
        component.label = 'fortePayment'
        super(component, options, data);
        this.data = data;
        this.form = this.getRoot();
        var that = this;
        console.log("data",that.data)
        var getFormInfo = function(e){
            var evt = new CustomEvent('formInfo', {cancelable: true,detail:{form:that.form}});
            window.dispatchEvent(evt);
        }
        window.addEventListener('getFormInfo', getFormInfo,false);
        
        function oncallback(e) {
            console.log(e)
            var form;
            var response = JSON.parse(e.data)
            var formInfo = function(e){
                form = e.detail.form;
            }
            window.addEventListener('formInfo', formInfo,false);
            var evt = new CustomEvent('getFormInfo', {cancelable: true,detail:{}});
            window.dispatchEvent(evt);
            switch(response.event) {
                
                case 'success' : 
                var evt = new CustomEvent('paymentSuccess', {cancelable: true,detail:{data: response,status: response.event}});
                form.element.dispatchEvent(evt);
                break;
                case 'failure' :
                document.getElementById('confirmOrder').style.display = 'block';
                document.getElementById('makePayment').style.display = 'none';
                document.getElementById('fortepay-token').value = "";
                var evt = new CustomEvent('paymentDeclined', {cancelable: true,detail:{message: response.response_description,data:response}});
                form.element.dispatchEvent(evt);
                break;
                case 'error' :
                document.getElementById('confirmOrder').style.display = 'block';
                document.getElementById('fortepay-token').value = "";
                var evt = new CustomEvent('paymentError', {cancelable: true,detail:{message: response.msg,data:response}});
                form.element.dispatchEvent(evt);
                break;
                case 'abort' :
                document.getElementById('confirmOrder').style.display = 'block';
                document.getElementById('makePayment').style.display = 'none';
                document.getElementById('fortepay-token').value = "";
                var evt = new CustomEvent('paymentCancelled', {cancelable: true,detail:{message: "Payment Cancelled By User",data:{}}});
                form.element.dispatchEvent(evt);
                break;
            }
            
        }
        var getPaymentToken = function(e){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if(e.detail.token ==false || e.detail.token == undefined){
                var evt = new CustomEvent('tokenFailure', {cancelable: true,detail:{message: "Unable to reach the Payment Gateway please try again!",error:true}});
                that.form.element.dispatchEvent(evt);
                
                return;
            }
            let paymentData = e.detail.token
            
            if(document.getElementById("makePayment")){
                $('script').each(function() {
                    if (this.src === e.detail.token.js_url) {
                        document.head.removeChild( this );
                    }
                });
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = e.detail.token.js_url;
                $("head").append(script);
                document.getElementById("makePayment").setAttribute('api_access_id',"");
                document.getElementById("confirmOrder").style.disabled ="true";
                document.getElementById("makePayment").style.display ="hidden";
                document.getElementById("fortepay-token").value = paymentData.api_access_id;
                
            }
            setAttributes(document.getElementById("makePayment"),{
                'api_access_id' : paymentData.api_access_id ,
                'total_amount'  : paymentData.amount ,
                'location_id'   : paymentData.location_id,
                'utc_time'      : paymentData.utc_time ,
                'hash_method'   : paymentData.hash_method ,
                'signature'     : paymentData.signature ,
                "version_number": paymentData.version,
                "xdata_1"       : that.data["appId"],
                "order_number"  : paymentData.order_number ,
                'method'        : that.data['paymentMethod'] ,
                "callback"      : oncallback
            })
            // if(that.data['payment_method'] === 'schedule'){
            //     console.log(that.data['planTerm'])
            //     console.log("setAttrs")
            //     setAttributes(document.getElementById("makePayment"),{
            //         'schedule_start_date' :  '02/17/2020', 
            //         'schedule_frequency'  :  that.data['paymentFrequency'],
            //         'schedule_quantity'   :  "2"
            //     })
            // }
            if(document.getElementById("makePayment").hasAttribute("signature")){
                setTimeout(() => {
                    $("#makePayment").click()
                },50)
                
            }
            
            
            
            
        }
        var paymentDetails = function(e){
            if(document.getElementById('confirmOrder')) {
                var confirmOrder = function(event) {
                    
                    var evt = new CustomEvent("requestPaymentToken",{cancelable: true,
                        detail : {
                            amount: document.getElementById('fortepay-amount').value,
                            order_number : "12344",
                            method: that.data['paymentMethod']
                        }
                    })
                    that.form.element.dispatchEvent(evt);
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    
                }
              
                document.getElementById("confirmOrder").onclick = null;
                document.getElementById("confirmOrder").onclick = confirmOrder;
            }
            
        }
      
        this.form.element.addEventListener('paymentDetails', paymentDetails,false);
        this.form.element.addEventListener('getPaymentToken', getPaymentToken,false);
        
        //set multiple attributes at once
        function setAttributes(element, attrs) {
            for(var key in attrs){
                element.setAttribute(key,attrs[key])
            }
        }
        
        
    }
    
    static Schema(...extend) {
        return Base.schema({
            type: 'fortePayment',
            label : 'fortePayment'
        }, ...extend );
    }
    static builderInfo = {
        title: 'Payment',
        group: 'basic',
        icon: 'fa fa-dollar',
        weight: 70,
        schema: FortePayCheckoutComponent.schema()
    }
    elementInfo() {
        return super.elementInfo();
    }
    build() {
        // super.build(element);
    }
    rebuild(){
        super.rebuild();
    }
    /**
    * Render returns an html string of the fully rendered component.
    *
    * @param children - If this class is extendended, the sub string is passed as children.
    * @returns {string}
    */
    render(children) {
        
        var api_access_id = this.renderTemplate('input', { 
            input: {
                type: 'input',
                ref: `fortepay-token`,
                attr: {
                    type: 'hidden',
                    key:'fortepay-token',
                    id:'fortepay-token',
                    hideLabel: 'true',
                    class:"form-control"
                }
            }
        });

        
        var that = this;
        function renderWithPrefix(prefix){
            that.component.prefix="$";
            var ret = that.renderTemplate('input', { 
                input: {
                    type: 'input',
                    ref: `fortepay-amount`,
                    attr: {
                        type: 'textfield',
                        key:'fortepay-amount',
                        class:'form-control',
                        disabled:true,
                        lang:'en',
                        Prefix: "$",
                        id:'fortepay-amount',
                        hideLabel: 'false',
                        placeholder: that.data["label"],
                        style: "background:#fff"
                        
                      
                    }
                }
            });
            that.component.prefix="";
            return ret;
        }
        var amount = renderWithPrefix("$");
        
        
        var row = 
        `<div id="fortepayment">
        ${api_access_id}
        <br/>
        <div class="col-md-12">
        ${amount}
        </div> 
        <br/>
        <button id="confirmOrder" class="btn btn-success">Confirm Order</button>
        <button 
        ref="makePayment"
        id="makePayment"
        class="btn btn-success"
        style="display:none"
        >
        Pay Now
        </button>
        </div>`
        var component = super.render(row)
        return component;
    }
    static editForm = editForm;

}


