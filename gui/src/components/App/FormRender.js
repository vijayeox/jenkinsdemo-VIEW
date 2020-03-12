import "../../public/css/formstyles.scss";
import { Formio } from "formiojs";
import Notification from "../../Notification";
import {
  getComponent,
  flattenComponents,
  eachComponent
} from "formiojs/utils/formUtils";
import React from "react";
import merge from "deepmerge";
import $ from "jquery";
import Swal from "sweetalert2";
import scrollIntoView from "scroll-into-view-if-needed";
import ConvergePayCheckoutComponent from "./Form/Payment/ConvergePayCheckoutComponent";
import DocumentComponent from "./Form/DocumentComponent";
import { countryList } from "./Form/Country.js";
import { phoneList } from "./Form/Phonelist.js";
import SliderComponent from "./Form/SliderComponent";
import FortePayCheckoutComponent from "./Form/Payment/FortePayCheckoutComponent";
import DocumentViewerComponent from "./Form/DocumentViewerComponent";
import RadioCardComponent from "./Form/RadioCardComponent";

class FormRender extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    var userprofile = this.core.make("oxzion/profile").get();
    this.privileges = userprofile.key.privileges;
    this.userprofile = userprofile.key;
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
      data: this.addAddlData(this.props.data),
      page: this.props.page,
      currentForm: null,
      formLevelDelegateCalled: false
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
    try {
      params["commands"] = JSON.parse(commands);
    } catch (e) {
      if (commands["commands"]) {
        params["commands"] = commands["commands"];
      } else {
        params["commands"] = commands;
      }
    }
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
    let response = await helper.request(
      "v1",
      "/app/" + this.state.appId + "/errorlog",
      params,
      "post"
      );
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
  async getForm() {
    // call to api using wrapper
    let helper = this.core.make("oxzion/restClient");
    let form = await helper.request(
      "v1",
      "/app/" + this.state.appId + "/form/" + this.state.formId,
      {},
      "get"
      );
    return form;
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
    let formContent = await helper.request("v1","/activity/" + this.state.activityInstanceId + "/form",{},"get");
    return formContent;
  }
  async getActivityInstance() {
    // call to api using wrapper
    let helper = this.core.make("oxzion/restClient");
    let formContent = await helper.request("v1","/app/" +this.state.appId + "/workflowinstance/" + this.state.workflowInstanceId + "/activityinstance/" + this.state.activityInstanceId + "/form",{},"get");
    return formContent;
  }
  async saveForm(form, data) {
    // this.core.make('oxzion/splash').show();
    if (!form) {
      form = this.state.currentForm;
    }
    var componentList = flattenComponents(form._form.components, true);
    for (var componentKey in componentList) {
      var componentItem = componentList[componentKey];
      if (componentItem && componentItem && componentItem.protected == true) {
        if (data[componentKey]) {
          delete data[componentKey];
        }
      } else if (componentItem && componentItem && componentItem.persistent == false) {
        if (data[componentKey]) {
          delete data[componentKey];
        }
      } else {
        // console.log(componentItem);
      }
    }
    if (form._form["properties"] && form._form["properties"]["submission_commands"]) {
      if (this.state.workflowId) {
        form.data["workflowId"] = this.state.workflowId;
      }
      if (this.state.workflowInstanceId) {
        form.submission.data["workflowInstanceId"] = this.state.workflowInstanceId;
        if (this.state.activityInstanceId) {
          form.submission.data["activityInstanceId"] = this.state.activityInstanceId;
          if (this.state.instanceId) {
            form.submission.data["instanceId"] = $this.state.instanceId;
          }
        }
      }
      var that = this;
      await this.callPipeline(
        form._form["properties"]["submission_commands"],
        this.cleanData(form.submission.data)
        ).then(async response => {
          this.core.make("oxzion/splash").destroy();
          if (response.status == "success") {
            if (response.data) {
              form.setSubmission({data:this.parseResponseData(this.addAddlData(response.data))}).then(function (){
                that.processProperties(form);
              });
              form.triggerChange();
            }
            await this.deleteCacheData().then(response2 => {
              if (response2.status == "success") {
                this.props.postSubmitCallback();
              }
              return response;
            });
          } else {
            if (response.errors) {
              await this.storeError(data, response.errors, "pipeline");
              this.notif.current.notify("Error",response.errors[0].message, "danger");
              return response;
            } else {
              await this.storeCache(data);
              this.notif.current.notify("Error", "Form Submission Failed", "danger");
            }
          }
        });
      } else {
        let helper = this.core.make("oxzion/restClient");
        let route = "";
        let method = "post";
        if (this.state.workflowId) {
          route = "/workflow/" + this.state.workflowId;
          if (this.state.activityInstanceId) {
            route = "/workflow/" + this.state.workflowId + "/activity/" + this.state.activityInstanceId;
            method = "post";
            if (this.state.instanceId) {
              route = "/workflow/" + this.state.workflowId + "/activity/" + this.state.activityId + "/instance/" + this.state.instanceId;
              method = "put";
            }
          }
        } else if (this.state.workflowInstanceId) {
          route = "/workflowinstance/" + this.state.workflowInstanceId;
          if (this.state.activityInstanceId) {
            route = "/workflowinstance/" + this.state.workflowInstanceId + "/activity/" + this.state.activityInstanceId;
            method = "post";
          }
          route = route + "/submit";
        } else {
          route = "/app/" + this.state.appId + "/form/" + this.state.formId + "/file";
          method = "post";
          if (this.state.instanceId) {
            route ="/app/" + this.state.appId + "/form/" +this.state.formId + "/file/" + this.state.instanceId;
            method = "put";
          }
        }
        var response = await helper.request("v1", route, this.cleanData(data), method).then(async response => {
          this.core.make("oxzion/splash").destroy();
          if (response.status == "success") {
            var cache = await this.deleteCacheData().then(response2 => {
              if (response2.status == "success") {
                this.props.postSubmitCallback();
              }
            });
            return response;
          } else {
            var storeCache = await this.storeCache(data).then(
              async cacheResponse => {
                if (response.data.errors) {
                  var storeError = await this.storeError(data,response.data.errors,route).then(storeErrorResponse => {
                      this.notif.current.notify("Error","Form Submission Failed","danger");
                      return storeErrorResponse;
                    });
                  } else {
                    return storeErrorResponse;
                  }
                }
                );
          }
          return response;
        });
        return response;
      }
    }

    cleanData(formData) {
      formData.privileges = undefined;
      formData.userprofile = undefined;
      formData.countryList = undefined;
      formData.phoneList = undefined;
      formData.orgId = this.userprofile.orgid;
      var ordered_data = {};
      Object.keys(formData).sort().forEach(function(key) {
        ordered_data[key] = formData[key];
      });
      return ordered_data;
    }

    addAddlData(data) {
      data = data ? data : {};
      return merge(data, {
        privileges: this.privileges,
        userprofile: this.userprofile,
        countryList: countryList,
        phoneList: phoneList
      });
    }

    async getFormContents(url) {
      let helper = this.core.make("oxzion/restClient");
      let formData = await helper.request("v1", url, {}, "get");
      return formData.data;
    }

    processProperties(form){
      if (form._form["properties"]) {
        this.runDelegates(form, form._form["properties"]);
        this.runProps(form._form,form,form._form["properties"],this.parseResponseData(this.addAddlData(form.submission.data)));
      } else {
        if (form.originalComponent["properties"]) {
          this.runDelegates(form, form.originalComponent["properties"]);
          this.runProps(form.originalComponent,form,form.originalComponent["properties"],this.parseResponseData(this.addAddlData(form.submission.data)));
        }
      }
    }

    loadWorkflow(form) {
      let that = this;
      if (this.state.parentWorkflowInstanceId) {
        this.getFileData().then(response => {
          if (response.status == "success") {
            let fileData = JSON.parse(response.data.data);
            fileData.parentWorkflowInstanceId =
            that.props.parentWorkflowInstanceId;
            fileData.workflowInstanceId = undefined;
            fileData.activityId = undefined;
            that.setState({ data: this.addAddlData(that.parseResponseData(fileData)) });
            that.setState({ formDivID: "formio_" + that.state.formId });
            if(form){
              form.setSubmission({data:that.state.data}).then(function (){
                that.processProperties(form);
              });
            } else {
              this.createForm();
            }
          }
        });
      } else  if (this.state.activityInstanceId && this.state.workflowInstanceId) {
        this.getActivityInstance().then(response => {
          if (response.status == "success") {
            that.setState({ workflowInstanceId: response.data.workflow_instance_id });
            that.setState({ workflowId: response.data.workflow_id });
            that.setState({ activityId: response.data.activity_id });
            that.setState({ data: that.parseResponseData(this.addAddlData(JSON.parse(response.data.data))) });
            that.setState({ content: JSON.parse(response.data.template) });
            if(form){
              form.setSubmission({data:that.state.data}).then(function (){
                that.processProperties(form);
              });
            } else {
              this.createForm();
            }
          }
        });
      } else if (this.state.formId) {
        this.getWorkflow().then(response => {
          if (response.status == "success" && response.data.workflow_id) {
            that.setState({ workflowId: response.data.workflow_id });
            if (response.data.activity_id) {
              that.setState({ activityId: response.data.activity_id });
            }
            if (!that.state.content) {
              that.setState({ content: JSON.parse(response.data.template) });
            }
            if(form){
              that.processProperties(form);
            }
          } else {
            this.getForm().then(response => {
              if (response.status == "success") {
                if (response.data.workflow_id) {
                  that.setState({ workflowId: response.data.workflow_id });
                }
                if (response.data.activity_id) {
                  that.setState({ activityId: response.data.activity_id });
                }
                if (!that.state.content) {
                  that.setState({ content: JSON.parse(response.data.template) });
                }
                if(form){
                   that.processProperties(form);
                }else{
                	setTimeout(function(){ that.createForm().then(form=> {
						that.processProperties(form);
                	}) }, 2000);
                }
              }
            });
          }
          that.setState({ formDivID: "formio_" + that.state.formId });
        });
      } else if (this.state.instanceId) {
        this.getInstanceData().then(response => {
          if (response.status == "success" && response.data.workflow_id) {
            that.setState({ workflowInstanceId: response.data.workflow_instance_id });
            that.setState({ workflowId: response.data.workflow_id });
            that.setState({ activityId: response.data.activity_id });
            that.setState({ data: this.addAddlData(JSON.parse(response.data.data)) });
            that.setState({ content: response.data.template });
            if(form){
              form.setSubmission({data:that.state.data}).then(function (){
                that.processProperties(form);
              });
            } else {
              this.createForm();
            }
          }
        });
      } else {
        if(form){
          that.processProperties(form);
        }
      }
    }
    createForm() {
      let that = this;
      Formio.registerComponent("slider", SliderComponent);
      Formio.registerComponent("convergepay", ConvergePayCheckoutComponent);
      Formio.registerComponent("document", DocumentComponent);
      Formio.registerComponent("fortepay", FortePayCheckoutComponent);
      Formio.registerComponent("documentviewer", DocumentViewerComponent);
      Formio.registerComponent("radiocard", RadioCardComponent);
      if (this.state.content && !this.state.form) {
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
            var form_data = JSON.parse(JSON.stringify(submission.data));
            // storeCache has to be fixed: For CSR if storeCache called, startForm will be loaded once we reload.
            that.storeCache(that.cleanData(form_data));
            next(null);
          },
          beforeCancel: () => {
            Swal.fire({
              title: "Are you sure?",
              text:
                "Do you really want to cancel the submission? This action cannot be undone!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              cancelButtonText: "No",
              confirmButtonText: "Yes",
              target:".AppBuilderPage"
            }).then(result => {
              if (result.value) {
                that.props.postSubmitCallback();
              }
            });
          }
        };
        options.hooks = hooks;
        var formCreated = Formio.createForm(document.getElementById(this.formDivID),this.state.content,options).then(function (form) {
          if (that.state.page && form.wizard) {
            if (form.wizard && form.wizard.display == "wizard") {
              form.setPage(parseInt(that.state.page));
              var breadcrumbs = document.getElementById(form.wizardKey + "-header");
              if (breadcrumbs) {
                // breadcrumbs.style.display = "none";
              }
            }
          }
          if(that.state.data !=  undefined){
            form.setSubmission({ data: that.state.data });
          }
          form.on("submit", async function (submission) {
            var form_data = that.cleanData(submission.data);
            var response_data = await that.saveForm(null, form_data);
            console.log(response_data);
            // Not able to get the returned response here from saveForm (Bharat)
            // if (response_data.status == "success") {
            //   form.emit("submitDone", response_data);
            // } else {
            //   form.emit("error", response_data);
            // }
          });
          form.on("prevPage", changed => {
            form.emit("render");
            that.setState({ page: changed.page });
          });
          form.on("nextPage", changed => {
            form.emit("render");
            that.runDelegates(form, form.pages[changed.page].originalComponent['properties']);
            that.setState({ page: changed.page });
            if (form.pages[changed.page]["properties"]["delegate"]) {
              if (form.pages[changed.page]["properties"]["delegate"]) {
                var form_data = that.cleanData(form.submission.data);
                that.callDelegate(form.pages[changed.page]["properties"]["delegate"], form_data).then(response => {
                  if (response) {
                    that.core.make("oxzion/splash").destroy();
                    if (response.data) {
                      form.setSubmission({ data: that.parseResponseData(that.addAddlData(response.data)) });
                    }
                  }
                });
              }
            }
          });

          form.on("change", function (changed) {
            // for (var dataItem in form.submission.data) {
            //   if (typeof form.submission.data[dataItem] == "object") {
            //     if (form.submission.data[dataItem]) {
            //       var checkComponent = form.getComponent(dataItem);
            //       if (checkComponent && checkComponent.type == "datagrid") {
            //         for (var rowItem in Object.keys(form.submission.data[dataItem])) {
            //           if (Array.isArray(form.submission.data[dataItem][rowItem])) {
            //             if(Object.keys(form.submission.data[dataItem][rowItem]).length == 0){
            //               console.log(form.submission.data[dataItem][rowItem])
            //               form.submission.data[dataItem][rowItem] = Object.assign({}, form.submission.data[dataItem][rowItem]);
            //             }
            //           }
            //         }
            //       }
            //     }
            //   }
            // }
            console.log(changed);
            if (changed && changed.changed) {
              var component = changed.changed.component;
              var properties = component.properties;
              if (properties && (Object.keys(properties).length > 0)) {
                if (component != undefined) {
                  that.runProps(component, form, properties, changed.data);
                } else {
                  if (changed.changed != undefined) {
                    that.runProps(changed.changed, form, changed.changed.properties, changed.data);
                  }
                }
              }
            }
          });
          form.on("render", function () {
            if (form.wizard && form.wizard.display == "wizard") {
              var breadcrumbs = document.getElementById(form.wizardKey + "-header");
              if (breadcrumbs) {
                // breadcrumbs.style.display = "none";
              }
            }
            eachComponent(form.root.components, function (component) {
              if (component) {
                if (component.component.properties && component.component.properties.custom_list) {
                  var targetComponent = form.getComponent(component.component.key);
                  if (targetComponent) {
                    switch (component.component.properties.custom_list) {
                      case "user_list":
                        var commands = { commands: [{ command: "getuserlist" }] };
                        that.callPipeline(commands, form.submission).then(response => {
                          that.core.make("oxzion/splash").destroy();
                          if (response.data) {
                            component.setValue(response.data.userlist);
                          }
                        });
                        break;
                      default:
                        break;
                    }
                  }
                }
              }
            },true);
            var elm = document.getElementsByClassName(that.state.appId + "_breadcrumbParent");
            if (elm.length > 0) {
              scrollIntoView(elm[0], { scrollMode: "if-needed",block: "center",behavior: "smooth",inline: "nearest" });
            }
            if (that.state.formLevelDelegateCalled == false) {
              that.setState({formLevelDelegateCalled: true});
            }
          });
          form.on("customEvent", function (event) {
            var changed = event.data;
            if (event.type == "callDelegate") {
              var component = event.component;
              if (component) {
                that.core.make("oxzion/splash").show();
                var properties = component.properties;
                if (properties) {
                  if (properties["delegate"]) {
                    if (properties["sourceDataKey"] && properties["destinationDataKey"]) {
                      var paramData = {};
                      paramData[properties["valueKey"]] = changed[properties["sourceDataKey"]];
                      that.core.make("oxzion/splash").show();
                      that.callDelegate(properties["delegate"], paramData).then(response => {
                        var responseArray = [];
                        for (var responseDataItem in response.data) {
                          if (response.data.hasOwnProperty(responseDataItem)) {
                            responseArray[responseDataItem] = response.data[responseDataItem];
                          }
                        }
                        if (response.data) {
                          if (response.data) {
                            var destinationComponent = form.getComponent(properties["destinationDataKey"]);
                            if (properties["validationKey"]) {
                              if (properties["validationKey"] && response.data[properties["validationKey"]]) {
                                var componentList = flattenComponents(destinationComponent.componentComponents, false);
                                var valueArray = [];
                                for (var componentKey in componentList) {
                                  valueArray[componentKey] = response.data[componentKey];
                                }
                                valueArray = Object.assign({}, valueArray);
                                changed[properties["destinationDataKey"]].push(valueArray);
                              }
                              if (properties["clearSource"]) {
                                changed[properties["sourceDataKey"]] = "";
                              }
                            }
                            form.setSubmission({ data: that.parseResponseData(that.addAddlData(changed)) }).then(response2 => {
                              destinationComponent.triggerRedraw();
                            });
                          }
                        }
                        that.core.make("oxzion/splash").destroy();
                      });
                    } else if (properties["sourceDataKey"]) {
                      var paramData = {};
                      paramData[properties["valueKey"]] = changed[properties["sourceDataKey"]];
                      that.core.make("oxzion/splash").show();
                      that.callDelegate(properties["delegate"], paramData).then(response => {
                        var responseArray = [];
                        for (var responseDataItem in response.data) {
                          if (response.data.hasOwnProperty(responseDataItem)) {
                            responseArray[responseDataItem] =
                              response.data[responseDataItem];
                          }
                        }
                        if (response.data) {
                          if (properties["validationKey"]) {
                            if (properties["validationKey"] && response.data[properties["validationKey"]]) {
                              var valueArray = [];
                              for (var item in response.data) {
                                changed[item] = response.data[item];
                              }
                            }
                            if (properties["clearSource"]) {
                              changed[properties["sourceDataKey"]] = "";
                            }
                          }
                          form.setSubmission({ data: that.parseResponseData(that.addAddlData(changed)) });
                          destinationComponent.triggerRedraw();
                        }
                        that.core.make("oxzion/splash").destroy();
                      });
                    } else {
                      that.callDelegate(properties["delegate"], that.cleanData(changed)).then(response => {
                        that.core.make("oxzion/splash").destroy();
                        if (response.data) {
                          form.setSubmission({ data: that.parseResponseData(that.addAddlData(response.data)) });
                        }
                      });
                    }
                  }
                }
              }
            }
            if (event.type == "triggerFormChange") {
              form.triggerChange();
            }
            if (event.type == "callPipeline") {
              var component = event.component;
              if (component) {
                that.core.make("oxzion/splash").show();
                var properties = component.properties;
                if (properties["commands"]) {
                  that.callPipeline(properties["commands"], that.cleanData(changed)).then(response => {
                    that.core.make("oxzion/splash").destroy();
                    if (response.data) {
                      try {
                        var formData = that.parseResponseData(that.addAddlData(response.data));
                        form.setSubmission({ data: formData }).then(response2 => {
                          that.runProps(component, form, properties, that.parseResponseData(that.addAddlData(form.submission.data)));
                        });
                      } catch (e) {
                        console.log(e);
                      }
                    }
                  });
                }
              }
            }
          });
          form.formReady.then(() => {
            console.log("formReady");
          });
          form.submissionReady.then(() => {
            console.log("submissionReady");
            form.element.addEventListener("getAppDetails", function (e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              var evt = new CustomEvent("appDetails", { detail: { core: that.core, appId: that.state.appId, uiUrl: that.core.config("ui.url"), wrapperUrl: that.core.config("wrapper.url") } });
              form.element.dispatchEvent(evt);
            }, true);
            form.emit("render");
          });
          that.setState({ currentForm: form });
          return form;
        });
      }
      return formCreated;
}
triggerComponent(form,targetProperties){
  var targetList = targetProperties.split(',');
  targetList.map(item => 
  {
    var targetComponent = form.getComponent(item);
    setTimeout(function(){
      if(targetComponent.type == 'datagrid'){
        targetComponent.triggerRedraw();
      }
            // targetComponent.triggerChange();
          },3000);
  }
  )
};

