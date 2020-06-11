import Base from 'formiojs/components/_classes/component/Component'
import editForm from 'formiojs/components/table/Table.form'
import $ from 'jquery';
import phoneList from './Phonelist';
import { AsYouType } from 'libphonenumber-js'

export default class PhoneNumberComponent extends Base { 
    constructor(component, options, data) {
        super(component, options, data);
        this.data = data;
        this.form = this.getRoot();
        var that = this;
     
    }
    static schema() {
        return Base.schema({
          type: 'phonenumber',
          label:'phonenumber'       
        });
    }
    static builderInfo = {
        title: 'Phonenumber',
        group: 'Custom',
        icon: 'fa fa-phone',
        weight: 70,
        schema: PhoneNumberComponent.schema()
    }
    static editForm = editForm;
    /**
   * Render returns an html string of the fully rendered component.
   *
   * @param children - If this class is extendended, the sub string is passed as children.
   * @returns {string}
   */
    render(children) { 
        var country = this.renderTemplate('input', { 
            input: {
                type: 'select',
                ref: this.component.key+'_phone_country',
                name: 'phone_country',
                id : this.component.key+"_phone_country",
                
                attr: {
                    key:this.component.key+'_phone_country',
                    id:this.component.key+'_phone_country',
                    hideLabel: 'true',
                    class:"form-control",
                    
                },
            }
        });
        var phoneNumber = this.renderTemplate('input' , {
            input: {
                type: 'input',
                ref: this.component.key+"_phone_no",
                attr: {
                    type: 'tel',
                    key: this.component.key+"_phone_no",
                    id: this.component.key+"_phone_no",
                    class:"form-control",
                    placeholder: this.component.placeholder?this.component.placeholder:"Enter Phone No",
                }
            }
        })
        return super.render(`<div class="row">
        <div class="col-md-1 padding-0">
            ${country}
        </div>
        <div class="col-md-4 padding-0">
            ${phoneNumber}
        </div>
        `);
    }
    /**
   * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
   * elements to attach functionality to.
   *
   * @param element
   * @returns {Promise}
   */
	attach(element) {
        var that = this;
        $("#"+this.key+"_phone_country").append(`<option value = "" disabled selected  data_descr="Code"></option>`)
    
        var options = phoneList.phoneList;
        arrayColumn(options,'name','code','dial_code');
        function arrayColumn(array, columnName,code,dial_code) {
            return array.map(function(value,index) {
                $("#"+this.key+"_phone_country").append(`<option value = "${value[code]}" dail_code="${value[dial_code]}" data_descr="${value[columnName]}" ></option>`)
            })
        }

        if(this.data["country"]){
            
            let obj = options.find(o => o.country === this.data["address_country"]);
            // $('#phone_country').val(obj.code);
        }
        function focus() {
            [].forEach.call(this.options, function(o) {
              o.textContent = o.getAttribute('data_descr') ;
              $("#"+this.key+"_phone_country").val("")
            });
        }
        var dail_code;
        function blur() {
            [].forEach.call(this.options, function(o) {
              o.textContent = o.getAttribute('dail_code');
            
            });
        }
        [].forEach.call(document.querySelectorAll("#"+this.key+"_phone_country"), function(s) {
            s.addEventListener('focus', focus);
            s.addEventListener('blur', blur);
            blur.call(s);
        });
        var selectedValue ,obj;
        $("#"+this.key+"_phone_country").change(function(e) {
            selectedValue = $(this).val();
            obj = options.find(o => o.code === selectedValue);
            this.blur()
            var value = document.getElementById(this.key+"_phone_no").value;
            if(value !== "") {
                var phone = new AsYouType(selectedValue).input(value);
                $('input[type="tel"]').val(phone);
            }
            else {
                $('input[type="tel"]').val("");
            }
        })

        $('input[type="tel"]').on("input", function(e) {
            var phone = new AsYouType(selectedValue).input(e.target.value)
            $('input[type="tel"]').val(phone);
            // this.updateValue(phone);
        })
        document.getElementById(this.key+"_phone_no").addEventListener("input", (e) => {
            var phone =new AsYouType(selectedValue).input(e.target.value);
            // this.updateValue({"dail_code":obj["dial_code"],"phoneNumber":phone});
        })
   
        
    }
    
}