import Base from "formiojs/components/_classes/component/Component";
import editForm from "formiojs/components/table/Table.form";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import $ from "jquery";
import { Formio } from "formiojs";
import * as _lodash from "lodash";

export default class DocumentSignerComponent extends Base {
  constructor(component, options, data) {
    var formOptions = Formio.getPlugin("optionsPlugin");
    var customOptions = _lodash.default.merge(options, formOptions.options);
    if(customOptions.core == null || customOptions.core == undefined){
        console.log(customOptions);
    }
    super(component, customOptions, data);
    component.core = customOptions.core;
    component.appId = customOptions.appId;
    component.uiUrl = customOptions.uiUrl;
    component.wrapperUrl = customOptions.wrapperUrl;
    this.form = this.getRoot();
    var that = this;
    this.data = data;
    this.documentsList = [];
  }

  //disable
  static schema(...extend) {
    return Base.schema(
      {
        label: "documentsigner",
        type: "documentsigner",
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
    schema: DocumentSignerComponent.schema(),
  };

  bindHandlers() {
    if (this.previousValue == this.dataValue) {
      return;
    }
    try {
      var form = this.form ? this.form : this;
      var name = form._data[this.component.documentsList][this.component.index].originalName;
    } catch (error) {
      this.redraw();
      return;
    }
    this.dataValue = name;
    this.previousValue = this.dataValue;
    var that = this;
    that.documentsList = `<h5>` + name + `<button id="sign_btn_`+this.id+`" >Sign Form</button></h5>`;
    that.documentsList += `<div id="myModal_`+this.id+`" class="insuresign modal"></div>`;
    that.redraw();
  }

  attach(element) {
    var that = this;
    this.attachEventListeners({});
    return super.attach(element);
  }

  ShowPopupMessageBytype(status, message) {
    var modal = document.getElementById("myModal_"+this.id);
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    // When the user clicks on the button, open the modal
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };
    // $('#modal_message').val('');
    $("#modal_message").html(message);
  }

  showInsureSignModal(docid, signing_url) {
    let modalHTML = "";
    modalHTML += `<div class="insuresign modal-content" style="height:100%">`;
    modalHTML += `<span class="close">&times;</span>`;
    modalHTML += `<iframe width="100%" height="100%" src=${signing_url}></iframe>`;
    // <iframe height='100%' width='100%' src='data.url+"'></iframe>
    modalHTML += `</div>`;

    $("#myModal_"+this.id).html(modalHTML);
    $("#myModal_"+this.id).css("display", "block");
    $("span.close").on("click", () => {
      $("#myModal_"+this.id).css("display", "none");
    });
  }

  pollForStatus() {
    setTimeout(() => {
      var docId = this.form._data[this.component.documentsList][
        this.component.index
      ].docId;
      let helper = this.component.core.make("oxzion/restClient");
      helper.request("v1", "/status/" + docId, {}, "get")
        .then(function (response) {
          var that = _this2 || _this3 || _this4 || _this5 || _this6 || _this7;
          if (
            response.data["status"] == "FINALIZED" ||
            response.data["status"] == "CANCELLED"
          ) {
            $("#myModal_"+this.id).css("display", "none");
            that.documentsList =
              `<h5>` +
              that.component.previousValue +
              `<button disabled id="sign_btn_`+this.id+`">Signed</button></h5>`;
            that.documentsList += `<div id="myModa_`+this.id`" class="insuresign modal"></div>`;
            that.redraw();
          } else {
            that.pollForStatus();
          }
        })
        .catch(function (response) {});
    }, 1000);
  }

  attachEventListeners(form) {
    if (document.getElementById("sign_btn_"+this.id)) {
      document.getElementById("sign_btn_"+this.id).addEventListener("click", async () => {
          // this.ShowPopupMessageBytype("error","random message")
          //currently added a dummy cross origin link.. change the link to signing_url
          var signingLink = this.form._data[this.component.documentsList][this.component.index].signingLink;
          this.showInsureSignModal(this.component.documentsList+this.component.index, signingLink);
          this.pollForStatus();
        });
    }
  }

  render(children) {
    var documentsList = this.documentsList ? this.documentsList : `<p>not working</p>`;
    setTimeout(() => {
      this.bindHandlers();
    }, 2000);
    var row = `<button id="sign_btn_`+this.id+`" >Sign Form</button>`;
    row += `<div id="myModal_`+this.id+`" class="insuresign modal"></div>`;
    return super.render(`<div>${documentsList}</div>`);
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
