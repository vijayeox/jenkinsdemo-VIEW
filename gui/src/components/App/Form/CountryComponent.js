import Base from 'formiojs/components/_classes/component/Component'
import editForm from 'formiojs/components/table/Table.form'
import $ from 'jquery';
import Country from './Country'

export default class CountryComponent extends Base {
    constructor(component, options, data) {
        super(component, options, data);
        this.data = data;
        this.form = this.getRoot();
        var that = this;
        console.log(this.data)

    }
    static schema() {
        return Base.schema({
          type: 'country',
          label:'country'
        });
    }
    
    static builderInfo = {
        title: 'country',
        group: 'basic',
        icon: 'fa fa-calender',
        weight: 70,
        schema: CountryComponent.schema()
    }
    static editForm = editForm
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
                ref: `${this.component.key}-selectcountry`,
                name: `${this.component.key}-selectcountry`,
                id : `${this.component.key}-selectcountry`,
                attr: {
                    key:`${this.component.key}-selectcountry`,
                    id: `${this.component.key}-selectcountry`,
                    hideLabel: 'true',
                    class:"form-control",
                },
            }
        });
        var state = this.renderTemplate('input', { 
            input: {
                type: 'select',
                ref: `${this.component.key}-selectstate`,
                name: `${this.component.key}-selectstate`,
                id : `${this.component.key}-selectstate`,
                attr: {
                    key:`${this.component.key}-selectstate`,
                    id: `${this.component.key}-selectstate`,
                    hideLabel: 'true',
                    class:"form-control",
                },
            }
        });
        var city = this.renderTemplate('input', { 
            input: {
                type: 'input',
                ref: `${this.component.key}-selectcity`,
                name: `${this.component.key}-selectcity`,
                id : `${this.component.key}-selectcity`,
                attr: {
                    key: `${this.component.key}-selectcity`,
                    id: `${this.component.key}-selectcity`,
                    hideLabel: 'true',
                    class:"form-control",
                    placeholder: "Enter City"
                },
            }
        });
        return super.render(`
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        ${country}
                    </div>
                    <div class="col-md-4">

                        ${state}

                    </div>
                    <div class="col-md-4">

                        ${city}

                    </div>
                </div>

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
        $('#'+this.component.key+'-selectcountry').val("");
        document.getElementById(this.component.key+"-selectcountry").addEventListener("input" , (e) => this.updateValue({country: e.target.value}));
        document.getElementById(this.component.key+"-selectstate").addEventListener("input" , (e) => this.updateValue({...this.data[this.component.key],state: e.target.value}));
        document.getElementById(this.component.key+"-selectcity").addEventListener("input" , (e) => this.updateValue({...this.data[this.component.key],city: e.target.value}));
        
        $('#'+this.component.key+'-selectcountry').append(`<option value = "" disabled selected >Select Country</option>`);
        
        $('#'+this.component.key+'-selectstate').append(`<option value = "" disabled selected >Select State</option>`)
        var options = Country.countryList;
        arrayColumn('#'+this.component.key+'-selectcountry',options,'country');
        
        function arrayColumn(id,array, columnName) {
            return array.map(function(value,index) {
               
                if(!columnName){
                    $(id).append(`<option value = "${value}" >${value}</option>`)
                }
                else{
                    $(id).append(`<option value = "${value[columnName]}" >${value[columnName]}</option>`)
                }
            })
        }
        var selectedCountry, values;
        var selectState = $('#'+this.component.key+'-selectstate');
        var selectCity = $('#'+this.component.key+'-selectcity');
        var state = '#'+this.component.key+'-selectstate'
        $('#'+this.component.key+'-selectcountry').change(function(e){
            console.log(selectState)
            selectedCountry = $(this).val()
            selectState.empty().append(`<option value = "" disabled selected >Select State</option>`);
            selectCity.val("")
            let obj = options.find(o => o.country === selectedCountry);
            if(obj){
                values = obj.states;
                arrayColumn(state,values);
            }
        })
        // if(this.data['address']['country'] && this.data['address']['state'] && this.data['address']['city'] )
        // {
        //     $('#city').val(this.data['address']['city']);
        //     $('#selectcountry').val(this.data['address']['country']);
        //     $('#selectstate').val(this.data['address']['state']);
        // }
    }
    /**
   * Set the value of the component into the dom elements.
   *
   * @param value
   * @returns {boolean}
   */
    setValue(value) {
        if (!value) {
            return;
        }
    }
   
}