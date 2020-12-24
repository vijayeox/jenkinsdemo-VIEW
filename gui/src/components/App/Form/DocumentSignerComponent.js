import Base from "formiojs/components/_classes/component/Component";
import editForm from "formiojs/components/table/Table.form";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import $ from 'jquery'

export default class DocumentSignerComponent extends Base {
  constructor(component, options, data) {
    super(component, options, data);
    component.core = null;
    component.appId = null;
    component.uiUrl = null;
    this.data=data;
    this.form = this.getRoot();
    
    var that = this;
    if(that.form && that.form.element){
      that.form.element.addEventListener("appDetails", function(e) {
        component.core = e.detail.core;
        component.appId = e.detail.appId;
        component.uiUrl = e.detail.uiUrl;
        component.wrapperUrl = e.detail.wrapperUrl;
      },true);
      var evt = new CustomEvent("getAppDetails", { detail: {} });
      that.form.element.dispatchEvent(evt);

      this.formList=[{name:"document1",status:"unsigned"},{name:"document2",status:"signed"},{name:"document3",status:"unsigned"}]
  }
  }

  //disable
  static schema(...extend) {
    return Base.schema(
      {
        label: "documentsigner",
        type: "documentsigner"
      },
      ...extend
    );
  }
  setValue(value) {
    this.value = JSON.stringify(value);
    this.dataValue = JSON.stringify(value);
  }
  get defaultSchema() {
    return DocumentSignerComponent.schema();
  }
  static builderInfo = {
    title: "Document Signer",
    group: "basic",
    icon: "fa fa-file",
    weight: 70,
    schema: DocumentSignerComponent.schema()
  };


  bindHandlers() {}

  attach(element){
    var that = this;
    // this.formList.map(form=>{
    //   this.attachEventListeners(form)
    // })
      this.attachEventListeners({})

      return super.attach(element);
  }

   

    ShowPopupMessageBytype(status,message){
      var modal = document.getElementById("myModal");
      // Get the button that opens the modal
      var btn = document.getElementById("myBtn");
      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];
      modal.style.display = "block";
      // When the user clicks on the button, open the modal
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
      }
      // $('#modal_message').val('');
      $("#modal_message").html(message)
    }

    showInsureSignModal(docid,signing_url){
      let modalHTML=""
      modalHTML+=`<div class="insuresign modal-content">`
      modalHTML+=`<span class="close">&times;</span>`
      modalHTML+=`<iframe width="100%" height="100%" src=${signing_url}></iframe>`
      // <iframe height='100%' width='100%' src='data.url+"'></iframe>
      modalHTML+=`</div>`

      $("#myModal").html(modalHTML)
      $("#myModal").css("display", "block")
      $('span.close').on('click',()=>{
       $("#myModal").css("display", "none")
      })

      // var modal = document.getElementById("myModal");
      // modal.innerHTML(modalHTML)
    }

    pollForStatus(){
      //implement once api is ready
      setTimeout(()=>{

        $("#myModal").css("display", "none")
      },60000)
    }
     

   attachEventListeners(form){
  
  //  let button_id=form.name+"-btn"
  //  let core=this.component.core
  //  let helper=this.component.core.make("oxzion/restClient");
  //  var modal = document.getElementById("myModal");
  //  if( document.getElementById(button_id)){
  //   document.getElementById(button_id).addEventListener("click",async()=>{
  //   let response = await helper.request('v1', 'analytics/datasource', {}, 'get');
  //     alert("this is "+form.name)
  //     console.log(core)
  //     console.log(response)
  //     // console.log(that.core)
  //   })
  //  }
  
   if( document.getElementById("sign_btn")){
    document.getElementById("sign_btn").addEventListener("click",async()=>{
      // this.ShowPopupMessageBytype("error","random message")
      //currently added a dummy cross origin link.. change the link to signing_url 
         this.showInsureSignModal("qwerty","https://lab.insuresign.com/?d=NDMxMmJmNTItNmExMy00NTRlLWI3YzYtNmY5YTY2ODliOWE3JmVveF91c2VyXzFAZ21haWwuY29t#/signing/doc")

         this.pollForStatus()
      
         // let response = await helper.request('v1', 'analytics/datasource', {}, 'get');
      // alert("this is clicked")
      // modal.style.display="block"
      // console.log(core)
      // console.log(response)
      // console.log(that.core)
    })
   }
    
 }

  render(children) {
    var evt = new CustomEvent("getAppDetails", { detail: {} });
    this.form.element.dispatchEvent(evt);
    var row = `<button id="sign_btn" >Sign Form</button>`
    row+=`<div id="myModal" class="insuresign modal"></div>`
    // this.formList.map(form=>{
    // row+=`<div>Form Name:${form.name} <span>Status:${form.status}</span>`
    // row+=form.status=="unsigned"?`<span><button id=${form.name+"-btn"} >Sign Form</button</span></div></br>`:`</div></br>`
    // })   
    return super.render(`<div>${row}</div>`);
  }

  static editForm = editForm;

  elementInfo() {
    const info = super.elementInfo();
    info.type = "input";
    info.attr.type = "hidden";
    info.changeEvent = "change";
    return info;
  }
  build(element) {
    super.build(element);
  }
}

