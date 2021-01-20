import FormComponent from 'formiojs/components/form/Form'
import * as _utils from 'formiojs/utils/utils';
import { Formio } from "formiojs";
import * as _lodash from "lodash";

export default class Nested extends FormComponent { 

    constructor(component, options, data) {
        var formOptions = Formio.getPlugin("options");
        var customOptions = _lodash.default.merge(options, formOptions);
        if(customOptions.core == null || customOptions.core == undefined){
            console.log(customOptions);
        }
        super(component, options, data);
    }
    beforePage(next) {
        this.component.reference = true;
        this.component.shouldSubmit = false;
        super.beforePage(next);
    }
    detach(){
        if(this.components){
            super.detach();
        }
    }
    shouldSubmit(){
        return false;
    }
    submitSubForm(rejectOnError){
        return this.getSubFormData();
    }
}