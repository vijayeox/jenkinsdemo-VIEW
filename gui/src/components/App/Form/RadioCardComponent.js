import Base from 'formiojs/components/_classes/component/Component'
import editForm from 'formiojs/components/table/Table.form'

export default class RadioCardComponent extends Base {
    constructor(component, options, data) {
        super(component, options, data);
        this.data = data;
        this.form = this.getRoot();
        var that = this;
        console.log(that.form.element)
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
        let content = '';
        let component = '<div class="row">';
        for(let i = 0 ; i< this.component.paymentTerm.length; i++) {
            let cell = '<div class="col-md-2">'
            cell += `<label class="labels">
                        <input type="radio" name="product" class="card-input-element" value={${this.component.paymentTerm[i]}} />
                        <div class="card card-input">
                            <div class="card-body" style="text-align: center">
                                ${this.component.paymentTerm[i]}
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
   
}