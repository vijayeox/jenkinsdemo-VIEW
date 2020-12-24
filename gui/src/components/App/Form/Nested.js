import FormComponent from 'formiojs/components/form/Form'
import * as _utils from 'formiojs/utils/utils'

export default class Nested extends FormComponent { 

    constructor(component, options, data) {
        console.log(component)
        super(component, options, data);
    }
    beforePage(next) {
        this.component.reference = true;
        this.component.shouldSubmit = false;
        super.beforePage(next);
    }
    shouldSubmit(){
        return false;
    }
    submitSubForm(rejectOnError){
        return this.getSubFormData();
    }
}