import "../../public/css/formstyles.scss";
import { Formio } from "formiojs";
import Notification from "../../Notification";
import { getComponent, flattenComponents } from "formiojs/utils/formUtils";
import React from "react";
import merge from 'deepmerge';
import scrollIntoView from "scroll-into-view-if-needed";
import ConvergePayCheckoutComponent from "./Form/Payment/ConvergePayCheckoutComponent";
import DocumentComponent from "./Form/DocumentComponent";

class FormRender extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    var userprofile = this.core.make("oxzion/profile").get();
    this.privileges = userprofile.key.privileges;
    this.state = {
      form: null,
      appId: this.props.appId,
      workflowId: null,
      cacheId: null,
      workflowInstanceId: this.props.workflowInstanceId,
      parentWorkflowInstanceId: this.props.parentWorkflowInstanceId,
      activityInstanceId: this.props.activityInstanceId,
      activityId: this.props.activityId,
      instanceId: this.props.instanceId,
      formId: this.props.formId,
      paymentDetails: null,
      hasPayment: false,
      content: this.props.content,
      data: this.props.data,
      page: this.props.page
    };
    this.helper = this.core.make("oxzion/restClient");
    this.notif = React.createRef();
    var formID = this.props.formId ? this.props.formId : "123";
    if (this.props.cacheId) {
      this.setState({ cacheId: this.props.cacheId });
    }
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
  async callPipeline(commands, submission) {
    let helper = this.core.make("oxzion/restClient");
    var params = [];
    params = submission;
    params['commands'] = JSON.parse(commands);
    let delegateData = await helper.request(
      "v1",
      "/app/" + this.state.appId + "/pipeline",
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
      "/app/" +
        this.state.appId +
        "/transaction/" +
        params.transaction_id +
        "/status",
      params.data,
      "post"
    );
    return delegateData;
  }
  async getCacheData() {
    let cacheData = await this.helper.request(
      "v1",
      "/app/" + this.state.appId + "/cache",
      {},
      "get"
    );
    return cacheData;
  }

  async storeCache(params) {
    if (this.state.page) {
      params.page = this.state.page;
    }
    let helper = this.core.make("oxzion/restClient");
    var route = "/app/" + this.state.appId + "/storecache";
    if (this.state.cacheId) {
      route = route + "/" + this.state.cacheId;
    }
    params.formId = this.state.formId;
    await helper.request("v1", route, params, "post").then(response => {
      this.setState({ cacheId: response.data.id });
      return response;
    });
  }
  async storeError(data, error, route) {
    let helper = this.core.make("oxzion/restClient");
    let params = {};
    params.type = "form";
    params.errorTrace = JSON.stringify(error);
    params.params = JSON.stringify({
      cache_id: this.state.cacheId,
      app_id: this.state.appId,
      formId: this.state.formId,
      workflowId: this.state.workflowId,
      route: route
    });
    let response = await helper.request("v1", "/errorlog", params, "post");
    return;
  }
  async deleteCacheData() {
    var route = "/app/" + this.state.appId + "/deletecache";
    if (this.state.cacheId) {
      route = route + "/" + this.state.cacheId;
    }
    let cacheData = await this.helper
      .request("v1", route, {}, "delete")
      .then(response => {
        this.setState({ cacheId: null });
        return response;
      });
    return cacheData;
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

  async getFileData() {
    // call to api using wrapper
    let helper = this.core.make("oxzion/restClient");
    let fileData = await helper.request(
      "v1",
      "/app/" +
      this.state.appId +
      "/workflowInstance/" +
      this.props.parentWorkflowInstanceId,
      {},
      "get"
    );
    return fileData;
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
  async saveForm(form,data) {
    // this.core.make('oxzion/splash').show();
    console.log(form);
      if (form._form["properties"] && form._form["properties"]["submission_commands"]) {
        if (this.state.workflowInstanceId) {
          form.data['workflowInstanceId'] = this.state.workflowInstanceId;
          if (this.state.activityInstanceId) {
             form.data['activityInstanceId'] = this.state.activityInstanceId;
             if (this.state.instanceId) {
                form.data['instanceId'] = $this.state.instanceId;
             }
          }
        }
        this.callPipeline(form._form["properties"]["submission_commands"], this.cleanData(form.data))
        .then(response => {
          this.core.make("oxzion/splash").destroy();
          if (response.status == "success") {
            if (response.data) {
            form.submission = { data: this.addAddlData(response.data) };
            form.triggerChange();
          }
          this.deleteCacheData().then(response2 => {
            if (response2.status == "success") {
              this.props.postSubmitCallback();
            }
            return response;
          });
        } else {
          this.storeCache(data).then(cacheResponse => {
            if (response.data.errors) {
              this.storeError(data, response.data.errors, route).then(
                storeErrorResponse => {
                  this.notif.current.notify(
                    "Error",
                    "Form Submission Failed",
                    "danger"
                    )
                }
                );
            }
          });
          return;
        }
        });
    } else {
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
      } else if (this.state.workflowInstanceId) {
        route = "/workflowinstance/" + this.state.workflowInstanceId;
        if (this.state.activityInstanceId) {
          route =
          "/workflowinstance/" +
          this.state.workflowInstanceId +
          "/activity/" +
          this.state.activityInstanceId;
          method = "post";
        }
        route = route + "/submit";
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
        this.core.make("oxzion/splash").destroy();
        if (response.status == "success") {
          this.deleteCacheData().then(response2 => {
            if (response2.status == "success") {
              this.props.postSubmitCallback();
            }
            return response;
          });
        } else {
          this.storeCache(data).then(cacheResponse => {
            if (response.data.errors) {
              this.storeError(data, response.data.errors, route).then(
                storeErrorResponse => {
                  this.notif.current.notify(
                    "Error",
                    "Form Submission Failed",
                    "danger"
                    )
                }
                );
            }
          });
          return;
        }
      });
    }
  }

  cleanData(formData){
      formData.privileges = undefined;
      return formData;
  }

  addAddlData(data){
    data = data ? data : {};
    return merge(data, {privileges:this.privileges});
  }

  async getFormContents(url) {
    let helper = this.core.make("oxzion/restClient");
    let formData = await helper.request("v1", url, {}, "get");
    return formData.data;
  }

  loadWorkflow() {
    let that = this;
    if (this.state.formId) {
      this.getWorkflow().then(response => {
        if (response.status == "success" && response.data.workflow_id) {
          that.setState({ workflowId: response.data.workflow_id });
          if (response.data.activity_id) {
            that.setState({ activityId: response.data.activity_id });
          }
          if (!that.state.content) {
            console.log(response.data);
            that.setState({ content: JSON.parse(response.data.template) });
          }
        }
        that.setState({ formDivID: "formio_" + that.state.formId });
        that.createForm();
      });
    }
    if (this.state.parentWorkflowInstanceId) {
      this.getFileData().then(response => {
        if (response.status == "success") {
          let fileData = JSON.parse(response.data.data);
          console.log(fileData.workflowInstanceId);
          fileData.parentWorkflowInstanceId = that.props.parentWorkflowInstanceId;
          fileData.workflowInstanceId = undefined;
          fileData.activityId = undefined;
          that.setState({ data: fileData });
          that.setState({ formDivID: "formio_" + that.state.formId });
          that.createForm();
        }
      });
    }
    if (this.state.activityInstanceId) {
      this.getActivity().then(response => {
        if (response.status == "success") {
          that.setState({
            workflowInstanceId: response.data.workflow_instance_id
          });
          that.setState({ workflowId: response.data.workflow_id });
          that.setState({ activityId: response.data.activity_id });
          that.setState({ data: JSON.parse(response.data.data) });
          that.setState({ content: response.data.template });
          that.createForm();
        }
      });
    }
    if (this.state.instanceId) {
      this.getInstanceData().then(response => {
        if (response.status == "success" && response.data.workflow_id) {
          that.setState({
            workflowInstanceId: response.data.workflow_instance_id
          });
          that.setState({ workflowId: response.data.workflow_id });
          that.setState({ activityId: response.data.activity_id });
          that.setState({ data: JSON.parse(response.data.data) });
          that.setState({ content: response.data.template });
          that.createForm();
        }
      });
    }
  }
  createForm() {
    let that = this;
    if (this.state.content && !this.state.form) {
      Formio.registerComponent("convergepay", ConvergePayCheckoutComponent);
      Formio.registerComponent("document", DocumentComponent);
      var options = {};
      if (this.state.content["properties"]) {
        if (this.state.content["properties"]["clickable"]) {
          options.breadcrumbSettings = {
            clickable: eval(this.state.content["properties"]["clickable"])
          };
        }
        if (this.state.content["properties"]["showPrevious"]) {
          options.buttonSettings = {
            showPrevious: eval(this.state.content["properties"]["showPrevious"])
          };
        }
        if (this.state.content["properties"]["showNext"]) {
          options.buttonSettings = {
            showNext: eval(this.state.content["properties"]["showNext"])
          };
        }
        if (this.state.content["properties"]["showCancel"]) {
          options.buttonSettings = {
            showCancel: eval(this.state.content["properties"]["showCancel"])
          };
        }
      }
      var hooks = {
        beforeNext: (currentPage, submission, next) => {
          that.storeCache(submission.data);
          next(null);
        }
      };
      options.hooks = hooks;
      var formCreated = Formio.createForm(
        document.getElementById(this.formDivID),
        this.state.content,
        options
      ).then(function(form) {
        if (that.state.page && form.wizard) {
          if (form.wizard.display == "wizard") {
            form.setPage(that.state.page);
          }
        }
        form.nosubmit = true;
        console.log(that.addAddlData(that.state.data));
        form.submission = {data : that.addAddlData(that.state.data)};
        form.on("prevPage", changed => that.setState({ page: changed.page }));
        form.on("nextPage", changed => {
          that.setState({ page: changed.page });
          if (form.pages[changed.page]["properties"]["delegate"]) {
            if (form.pages[changed.page]["properties"]["delegate"]) {
              var form_data = that.cleanData(form.data);
              that
                .callDelegate(
                  form.pages[changed.page]["properties"]["delegate"],
                  form_data
                )
                .then(response => {
                  that.core.make("oxzion/splash").destroy();
                  if (response.data) {
                    form.submission = { data: that.addAddlData(response.data) };
                    form.triggerChange();
                  }
                });
            }
          }
        });
        form.on("submit", submission => {
          var form_data = that.cleanData(submission.data);
          return that.saveForm(form,form_data).then(response => {
            form.emit('submitDone', response);
          });
        });
        form.on("error", errors => {
          var elm = document.getElementsByClassName("alert-danger")[0];
          scrollIntoView(elm, {
            scrollMode: "if-needed",
            block: "center",
            behavior: "smooth",
            inline: "nearest"
          });
        });
        form.on("render", () => {
          var elm = document.getElementsByClassName("breadcrumbParent");
          if (elm.length > 0) {
            scrollIntoView(elm[0], {
              scrollMode: "if-needed",
              block: "center",
              behavior: "smooth",
              inline: "nearest"
            });
          }
          if (form._form["properties"]) {
            if (form._form["properties"]["delegate"]) {
              if (form._form["properties"]["delegate"]) {
                that
                  .callDelegate(form._form["properties"]["delegate"], that.cleanData(form.data))
                  .then(response => {
                    that.core.make("oxzion/splash").destroy();
                    if (response.data) {
                      form.submission = { data: that.addAddlData(response.data) };
                      form.triggerChange();
                    }
                  });
              }
            }
            if(form._form["properties"]["commands"]){
              that
               .callPipeline(form._form["properties"]["commands"], that.cleanData(form.data))
               .then(response => {
                    that.core.make("oxzion/splash").destroy();
                    if (response.status == "success") {
                        if (response.data) {
                            form.submission = { data: that.addAddlData(response.data) };
                            form.triggerChange();
                        }
                    }
                });
            }
            if (form._form["properties"]["payment_confirmation_page"]) {
              var elements = document.getElementsByClassName(
                "btn-wizard-nav-submit"
              );
              that.getPayment(that.cleanData(form.submission.data)).then(response => {
                var responseArray = [];
                if (response.data) {
                  var evt = new CustomEvent("paymentDetails", {
                    detail: response.data[0]
                  });
                  window.dispatchEvent(evt);
                }
              });
              window.addEventListener(
                "requestPaymentToken",
                function(e) {
                  e.stopPropagation();
                  that.core.make("oxzion/splash").show();
                  that
                    .callPayment({
                      firstname: e.detail.firstname,
                      lastname: e.detail.lastname,
                      amount: e.detail.amount
                    })
                    .then(response => {
                      var transactionIdComponent = form.getComponent(
                        "transaction_id"
                      );
                      if (response.data.transaction.id && response.data.token) {
                        transactionIdComponent.setValue(
                          response.data.transaction.id
                        );
                        var evt = new CustomEvent("getPaymentToken", {
                          detail: response.data
                        });
                        window.dispatchEvent(evt);
                      } else {
                        that.notif.current.notify(
                          "Error",
                          "Transaction Token Failed!",
                          "danger"
                        )
                      }
                      that.core.make("oxzion/splash").destroy();
                    });
                },
                true
              );
              window.addEventListener(
                "paymentSuccess",
                function(e) {
                  e.stopPropagation();
                  that.core.make("oxzion/splash").show();
                  var transactionIdComponent = form.getComponent(
                    "transaction_id"
                  );
                  that
                    .storePayment({
                      transaction_id: transactionIdComponent.getValue(),
                      data: e.detail.data,
                      status: e.detail.status
                    })
                    .then(response => {
                      that.notif.current.notify(
                        "Payment has been Successfully completed!",
                        "Please wait while we get things ready!", "success"
                      );
                      var formsave = that.saveForm(form,that.cleanData(form.submission.data));
                      var transactionStatusComponent = form.getComponent(
                        "transaction_status"
                      );
                      transactionStatusComponent.setValue(e.detail.status);
                      if (formsave) {
                        that.notif.current.notify(
                          "Success",
                          "Application Has been Successfully Submitted",
                          "success"
                        );
                        that.core.make("oxzion/splash").destroy();
                      } else {
                        that.notif.current.notify(
                          "Error",
                          e.detail.message,
                          "danger"
                        );
                      }
                    });
                },
                true
              );
              window.addEventListener(
                "paymentDeclined",
                function(e) {
                  e.stopPropagation();
                  console.log(e.detail);
                  var transactionIdComponent = form.getComponent(
                    "transaction_id"
                  );
                  console.log;
                  that
                    .storePayment({
                      transaction_id: transactionIdComponent.getValue(),
                      data: e.detail.data
                    })
                    .then(response => {
                      that.notif.current.notify(
                        "Error",
                        e.detail.message,
                        "danger"
                      );
                      that.core.make("oxzion/splash").destroy();
                    });
                },
                true
              );
              window.addEventListener(
                "paymentError",
                function(e) {
                  e.stopPropagation();
                  console.log(e.detail);
                  var transactionIdComponent = form.getComponent(
                    "transaction_id"
                  );
                  that
                    .storePayment({
                      transaction_id: transactionIdComponent.getValue(),
                      data: e.detail.data
                    })
                    .then(response => {
                      that.notif.current.notify(
                        "Error",
                        e.detail.message,
                        "danger"
                      );
                      that.core.make("oxzion/splash").destroy();
                    });
                },
                true
              );
              window.addEventListener(
                "paymentPending",
                function(e) {
                  that.core.make("oxzion/splash").show();
                  e.stopPropagation();
                  that.notif.current.notify(
                    "Information",
                    e.detail.message,
                    "default"
                  );
                },
                true
              );
            }
          }
        });

        form.on("change", function (changed) {
          console.log(changed.changed);
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
                that.core.make("oxzion/splash").show();
                that
                  .callDelegate(properties["delegate"], that.cleanData(formdata.data))
                  .then(response => {
                    var responseArray = [];
                    for (var responseDataItem in response.data) {
                      if (response.data.hasOwnProperty(responseDataItem)) {
                        responseArray[responseDataItem] =
                          response.data[responseDataItem];
                      }
                    }
                    if (response.data) {
                      form.submission = { data: that.addAddlData(response.data) };
                      form.triggerChange();
                    }
                    that.core.make("oxzion/splash").destroy();
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
          that.core.make("oxzion/splash").show();
          var component = form.getComponent(event.target.id);
          if (component) {
            var properties = component.component.properties;
            if (properties) {
              if (properties["delegate"]) {
                if (properties["sourceDataKey"] && properties["destinationDataKey"]) {
                  var paramData = {};
                  paramData[properties["valueKey"]] = changed[properties["sourceDataKey"]];
                  that.core.make("oxzion/splash").show();
                  that
                    .callDelegate(properties["delegate"], paramData)
                    .then(response => {
                      var responseArray = [];
                      for (var responseDataItem in response.data) {
                        if (response.data.hasOwnProperty(responseDataItem)) {
                          responseArray[responseDataItem] =
                            response.data[responseDataItem];
                        }
                      }
                      if (response.data) {
                        if (response.data.Verified) {
                          if (changed[properties["destinationDataKey"]].length > 1) {
                            var flag = false;
                            for (var i = 0; i < changed[properties["destinationDataKey"]].length; i++) {
                             
                              if (changed[properties["destinationDataKey"]][i][properties["valueKey"]] == response.data[properties["valueKey"]]) {
                                flag = true;
                                break;
                              }
                            }
                            if (!flag) {
                              changed[properties["destinationDataKey"]].push(response.data);
                            }
                          }
                          else if (changed[properties["destinationDataKey"]][0]['Verified'] == "false") {
                            changed[properties["destinationDataKey"]][0] = response.data;
                          }
                          else {
                            if (changed[properties["destinationDataKey"]][0][properties['valueKey']] != response.data[properties['valueKey']]) {
                              changed[properties["destinationDataKey"]].push(response.data);
                            }
                          }
                          form.submission = { data: changed };
                          form.triggerChange();
                        }
                      }
                      that.core.make("oxzion/splash").destroy();
                    });
                }
                else {
                  that
                    .callDelegate(properties["delegate"], changed)
                    .then(response => {
                      that.core.make("oxzion/splash").destroy();
                      if (response.data) {
                        form.submission = { data: that.addAddlData(response.data) };
                        form.triggerChange();
                      }
                    });
                }
              }
            }
          }
        });
        form.on("callDelegate", changed => {

        });
      });
    }
  }

  parseResponseData = data => {
    var parsedData = {};
    Object.keys(data).forEach(key => {
      try {
        parsedData[key] = data[key] ? JSON.parse(data[key]) : "";
      } catch (error) {
        parsedData[key] = data[key];
      }
    });
    return parsedData;
  };

  componentDidMount() {
    if(this.props.url)
      {this.getFormContents(this.props.url).then(response => {
          var parsedData = [];
          if (response.data) {
            parsedData = this.parseResponseData(JSON.parse(response.data));
          }else if(this.state.data){
            parsedData = this.state.data;
          }
          response.workflow_uuid
            ? (parsedData.workflow_uuid = response.workflow_uuid)
            : null;
          this.setState({
            content: JSON.parse(response.template),
            data: this.addAddlData(parsedData),
            workflowInstanceId: response.workflow_instance_id,
            activityInstanceId: response.activity_instance_id,
            workflowId: response.workflow_uuid,
            formId: response.form_id
          });
          this.createForm();
        })};
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
    return (
      <div>
        <Notification ref={this.notif} />
        <div className="form-render" id={this.formDivID}></div>
      </div>
    );
  }
}
export default FormRender;
