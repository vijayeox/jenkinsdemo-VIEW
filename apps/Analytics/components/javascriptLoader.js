
//Utility class for dynamically loading/unloading javascript libraries.
class JavascriptLoader {
    //Dynamically loads javascript libraries by inserting <script> tags in the document body.
    //Object structure of the objects in the scriptList is:
    //{
    //    'name':'<script library name>',
    //    'url':'<URL of javascript library file>',
    //    'onload':function() {}, //Function to call when the library is successfully loaded. This is optional.
    //    'onerror':function(){}, //Function to call when the library loading fails. This is optional.
    //    'onunload':function(){} // Function to call when the library is unloaded/removed [This property is used by unloadScript]. This is optional.
    //}
    static loadScript(scriptList) {
        var script = scriptList.shift();
        var scriptTag = document.querySelector('script#' + script['name']);
        if (!scriptTag) {
            console.debug('Loading script ' + script['name'] + ' from ' + script['url']);
            scriptTag = document.createElement('script');
            scriptTag.setAttribute('src', script['url']);
            scriptTag.setAttribute('id', script['name']);
            scriptTag.onload = function() {
                console.debug('Loaded script ' + script['name'] + ' from ' + script['url']);
                var onloadFn = script['onload'];
                if (onloadFn) {
                    onloadFn();
                }
                if (scriptList.length > 0) {
                    JavascriptLoader.loadScript(scriptList);
                }
            };
            scriptTag.onerror = function() {
                console.error('Failed to load script ' + script['name'] + ' from ' + script['url']);
                var onerrorFn = script['onerror'];
                if (onerrorFn) {
                    onerrorFn();
                }
            };
            document.body.appendChild(scriptTag);
        }
        else {
            console.debug('Script ' + script['name'] + ' from ' + script['url'] + ' is already loaded.');
            var onloadFn = script['onload'];
            if (onloadFn) {
                onloadFn();
            }
            if (scriptList.length > 0) {
                JavascriptLoader.loadScript(scriptList);
            }
        }
    }

    //Dynamically unloads/removes <script> tags. See loadScript method for the definition of the objects provided in scriptList parameter.
    static unloadScript(scriptList) {
        scriptList.forEach(function(script, index) {
            var scriptTag = document.querySelector('script#' + script['name']);
            if (scriptTag) {
                document.body.removeChild(scriptTag);
                console.debug('Unloaded script ' + script['name'] + ' from ' + script['url']);
            }
            else {
                console.debug('Script ' + script['name'] + ' from ' + script['url'] + ' was not found loaded; therefore not unloaded.');
            }
            var unloadFn = script['onunload'];
            if (unloadFn) {
                unloadFn();
            }
        });
    }
}

export default JavascriptLoader;

