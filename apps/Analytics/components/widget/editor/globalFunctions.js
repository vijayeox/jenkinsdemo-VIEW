
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject
            this.resolve = resolve
        })
    }
}

window.oxzionEditor = null;
//CkEditor automatically calls window.onDialogEvent function when dialog events occur.
//Function must be named onDialogEvent - name is not configurable in CkEditor.
window.onDialogEvent = function(dialogEvent) {
    switch(dialogEvent.name) {
        case 'load':
            window.addEventListener('message', function(event) {
                handleAsyncResponse(event.data);
            }, false);
            window.top.postMessage({'action':'register'}, '*');
            //Dialog 'load' event contains reference to the editor opening this dialog.
            window.oxzionEditor = dialogEvent.editor;
            window.startWidgetEditorApp(window.oxzionEditor);
//IMPORTANT: Load available widget list here.
setTimeout(function() {
    window.sendAsyncRequest('http://localhost/a/b/c', {'name':'Mickey', 'age':25}).then(
        function(value) {
 console.log('promise resolved:');
 console.log(value);
        }).catch(
        function(value) {
console.log('promise rejected:');
console.log(value);
        });
}, 5000);
        break;
        case 'ok':
            //Reject 'ok' button click if user input validation fails.
            if (!window.widgetEditorApp.validateUserInput()) {
                throw 'User input validation failed.';
            }
            var data = window.widgetEditorApp.getState();
            if (!data) {
                data = {
                    'type':'block',
                    'id':'f5b8ee95-8da2-409a-8cf0-fa5b4af10667',
                    'align':'center',
                };
            }
            window.oxzionEditor.plugins.oxzion.acceptUserData(window.oxzionEditor, data);
        break;
    }
}

window.sendAsyncRequest = function(url, params) {
    if (window.deferred) {
        throw 'Another request is already in progress. Try later.';
    }
    window.deferred = new Deferred();
    window.top.postMessage({
        'action':'data', 
        'url':url, 
        'params':params
    });
    return deferred.promise;
}

window.handleAsyncResponse = function(response) {
    if (!window.deferred) {
        return;
    }
    switch(response.status) {
        case 'success':
            deferred.resolve(response);
        break;
        case 'failure':
            deferred.reject(response);
        break;
    }
    window.deferred = null;
}

