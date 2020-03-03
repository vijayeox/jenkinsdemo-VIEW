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
      data: this.props.data,
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
    let formContent = await helper.request(
      "v1",
      "/activity/" + this.state.activityInstanceId + "/form",
      {},
      "get"
      );
    return formContent;
  }
  async getActivityInstance() {
    // call to api using wrapper
    let helper = this.core.make("oxzion/restClient");
    let formContent = await helper.request(
      "v1",
      "/app/" +
      this.state.appId +
      "/workflowinstance/" +
      this.state.workflowInstanceId +
      "/activityinstance/" +
      this.state.activityInstanceId +
      "/form",
      {},
      "get"
      );
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
      } else if (
        componentItem &&
        componentItem &&
        componentItem.persistent == false
        ) {
        if (data[componentKey]) {
          delete data[componentKey];
        }
      } else {
        // console.log(componentItem);
      }
    }
    if (
      form._form["properties"] &&
      form._form["properties"]["submission_commands"]
      ) {
      if (this.state.workflowId) {
        form.data["workflowId"] = this.state.workflowId;
      }
      if (this.state.workflowInstanceId) {
        form.submission.data[
        "workflowInstanceId"
        ] = this.state.workflowInstanceId;
        if (this.state.activityInstanceId) {
          form.submission.data[
          "activityInstanceId"
          ] = this.state.activityInstanceId;
          if (this.state.instanceId) {
            form.submission.data["instanceId"] = $this.state.instanceId;
          }
        }
      }
      await this.callPipeline(
        form._form["properties"]["submission_commands"],
        this.cleanData(form.submission.data)
        ).then(async response => {
          this.core.make("oxzion/splash").destroy();
          if (response.status == "success") {
            if (response.data) {
              form.submission = {
                data: this.parseResponseData(this.addAddlData(response.data))
              };
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
              this.notif.current.notify(
                "Error",
                response.errors[0].message,
                "danger"
                );
              return response;
            } else {
              await this.storeCache(data);
              this.notif.current.notify(
                "Error",
                "Form Submission Failed",
                "danger"
                );
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
        var response = await helper
        .request("v1", route, this.cleanData(data), method)
        .then(async response => {
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
                  var storeError = await this.storeError(
                    data,
                    response.data.errors,
                    route
                    ).then(storeErrorResponse => {
                      this.notif.current.notify(
                        "Error",
                        "Form Submission Failed",
                        "danger"
                        );
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
      Object.keys(formData)
      .sort()
      .forEach(function(key) {
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

    loadWorkflow(form) {
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
              }
            });
          }
          that.setState({ formDivID: "formio_" + that.state.formId });
          
        });
      }
      if (this.state.parentWorkflowInstanceId) {
        this.getFileData().then(response => {
          if (response.status == "success") {
            let fileData = JSON.parse(response.data.data);
            console.log(fileData);
            fileData.parentWorkflowInstanceId =
            that.props.parentWorkflowInstanceId;
            fileData.workflowInstanceId = undefined;
            fileData.activityId = undefined;
            that.setState({ data: this.addAddlData(that.parseResponseData(fileData)) });
            that.setState({ formDivID: "formio_" + that.state.formId });
            if(form){
              form.setSubmission({data:that.state.data},{modified:false}).then(response2 =>{
                form.setPristine(true);
              });
            }
          }
        });
      }
      if (this.state.activityInstanceId && this.state.workflowInstanceId) {
        this.getActivityInstance().then(response => {
          if (response.status == "success") {
            that.setState({
              workflowInstanceId: response.data.workflow_instance_id
            });
            that.setState({ workflowId: response.data.workflow_id });
            that.setState({ activityId: response.data.activity_id });
            that.setState({ data: this.addAddlData(JSON.parse(response.data.data)) });
            that.setState({ content: JSON.parse(response.data.template) });
            if(form){
              form.setSubmission({data:that.state.data},{modified:false}).then(response2 =>{
                form.setPristine(true);
              });
            }
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
            that.setState({ data: this.addAddlData(JSON.parse(response.data.data)) });
            that.setState({ content: response.data.template });
            if(form){
              form.setSubmission({data:that.state.data},{modified:false}).then(response2 =>{
                form.setPristine(true);
              });
            }
          }
        });
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
          }
        };
        options.hooks = hooks;
        var formCreated = Formio.createForm(
          document.getElementById(this.formDivID),
          this.state.content,
          options
        ).then(function (form) {
          if (that.state.page && form.wizard) {
            if (form.wizard && form.wizard.display == "wizard") {
              form.setPage(parseInt(that.state.page));
              var breadcrumbs = document.getElementById(
                form.wizardKey + "-header"
              );
              if (breadcrumbs) {
                breadcrumbs.style.display = "none";
              }
            }
          }
          form.setSubmission({ data: that.state.data }, { modified: false }).then(response2 => {
            form.setPristine(true);
          });
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
            form.setPristine(true);
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
                      form.setSubmission({ data: that.parseResponseData(that.addAddlData(response.data)) }, { modified: false }).then(response2 => {
                        form.setPristine(true);
                      });
                    }
                  }
                });
              }
            }
          });

          form.on("change", function (changed) {
            form.setPristine(true);
            for (var dataItem in form.submission.data) {
              if (typeof form.submission.data[dataItem] == "object") {
                if (form.submission.data[dataItem]) {
                  var checkComponent = form.getComponent(dataItem);
                  if (checkComponent && checkComponent.type == "datagrid") {
                    for (var rowItem in Object.keys(form.submission.data[dataItem])) {
                      if (Array.isArray(form.submission.data[dataItem][rowItem])) {
                        form.submission.data[dataItem][rowItem] = Object.assign({}, form.submission.data[dataItem][rowItem]);
                      }
                    }
                  }
                }
              }
            }
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
              var breadcrumbs = document.getElementById(
                form.wizardKey + "-header"
              );
              if (breadcrumbs) {
                breadcrumbs.style.display = "none";
              }
            }
            form.setPristine(true);
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
                            form.setPristine(true);
                          }
                        });
                        break;
                      default:
                        break;
                        component.refresh();
                    }
                  }
                }
              }
            },
              true
            );
            var elm = document.getElementsByClassName(
              that.state.appId + "_breadcrumbParent"
            );
            if (elm.length > 0) {
              scrollIntoView(elm[0], {
                scrollMode: "if-needed",
                block: "center",
                behavior: "smooth",
                inline: "nearest"
              });
            }
            if (that.state.formLevelDelegateCalled == false) {
              that.setState({
                formLevelDelegateCalled: true
              });
              if (form._form["properties"]) {
                that.runDelegates(form, form._form["properties"]);
              } else {
                if (form.originalComponent["properties"]) {
                  that.runDelegates(form, form.originalComponent["properties"]);
                }
              }
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
                            form.submission = { data: that.parseResponseData(that.addAddlData(changed)) };
                            // form.triggerChange();
                            destinationComponent.triggerRedraw();
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
                          form.submission = { data: that.parseResponseData(that.addAddlData(changed)) };
                          // form.triggerChange();
                          destinationComponent.triggerRedraw();
                        }
                        that.core.make("oxzion/splash").destroy();
                      });
                    } else {
                      that.callDelegate(properties["delegate"], that.cleanData(changed)).then(response => {
                        that.core.make("oxzion/splash").destroy();
                        if (response.data) {
                          form.submission = { data: that.parseResponseData(that.addAddlData(response.data)) };
                          // form.triggerChange();
                        }
                      });
                    }
                  }
                }
              }
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
                        form.setSubmission({ data: formData }, { modified: false }).then(response2 => {
                          form.setPristine(true);
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
          // form.formReady.then( () => {
          //   console.log('formReady');
          //   form.emit('render');
          // });
          // form.emit('render');
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
            form.setSubmission(formData,{modified:false}).then(response2 =>{
              form.setPristine(true);
            if (properties["post_delegate_refresh"]) {
              var targetList = properties["post_delegate_refresh"].split(',');
              targetList.map(item => {
               var targetComponent = form.getComponent(item);
               if(targetComponent.component && targetComponent.component["properties"]){
                if(targetComponent.type == 'datagrid'){
                  targetComponent.triggerRedraw();
                }
                if(targetComponent.component['properties']){
                  that.runProps(targetComponent,form,targetComponent.component['properties'],form.submission.data);
               } else {
                if(targetComponent.component && targetComponent.component.properties){
                  that.runProps(targetComponent,form,targetComponent.component.properties,form.submission.data);
               } 
                }
              }
            });
            }
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
          targetComponent.setValue(value);
          // targetComponent.updateValue(value);
          form.submission.data[targetComponent.key] = value;
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
            targetComponent.setValue(value);
            // targetComponent.updateValue(value);
            form.submission.data[targetComponent.key] = value;
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
            that.runDelegates(form, targetComponent.component["properties"]);
         }
       });
    }
  }
  form.setPristine(true);
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
          form.setSubmission({data:form_data},{modified:false}).then(response2 =>{
            form.setPristine(true);
          });
        }
      });
    }
    if (properties["commands"]) {
      this.callPipeline(properties["commands"],this.cleanData(form.submission.data)).then(response => {
        this.core.make("oxzion/splash").destroy();
        if (response.status == "success") {
          if (response.data) {
            let form_data = this.parseResponseData(
              this.addAddlData(response.data)
              );
            form.setSubmission({data:form_data},{modified:false}).then(response2 =>{
              form.setPristine(true);
            });
          }
        }
      });
    }
    if (properties["commands"]) {
      var that = this;
      this.callPipeline(properties["commands"],this.cleanData(form.submission.data)).then(response => {
        this.core.make("oxzion/splash").destroy();
        if (response.status == "success") {
          if (response.data) {
            form.setSubmission({data:that.parseResponseData(that.addAddlData(response.data))},{modified:false}).then(response2 =>{
              form.setPristine(true);
              that.runProps(null,form,properties,that.parseResponseData(that.addAddlData(form.submission.data)));
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
      if(data[key] != undefined && data[key] != ""){
        parsedData[key] = data[key];
      }
    }
  });
  return parsedData;
};

componentDidMount() {
  if (this.props.url) {
    this.getFormContents(this.props.url).then(response => {
      var parsedData = [];
      if (response.data) {
        parsedData = this.parseResponseData(JSON.parse(response.data));
      } else if (this.state.data) {
        parsedData = this.state.data;
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
        this.loadWorkflow(form);
      });
      
    });
  }
  if (this.props.pipeline) {
    this.loadFormWithCommands(this.props.pipeline).then(response=>{
      this.createForm().then(form => {
        this.loadWorkflow(form);
      });
    });
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
