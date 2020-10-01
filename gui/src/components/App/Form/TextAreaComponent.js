import Select from 'formiojs/components/textarea/TextArea'
import * as _utils from 'formiojs/utils/utils'
import * as _Formio from 'formiojs/Formio'
import * as _lodash from "lodash";
import * as _nativePromiseOnly from "native-promise-only";
import JavascriptLoader from '../../javascriptLoader';

export default class TextAreaComponent extends Select {

    constructor(component, options, data) {
        super(component, options, data);
        component.core = null;
        component.appId = null;
        component.uiUrl = null;
        this.form = this.getRoot();
        var that = this;
        if (that.form && that.form.element) {
            that.form.element.addEventListener("appDetails", function(e) {
                component.core = e.detail.core;
                component.appId = e.detail.appId;
                component.uiUrl = e.detail.uiUrl;
                component.wrapperUrl = e.detail.wrapperUrl;
            }, true);
            var evt = new CustomEvent("getAppDetails", {
                detail: {}
            });
            that.form.element.dispatchEvent(evt);
        }
    }
    attachElement(element, index) {
        var evt = new CustomEvent("getAppDetails", {
            detail: {}
        });
        this.form.element.dispatchEvent(evt);
        var _this2 = this;

        if (this.autoExpand && (this.isPlain || this.options.readOnly || this.options.htmlView)) {
            if (element.nodeName === 'TEXTAREA') {
                this.addAutoExpanding(element, index);
            }
        }

        if (this.options.readOnly) {
            return element;
        }

        if (this.component.wysiwyg && !this.component.editor) {
            this.component.editor = 'ckeditor';
        }

        var settings = _lodash.default.isEmpty(this.component.wysiwyg) ? this.wysiwygDefault[this.component.editor] || this.wysiwygDefault.default : this.component.wysiwyg; // Keep track of when this editor is ready.

        this.editorsReady[index] = new _nativePromiseOnly.default(function(editorReady) {
            // Attempt to add a wysiwyg editor. In order to add one, it must be included on the global scope.
            switch (_this2.component.editor) {
                case 'ace':
                    if (!settings) {
                        settings = {};
                    }

                    settings.mode = _this2.component.as;

                    _this2.addAce(element, settings, function(newValue) {
                        return _this2.updateEditorValue(index, newValue);
                    }).then(function(ace) {
                        _this2.editors[index] = ace;
                        var dataValue = _this2.dataValue;
                        dataValue = _this2.component.multiple && Array.isArray(dataValue) ? dataValue[index] : dataValue;
                        ace.setValue(_this2.setConvertedValue(dataValue, index));
                        editorReady(ace);
                        return ace;
                    }).catch(function(err) {
                        return console.warn(err);
                    });

                    break;

                case 'quill':
                    // Normalize the configurations for quill.
                    if (settings.hasOwnProperty('toolbarGroups') || settings.hasOwnProperty('toolbar')) {
                        console.warn('The WYSIWYG settings are configured for CKEditor. For this renderer, you will need to use configurations for the Quill Editor. See https://quilljs.com/docs/configuration for more information.');
                        settings = _this2.wysiwygDefault.quill;
                    } // Add the quill editor.


                    _this2.addQuill(element, settings, function() {
                        return _this2.updateEditorValue(index, _this2.editors[index].root.innerHTML);
                    }).then(function(quill) {
                        _this2.editors[index] = quill;

                        if (_this2.component.isUploadEnabled) {
                            var _this = _this2;
                            quill.getModule('toolbar').addHandler('image', function() {
                                //we need initial 'this' because quill calls this method with its own context and we need some inner quill methods exposed in it
                                //we also need current component instance as we use some fields and methods from it as well
                                _this.imageHandler.call(_this, this);
                            });
                        }

                        quill.root.spellcheck = _this2.component.spellcheck;

                        if (_this2.options.readOnly || _this2.component.disabled) {
                            quill.disable();
                        }

                        var dataValue = _this2.dataValue;
                        dataValue = _this2.component.multiple && Array.isArray(dataValue) ? dataValue[index] : dataValue;
                        quill.setContents(quill.clipboard.convert({
                            html: _this2.setConvertedValue(dataValue, index)
                        }));
                        editorReady(quill);
                        return quill;
                    }).catch(function(err) {
                        return console.warn(err);
                    });

                    break;

                case 'ckeditor':
                    JavascriptLoader.loadScript([{
                        'name': 'ckEditorJs',
                        'url': './ckeditor/ckeditor.js',
                        'onload': function() {
                            _this2.setupCkEditor(_this2, element, index,editorReady);
                        },
                        'onerror': function() {}
                    }]);
                    //Without this setting CKEditor removes empty inline widgets (which is <span></span> tag).

                    // editorReady(editor);
                    // return editor;

                    break;

                default:
                    _get(_getPrototypeOf(TextAreaComponent.prototype), "attachElement", _this2).call(_this2, element, index);

                    break;
            }
        });
        return element;
    }
    setupCkEditor = (_this2, element, index,editorReady) => {
        CKEDITOR.dtd.$removeEmpty['span'] = false;
        const settings = {
            rows: _this2.component.rows,
            extraPlugins: 'oxzion,autogrow',
            autoGrow_minHeight: 250,
            autoGrow_maxHeight: 400,
            height: 400,
            width: '100%',
            //IMPORTANT: Need this setting to retain HTML tags as we want them. Without this setting, 
            //CKEDITOR removes tags like span and flattens HTML structure.
            allowedContent: true,
            //extraAllowedContent:'span(*)',
            oxzion: {
                dimensions: {
                    begin: {
                        width: 300,
                        height: 200
                    },
                    min: {
                        width: 100,
                        height: 100
                    },
                    max: {
                        width: '100%',
                        height: 600,
                    }
                },
                dialogUrl: './widgetEditorDialog.html'
            }
        };
        let editor = CKEDITOR.appendTo(element, settings, function(newValue) {
            console.log(newValue);
            return _this2.updateEditorValue(index, newValue);
        });
        _this2.editors[index] = editor;
        var dataValue = _this2.dataValue;
        dataValue = _this2.component.multiple && Array.isArray(dataValue) ? dataValue[index] : dataValue;

        var value = _this2.setConvertedValue(dataValue, index);

        var isReadOnly = _this2.options.readOnly || _this2.component.disabled;

        if ((0, _utils.getIEBrowserVersion)()) {
            editor.on('instanceReady', function() {
                editor.setReadOnly(isReadOnly);
                editor.setData(value);
            });
        } else {
            var numRows = parseInt(_this2.component.rows, 10);

            if (_lodash.default.isFinite(numRows) && _lodash.default.has(editor, 'ui.view.editable.editableElement')) {
                // Default height is 21px with 10px margin + a 14px top margin.
                var editorHeight = numRows * 31 + 14;
                editor.ui.view.editable.editableElement.style.height = "".concat(editorHeight, "px");
            }

            editor.isReadOnly = isReadOnly;
            if (editor.data) {
                editor.data.set(value);
            } else {
              editor.setData(value);
            }
        }
        editor.on('change', function (event) {
          console.log(event);
          return _this2.updateEditorValue(index, event.editor.getData());
        });
        editorReady(editor);
        return editor;
    }
}