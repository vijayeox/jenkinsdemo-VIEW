import FormComponent from 'formiojs/components/form/Form'
import * as _utils from 'formiojs/utils/utils'

export default class Nested extends FormComponent { 

    constructor(component, options, data) {
        if(options.appId == null){
            options.core = options.root.core;
            options.appId = options.root.appId;
            options.uiUrl = options.root.uiUrl;
            options.formDivID = options.root.formDivID;
            options.wrapperUrl = options.root.wrapperUrl;
            if(options.parent && options.parent.root && options.parent.root.parent && options.parent.root.parent.appId){
                options.core = options.parent.root.parent.core;
                options.appId = options.parent.root.parent.appId;
                options.uiUrl = options.parent.root.parent.uiUrl;
                options.formDivID = options.parent.root.parent.formDivID;
                options.wrapperUrl = options.parent.root.parent.wrapperUrl;
            }
        }
        console.log(options);
        component.core = options.core;
        component.appId = options.appId;
        component.uiUrl = options.uiUrl;
        component.wrapperUrl = options.wrapperUrl;
        component.formDivID = options.formDivID;
        super(component, options, data);
        this.core = options.core;
        this.appId = options.appId;
        this.uiUrl = options.uiUrl;
        this.wrapperUrl = options.wrapperUrl;
        this.formDivID = options.formDivID;
        console.log(this);
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