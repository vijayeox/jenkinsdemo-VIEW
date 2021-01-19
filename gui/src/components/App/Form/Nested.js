import FormComponent from 'formiojs/components/form/Form'
import * as _utils from 'formiojs/utils/utils'

export default class Nested extends FormComponent { 

    constructor(component, options, data) {
        if((options.appId == null || options.appId == undefined)){
            options.core = options.root.options.core;
            options.appId = options.root.options.appId;
            options.uiUrl = options.root.options.uiUrl;
            options.formDivID = options.root.options.formDivID;
            options.wrapperUrl = options.root.options.wrapperUrl;
        }
        if((options.appId == null || options.appId == undefined)){
            options.core = options.parent.options.core;
            options.appId = options.parent.options.appId;
            options.uiUrl = options.parent.options.uiUrl;
            options.formDivID = options.parent.options.formDivID;
            options.wrapperUrl = options.parent.options.wrapperUrl;
        }
        component.core = options.core;
        component.appId = options.appId;
        component.uiUrl = options.uiUrl;
        component.wrapperUrl = options.wrapperUrl;
        component.formDivID = options.formDivID;
        super(component, options, data);
        options.root = this.root;
        this.core = options.core;
        this.appId = options.appId;
        this.uiUrl = options.uiUrl;
        this.wrapperUrl = options.wrapperUrl;
        this.formDivID = options.formDivID;
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