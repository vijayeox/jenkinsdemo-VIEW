import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form'
import Formio from 'formiojs/Formio';


export default class FortePayCheckoutComponent extends Base { 
    constructor(component, options, data) {
		component.label = 'fortePayment'
        super(component, options, data);
        window.addEventListener("paymentDetails", function (e){
            console.log(e.detail)
            console.log("FortePayment")
            Formio.requireLibrary('paywithforte', 'payWithForte',e.detail.js_url, true);
            document.getElementById("makePayment").setAttribute('api_access_id',"");
           
            if(document.getElementById('confirmOrder')) {
                var confirmOrder = function(event) {
                    event.stopPropagation();
                    var evt = new CustomEvent("requestPaymentToken",{
                        detail : {
                            firstname : document.getElementById('fortepay-firstname').value,
                            lastname : document.getElementById('fortepay-lastname').value,
                            amount: document.getElementById('fortepay-amount').value,
                            order_number : "12344",
                            method: "schedule"
                        }
                    })
                    window.dispatchEvent(evt);
                    event.stopPropagation();
                }
                // document.getElementById('confirmOrder').onclick = null;
                document.getElementById("confirmOrder").onclick = confirmOrder;
                
            }

            if(document.getElementById("makePayment")) {
                var makePayment = function (event) {
                    event.stopPropagation()
                   
                }
                document.getElementById("makePayment").onclick = makePayment;
            }

        },true)
        function oncallback(e) {
            
           var response = JSON.parse(e.data)
           
           switch(response.event) {
               
                case 'success' : 
                    var evt = new CustomEvent('paymentSuccess', {detail:{data: response,status: response.event}});
                    window.dispatchEvent(evt);
                    break;
                case 'failure' :
                    document.getElementById('confirmOrder').style.display = 'block';
                    document.getElementById('makePayment').style.display = 'none';
                    document.getElementById('fortepay-firstname').disabled = false;
                    document.getElementById('fortepay-lastname').disabled = false;
                    document.getElementById('fortepay-token').value = "";
                    var evt = new CustomEvent('paymentDeclined', {detail:{message: response.response_description,data:response}});
                    window.dispatchEvent(evt);
                    break;
                case 'error' :
                    document.getElementById('confirmOrder').style.display = 'block';
                    document.getElementById('fortepay-firstname').disabled = false;
                    document.getElementById('fortepay-lastname').disabled = false;
                    document.getElementById('fortepay-token').value = "";
                    var evt = new CustomEvent('paymentError', {detail:{message: response.msg,data:response}});
                    window.dispatchEvent(evt);
                    break;
                case 'abort' :
                    document.getElementById('confirmOrder').style.display = 'block';
                    document.getElementById('makePayment').style.display = 'none';
                    document.getElementById('fortepay-firstname').disabled = false;
                    document.getElementById('fortepay-lastname').disabled = false;
                    document.getElementById('fortepay-token').value = "";
                    var evt = new CustomEvent('paymentCancelled', {detail:{message: "Payment Cancelled By User",data:{}}});
                    window.dispatchEvent(evt);
                    break;
            }

        }
        window.addEventListener('getPaymentToken', function(e) {
            console.log(e.detail)
            let data = e.detail.token
            document.getElementById("confirmOrder").style.display ="none";
            document.getElementById("makePayment").style.display ="block";
            document.getElementById("fortepay-token").value = data.api_access_id
            document.getElementById("makePayment").setAttribute('api_access_id',data.api_access_id);
            document.getElementById("makePayment").setAttribute('total_amount',data.amount);
            document.getElementById("makePayment").setAttribute('method',data.method);
            document.getElementById("makePayment").setAttribute('location_id',data.location_id);
            document.getElementById("makePayment").setAttribute('utc_time',data.utc_time);
            document.getElementById("makePayment").setAttribute('hash_method',data.hash_method);
            document.getElementById("makePayment").setAttribute('signature',data.signature);
            document.getElementById('makePayment').setAttribute("version_number",data.version);
            document.getElementById('makePayment').setAttribute("order_number", data.order_number);
            // document.getElementById('makePayment').setAttribute('schedule_start_date')
            // document.getElementById('makePayment').setAttribute('schedule_frequency')
            // document.getElementById('makePayment').setAttribute('schedule_quantity')
            // document.getElementById('makePayment').setAttribute("customer_token",data.customer_token);
            // document.getElementById('makePayment').setAttribute("billing_company_name",data.billing_company_name);
            // document.getElementById('makePayment').setAttribute("consumer_id",data.billing_company_name);
            document.getElementById('makePayment').setAttribute("callback",oncallback);
        })
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
        var firstname = this.renderTemplate('input', { 
            input: {
              type: 'input',
              ref: `fortepay-firstname`,
              attr: {
                type: 'textfield',
                key:'fortepay-firstname',
                class:'form-control',
                lang:'en',
                id:'fortepay-firstname',
                placeholder:'First Name',
                hideLabel: 'true'
              }
            }
        });

        var lastname = this.renderTemplate('input', { 
            input: {
                type: 'input',
                ref: `fortepay-lastname`,
                attr: {
                    type: 'textfield',
                    key:'fortepay-lastname',
                    class:'form-control',
                    lang:'en',
                    id:'fortepay-lastname',
                    placeholder:'Last Name',
                    hideLabel: 'true'
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
                        placeholder:'Amount to be payed',
                        hideLabel: 'true',
                        value: 800
                    }
                }
            });
            that.component.prefix="";
            return ret;
          }
          var amount = renderWithPrefix("$");

        
        var row = 
        `<div>
            ${api_access_id}
            <div class="row">
                <div class="col-md-6">
                    ${firstname}
                </div>
                <div class="col-md-6">
                    ${lastname}
                </div>
            </div>
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


