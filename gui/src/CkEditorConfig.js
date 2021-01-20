var ckeditorConfig = {
    extraPlugins: 'oxzion,wordcount,abbr,imagepaste,sourcedialog,autocorrect,autolink,tableresize,lineheight,texttransform,quicktable,preview',
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
ckeditorConfig.toolbarCanCollapse ='true';
ckeditorConfig.toolbarStartupExpanded = false;
ckeditorConfig.pasteFromWordRemoveFontStyles = false;
ckeditorConfig.pasteFromWordRemoveStyles = false;
ckeditorConfig.wordcount = {
    // Whether or not you want to show the Word Count
    showWordCount: false,
    // Whether or not you want to show the Char Count
    showCharCount: true,
     // Whether or not to include Html chars in the Char Count
    countHTML: true,
    charLimit: 300000,
    
};
ckeditorConfig.removeButtons = 'Underline,Subscript,Superscript,ShowBlocks,PageBreak,Save,NewPage,DocProps,Print,CreateDiv,Source';
ckeditorConfig.removePlugins = 'flash,iframe,ShowBlocks';
module.exports.ckeditorConfig = ckeditorConfig;