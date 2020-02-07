import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/table/Table.form';

export default class DocumentViewerComponent extends Base {
  constructor(component, options, data) {
    component.core = null;
    component.appId = null;
    component.uiUrl = null;
    component.wrapperUrl = '<p> No Files to Display</p>';
    super(component, options, data);
    window.addEventListener('appDetails', function (e) {
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
    this.fileList = this.getFileList(this.dataValue);
    var dataValue = this.dataValue;
    var component = this.component
    this.redraw();
    if(dataValue && dataValue != undefined){
      var evt = new CustomEvent("getAppDetails", {detail:{} });
      window.dispatchEvent(evt);
      for (var prop in dataValue) {
        if(document.getElementById('selectFile_'+prop)){
          document.getElementById('selectFile_'+prop).addEventListener("click",function(event){
            var url;
            var fileUrl = dataValue[prop];
            var type = fileUrl.substr(fileUrl.lastIndexOf('.') + 1);
            if (type == "pdf") {
              url = component.uiUrl+"/ViewerJS/#" + component.wrapperUrl+component.appId+'/'+fileUrl;
            } else if (type == "image") {
              url = documentData;
            } else {
              url = component.uiUrl+"/ViewerJS/#" + component.wrapperUrl+component.appId+'/'+fileUrl;
            }
            console.log(url);
            document.getElementById('displayDocumentData').innerHTML = '<iframe src="'+url+'" class="iframeDoc" key="'+url+'"></iframe>';
            event.stopPropagation();
          },true);
        }
      }
    }
  }
  getFileList(files){
    var fileList = '';
    if(files){
      for (var prop in files) {
        fileList += `<div class="card docList" key="`+prop+`">
        <div class="card-body docListBody border" id="selectFile_`+prop+`">
       <br></br>`+files[prop].substring(files[prop].lastIndexOf('/')+1)+`
        </a>
        </div>
        </div>`;
      }
    } else {
      fileList = '<p> No Files to Display</p>';
    }
    return fileList;
  }

  render(children) {
    var row = `<div class="row" style="height: -webkit-fill-available" >
    <div class="col-md-2 docListDiv" >`+ this.fileList +`</div>
    <div class="col-md-10 border" id="displayDocumentData">
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