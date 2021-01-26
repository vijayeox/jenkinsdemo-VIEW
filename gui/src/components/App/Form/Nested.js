import FormComponent from 'formiojs/components/form/Form'
import * as _utils from 'formiojs/utils/utils';
import { Formio } from "formiojs";
import * as _lodash from "lodash";

export default class Nested extends FormComponent { 

    constructor(component, options, data) {
        var formOptions = Formio.getPlugin("optionsPlugin");
        var customOptions = _lodash.default.merge(options, formOptions.options);
        if(customOptions.core == null || customOptions.core == undefined){
            console.log(customOptions);
        }
        super(component, customOptions, data);
        this.customOptions = customOptions;
        this.appId = customOptions.appId;
        this.parentData = [];
        this.formDivID = customOptions.formDivID;
    }
    getSubOptions(){
        var defaultOptions = super.getSubOptions();
        defaultOptions.appId = this.appId;
        defaultOptions.formDivID = this.formDivID;
        var customOptions = _lodash.default.merge(defaultOptions, this.customOptions);
        return customOptions;
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