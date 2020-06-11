import Base from 'formiojs/components/_classes/component/Component'
import editForm from 'formiojs/components/table/Table.form'
import $ from 'jquery';
import Components from 'formiojs/components/Components';


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
          label:'radioCard',
          input: false,
          persistent: false,
        });
    }
    
    static builderInfo = {
        title: 'Radiocard',
        group: 'Custom',
        icon: 'fa fa-square',
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
        let defaultRange = that.data[this.component.key+"-defaultRange"].split(",").map(i => +i);
        console.log(defaultRange)
        for(let i = 0 ; i< defaultRange.length; i++) {
            let cell = '<div class="col-md-2">'
            cell += `<label class="labels">
                        <input id="${this.component.key}-${i}" name="${this.component.key}" type="radio" name="product" class="card-input-element" value="${defaultRange[i]}" />
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
        if(this.dataValue){
            $('input[type=radio][name='+this.component.key+'][value=' + this.dataValue + ']').prop("checked",true);
            this.updateValue(this.dataValue);
        }
      
        
        if(this.component.range){
            var defaultRange = this.data[this.component.key+"-defaultRange"].split(",").map(i => +i);
            for(let i = 0 ; i< defaultRange.length; i++) { 
                if(!this.component.range.includes(defaultRange[i])){
                    $('input[type=radio][name='+this.component.key+'][value=' + defaultRange[i] + ']').prop("disabled",true);
                }
            }
        }
        
        if(this.data['rangeValue']){
            $('input[type=radio][name='+this.component.key+'][value=' + this.data['rangeValue'] + ']').prop("checked",true);
            this.updateValue(this.data['rangeValue'])
        }
    
        element.addEventListener("click", (e) => this.updateValue(e.target.value))
        
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
Components.addComponent('radiocard', RadioCardComponent);
     