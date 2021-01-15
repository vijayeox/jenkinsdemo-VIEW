import FormComponent from 'formiojs/components/form/Form'
import * as _utils from 'formiojs/utils/utils'

export default class Nested extends FormComponent { 

    constructor(component, options, data) {
        super(component, options, data);
        this.parentData = this.root._data;
        var that = this;
        var root = this.getRoot();
        var element;
        if (root && root.element) {
            element = root.element;
        }
        if(root && root.root && root.root.parent && root.root.parent.root && root.root.parent.root.element && element == null){
            element = root.root.parent.root.element;
        }
        if(that.parent && that.parent.root && that.parent.root.element && element == null){
            element = that.parent.root.element;
        }
        if(that.parent && that.parent.rootElement && element == null){
            element = that.parent.rootElement;
        }
        if(root.root && root.root.element && element == null){
            element = root.root.element;
        }
        if(root.parent && root.parent.element && element == null){
            element = root.parent.element;
        }
        if(that.root && that.root.element && element == null){
            element = that.root.element;
        }
        if(element){
            element.addEventListener("appDetails", function(e) {
                component.core = e.detail.core;
                component.appId = e.detail.appId;
                component.uiUrl = e.detail.uiUrl;
                component.wrapperUrl = e.detail.wrapperUrl;
                that.rootElement = e.detail.element;
            }, true);
            if(component.core == null){
                var evt = new CustomEvent("getAppDetails", {
                    detail: {}
                });
                element.dispatchEvent(evt);
            }
            that.rootElement = element;
        }
    }
    beforePage(next) {
        this.component.reference = true;
        this.component.shouldSubmit = false;
        super.beforePage(next);
    }
    shouldSubmit(){
        return false;
    }
    loadSubForm(){
      var _this4 = this;
      console.log(this);
      return super.loadSubForm();
    }
    attach(element){
        console.log(element);
        return super.attach(element);
    }
    submitSubForm(rejectOnError){
        return this.getSubFormData();
    }
}