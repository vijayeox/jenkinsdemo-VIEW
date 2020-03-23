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
    onChange(flags, fromRoot){
      var dataValue = this.dataValue;
      if(typeof dataValue == 'string'){
       dataValue = JSON.parse(dataValue);
     }
     var component = this.component
     var that =this;
     var evt = new CustomEvent("getAppDetails", {detail:{} });
     this.form.element.dispatchEvent(evt);
     this.fileList = this.getFileList(dataValue,component);
     this.redraw();
     if(dataValue && dataValue != undefined){
      var elements = document.getElementsByClassName("selectFile");
      Array.from(elements).forEach(function(element) {
        element.addEventListener('click', function(event){
          var file = this.parentElement.parentElement.getAttribute("data-file");

          var url = this.parentElement.getAttribute("data-url");
          if(!url){
            url = this.parentElement.parentElement.getAttribute("data-url");
          }
          document.getElementById('filePreviewModal').style.display = "block";
          document.getElementById('filePreviewModal').style.height = that.form.element.parentElement.parentElement.clientHeight + 'px';
          document.getElementById('filePreviewWindow').innerHTML = '<iframe src="'+url+'" allowTransparency="true" frameborder="0" scrolling="yes" style="width:100%;height:100%;" class="iframeDoc" key="'+url+'"></iframe>';
          event.stopPropagation();
        });
      });
      var downloadElements = document.getElementsByClassName("downloadFile");
      Array.from(downloadElements).forEach(function(element) {
        element.addEventListener('click', function(event){
          var url = this.parentElement.parentElement.getAttribute("data-downloadurl");
          window.open(url,'_blank');
          event.stopPropagation();
        });
      });
      if(document.getElementById('closeFile')){
        document.getElementById('closeFile').addEventListener('click', function(event){
          document.getElementById('filePreviewModal').style.display='none'
        });
      }
    }
  }
  getFileList(files,component){
    var fileList = '';
    if(files){
      for (var prop in files) {
        var type = files[prop].substr(files[prop].lastIndexOf('.') + 1);
        var url = '';
        var icon = "<i class='fa fa-file-o'></i>";
        if (type == "pdf") {
          url = component.uiUrl+"/ViewerJS/#" + component.wrapperUrl+component.appId+'/'+files[prop];
          icon = "<i class='fa fa-file-pdf-o'></i>";
        } else if (type == "image") {
          url = documentData;
          icon = "<i class='fa fa-picture-o'></i>";
        } else {
          url = component.uiUrl+"/ViewerJS/#" + component.wrapperUrl+component.appId+'/'+files[prop];
        }
        fileList += `<div class="docList" key="`+prop+`">
        <div class="fileDiv"><div class="singleFile row" id="selectFile_`+prop+`" data-downloadurl="`+component.wrapperUrl+component.appId+'/'+files[prop]+`" data-file="`+prop+`" data-url="`+url+`"><span class="col-md-10 selectFile" style="line-height: 1.5; vertical-align: middle;padding: .375rem .75rem;">`+icon+' '+files[prop].substring(files[prop].lastIndexOf('/')+1)+`</span><span class="col-md-1"><button class="btn btn-sm btn-info selectFile" ><i class="fa fa-eye"></i></button></span><span class="col-md-1"><button class="btn btn-sm btn-info downloadFile" style="margin-left:5px;" ><i class="fa fa-download"></i></button>
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
    <div id="filePreviewModal" class="modal" style="position:absolute">
    <div style="height:inherit;display: block;background-color: white;">
    <span id="closeFile" class="close" style="font-size:2em">&times;</span>
    <div id="filePreviewWindow" style="height:inherit"></div>
    </div>
    </div>`;
    var content = super.render(row);
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