import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
const loadScript = require('load-script');


class CKEditor extends React.Component {
    constructor(props) {
        super(props);
        //Bindings
        this.onLoad = this.onLoad.bind(this);
        //State initialization
        this.state = {
            element: this.props.element?this.props.element:ReactDOM.findDOMNode(this),
            isScriptLoaded: props.isScriptLoaded
        };
    }
    
    //load ckeditor script as soon as component mounts if not already loaded
    componentDidMount() {
        if (!this.state.isScriptLoaded) {
            loadScript(this.props.scriptUrl, this.onLoad);
        } else {
            this.onLoad();
        }
    }
    
    componentWillReceiveProps(props) {
        const editor = this.editorInstance;
        if (editor && editor.getData() !== props.content) {
            editor.setData(props.content);
        }
    }
    
    componentWillUnmount() {
        this.unmounting = true;
    }
    
    onLoad() {
        if (this.unmounting) return;
        
        this.setState({
            isScriptLoaded: true
        });
        
        if (!window.CKEDITOR) {
            console.error('CKEditor not found');
            return;
        }
        
        this.editorInstance = window.CKEDITOR.appendTo(
            this.state.element,
            this.props.config,
            this.props.content
            );
            
            //Register listener for custom events if any
            for (var event in this.props.events) {
                var eventHandler = this.props.events[event];
                
                this.editorInstance.on(event, eventHandler);
            }
        }
        
        render() {
            return <div className={this.props.activeClass} />;
        }
    }
    
    CKEditor.defaultProps = {
        content: '',
        config: {
            rows: 4,
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
        },
        isScriptLoaded: false,
        scriptUrl: './ckeditor/ckeditor.js',
        activeClass: '',
        events: {}
    };
    
    CKEditor.propTypes = {
        content: PropTypes.any,
        config: PropTypes.object,
        isScriptLoaded: PropTypes.bool,
        scriptUrl: PropTypes.string,
        activeClass: PropTypes.string,
        events: PropTypes.object
    };
    
    export default CKEditor;