postDelegateRefresh(form,properties){
  var targetList = properties["post_delegate_refresh"].split(',');
  targetList.map(item => {
   var targetComponent = form.getComponent(item);
   console.log(targetComponent);
   if(targetComponent.component && targetComponent.component["properties"]){
    if(targetComponent.type == 'datagrid' || targetComponent.type == 'selectboxes'){
      targetComponent.triggerRedraw();
    }
    if(targetComponent.component['properties']){
      this.runProps(targetComponent,form,targetComponent.component['properties'],form.submission.data);
    } else {
      if(targetComponent.component && targetComponent.component.properties){
        this.runProps(targetComponent,form,targetComponent.component.properties,form.submission.data);
      } 
    }
  }
});
}
runProps(component,form,properties,formdata){
  if(formdata.data){
    formdata = formdata.data;
  }
  var that =this;
  if(properties && (Object.keys(properties).length > 0)){
    if (properties["delegate"]) {
      this.core.make("oxzion/splash").show();
      this.callDelegate(properties["delegate"],this.cleanData(formdata)).then(response => {
        if (response) {
          if (response.data) {
            var formData = { data: this.parseResponseData(this.addAddlData(response.data))};
            form.setSubmission(formData).then(response2 =>{
            if (properties["post_delegate_refresh"]) {
              this.postDelegateRefresh(form,properties);
            }
            form.setPristine(true);
            });
          }
          this.core.make("oxzion/splash").destroy();
        }
      });
    }
    if (properties["target"]) {
      var targetComponent = form.getComponent(properties["target"]);
      var value;
      if (component.dataValue != undefined && targetComponent != undefined) {
        value = formdata[component.dataValue];
        if (component.dataValue != undefined && component.dataValue.value != undefined && formdata[component.dataValue.value] != undefined) {
          formdata[component.key] = formdata[component.dataValue.value];
        } else if (component.dataValue.value != undefined) {
          value = component.dataValue.value;
        } else if(formdata[component.dataValue] != undefined){
          value = formdata[component.dataValue];
        } else {
          value = component.dataValue;
        }
        if(value == undefined){
          if(formdata[formdata[component.key]]){
            value = formdata[component.key];
          }
        }
        if(value != undefined){
          targetComponent.setValue(value);
          form.submission.data[targetComponent.key] = value; 
        }
      } else {
        if (component != undefined && targetComponent != undefined) {
          if (component.value != undefined && component.value.value != undefined && formdata[component.value.value] != undefined) {
            value = formdata[component.value.value];
          } else  if (component.value != undefined && component.value.value != undefined) {
            value = component.value.value;
          } else if(formdata[component.value] != undefined){
            value = formdata[component.value];
          } else if(formdata[formdata[component.key]] != undefined){
            value = formdata[formdata[component.key]];
          } else if(formdata[formdata[component.key]] != undefined){
            value = formdata[formdata[component.key]];
          } else if(formdata[formdata[component.key].value] != undefined){
            value = formdata[formdata[component.key].value];
          }else if(formdata[component.key] != undefined){
            value = formdata[component.key];
          } else {
            value = component.value;
          }
          if(value == undefined){
            if(formdata[formdata[component.key]]){
              value = formdata[component.key];
            }
          }
          if(value != undefined){
            targetComponent.setValue(value);
            form.submission.data[targetComponent.key] = value;
          }
        } else {
          if (document.getElementById(properties["target"])) {
            value = formdata[component.value];
            if (component.value != undefined && component.value.value != undefined) {
              value = formdata[component.value.value];
            } else if (value && value != undefined) {
              value = value;
            } else if(formdata[formdata[component.key]] != undefined){
              value = formdata[formdata[component.key]];
            } else if(formdata[component.key] != undefined){
              value = formdata[component.key];
            } else {
              if (component.value != undefined && component.value.value != undefined) {
                value = component.value.value;
              } else {
                value = component.value;
              }
            }
            if(value == undefined){
              if(formdata[formdata[component.key]]){
                value = formdata[component.key];
              }
            }
            document.getElementById(properties["target"]).value  = value;
          }
        }
      }
      if(targetComponent && targetComponent.component && targetComponent.component.properties){
        that.runProps(targetComponent.component,form,targetComponent.component.properties,form.submission.data);
        form.setPristine(true);
      }
    }
      if (properties["negate"]) {
        var targetComponent = form.getComponent(properties["negate"]);
        if (component.value && targetComponent) {
          if (component.value.value) {
            targetComponent.setValue(!component.value.value);
          } else {
            targetComponent.setValue(!component.value);
          }
        } else {
          if(formdata[component.key]){
            targetComponent.setValue(!formdata[component.key]);
          }
        }
      } 
      if (properties["render"]) {
        var targetList = properties["render"].split(',');
        targetList.map(item => {
         var targetComponent = form.getComponent(item);
         if(targetComponent.component && targetComponent.component.properties){
            that.runProps(targetComponent.component,form,targetComponent.component.properties,form.submission.data);
            console.log(targetComponent);
            that.runDelegates(form, targetComponent.component["properties"]);
         }
       });
    }
    form.setPristine(true);
  }
}
runDelegates(form, properties) {
  if (properties) {
    if (properties["delegate"]) {
      this.callDelegate(properties["delegate"],this.cleanData(form.submission.data)).then(response => {
        this.core.make("oxzion/splash").destroy();
        if (response.data) {
          let form_data = this.parseResponseData(
            this.addAddlData(response.data)
            );
          form.setSubmission({data:form_data});
        }
      });
    }
    if (properties["commands"]) {
      var that = this;
      this.callPipeline(properties["commands"],this.cleanData(form.submission.data)).then(response => {
        this.core.make("oxzion/splash").destroy();
        if (response.status == "success") {
          if (response.data) {
             form.setSubmission({data:that.parseResponseData(that.addAddlData(response.data))}).then(response2 =>{
              if (properties["post_delegate_refresh"]) {
                this.postDelegateRefresh(form,properties);
              }else{
                that.runProps(null,form,properties,that.parseResponseData(that.addAddlData(form.submission.data))); 
              }  
            });
          }
        }
      });
    }
    if (properties["payment_confirmation_page"]) {
      var elements = document.getElementsByClassName("btn-wizard-nav-submit");
      this.getPayment(form.submission.data).then(response => {
        var responseArray = [];
        if (response.data) {
          var evt = new CustomEvent("paymentDetails", { cancelable: true,detail: response.data[0] });
          form.element.dispatchEvent(evt);
        }
      });
      var that = this;
      form.element.removeEventListener("requestPaymentToken",function(e) { that.requestPaymentToken(that,form, e)},false);
      form.element.addEventListener("requestPaymentToken",function(e) { that.requestPaymentToken(that,form, e)},false);
      form.element.addEventListener("paymentSuccess", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        that.core.make("oxzion/splash").show();
        var transactionIdComponent = form.getComponent("transaction_id");
        that.storePayment({transaction_id: transactionIdComponent.getValue(),data: e.detail.data,status: e.detail.status}).then(response => {
          that.notif.current.notify("Payment has been Successfully completed!","Please wait while we get things ready!","success");
          var formsave = that.saveForm(form,that.state.currentForm.submission.data);
          var transactionStatusComponent = form.getComponent("transaction_status");
          transactionStatusComponent.setValue(e.detail.status);
          if (formsave) {
            that.notif.current.notify("Success","Application Has been Successfully Submitted","success");
          } else {
            that.notif.current.notify("Error",e.detail.message,"danger");
          }
          that.core.make("oxzion/splash").destroy();
        });
      },false);
      form.element.addEventListener("tokenFailure",function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(e.detail.error){
          that.notif.current.notify("Error", e.detail.message, "danger");
        }
      },false);
      form.element.addEventListener("paymentDeclined",function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var transactionIdComponent = form.getComponent("transaction_id");
        that.storePayment({transaction_id: transactionIdComponent.getValue(),data: e.detail.data}).then(response => {
          that.notif.current.notify("Error", e.detail.message, "danger");
          that.core.make("oxzion/splash").destroy();
        });
      },false);
      form.element.addEventListener("paymentCancelled",function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        that.notif.current.notify("Warning", e.detail.message, "danger");
        that.core.make("oxzion/splash").destroy();
      },false);
      form.element.addEventListener("paymentError", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var transactionIdComponent = form.getComponent("transaction_id");
        that.storePayment({transaction_id: transactionIdComponent.getValue(),data: e.detail.data}).then(response => {
          that.notif.current.notify("Error", e.detail.message, "danger");
          that.core.make("oxzion/splash").destroy();
        });
      },false);
      form.element.addEventListener("paymentPending", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        that.core.make("oxzion/splash").show();
        that.notif.current.notify("Information",e.detail.message,"default");
      },false);
    }
  }
}
requestPaymentToken(that,form,e){
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  that.core.make("oxzion/splash").show();
  let requestbody = {firstname: e.detail.firstname,lastname: e.detail.lastname,amount: e.detail.amount};
  that.callPayment(e.detail).then(response => {
    var transactionIdComponent = form.getComponent("transaction_id");
    if (response.data.transaction.id && response.data.token) {
      transactionIdComponent.setValue(response.data.transaction.id);
      var evt = new CustomEvent("getPaymentToken", { detail: response.data });
      form.element.dispatchEvent(evt);
    } else {
      that.notif.current.notify("Error","Transaction Token Failed!","danger");
    }
    that.core.make("oxzion/splash").destroy();
  });
}
parseResponseData = data => {
  var parsedData = {};
  Object.keys(data).forEach(key => {
    try {
      parsedData[key] = data[key] ? JSON.parse(data[key]) : "";
    } catch (error) {
      if(data[key] != undefined){
        parsedData[key] = data[key];
      }
    }
  });
  return parsedData;
};

