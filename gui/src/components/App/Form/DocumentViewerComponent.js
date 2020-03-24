import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form';

export default class DocumentViewerComponent extends Base {
  constructor(component, options, data) {
    super(component, options, data);
    component.core = null;
    component.appId = null;
    component.uiUrl = null;
    this.form = this.getRoot();
    var that = this;
    component.wrapperUrl = '<p> No Files to Display</p>';
    that.form.element.addEventListener('appDetails', function (e) {
      component.core = e.detail.core;
      component.appId = e.detail.appId;
      component.uiUrl = e.detail.uiUrl;
      component.wrapperUrl = e.detail.wrapperUrl;
    },true);
  }
  static schema(...extend) {
    return Base.schema({
      label: 'documentviewer',
      type: 'documentviewer'
    }, ...extend);
  }
   setValue(value) {
    this.value = JSON.stringify(value);
    this.dataValue = JSON.stringify(value);
  }
  get defaultSchema() {
    return DocumentViewerComponent.schema();
  }
  static builderInfo = {
    title: 'Document',
    group: 'basic',
    icon: 'fa fa-file',
    weight: 70,
    schema: DocumentViewerComponent.schema()
  }
  // onChange(flags, fromRoot){
    bindHandlers(){
      var component = this.component
      if(component.bindHandlers){
        return;
      }      
      var dataValue = this.dataValue;
      if(typeof dataValue == 'string'){
       dataValue = JSON.parse(dataValue);
     }
     // var component = this.component
     var that =this;
     var evt = new CustomEvent("getAppDetails", {detail:{} });
     this.form.element.dispatchEvent(evt);
     this.fileList = this.getFileList(dataValue,component);
     this.redraw();
     if(dataValue && dataValue != undefined){
      var elements = document.getElementsByClassName(component.key + "-selectFile");
      if(elements.length > 0){
        component.bindHandlers = true;
      }
      Array.from(elements).forEach(function(element) {
        element.addEventListener('click', function(event){
          var file = this.parentElement.parentElement.getAttribute("data-file");

          var url = this.parentElement.getAttribute("data-url");
          if(!url){
            url = this.parentElement.parentElement.getAttribute("data-url");
          }
          document.getElementById(component.key + '-filePreviewModal').style.display = "block";
          // document.getElementById(component.key + '-filePreviewModal').style.height = that.form.element.parentElement.parentElement.clientHeight + 'px';

          var fileType = this.parentElement.parentElement.getAttribute("data-type");
          console.log(fileType);
          if(fileType == 'png' || fileType == 'jpeg' || fileType == 'jpg'){
              document.getElementById(component.key + '-filePreviewWindow').innerHTML = '<img src="'+url+'" style="width:100%;height:100%;" key="'+url+'"></img>';            
          }else{
              document.getElementById(component.key + '-filePreviewWindow').innerHTML = '<iframe src="'+url+'" allowTransparency="true" frameborder="0" scrolling="yes" style="width:100%;height:100%;" class="iframeDoc" key="'+url+'"></iframe>';
          }          
          event.stopPropagation();
        });
      });
      var downloadElements = document.getElementsByClassName(component.key + "-downloadFile");
      Array.from(downloadElements).forEach(function(element) {
        element.addEventListener('click', function(event){
          var url = this.parentElement.parentElement.getAttribute("data-downloadurl");
          window.open(url,'_blank');
          event.stopPropagation();
        });
      });
      var closeFile = document.getElementById(component.key + '-closeFile');
      if(closeFile){
        closeFile.addEventListener('click', function(event){
          document.getElementById(component.key + '-filePreviewModal').style.display='none'
        });
      }
    }
  }
  getFileList(files,component){
    var fileList = '';
    if(files){
      for (var prop in files) {
        var file = (files[prop]['file']) ? files[prop]['file'] : files[prop];
        var fileName = (files[prop]['originalName']) ? files[prop]['originalName'] : file.substring(file.lastIndexOf('/')+1);
        var type = (file.substr(file.lastIndexOf('.') + 1));
        var url = '';
        var icon = "<i class='fa fa-file-o'></i>";
        if (type == "pdf") {
          url = component.uiUrl+"/ViewerJS/#" + component.wrapperUrl+component.appId+'/'+file;
          icon = "<i class='fa fa-file-pdf-o'></i>";
        } else {
          url = component.wrapperUrl+component.appId+'/'+file;
          icon = "<i class='fa fa-picture-o'></i>";
        } 
        // else {
        //   url = component.wrapperUrl+"/"+component.appId+'/'+file;
        //   window.open(url, "_self");
        // }
        fileList += `<div class="docList" key="`+prop+`">
        <div class="fileDiv">
        <div class="singleFile row" id="selectFile_`+prop+`" data-downloadurl="`+component.wrapperUrl+component.appId+'/'+file+`" data-file="`+prop+`" data-type="`+type+`" data-url="`+url+`"><span class="col-md-10 `+ component.key + `-selectFile" style="line-height: 1.5; vertical-align: middle;padding: .375rem .75rem;">`+icon+' '+fileName+`</span><span class="col-md-1"><button class="btn btn-sm btn-info `+component.key+ `-selectFile" ><i class="fa fa-eye"></i></button></span><span class="col-md-1"><button class="btn btn-sm btn-info `+component.key+ `-downloadFile" style="margin-left:5px;" ><i class="fa fa-download"></i></button>
        </span></div></div>
        </div>`;
      }
    } else {
      fileList = '<p> No Files to Display</p>';
    }
    return fileList;
  }

  render(children) {
    var fileList = this.fileList?this.fileList:null;
    var row = `<div class="row" style="padding: 15px;" >
    <div class="col-md-12" >`+ fileList +`</div>
    </div>
    <div id="`+this.component.key+`-filePreviewModal" class="modal">
    <div style="height:inherit;display: block;background-color: white;">
    <span id="`+this.component.key+`-closeFile" class="close" style="font-size:2em">&times;</span>
    <div id="`+this.component.key+`-filePreviewWindow" style="height:inherit"></div>
    </div>
    </div>`;
    var content = super.render(row);
    var that = this;
    setTimeout(function(){
     that.bindHandlers();
   },200);
    return content;
  }

  attach(element) {
    return super.attach(element);
  }
  static editForm = editForm

  elementInfo() {
    const info = super.elementInfo();
    info.type = 'input';
    info.attr.type = 'hidden';
    info.changeEvent = 'change';
    return info;
  }
  build(element) {
    super.build(element);
  }
}