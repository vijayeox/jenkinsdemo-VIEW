import "../../public/css/formstyles.scss";
import { Formio } from "formiojs";
import Notification from "../../Notification";
import { getComponent, flattenComponents } from "formiojs/utils/formUtils";
import React from "react";
import ConvergePayCheckoutComponent from './Form/Payment/ConvergePayCheckoutComponent';

class FormRender extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.state = {
      form: null,
      appId: this.props.appId,
      workflowId: null,
      cacheId: null,
      workflowInstanceId: this.props.workflowInstanceId,
      activityInstanceId: this.props.activityInstanceId,
      activityId: this.props.activityId,
      instanceId: this.props.instanceId,
      formId: this.props.formId,
      paymentDetails : null,
      hasPayment: false,
      content: this.props.content,
      data: this.props.data,
      page: this.props.page
    };
    this.notif = React.createRef();
    var formID= this.props.formId ? this.props.formId : "123";
    this.formDivID = "formio_" + formID;
  }

  async callDelegate(delegate, params) {
    let helper = this.core.make("oxzion/restClient");
    let delegateData = await helper.request(
      "v1",
      "/app/" + this.state.appId + "/delegate/" + delegate,
      params,
      "post"
    );
    return delegateData;
  }
  async callPayment(params) {
    let helper = this.core.make("oxzion/restClient");
    let delegateData = await helper.request(
      "v1",
      "/app/" + this.state.appId + "/paymentgateway/initiate",
      params,
      "post"
    );
    return delegateData;
  }
  async storePayment(params) {
    let helper = this.core.make("oxzion/restClient");
    let delegateData = await helper.request(
      "v1",
      "/app/" + this.state.appId + "/transaction/"+params.transaction_id+"/status",
      params.data,
      "post"
      );
    return delegateData;
  }

  async getPayment() {
    let helper = this.core.make("oxzion/restClient");
    let delegateData = await helper.request(
      "v1",
      "/app/" + this.state.appId + "/paymentgateway",
      {},
      "get"
    );
    return delegateData;
  }
  async getWorkflow() {
    // call to api using wrapper
    let helper = this.core.make("oxzion/restClient");
    let pageContent = await helper.request(
      "v1",
      "/app/" + this.state.appId + "/form/" + this.state.formId + "/workflow",
      {},
      "get"
    );
    return pageContent;
  }
  async getActivity() {
    // call to api using wrapper
    let helper = this.core.make("oxzion/restClient");
    let formContent = await helper.request(
      "v1",
      "/activity/" + this.state.activityInstanceId + "/form",
      {},
      "get"
    );
    return formContent;
  }
  async saveForm(data) {
    this.core.make('oxzion/splash').show();
    let helper = this.core.make("oxzion/restClient");
    let route = "";
    let method = "post";
    if (this.state.workflowId) {
      route = "/workflow/" + this.state.workflowId;
      if (this.state.activityInstanceId) {
        route =
          "/workflow/" +
          this.state.workflowId +
          "/activity/" +
          this.state.activityInstanceId;
        method = "post";
        if (this.state.instanceId) {
          route =
            "/workflow/" +
            this.state.workflowId +
            "/activity/" +
            this.state.activityId +
            "/instance/" +
            this.state.instanceId;
          method = "put";
        }
      }
    } else if(this.state.workflowInstanceId){
      route = "/workflowinstance/" + this.state.workflowInstanceId;
      if (this.state.activityInstanceId) {
        route =
          "/workflowinstance/" +
          this.state.workflowInstanceId +
          "/activity/" +
          this.state.activityInstanceId;
        method = "post";
      }
      route = route + "/submit"
    } else {
      route =
        "/app/" + this.state.appId + "/form/" + this.state.formId + "/file";
      method = "post";
      if (this.state.instanceId) {
        route =
          "/app/" +
          this.state.appId +
          "/form/" +
          this.state.formId +
          "/file/" +
          this.state.instanceId;
        method = "put";
      }
    }
    await helper.request("v1", route, data, method).then(response => {
        that.core.make('oxzion/splash').destroy();
      if (response.status == "success") {
        return response;
      } else {
        return;
      }
    });
  }

  async getFormContents(url) {
    let helper = this.core.make("oxzion/restClient");
    let formData = await helper.request("v1", url, {}, "get");
    return formData.data;
  }

  loadWorkflow() {
    if (this.state.formId) {
      this.getWorkflow().then(response => {
        if (response.status == "success" && response.data.workflow_id) {
          this.setState({ workflowId: response.data.workflow_id });
          this.setState({ activityId: response.data.activity_id });
          if (!this.state.content) {
            this.setState({ content: response.data.template });
          }
          this.createForm();
        }
      });
    }
    if (this.state.activityInstanceId) {
      this.getActivity().then(response => {
        if (response.status == "success") {
          this.setState({
            workflowInstanceId: response.data.workflow_instance_id
          });
          this.setState({ workflowId: response.data.workflow_id });
          this.setState({ activityId: response.data.activity_id });
          this.setState({ data: JSON.parse(response.data.data) });
          this.setState({ content: response.data.template });
          this.createForm();
        }
      });
    }
    if (this.state.instanceId) {
      this.getInstanceData().then(response => {
        if (response.status == "success" && response.data.workflow_id) {
          this.setState({
            workflowInstanceId: response.data.workflow_instance_id
          });
          this.setState({ workflowId: response.data.workflow_id });
          this.setState({ activityId: response.data.activity_id });
          this.setState({ data: JSON.parse(response.data.data) });
          this.setState({ content: response.data.template });
          this.createForm();
        }
      });
    }
  }
  createForm() {
    let that = this;
    if (this.state.content && !this.state.form) {
      Formio.registerComponent('convergepay', ConvergePayCheckoutComponent);
      var options = {};
      if(this.state.content['properties']){
        if(this.state.content['properties']['clickable']){
          options.breadcrumbSettings = {clickable: eval(this.state.content['properties']['clickable'])};  
        }
        if(this.state.content['properties']['showPrevious']){
          options.buttonSettings ={showPrevious: eval(this.state.content['properties']['showPrevious'])};  
        }
        if(this.state.content['properties']['showNext']){
          options.buttonSettings = {showNext: eval(this.state.content['properties']['showNext'])};  
        }
        if(this.state.content['properties']['showCancel']){
          options.buttonSettings = {showCancel: eval(this.state.content['properties']['showCancel'])};  
        }
      }
      var hooks = {
        beforeNext: (currentPage, submission, next) => {
          if(currentPage['properties']){
            if(currentPage['properties']['payment_confirmation_page']){
              that.getPayment()
                  .then(response => {
                    console.log(response);
                    var responseArray = [];
                    for (var responseDataItem in response.data) {
                      if (response.data.hasOwnProperty(responseDataItem)) {
                        responseArray[responseDataItem] =
                          response.data[responseDataItem];
                      }
                    }
                    if (response.data) {
                      submission = { data: response.data };
                    }
                    next(null);
                  });
            } else {
              next(null);
            }
          } else {
            next(null);
          }
        },
        beforeSubmit: (submission, next) => {
          console.log(next)
          next();
        }
      };
      options.hooks = hooks;
      var formCreated = Formio.createForm(
        document.getElementById(this.formDivID),
        this.state.content,
        options
      ).then(function(form) {
        if (that.state.page) {
          form.setPage(that.state.page);
        }
        form.submission = { data: that.state.data };
        form.on("prevPage", changed => that.setState({ page: changed.page }));
        form.on("nextPage", (changed) => {
          console.log(that.state);
          that.setState({ page: changed.page });
        });
        form.on("submit", submission => {
          that.saveForm(submission.data)
        });
        form.on("render", () =>{
          if(form._form['properties']){
            if(form._form['properties']['payment_confirmation_page']){
              var elements = document.getElementsByClassName("btn-wizard-nav-submit");
              if(elements.length > 0){
                elements[0].classList.add('invisible')
              }
              that.getPayment(form.submission.data).then(response => {
                var responseArray = [];
                if(response.data){
                  var evt = new CustomEvent('paymentDetails', {detail: response.data[0]});
                  window.dispatchEvent(evt);
                }
              });
              window.addEventListener("requestPaymentToken", function(e){
                e.preventDefault();
                that.core.make('oxzion/splash').show();
                that.callPayment({firstname:e.detail.firstname,lastname:e.detail.lastname,amount:e.detail.amount}).then(response => {
                  var evt = new CustomEvent('getPaymentToken', {detail: response.data});
                  window.dispatchEvent(evt);
                  that.core.make('oxzion/splash').destroy();
                });
              });
              window.addEventListener("paymentSuccess", function(e){
                e.preventDefault();
                that.core.make('oxzion/splash').show();
                that.storePayment({transaction_id:e.detail.transaction_id,data:e.detail.data}).then(response => {
                that.notif.current.customSuccessNotification("Payment has been Successfully completed!","Please wait while we get things ready!");
                  var formsave = that.saveForm(form.submission.data);
                  if(formsave){
                    that.notif.current.customSuccessNotification("Success!","Application Has been Successfully Submitted!");
                    that.core.make('oxzion/splash').destroy();
                  } else {
                    that.notif.current.customFailNotification("Error",e.detail.message);
                  }
                });
              });
              window.addEventListener("paymentDeclined", function(e){
                e.preventDefault();
                that.notif.current.customFailNotification("Error",e.detail.message);
              });
              window.addEventListener("paymentError", function(e){
                e.preventDefault();
                that.notif.current.customFailNotification("Error",e.detail.message);
              });
              window.addEventListener("paymentPending", function(e){
                that.core.make('oxzion/splash').show();
                e.preventDefault();
                that.notif.current.stockNotification("Information",e.detail.message);
              });
            }
          }
        });

        form.on("change", function(changed) {
          console.log("Form was changed", changed);
          var formdata = changed;
          var formdataArray = [];
          for (var formDataItem in formdata.data) {
            if (formdata.data.hasOwnProperty(formDataItem)) {
              formdataArray[formDataItem] = formdata.data[formDataItem];
            }
          }
          if (changed && changed.changed) {
            var component = changed.changed.component;
            var properties = component.properties;
            if (properties) {
              if (properties["delegate"]) {
                that.core.make('oxzion/splash').show();
                that
                  .callDelegate(properties["delegate"], formdata.data)
                  .then(response => {
                    var responseArray = [];
                    for (var responseDataItem in response.data) {
                      if (response.data.hasOwnProperty(responseDataItem)) {
                        responseArray[responseDataItem] =
                          response.data[responseDataItem];
                      }
                    }
                    if (response.data) {
                      form.submission = { data: response.data };
                      form.triggerChange();
                    }
                    that.core.make('oxzion/splash').destroy();
                  });
              }
              if (properties["target"]) {
                var targetComponent = form.getComponent(properties["target"]);
                if (changed.changed.value) {
                  var value = formdata.data[changed.changed.value];
                  if (value) {
                    targetComponent.setValue(value);
                  } else {
                    targetComponent.setValue(changed.changed.value);
                  }
                }
              }
            }
          }
          var componentList = flattenComponents(form.components);
          for (var componentKey in componentList) {
            if (componentList.hasOwnProperty(componentKey)) {
              var componentItem = componentList[componentKey];
              if (
                componentItem.component.properties &&
                componentItem.component.properties["target"]
              ) {
                var targetComponent = form.getComponent(
                  componentItem.component.properties["target"]
                );
                if (targetComponent && componentItem.value) {
                  if (formdataArray[componentItem.value]) {
                    targetComponent.setValue(
                      formdataArray[componentItem.value]
                    );
                    targetComponent.refresh();
                  }
                }
              }
            }
          }
        });
        form.on("callDelegate", changed => {
          that.core.make('oxzion/splash').show();
          var component = form.getComponent(event.target.id);
          if (component) {
            var properties = component.component.properties;
            if (properties) {
              if (properties["delegate"]) {
                that
                  .callDelegate(properties["delegate"], changed)
                  .then(response => {
                    that.core.make('oxzion/splash').destroy();
                    if (response.data) {
                      form.submission = { data: response.data };
                      form.triggerChange();
                    }
                  });
              }
            }
          }
        });
      });
    }
  }
  componentDidMount() {
    this.props.url
      ? this.getFormContents(this.props.url).then(response => {
          console.log(response);
          this.setState({
            content: JSON.parse(response.template),
            data: JSON.parse(response.data),
            workflowInstanceId: response.workflow_instance_id,
            activityInstanceId: response.activity_instance_id,
            formId: response.form_id
          });
          this.createForm();
        })
      : null;
    this.loadWorkflow();
  }

  async PushDataPOST(api, method, item, body) {
    if (method == "put") {
      let response = await helper.request(
        "v1",
        "/" + api + "/" + item,
        body,
        "filepost"
      );
      return response;
    } else if (method == "post") {
      let response = await helper.request("v1", "/" + api, body, "filepost");
      return response;
    }
  }
  render() {
    return <div>
          <Notification ref={this.notif} />
          <div className="form-render" id={this.formDivID}></div></div>;
  }
}
export default FormRender;
