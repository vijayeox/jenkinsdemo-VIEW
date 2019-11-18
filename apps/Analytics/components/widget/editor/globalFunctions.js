import Swal from "sweetalert2";
import '../../../../../gui/src/public/css/sweetalert.css';

class Deferred {
    static deferredRegistry = {};

    constructor() {
        this.corrId = Deferred.generateUUID();
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject; //Here this refers to Deferred instance's this, not Promise instance's this.
            this.resolve = resolve; //Here this refers to Deferred instance's this, not Promise instance's this.
        });
        Deferred.deferredRegistry[this.corrId] = this;
        //console.log(Deferred.deferredRegistry);
    }

    static generateUUID() { // Public Domain/MIT
        let d = new Date().getTime();//Timestamp
        let d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){  //Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {    //Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    static getFromRegistry(corrId) {
        let deferred = Deferred.deferredRegistry[corrId];
        if (deferred) {
            delete Deferred.deferredRegistry[corrId];
            //console.log(Deferred.deferredRegistry);
        }
        return deferred;
    }
}

window.oxzionEditor = null;
//CkEditor automatically calls window.onDialogEvent function when dialog events occur.
//Function must be named onDialogEvent - name is not configurable in CkEditor.
window.onDialogEvent = function(dialogEvent) {
    switch(dialogEvent.name) {
        case 'load':
            window.addEventListener('message', function(event) {
                window.handleDataResponse(event.data);
            }, false);
            //Dialog 'load' event contains reference to the editor opening this dialog.
            window.oxzionEditor = dialogEvent.editor;
            window.startWidgetEditorApp(window.oxzionEditor);
            window.validationCompleted = false;
        break;
        case 'ok':
            console.debug(`window.validationCompleted : ${window.validationCompleted}`);
            function closeDialogWindow(data) {
                window.oxzionEditor.plugins.oxzion.acceptUserData(window.oxzionEditor, data);
                window.validationCompleted = true;
                let buttons = window.parent.document.getElementsByClassName('cke_dialog_ui_button_ok');
                if (!buttons || (0 === buttons.length)) {
                    console.error('Failed to locate CkEditor dialog close button.');
                }
                let button = buttons[0];
                button.click();
            }

            if (window.validationCompleted) {
                return;
            }
            else {
                let widgetEditorApp = window.widgetEditorApp;
                widgetEditorApp.hasUserInputErrors(true).then(function(hasErrors) {
                    console.debug(`hasUserInputErrors promise fulfilled with '${hasErrors}'`);
                    if (hasErrors) {
                        console.debug('User input has errors. Dont close the dialog.');
                    }
                    else {
                        if (widgetEditorApp.isEdited()) {
                            console.debug('Save widget and close the dialog if widget save is successful.');
                            widgetEditorApp.saveWidget().
                                then(function(response) {
                                    let data = widgetEditorApp.getWidgetStateForCkEditorPlugin();
                                    data['id'] = response.newWidgetUuid;
                                    closeDialogWindow(data);
                                }).
                                catch(function(response) {
                                    console.error(response);
                                    Swal.fire({
                                        type: 'error',
                                        title: 'Oops ...',
                                        text: 'Could not save the widget. Please try after some time.'
                                    });
                                    throw 'Could not save the widget. Please try after some time.';
                                });
                        }
                        else {
                            console.debug('No changes made in dialog. Just update widget state in the dashboard and close dialog.');
                            let data = widgetEditorApp.getWidgetStateForCkEditorPlugin();
                            closeDialogWindow(data);
                        }
                    }
                });
                throw 'Waiting for validation to complete and save widget. Threw exception to prevent dialog window closure.';
            }
        break;
    }
}

const OXZION_CORRELATION_ID = 'OX_CORR_ID';
window.postDataRequest = function(url, params, method) {
    let deferred = new Deferred();
    if (!params) {
        params = {};
    }
    params[OXZION_CORRELATION_ID] = deferred.corrId;
    var message = {
        'action':'data', 
        'url':url,
        'params':params
    };
    if (method) {
        message['method'] = method;
    }
    window.top.postMessage(message);
    return deferred.promise;
}

window.handleDataResponse = function(response) {
    let corrId = response.params[OXZION_CORRELATION_ID];
    if (!corrId) {
        throw `Response object does not contain ${OXZION_CORRELATION_ID} parameter.`;
    }
    delete response.params[OXZION_CORRELATION_ID];
    let deferred = Deferred.getFromRegistry(corrId);
    if (!deferred) {
        console.warn('No deferred instance found. Unexpected REST response found:');
        console.warn(response);
        return;
    }
    switch(response.status) {
        case 'success':
            deferred.resolve(response);
        break;
        case 'error':
        case 'failure':
            deferred.reject(response);
        break;
    }
}