componentDidMount() {
  if (this.props.url) {
    this.getFormContents(this.props.url).then(response => {
      var parsedData = {};
      if (response.data) {
        parsedData = this.parseResponseData(this.addAddlData(JSON.parse(response.data)));
      }
      response.workflow_uuid
      ? (parsedData.workflow_uuid = response.workflow_uuid)
      : null;
      this.setState({
        content: JSON.parse(response.template),
        workflowInstanceId: response.workflow_instance_id,
        activityInstanceId: response.activity_instance_id,
        workflowId: response.workflow_uuid,
        formId: response.form_id
      });
      this.createForm().then(form => {
        if(Object.keys(parsedData).length > 1){//to account for only workflow_uuid
          var that = this;
          form.setSubmission({data: parsedData}).then(respone=> {
            that.processProperties(form);
          });
        }else{
          this.loadWorkflow(form);
        }
        this.setState({
          data: {"AddILocPremium":472.27290000000005,"AddILocTax":85.8678,"ApplicantName":"Nikhil S ","BuildingLimitFP":1.23,"City2":"","ContentsFP":13.31,"CoverageFP":1874,"ExcessLiabilityFP":567,"IfyouhaveapoolisitusedforactivitiesotherthandivingandorswimmingIfyescontactVicenciaBuckleyforsupplementalformPL":true,"LiaTax":197.28,"LossofBusIncomeFP":400,"MI":"J","MedicalExpenseFP":55,"Non-OwnedAutoFP":113,"PAORFee":"","ProRataPremium":1221.8382000000001,"PropDeductibleCredit":18.115398000000003,"PropTax":24.872400000000003,"TAEO100kTo500k":340,"TAEOunder100k":283,"TitleofApplicant":"Software Developer","TravelAgentEOFP":283,"activityInstanceId":"3c88c4f8-62aa-11ea-b810-5ac21fcab9ac","additionalInsured":[{"name":"Georgia J Bolin","address":"1559 Coplin Avenue","city":"Phoenix","country":{"country":"United States of America","states":["Alabama","Alaska","American Samao","Arizona","Arkansas","Armed Forces America","Armed Forces Pacific","Armed Forces Other","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","North Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]},"state":"Alabama","zip":"85003","additionalInformation":"","businessRelation":"diveStoreOwner"}],"additionalLocations":[{"name":"Georgia J Bolin","city":"Phoenix","additionalLocationState":"Alabama","dsPropCentralFireAL":{"centralStationAlarmAL":"yes","fireSprinklersAL":"yes"},"additionalLocationFurniturefixturesAndEquipment":213,"additionalLocationTableInventoryStock":6776,"additionalLocationPropertyOfOthers":78,"additionalLocationSignsAttachedOrDetached":77,"additionalLocationTenantImprovements":88,"additionalLocationOther":778,"additionalLocationDoYouOwnPropertyIncludingCompressorsOffPremises":990,"additionalLocationPropertyTotal":9000,"ALBuildingReplacementValue":123,"estimatedMonthlyReceipts":2133,"ALPoolLiability":1233,"propertyValueToBeInsured":"","claimsinLast5Years":"no","ALTravelAgentEoCheckBox":true,"ReceiptsAmont":213,"ALLossofBusIncomeCheckBox":true,"ALLossofBusIncome":"40000.00","address":"1559 Coplin Avenue","country":{"country":"United States of America","states":["Alabama","Alaska","American Samao","Arizona","Arkansas","Armed Forces America","Armed Forces Pacific","Armed Forces Other","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","North Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]},"buildingConstruction":"masonry","distanceFromOceanOrGulf":"123","additionalLocationDoYouOwntheBuilding":"yes","explainationAL":"","receiptsAL":[],"doyouhaveapoolonpremisesAL":true,"doyouhaveanyincidentallocationsiEOfficekiosketcAL":false,"doyouhavepropertyatthatlocationtobeinsuredAL":false,"doyouconductrecreationalorbusinessactivitiesotherthandivingatyourfacilityAL":false,"cylinderhydrostatictestingAL":false,"otherequipmentsalesAL":false,"otherequipmentrepairsAL":false,"otherequipmentrentalsAL":false,"otherbusinessactivityAL":false,"zip":1233,"squarefootageofyourbuildingAL":"","updatesOnPlumbingElectricalRoofEtcAL":"","yearBuildAL":2020,"ifyouhaveapoolisitusedforactivitiesotherthandivingandorswimmingIfyescontactVicenciaBuckleyforsupplementalformAL":true,"ALCoverageFP":187.4,"ALnonDivingPoolAmount":396,"ALMedicalExpenseFP":5.5,"ALNonOwnedAutoFP":11.3,"ALExcessLiabilityFP":56.7,"ALTravelAgentEOFP":283,"ALContentsFP":90,"ALLossofBusIncomeFP":400,"ALBuildingLimitFP":1.23,"ALliabilityCoveragesTotal":939.9,"ALPropertyCoveragesTotal":491.23,"ALLiabilityPropertyCoveragesTotal":1431.13,"ALProRataPremiumPercentage":0.33,"ALProRataPremium":472.27290000000005,"ALliabilityTaxPercentage":"6","ALliabilityTaxTotal":56.394,"ALPropertyTaxPercentage":"6","ALPropertyTaxTotal":29.4738,"ALTotalTax":85.8678,"locationTotal":558.1407,"ALCoverageCheckBox":true,"ALPropertyCoverageOption":"nonCat","ALMedicalExpenseCheckBox":true,"ALNonOwnedAutoCheckBox":true,"ALExcessLiabilityCheckBox":true}],"additionalLocationsSelect":"yes","additionalLossofBusinessIncomePL":true,"additional_insured_select":"yes","address1":"1559 Coplin Avenue","address2":"","address3":"Phoenix","address4":"","appId":"d77ea120-b028-479b-8c6e-60476b6a4456","app_id":"28","approverEmailId":"testhub07@gmail.com","approverName":"Admin User","attachmentsFieldnames":["receipts",["additionalLocations","receiptsAL"],["groupPL","document"]],"buisness_work_number":1233,"businessPadiVerified":true,"businessPadiVerified1":"","business_address1":"1559 Coplin Avenue","business_address2":"","business_city":"Phoenix","business_country":"United States of America","business_email":"PansyBJordan@teleworm.us","business_email1":"PansyBJordan@teleworm.us","business_fax":"(123) 123-1231","business_name":"sasa","business_padi":1976,"business_state":"Alaska","business_website":"","business_work_phone":"11233","business_zip":85003,"city":"Phoenix","city1":"Phoenix","country":"United States of America","country1":{"country":"United States of America","states":["Alabama","Alaska","American Samao","Arizona","Arkansas","Armed Forces America","Armed Forces Pacific","Armed Forces Other","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","North Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]},"csrApproved":"accepted","current_insurance_company":"","cylinderhydrostatictestingPL":"","dialCode":"+1684","discontinuedOperation":816,"doyouhaveanyincidentallocationsiEOfficekiosketcPL":"","doyouhaveapoolonpremisesPL":true,"doyouhavepropertyatthatlocationtobeinsuredPL":"","dsPropCentralFirePL":{"centralStationAlarmPL":"yes","fireSprinklersPL":"yes"},"dsbidba":"soleProprietor","dsbiplsexplain":"","dsbireqpolicyperiod":"2020-03-10T13:02:00+05:30","dsbishareholders":"","dsbiwhoarepartners":"","dsglClaimAmountpaidanyamountsoutstanding":[{"dsgldateoftheclaim":""}],"dsglPleasedescribehere":"","dsglbusinessactivity":"","dsgleqprentals":"","dsgleqprepairs":"","dsgleqpsales":"","dsglestmonthretailreceipt":213,"dspropFurniturefixturesandequip":213,"dspropPleaseexplainlocation":"","dspropTennantImprv":66,"dspropTotal":1331,"dspropUpdatesonplumbingelectricalroofetc":"","dspropWhatisthesquarefootageofyourbuilding":123,"dspropbuildingconstr":"woodFrame","dspropdistfrmoceangulf":123,"dspropinventory":766,"dspropofothers":66,"dspropother":77,"dspropownbuilding":"yes","dspropownpropincludingcompr":66,"dspropreplacementvalue":123,"dspropsignsattachedordetached":77,"email":"sample2@teleworm.us","email1":"PansyBJordan@teleworm.us","end_date":"2020-06-30T00:00:00+05:30","estimatedAnnualReceipts":123,"excessLiabilityCoverage":"excessLiabilityCoverage1M","excessLiabilityCoverage1M":567,"excessLiabilityCoverage2M":1133,"excessLiabilityCoverage3M":1700,"excessLiabilityCoverage4M":2266,"excessLiabilityCoverage9M":5381,"excessLiabilityCoveragePrimarylimit1000000PL":true,"fax":"(243) 123-1231","fileId":"b6e7e9ca-cd96-40af-a1f8-100828686627","firstname":"Georgia","firstname1":"Georgia","gdprAgreement":true,"groupAdditionalInsured":[[]],"groupCoverage":970,"groupCoverageMoreThan0":462,"groupCoverageMoreThan100000":1178,"groupCoverageMoreThan150000":1524,"groupCoverageMoreThan200000":1618,"groupCoverageMoreThan25000":762,"groupCoverageMoreThan250000":1940,"groupCoverageMoreThan350000":2080,"groupCoverageMoreThan50000":970,"groupCoverageMoreThan500000":2310,"groupCoverageSelect":"groupCoverageMoreThan50000","groupExcessLiability":1212.5,"groupExcessLiability1M":65,"groupExcessLiability2M":125,"groupExcessLiability3M":160,"groupExcessLiability4M":200,"groupExcessLiability9M":350,"groupExcessLiabilitySelect":"groupExcessLiability2M","groupNamedInsureds":[],"groupPAORfee":"","groupPL":[{"initial":"S","address1":"","address2":"","firstname":"Nikhil","zip":"","verified":true,"lastname":"s","home_phone":"","work_phone":"","address_international":"","state2":"","city3":"","country":"","email":"","document":[]}],"groupPadi":"","groupPadiFee":175,"groupPadiFeeAmount":175,"groupProfessionalLiability":2488.45,"groupProfessionalLiabilitySelect":"yes","groupReceipts":1233,"groupTaxAmount":130.95,"groupTaxPercentage":"6","groupTotalAmount":2488.45,"group_additional_insureds_select":"","group_named_insureds_select":"","home_country_code":93,"home_phone":"93(602) 568-2323","home_phone_number":"(602) 568-2323","identifier_field":"padi","initial":"S","lakequarrypondContactVicenciaBuckleyforsupplementalformPL":"","lastname":"Bolin","lastname1":"Bolin","liability":true,"liabilityCoverageOption":"standardCoverage50001To100000","liabilityCoveragesTotalPL":3288,"liabilityOnly100001To200000":2153,"liabilityOnly1MAndOver":3359,"liabilityOnly200001To350000":2470,"liabilityOnly350001To500000":2939,"liabilityOnly500001To1M":3141,"liabilityOnly50001To100000":1874,"liabilityOnlyUpTo50000":1631,"liabilityProRataPremium":1085.04,"liabilityPropertyCoveragesTotalPL":3702.54,"liabilityTaxPL":"6","limitOver0CoverBuildingCat":0.02,"limitOver0CoverBuildingNonCat":0.01,"limitOver0CoverBusIncomeCat":0.02,"limitOver0CoverBusIncomeNonCat":0.01,"limitOver100000CoverBuildingCat":0.02,"limitOver100000CoverBuildingNonCat":0.01,"limitOver100000CoverBusIncomeCat":0.01,"limitOver100000CoverBusIncomeNonCat":0.01,"limitOver250000CoverBuildingCat":0.01,"limitOver250000CoverBuildingNonCat":0.01,"limitOver250000CoverBusIncomeCat":0.01,"limitOver250000CoverBusIncomeNonCat":0.01,"limitOver500000CoverBuildingCat":0.01,"limitOver500000CoverBuildingNonCat":0.01,"limitOver500000CoverBusIncomeCat":0.01,"limitOver500000CoverBusIncomeNonCat":0.01,"lossOfBusIncome":40000,"lossPayees":[{"name":"Georgia J Bolin","address":"1559 Coplin Avenue","city":"Phoenix","state":"Alabama","country":{"country":"United States of America","states":["Alabama","Alaska","American Samao","Arizona","Arkansas","Armed Forces America","Armed Forces Pacific","Armed Forces Other","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","North Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]},"zip":12333}],"lossPayeesSelect":"yes","mailaddress1":"","mailaddress2":"","medicalExpense":55,"medicalExpensePLCheckBox":true,"mobile_phone":"213(211) 212-3123","namedPadi":"","nonDivingPoolAmount":396,"nonOwnedAutoLiability100K":113,"nonOwnedAutoLiability1M":849,"nonOwnedAutoLiabilityPL":"nonOwnedAutoLiability100K","orgId":"f0033dc0-126b-40ba-89e0-d3061bdeda4c","otherbusinessactivityPL":"","otherequipmentrentalsPL":"","otherequipmentrepairsPL":"","otherequipmentsalesPL":"","padi":444444,"padiEmpty":"","padiFee":50,"padiFeePL":50,"padiNotFound":"","padiVerified":true,"padi_empty":"","page4PanelPanelPanelColumnsAverage":"","page5ColumnsPanel3TextArea":"","page5ColumnsPanelAcknowledged":true,"page5PanelColumns4HiddenField":"","pageNaNPanel3ColumnsPanelHaveyouhadanystorepropertyfiretheftburglarytheftetcOrliabilityslipfallotherinStoreliabilityclaimsinthelastfive5Years":"no","pageNaNPanel3ColumnsPanelText":"","panelPanel2ColumnsValidatePadiMembership":"","panelPanelColumns2ValidateBusinessPadi":true,"phone":"213(211) 212-3123","phone_country_code":213,"phone_number":"(211) 212-3123","physical_city":"","physical_country":"United States of America","physical_state":"","physical_zip":85003,"policy_exists":"","poolLiability":133,"poolLiabilityOver0":396,"poolLiabilityOver20k":793,"poolLiabilityOver50k":1189,"proRataFactorsApr":0.25,"proRataFactorsAug":0.91,"proRataFactorsDec":0.58,"proRataFactorsFeb":0.41,"proRataFactorsJan":0.49,"proRataFactorsJul":1,"proRataFactorsJun":0.08,"proRataFactorsMar":0.33,"proRataFactorsMay":0.16,"proRataFactorsNov":0.66,"proRataFactorsOct":0.75,"proRataFactorsSep":0.83,"proRataPercentage":0.33,"product":"Dive Store","property":true,"propertyCoverageOption":"nonCat","propertyCoveragesTotalPL":414.54,"propertyDeductibles":"propertyDeductibles2500","propertyDeductibles1000":0,"propertyDeductibles2500":4.37,"propertyDeductibles5000":8.93,"propertyDeductiblesPercentage":4.37,"propertyProRataPremium":136.7982,"propertyTaxPL":"6","receipts":[],"recreationalorbusinessactivitiesfacilityPL":"","sameasmailingaddress":true,"standardCoverage100001To200000":2153,"standardCoverage1MAndOver":3359,"standardCoverage200001To350000":2470,"standardCoverage350001To500000":2939,"standardCoverage500001To1M":3141,"standardCoverage50001To100000":1874,"standardCoverageUpTo50000":1631,"start_date":"2020-03-10T13:02:00+05:30","state":"Alabama","state1":"Alabama","stateTaxData":[{"state":"Alabama","coverage":"liability","percentage":"6"},{"state":"Alaska","coverage":"liability","percentage":"4"},{"state":"American Samoa","coverage":"liability","percentage":"3"},{"state":"Arizona","coverage":"liability","percentage":"3"},{"state":"Arkansas","coverage":"liability","percentage":"4"},{"state":"California","coverage":"liability","percentage":"3"},{"state":"Colorado","coverage":"liability","percentage":"3"},{"state":"Connecticut","coverage":"liability","percentage":"4"},{"state":"Delaware","coverage":"liability","percentage":"3"},{"state":"District of Columbia","coverage":"liability","percentage":"2"},{"state":"Federated States of Micronesia","coverage":"liability","percentage":"0"},{"state":"Florida","coverage":"liability","percentage":"3"},{"state":"Georgia","coverage":"liability","percentage":"4"},{"state":"GUAM","coverage":"liability","percentage":"3"},{"state":"Hawaii","coverage":"liability","percentage":"5"},{"state":"Idaho","coverage":"liability","percentage":"2"},{"state":"Illinois","coverage":"liability","percentage":"4"},{"state":"Indiana","coverage":"liability","percentage":"3"},{"state":"Iowa","coverage":"liability","percentage":"1"},{"state":"Kansas","coverage":"liability","percentage":"6"},{"state":"Kentucky","coverage":"liability","percentage":"5"},{"state":"Louisiana","coverage":"liability","percentage":"5"},{"state":"Maine","coverage":"liability","percentage":"3"},{"state":"Marshall Islands","coverage":"liability","percentage":"0"},{"state":"Maryland","coverage":"liability","percentage":"3"},{"state":"Massachusetts","coverage":"liability","percentage":"4"},{"state":"Michigan","coverage":"liability","percentage":"3"},{"state":"Minnesota","coverage":"liability","percentage":"3"},{"state":"Mississippi","coverage":"liability","percentage":"7"},{"state":"Missouri","coverage":"liability","percentage":"5"},{"state":"Montana","coverage":"liability","percentage":"3"},{"state":"Nebraska","coverage":"liability","percentage":"3"},{"state":"Nevada","coverage":"liability","percentage":"4"},{"state":"New Hampshire","coverage":"liability","percentage":"3"},{"state":"New Jersey","coverage":"liability","percentage":"5"},{"state":"New Mexico","coverage":"liability","percentage":"3"},{"state":"New York","coverage":"liability","percentage":"4"},{"state":"North Carolina","coverage":"liability","percentage":"5"},{"state":"North Dakota","coverage":"liability","percentage":"2"},{"state":"Northern Mariana Islands","coverage":"liability","percentage":"3"},{"state":"Ohio","coverage":"liability","percentage":"5"},{"state":"Oklahoma","coverage":"liability","percentage":"6"},{"state":"Oregon","coverage":"liability","percentage":"2"},{"state":"Palau","coverage":"liability","percentage":"0"},{"state":"Pennsylvania","coverage":"liability","percentage":"3"},{"state":"Puerto Rico","coverage":"liability","percentage":"4"},{"state":"Rhode Island","coverage":"liability","percentage":"4"},{"state":"South Carolina","coverage":"liability","percentage":"6"},{"state":"South Dakota","coverage":"liability","percentage":"3"},{"state":"Tennessee","coverage":"liability","percentage":"5"},{"state":"Texas","coverage":"liability","percentage":"5"},{"state":"Utah","coverage":"liability","percentage":"4"},{"state":"Vermont","coverage":"liability","percentage":"3"},{"state":"Virgin Islands","coverage":"liability","percentage":"5"},{"state":"Virginia","coverage":"liability","percentage":"2"},{"state":"Washington","coverage":"liability","percentage":"3"},{"state":"West Virginia","coverage":"liability","percentage":"5"},{"state":"Wisconsin","coverage":"liability","percentage":"3"},{"state":"Wyoming","coverage":"liability","percentage":"3"},{"state":"Armed Forces - America\u0027s","coverage":"liability","percentage":"3"},{"state":"Armed Forces - Other","coverage":"liability","percentage":"3"},{"state":"Armed Forces - Pacific","coverage":"liability","percentage":"3"},{"state":"Alabama","coverage":"property","percentage":"6"},{"state":"Alaska","coverage":"property","percentage":"4"},{"state":"American Samoa","coverage":"property","percentage":"3"},{"state":"Arizona","coverage":"property","percentage":"3"},{"state":"Arkansas","coverage":"property","percentage":"4"},{"state":"California","coverage":"property","percentage":"3"},{"state":"Colorado","coverage":"property","percentage":"3"},{"state":"Connecticut","coverage":"property","percentage":"4"},{"state":"Delaware","coverage":"property","percentage":"3"},{"state":"District of Columbia","coverage":"property","percentage":"2"},{"state":"Federated States of Micronesia","coverage":"property","percentage":"0"},{"state":"Florida","coverage":"property","percentage":"3"},{"state":"Georgia","coverage":"property","percentage":"4"},{"state":"GUAM","coverage":"property","percentage":"3"},{"state":"Hawaii","coverage":"property","percentage":"5"},{"state":"Idaho","coverage":"property","percentage":"2"},{"state":"Illinois","coverage":"property","percentage":"5"},{"state":"Indiana","coverage":"property","percentage":"3"},{"state":"Iowa","coverage":"property","percentage":"1"},{"state":"Kansas","coverage":"property","percentage":"6"},{"state":"Kentucky","coverage":"property","percentage":"5"},{"state":"Louisiana","coverage":"property","percentage":"5"},{"state":"Maine","coverage":"property","percentage":"3"},{"state":"Marshall Islands","coverage":"property","percentage":"0"},{"state":"Maryland","coverage":"property","percentage":"3"},{"state":"Massachusetts","coverage":"property","percentage":"4"},{"state":"Michigan","coverage":"property","percentage":"3"},{"state":"Minnesota","coverage":"property","percentage":"3"},{"state":"Mississippi","coverage":"property","percentage":"7"},{"state":"Missouri","coverage":"property","percentage":"5"},{"state":"Montana","coverage":"property","percentage":"5"},{"state":"Nebraska","coverage":"property","percentage":"3"},{"state":"Nevada","coverage":"property","percentage":"4"},{"state":"New Hampshire","coverage":"property","percentage":"3"},{"state":"New Jersey","coverage":"property","percentage":"5"},{"state":"New Mexico","coverage":"property","percentage":"3"},{"state":"New York","coverage":"property","percentage":"3"},{"state":"North Carolina","coverage":"property","percentage":"5"},{"state":"North Dakota","coverage":"property","percentage":"2"},{"state":"Northern Mariana Islands","coverage":"property","percentage":"3"},{"state":"Ohio","coverage":"property","percentage":"5"},{"state":"Oklahoma","coverage":"property","percentage":"6"},{"state":"Oregon","coverage":"property","percentage":"2"},{"state":"Palau","coverage":"property","percentage":"0"},{"state":"Pennsylvania","coverage":"property","percentage":"3"},{"state":"Puerto Rico","coverage":"property","percentage":"3"},{"state":"Rhode Island","coverage":"property","percentage":"4"},{"state":"South Carolina","coverage":"property","percentage":"6"},{"state":"South Dakota","coverage":"property","percentage":"3"},{"state":"Tennessee","coverage":"property","percentage":"5"},{"state":"Texas","coverage":"property","percentage":"5"},{"state":"Utah","coverage":"property","percentage":"4"},{"state":"Vermont","coverage":"property","percentage":"3"},{"state":"Virgin Islands","coverage":"property","percentage":"5"},{"state":"Virginia","coverage":"property","percentage":"2"},{"state":"Washington","coverage":"property","percentage":"3"},{"state":"West Virginia","coverage":"property","percentage":"5"},{"state":"Wisconsin","coverage":"property","percentage":"3"},{"state":"Wyoming","coverage":"property","percentage":"3"},{"state":"Armed Forces - America\u0027s","coverage":"property","percentage":"3"},{"state":"Armed Forces - Other","coverage":"property","percentage":"3"},{"state":"Armed Forces - Pacific","coverage":"property","percentage":"3"},{"state":"Alabama","coverage":"group","percentage":"6"},{"state":"Alaska","coverage":"group","percentage":"4"},{"state":"American Samoa","coverage":"group","percentage":"3"},{"state":"Arizona","coverage":"group","percentage":"3"},{"state":"Arkansas","coverage":"group","percentage":"4"},{"state":"California","coverage":"group","percentage":"3"},{"state":"Colorado","coverage":"group","percentage":"3"},{"state":"Connecticut","coverage":"group","percentage":"4"},{"state":"Delaware","coverage":"group","percentage":"3"},{"state":"District of Columbia","coverage":"group","percentage":"2"},{"state":"Federated States of Micronesia","coverage":"group","percentage":"0"},{"state":"Florida","coverage":"group","percentage":"3"},{"state":"Georgia","coverage":"group","percentage":"4"},{"state":"GUAM","coverage":"group","percentage":"3"},{"state":"Hawaii","coverage":"group","percentage":"5"},{"state":"Idaho","coverage":"group","percentage":"2"},{"state":"Illinois","coverage":"group","percentage":"4"},{"state":"Indiana","coverage":"group","percentage":"3"},{"state":"Iowa","coverage":"group","percentage":"1"},{"state":"Kansas","coverage":"group","percentage":"6"},{"state":"Kentucky","coverage":"group","percentage":"5"},{"state":"Louisiana","coverage":"group","percentage":"5"},{"state":"Maine","coverage":"group","percentage":"3"},{"state":"Marshall Islands","coverage":"group","percentage":"0"},{"state":"Maryland","coverage":"group","percentage":"3"},{"state":"Massachusetts","coverage":"group","percentage":"4"},{"state":"Michigan","coverage":"group","percentage":"3"},{"state":"Minnesota","coverage":"group","percentage":"3"},{"state":"Mississippi","coverage":"group","percentage":"7"},{"state":"Missouri","coverage":"group","percentage":"5"},{"state":"Montana","coverage":"group","percentage":"3"},{"state":"Nebraska","coverage":"group","percentage":"3"},{"state":"Nevada","coverage":"group","percentage":"4"},{"state":"New Hampshire","coverage":"group","percentage":"3"},{"state":"New Jersey","coverage":"group","percentage":"5"},{"state":"New Mexico","coverage":"group","percentage":"3"},{"state":"New York","coverage":"group","percentage":"4"},{"state":"North Carolina","coverage":"group","percentage":"5"},{"state":"North Dakota","coverage":"group","percentage":"2"},{"state":"Northern Mariana Islands","coverage":"group","percentage":"3"},{"state":"Ohio","coverage":"group","percentage":"5"},{"state":"Oklahoma","coverage":"group","percentage":"6"},{"state":"Oregon","coverage":"group","percentage":"2"},{"state":"Palau","coverage":"group","percentage":"0"},{"state":"Pennsylvania","coverage":"group","percentage":"3"},{"state":"Puerto Rico","coverage":"group","percentage":"3"},{"state":"Rhode Island","coverage":"group","percentage":"4"},{"state":"South Carolina","coverage":"group","percentage":"6"},{"state":"South Dakota","coverage":"group","percentage":"3"},{"state":"Tennessee","coverage":"group","percentage":"5"},{"state":"Texas","coverage":"group","percentage":"5"},{"state":"Utah","coverage":"group","percentage":"4"},{"state":"Vermont","coverage":"group","percentage":"3"},{"state":"Virgin Islands","coverage":"group","percentage":"5"},{"state":"Virginia","coverage":"group","percentage":"2"},{"state":"Washington","coverage":"group","percentage":"3"},{"state":"West Virginia","coverage":"group","percentage":"5"},{"state":"Wisconsin","coverage":"group","percentage":"3"},{"state":"Wyoming","coverage":"group","percentage":"3"},{"state":"Armed Forces - America\u0027s","coverage":"group","percentage":"3"},{"state":"Armed Forces - Other","coverage":"group","percentage":"3"},{"state":"Armed Forces - Pacific","coverage":"group","percentage":"3"}],"submit":true,"totalAmount":4522.465902,"travelAgentEOReceiptsPL":1233,"travelAgentEoPL":true,"user_exists":"","username":444444,"validatePadiGroup":true,"verified":true,"workFlowId":"","work_country_code":1,"workflowId":"cb99e634-de00-468d-9230-d6f77d241c5b","workflowInstanceId":"3b705017-62aa-11ea-b810-5ac21fcab9ac","workflow_uuid":"cb99e634-de00-468d-9230-d6f77d241c5b","zip":85003,"zip1":85003,"uuid":"b6e7e9ca-cd96-40af-a1f8-100828686627"}
        })
      });
      
    });
  } else if (this.props.pipeline) {
    this.loadFormWithCommands(this.props.pipeline).then(response=>{
      this.createForm().then(form => {
        this.loadWorkflow(form);
      });
    });
  } else {
    if(this.state.content){
      this.createForm().then(form => {
        this.loadWorkflow(form);
      });
    } else {
      this.loadWorkflow();
    }
  }
}
async loadFormWithCommands(commands) {
  await this.callPipeline(commands, commands).then(response => {
    if (response.status == "success") {
      if (response.data.data && response.data.form_data) {
        var data = response.data.data;
        this.setState({
          content: JSON.parse(data.template),
          data: this.addAddlData(response.data.form_data),
          formId: data.id,
          workflowId: response.data.workflow_id
        });
      }
    }
  });
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