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
import SliderComponent from "./Form/SliderComponent";
import FortePayCheckoutComponent from "./Form/Payment/FortePayCheckoutComponent";

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
      currentForm: null
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
          await this.storeCache(data).then(async cacheResponse => {
            if (response.data.errors) {
              await this.storeError(data, response.data.errors, route).then(
                storeErrorResponse => {
                  this.notif.current.notify(
                    "Error",
                    "Form Submission Failed",
                    "danger"
                  );
                }
              );
            } else {
              return response;
            }
          });
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
    return formData;
  }

  addAddlData(data) {
    data = data ? data : {};
    return merge(data, {
      privileges: this.privileges,
      userprofile: this.userprofile,
      countryList: countryList
    });
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
        that.createForm();
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
          that.setState({ data: that.parseResponseData(fileData) });
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
    Formio.registerComponent("slider", SliderComponent);
    Formio.registerComponent("convergepay", ConvergePayCheckoutComponent);
    Formio.registerComponent("document", DocumentComponent);
    Formio.registerComponent("fortepay", FortePayCheckoutComponent);

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
          that.storeCache(that.cleanData(form_data));
          next(null);
        },
        beforeSubmit: async (submission, next) => {
          var form_data = that.cleanData(submission.data);
          var formSave = await that
            .saveForm(null, form_data)
            .then(function (response) {
              console.log(response);
              if (response.status == "success") {
                next(null);
              } else {
                var submitErrors = [];
                if (response.data.errors) {
                  submitErrors.push(response.data.errors);
                } else {
                  submitErrors.push(response.message);
                }
                next(submitErrors);
              }
            });
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
        form.submission = {
          data: that.parseResponseData(that.addAddlData(that.state.data))
        };
        console.log(form.submission);
        form.on("prevPage", changed => {
          form.emit("render");
          that.setState({ page: changed.page });
        });
        form.on("nextPage", changed => {
          form.emit("render");
          that.setState({ page: changed.page });
          if (form.pages[changed.page]["properties"]["delegate"]) {
            if (form.pages[changed.page]["properties"]["delegate"]) {
              var form_data = that.cleanData(form.submission.data);
              that
                .callDelegate(
                  form.pages[changed.page]["properties"]["delegate"],
                  form_data
                )
                .then(response => {
                  if (response) {
                    that.core.make("oxzion/splash").destroy();
                    if (response.data) {
                      form.submission = {
                        data: that.parseResponseData(
                          that.addAddlData(response.data)
                        )
                      };
                      form.triggerChange();
                    }
                  }
                });
            }
          }
        });
        form.on("submit", submission => {
          console.log("Submission Call");
          // var form_data = that.cleanData(submission.data);
          // return that.saveForm(form,form_data).then(response => {
          //   form.emit('submitDone', response);
          // });
        });

        form.on("change", function (changed) {
          console.log(changed.data);
          var formdata = changed;
          for (var dataItem in form.submission.data) {
            if (typeof form.submission.data[dataItem] == "object") {
              if (form.submission.data[dataItem]) {
                var checkComponent = form.getComponent(dataItem);
                if (checkComponent && checkComponent.type == "datagrid") {
                  for (var rowItem in Object.keys(
                    form.submission.data[dataItem]
                  )) {
                    if (
                      Array.isArray(form.submission.data[dataItem][rowItem])
                    ) {
                      form.submission.data[dataItem][rowItem] = Object.assign(
                        {},
                        form.submission.data[dataItem][rowItem]
                      );
                    }
                  }
                }
              }
            }
          }
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
                  .callDelegate(
                    properties["delegate"],
                    that.cleanData(formdata.data)
                  )
                  .then(response => {
                    if (response) {
                      var responseArray = [];
                      for (var responseDataItem in response.data) {
                        if (response.data.hasOwnProperty(responseDataItem)) {
                          responseArray[responseDataItem] =
                            response.data[responseDataItem];
                        }
                      }
                      if (response.data) {
                        console.log(response.data);
                        form.submission = {
                          data: that.parseResponseData(
                            that.addAddlData(response.data)
                          )
                        };
                        form.triggerChange();
                      }
                      that.core.make("oxzion/splash").destroy();
                    }
                  });
              }
              if (properties["target"]) {
                var targetComponent = form.getComponent(properties["target"]);
                if (changed.changed.value && targetComponent) {
                  var value = formdata.data[changed.changed.value];
                  if (
                    changed.changed.value.value != undefined &&
                    formdata.data[changed.changed.value.value] != undefined
                  ) {
                    value = formdata.data[changed.changed.value.value];
                  }
                  if (value != undefined) {
                    targetComponent.setValue(value);
                  } else {
                    if (changed.changed.value.value != undefined) {
                      targetComponent.setValue(changed.changed.value.value);
                    } else {
                      targetComponent.setValue(changed.changed.value);
                    }
                  }
                } else {
                  if (document.getElementById(properties["target"])) {
                    var value = formdata.data[changed.changed.value];
                    if (changed.changed.value.value) {
                      value = formdata.data[changed.changed.value.value];
                    }
                    if (value && value != undefined) {
                      document.getElementById(
                        properties["target"]
                      ).value = value;
                    } else {
                      if (changed.changed.value.value) {
                        document.getElementById(properties["target"]).value =
                          changed.changed.value.value;
                      } else {
                        document.getElementById(properties["target"]).value =
                          changed.changed.value;
                      }
                    }
                  }
                }
              }
              if (properties["negate"]) {
                var targetComponent = form.getComponent(properties["negate"]);
                if (changed.changed.value && targetComponent) {
                  if (changed.changed.value.value) {
                    targetComponent.setValue(!changed.changed.value.value);
                  } else {
                    targetComponent.setValue(!changed.changed.value);
                  }
                }
              }
              if (properties["render"]) {
                var renderComponent = form.getComponent(properties["render"]);
                if (renderComponent.originalComponent) {
                  if (renderComponent.originalComponent["properties"]) {
                    that.runDelegates(
                      form,
                      renderComponent.originalComponent["properties"]
                    );
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
        form.on("render", function () {
          if (form.wizard && form.wizard.display == "wizard") {
            var breadcrumbs = document.getElementById(
              form.wizardKey + "-header"
            );
            if (breadcrumbs) {
              breadcrumbs.style.display = "none";
            }
          }
          eachComponent(
            form.root.components,
            function (component) {
              if (component) {
                if (
                  component.component.properties &&
                  component.component.properties.custom_list
                ) {
                  var targetComponent = form.getComponent(
                    component.component.key
                  );
                  if (targetComponent) {
                    switch (component.component.properties.custom_list) {
                      case "user_list":
                        var commands = {
                          commands: [{ command: "getuserlist" }]
                        };
                        that
                          .callPipeline(commands, form.submission)
                          .then(response => {
                            that.core.make("oxzion/splash").destroy();
                            if (response.data) {
                              component.setValue(response.data.userlist);
                            }
                          });
                        break;
                      case "country_list":
                        component.setValue(countryList);
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
          if (form._form["properties"]) {
            that.runDelegates(form, form._form["properties"]);
          }
          if (form.originalComponent["properties"]) {
            that.runDelegates(form, form.originalComponent["properties"]);
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
                  if (
                    properties["sourceDataKey"] &&
                    properties["destinationDataKey"]
                  ) {
                    var paramData = {};
                    paramData[properties["valueKey"]] =
                      changed[properties["sourceDataKey"]];
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
                          var destinationComponent = form.getComponent(
                            properties["destinationDataKey"]
                          );
                          if (response.data) {
                            if (properties["validationKey"]) {
                              if (
                                properties["validationKey"] &&
                                response.data[properties["validationKey"]]
                              ) {
                                var componentList = flattenComponents(
                                  destinationComponent.componentComponents,
                                  false
                                );
                                var valueArray = [];
                                for (var componentKey in componentList) {
                                  valueArray[componentKey] =
                                    response.data[componentKey];
                                }
                                valueArray = Object.assign({}, valueArray);
                                changed[properties["destinationDataKey"]].push(
                                  valueArray
                                );
                              }
                              if (properties["clearSource"]) {
                                changed[properties["sourceDataKey"]] = "";
                              }
                            }
                            form.submission = {
                              data: that.parseResponseData(
                                that.addAddlData(changed)
                              )
                            };
                            form.triggerChange();
                            destinationComponent.triggerRedraw();
                          }
                        }
                        that.core.make("oxzion/splash").destroy();
                      });
                  } else {
                    that
                      .callDelegate(
                        properties["delegate"],
                        that.cleanData(changed)
                      )
                      .then(response => {
                        that.core.make("oxzion/splash").destroy();
                        if (response.data) {
                          form.submission = {
                            data: that.parseResponseData(
                              that.addAddlData(response.data)
                            )
                          };
                          form.triggerChange();
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
              console.log(properties);
              if (properties["commands"]) {
                that
                  .callPipeline(properties["commands"], that.cleanData(changed))
                  .then(response => {
                    that.core.make("oxzion/splash").destroy();
                    if (response.data) {
                      form.submission = {
                        data: that.parseResponseData(
                          that.addAddlData(response.data)
                        )
                      };
                      form.triggerChange();
                    }
                  });
              }
            }
          }
        });
        form.formReady.then(() => {
          console.log("formReady");
          // form.emit('render');
        });
        form.submissionReady.then(() => {
          console.log("submissionReady");
          form.emit("render");
        });
        that.setState({ currentForm: form });
        // form.formReady.then( () => {
        //   console.log('formReady');
        //   form.emit('render');
        // });
        // form.emit('render');
      });
    }
  }
  runDelegates(form, properties) {
    if (properties) {
      if (properties["delegate"]) {
        this.callDelegate(
          properties["delegate"],
          this.cleanData(form.submission.data)
        ).then(response => {
          this.core.make("oxzion/splash").destroy();
          if (response.data) {
            let form_data = this.parseResponseData(
              this.addAddlData(response.data)
            );
            form.submission = {
              data: form_data
            };
            form.triggerChange();
          }
        });
      }
      if (properties["commands"]) {
        this.callPipeline(
          properties["commands"],
          this.cleanData(form.submission.data)
        ).then(response => {
          this.core.make("oxzion/splash").destroy();
          if (response.status == "success") {
            if (response.data) {
              form.submission = {
                data: this.parseResponseData(this.addAddlData(response.data))
              };
              form.triggerChange();
            }
          }
        });
      }
      if (properties["payment_confirmation_page"]) {
        var elements = document.getElementsByClassName("btn-wizard-nav-submit");
        this.getPayment(form.submission.data).then(response => {
          var responseArray = [];
          if (response.data) {
            var evt = new CustomEvent("paymentDetails", {

              detail: response.data[0]
            });
            window.dispatchEvent(evt);
          }
        });
        var that = this;
        window.addEventListener(
          "requestPaymentToken",
          function (e) {
            e.stopPropagation();
            that.core.make("oxzion/splash").show();
            // let requestbody = {
            //   firstname: e.detail.firstname,
            //   lastname: e.detail.lastname,
            //   amount: e.detail.amount
            // };
            // if (e.detail.hasOwnProperty('order_number') && e.detail.hasOwnProperty('method')) {
            //   requestbody['order_number'] = e.detail.order_number;
            //   requestbody['method'] = e.detail.method;
            // }
            that
              .callPayment(e.detail)
              .then(response => {
                var transactionIdComponent = form.getComponent(
                  "transaction_id"
                );
                if (response.data.transaction.id && response.data.token) {
                  transactionIdComponent.setValue(response.data.transaction.id);
                  var evt = new CustomEvent("getPaymentToken", {
                    detail: response.data
                  });
                  window.dispatchEvent(evt);
                } else {
                  that.notif.current.notify(
                    "Error",
                    "Transaction Token Failed!",
                    "danger"
                  );
                }
                that.core.make("oxzion/splash").destroy();
              });
          },
          true
        );
        window.addEventListener(
          "paymentSuccess",
          function (e) {
            e.stopPropagation();
            that.core.make("oxzion/splash").show();
            var transactionIdComponent = form.getComponent("transaction_id");
            that
              .storePayment({
                transaction_id: transactionIdComponent.getValue(),
                data: e.detail.data,
                status: e.detail.status
              })
              .then(response => {
                that.notif.current.notify(
                  "Payment has been Successfully completed!",
                  "Please wait while we get things ready!",
                  "success"
                );
                var formsave = that.saveForm(
                  form,
                  that.state.currentForm.submission.data
                );
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
                } else {
                  that.notif.current.notify(
                    "Error",
                    e.detail.message,
                    "danger"
                  );
                }
                that.core.make("oxzion/splash").destroy();
              });
          },
          true
        );
        window.addEventListener(
          "paymentDeclined",
          function (e) {
            e.stopPropagation();
            console.log(e.detail);
            var transactionIdComponent = form.getComponent("transaction_id");
            that
              .storePayment({
                transaction_id: transactionIdComponent.getValue(),
                data: e.detail.data
              })
              .then(response => {
                that.notif.current.notify("Error", e.detail.message, "danger");
                that.core.make("oxzion/splash").destroy();
              });
          },
          true
        );
        window.addEventListener(
          "paymentCancelled",
          function (e) {
            e.stopPropagation();
            that.notif.current.notify("Warning", e.detail.message, "danger");
            that.core.make("oxzion/splash").destroy();
          },
          true
        );
        window.addEventListener(
          "paymentError",
          function (e) {
            e.stopPropagation();
            console.log(e.detail);
            var transactionIdComponent = form.getComponent("transaction_id");
            that
              .storePayment({
                transaction_id: transactionIdComponent.getValue(),
                data: e.detail.data
              })
              .then(response => {
                that.notif.current.notify("Error", e.detail.message, "danger");
                that.core.make("oxzion/splash").destroy();
              });
          },
          true
        );
        window.addEventListener(
          "paymentPending",
          function (e) {
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
          data: this.addAddlData(parsedData),
          workflowInstanceId: response.workflow_instance_id,
          activityInstanceId: response.activity_instance_id,
          workflowId: response.workflow_uuid,
          formId: response.form_id
        });
        this.createForm();
      });
    }
    if (this.props.pipeline) {
      this.loadFormWithCommands(this.props.pipeline);
    }
    this.loadWorkflow();
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
          this.createForm();
        }
      }
      return response;
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
