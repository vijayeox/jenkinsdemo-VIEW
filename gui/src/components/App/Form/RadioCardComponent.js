import Base from 'formiojs/components/_classes/component/Component'
import editForm from 'formiojs/components/table/Table.form'
import $ from 'jquery';
import { element } from 'prop-types';

export default class RadioCardComponent extends Base {
    constructor(component, options, data) {
        super(component, options, data);
        this.data = data;
        this.form = this.getRoot();
        var that = this;
   
    }
    static schema() {
        return Base.schema({
          type: 'radiocard',
          label:'radioCard'
        });
    }
    
    static builderInfo = {
        title: 'radiocard',
        group: 'basic',
        icon: 'fa fa-calender',
        weight: 70,
        schema: RadioCardComponent.schema()
    }
    static editForm = editForm
    /**
   * Render returns an html string of the fully rendered component.
   *
   * @param children - If this class is extendended, the sub string is passed as children.
   * @returns {string}
   */
    render(children) { 
        let that = this;
        let content = '';
        let component = '<div class="row">';
        let defaultRange = that.data["defaultRange"].split(",").map(i => +i);
        for(let i = 0 ; i< defaultRange.length; i++) {
            // disabled[i] = that.component.range.includes(defaultRange[i])
            let cell = '<div class="col-md-2">'
            cell += `<label class="labels">
                        <input id="${i}" type="radio" name="product" class="card-input-element" value="${defaultRange[i]}" />
                        <div class="card card-input">
                            <div class="card-body" style="text-align: center">
                                ${defaultRange[i]}
                                Months
                            </div>
                        </div>
                    </label>`
            cell += '</div>'
            content += cell;
        }
        component += content;
        component += '</div>'
        return super.render(`
            <div class="container">
                ${component}
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
        $('input[type=radio][value=' + this.data['rangeValue'] + ']').prop("checked",true);
        element.addEventListener("click", (e) => this.updateValue(e.target.value))
        if(this.component.range){
            var defaultRange = this.data["defaultRange"].split(",").map(i => +i);
            for(let i = 0 ; i< defaultRange.length; i++) { 
                if(!this.component.range.includes(defaultRange[i])){
                    $('input[type=radio][value=' + defaultRange[i] + ']').prop("disabled",true);
                }
            }
        }
        
        if(this.data['rangeValue']){
            $('input[type=radio][value=' + this.data['rangeValue'] + ']').prop("checked",true);
            this.updateValue(this.data['rangeValue'])
        }
        
        return super.attach(element);
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