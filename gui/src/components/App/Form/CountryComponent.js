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
                ref: `selectcountry`,
                name: 'selectcountry',
                id : "selectcountry",
                attr: {
                    key:'selectcountry',
                    id:'selectcountry',
                    hideLabel: 'true',
                    class:"form-control",
                },
            }
        });
        var state = this.renderTemplate('input', { 
            input: {
                type: 'select',
                ref: `selectstate`,
                name: 'selectstate',
                id : "selectstate",
                attr: {
                    key:'selectstate',
                    id:'selectstate',
                    hideLabel: 'true',
                    class:"form-control",
                },
            }
        });
        var city = this.renderTemplate('input', { 
            input: {
                type: 'input',
                ref: `city`,
                name: 'city',
                id : "city",
                attr: {
                    key:'city',
                    id:'city',
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
        document.getElementById("selectcountry").addEventListener("input" , (e) => this.updateValue({country: e.target.value}));
        document.getElementById("selectstate").addEventListener("input" , (e) => this.updateValue({...this.data['address'],state: e.target.value}));
        document.getElementById("city").addEventListener("input" , (e) => this.updateValue({...this.data['address'],city: e.target.value}));
        
        $('#selectcountry').append(`<option value = "" disabled selected >Select Country</option>`);
        $('#selectstate').append(`<option value = "" disabled selected >Select State</option>`)
        console.log(this.data["address"])
        var options = Country.countryList;
        arrayColumn('#selectcountry',options,'country');
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
        $('#selectcountry').change(function(e){
            selectedCountry = $(this).val()
            $('#selectstate').empty().append(`<option value = "" disabled selected >Select State</option>`);
            $('#city').val("")
            let obj = options.find(o => o.country === selectedCountry);
            if(obj){
                values = obj.states;
                arrayColumn('#selectstate',values);
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