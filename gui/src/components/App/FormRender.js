// import "../../public/css/formstyles.scss";
import Notification from "../../Notification";
import {
    getComponent,
    flattenComponents,
    eachComponent,
} from "formiojs/utils/formUtils";
import React from "react";
import merge from "deepmerge";
import $ from "jquery";

import BaseFormRenderer from './BaseFormRenderer'
class FormRender extends BaseFormRenderer {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    var userprofile = this.core.make("oxzion/profile").get();
    this.privileges = userprofile.key.privileges;
    this.userprofile = userprofile.key;
    this.loader = this.core.make("oxzion/splash");
    this.state = {
      appId: this.props.appId,
      workflowId: this.props.workflowId ? this.props.workflowId : null,
      cacheId: this.props.cacheId ? this.props.cacheId : null,
      isDraft: this.props.isDraft ? this.props.isDraft : false,
      workflowInstanceId: this.props.workflowInstanceId,
      parentWorkflowInstanceId: this.props.parentWorkflowInstanceId,
      activityInstanceId: this.props.activityInstanceId,
      activityId: this.props.activityId,
      instanceId: this.props.instanceId,
      paymentDetails: null,
      hasPayment: false,
      data: this.addAddlData(this.props.data),
      page: this.props.page,
      formLevelDelegateCalled: false,
      formId: this.props.formId,
      fileId: this.props.fileId,
      content: this.props.content,
    };
  }

  async getCacheData() {
    return await this.helper.request("v1", this.appUrl + "/cache/" + this.state.cacheId, {}, "get");
  }

  async getWorkflow() {
    // call to api using wrapper
    return await this.helper.request("v1", this.appUrl + "/form/" + this.state.formId + "/workflow", {}, "get");
  }
  async getForm() {
    // call to api using wrapper
    return await this.helper.request("v1", this.appUrl + "/form/" + this.state.formId, {}, "get");
  }

  async getFileData() {
    // call to api using wrapper
    if (this.props.parentWorkflowInstanceId != "null") {
      return await this.helper.request("v1", this.appUrl + "/workflowInstance/" + this.props.parentWorkflowInstanceId, {}, "get");
    }
    return
  }

  async getFileDataById() {
    // call to api using wrapper
    return await this.helper.request("v1", this.appUrl + "/file/" + this.props.fileId + "/data", {}, "get");
  }

  async getDataByUrl() {
    // call to api using wrapper
    return await this.helper.request("v1", this.props.dataUrl, {}, "get");
  }

  async getStartFormWorkflow() {
    // call to api using wrapper
    return await this.helper.request("v1", this.appUrl + "/workflow/" + this.state.workflowId + "/startform", {}, "get");
  }

  async getActivityInstance() {
    // call to api using wrapper
    return await this.helper.request("v1", this.appUrl + "/workflowinstance/" + this.state.workflowInstanceId + "/activityinstance/" + this.state.activityInstanceId + "/form", {}, "get");
  }

  async getFormContents(url) {
    return this.props.urlPostParams
      ? await this.helper.request("v1", url, this.props.urlPostParams, "post")
      : await this.helper.request("v1", url, {}, "get");
  }

  processProperties(form) {
    if (form._form.properties || form.originalComponent.properties) {
      this.runDelegates(
        form,
        form._form.properties
          ? form._form.properties
          : form.originalComponent.properties
      );
      // Should'nt run both runDelegates and runProps func on form initializaton as it creates duplicate delegate calls
    }
  }

  loadWorkflow(form) {
    let that = this;
    if (this.state.parentWorkflowInstanceId && !this.state.isDraft) {
      this.getFileData().then(response => {
        if (response.status == "success") {
          let fileData = JSON.parse(response.data.data);
          fileData.parentWorkflowInstanceId = that.props.parentWorkflowInstanceId;
          fileData.workflowInstanceId = undefined;
          fileData.activityId = undefined;
          that.setState({ data: this.formatFormData(fileData) });
          that.setState({ formDivID: "formio_" + that.state.formId });
          if (form) {
            form.setSubmission({ data: that.state.data }).then(function () {
              that.processProperties(form);
            });
          } else {
            this.createForm();
          }
        }
      });
    } else if (this.state.workflowId && (this.state.workflowId != null) && this.state.isDraft) {
      this.getStartFormWorkflow().then(response => {
        var parsedData = {};
        var template;
        if (response.data) {
          try {
            parsedData = this.formatFormData(JSON.parse(response.data));
          } catch (e) {
            parsedData = this.formatFormData(response.data);
          }
        }
        try {
          template = JSON.parse(parsedData.template);
        } catch (e) {
          template = parsedData.template;
        }
        parsedData.workflow_uuid ? (parsedData.workflow_uuid = parsedData.workflow_uuid) : null;
        this.setState({
          content: template,
          workflowInstanceId: parsedData.workflow_instance_id,
          activityInstanceId: parsedData.activity_instance_id,
          workflowId: parsedData.workflow_uuid,
          formId: parsedData.form_id
        });
        that.createForm().then((form) => {
          this.getCacheData().then((cacheResponse) => {
            if (Object.keys(cacheResponse.data).length > 1) {//to account for only workflow_uuid
              var that = this;
              if (cacheResponse.data) {
                form.setSubmission({ data: this.formatFormData(cacheResponse.data) }).then(respone => {
                  that.processProperties(form);
                  if (cacheResponse.data.page && form.wizard) {
                    if (form.wizard && form.wizard.display == "wizard") {
                      form.setPage(parseInt(cacheResponse.data.page));
                      that.hideBreadCrumb(true);
                    }
                  }
                });
              }
            }
          });
        });

      });
    } else if (this.state.activityInstanceId && this.state.workflowInstanceId && this.state.isDraft) {
      this.getActivityInstance().then(response => {
        var parsedData = {};
        var template;
        if (response.data) {
          try {
            parsedData = this.formatFormData(JSON.parse(response.data));
          } catch (e) {
            parsedData = this.formatFormData(response.data);
          }
        }
        try {
          template = JSON.parse(parsedData.template);
        } catch (e) {
          template = parsedData.template;
        }
        parsedData.workflow_uuid ? (parsedData.workflow_uuid = parsedData.workflow_uuid) : null;
        this.setState({
          content: template,
          workflowInstanceId: parsedData.workflow_instance_id,
          activityInstanceId: parsedData.activity_instance_id,
          workflowId: parsedData.workflow_uuid,
          formId: parsedData.form_id
        });
        that.createForm().then((form) => {
          this.getCacheData().then((cacheResponse) => {
            if (Object.keys(cacheResponse.data).length > 1) {//to account for only workflow_uuid
              var that = this;
              if (cacheResponse.data) {
                form.setSubmission({ data: this.formatFormData(cacheResponse.data) }).then(respone => {
                  that.processProperties(form);
                  if (cacheResponse.data.page && form.wizard) {
                    if (form.wizard && form.wizard.display == "wizard") {
                      form.setPage(parseInt(cacheResponse.data.page));
                      that.hideBreadCrumb(true);
                    }
                  }
                });
              }
            }
          });
        });

      });
    } else if (this.state.fileId) {
      this.getFileDataById().then((response) => {
        if (response.status == "success") {
          this.setState({
            data: this.formatFormData(response.data.data)
          }, () => {
            (form || this.state.currentForm) ? form ? form.setSubmission({ data: this.state.data }).then(function () { that.processProperties(form); }) : this.state.currentForm.setSubmission({ data: this.state.data }).then(function () { that.processProperties(that.state.currentForm); }) : null;
          });
        }
      });
    } else if (this.props.dataUrl) {
      this.getDataByUrl().then((response) => {
        if (response.status == "success") {
          this.setState(
            {
              data: this.formatFormData(response.data)
            }, () => {
              (form || this.state.currentForm) ? form ? form.setSubmission({ data: this.state.data }).then(function () { that.processProperties(form); }) : this.state.currentForm.setSubmission({ data: this.state.data }).then(function () { that.processProperties(that.state.currentForm); }) : null;
            });
        }
      });
    }
    else if (this.state.activityInstanceId && this.state.workflowInstanceId && !this.state.cacheId) {
      this.getActivityInstance().then(response => {
        if (response.status == "success") {
          that.setState({ workflowInstanceId: response.data.workflow_instance_id });
          that.setState({ workflowId: response.data.workflow_id });
          that.setState({ activityId: response.data.activity_id });
          that.setState({ data: that.formatFormData(JSON.parse(response.data.data)) });
          that.setState({ content: JSON.parse(response.data.template) });
          if (form) {
            form.setSubmission({ data: that.state.data }).then(function () {
              that.processProperties(form);
            });
          } else {
            this.createForm();
          }
        }
      });
    } else if (this.state.instanceId) {
      this.getInstanceData().then(response => {
        if (response.status == "success" && response.data.workflow_id) {
          that.setState({ workflowInstanceId: response.data.workflow_instance_id });
          that.setState({ workflowId: response.data.workflow_id });
          that.setState({ activityId: response.data.activity_id });
          that.setState({ data: this.addAddlData(JSON.parse(response.data.data)) });
          that.setState({ content: response.data.template });
          if (form) {
            form.setSubmission({ data: that.state.data }).then(function () {
              that.processProperties(form);
            });
          } else {
            this.createForm();
          }
        }
      });
    } else {
      if (form) {
        that.processProperties(form);
      }
    }
  }


  triggerComponent(form, targetProperties) {
    var targetList = targetProperties.split(',');
    targetList.map(item => {
      var targetComponent = form.getComponent(item);
      setTimeout(function () {
        if (targetComponent.type == 'datagrid') {
          targetComponent.triggerRedraw();
        }
      }, 3000);
    });
  };

  componentDidMount() {
    this.showFormLoader(true, 1);
    if (this.props.url) {
      this.getFormContents(this.props.url).then(response => {
        if (response.status == 'success') {
          var parsedData = {};
          var template;
          if (response.data) {
            try {
              parsedData = this.formatFormData(JSON.parse(response.data));
            } catch (e) {
              parsedData = this.formatFormData(response.data);
            }
          }
          try {
            template = JSON.parse(parsedData.template);
          } catch (e) {
            template = parsedData.template;
          }
          parsedData.workflow_uuid ? (parsedData.workflow_uuid = parsedData.workflow_uuid) : null;
          this.setState({
            content: template,
            workflowInstanceId: parsedData.workflow_instance_id,
            activityInstanceId: parsedData.activity_instance_id,
            workflowId: parsedData.workflow_uuid,
            formId: parsedData.form_id
          });
          this.createForm().then(form => {
            if (Object.keys(parsedData).length > 1) {//to account for only workflow_uuid
              var that = this;
              if (parsedData.data) {
                form.setSubmission({ data: this.formatFormData(parsedData.data) }).then(respone => {
                  that.processProperties(form);
                });
              } else {
                this.loadWorkflow(form);
              }
            } else {
              this.loadWorkflow(form);
            }
          });
        } else {
          var errorMessage = "";
          if (response.errors && response.errors[0] && response.errors[0]['message']) {
            errorMessage = response.errors[0]['message'];
          }
          if (response.message) {
            errorMessage = response.errors[0]['message'];
          }
          this.showFormError(true, errorMessage);
        }
      });
    } else if (this.props.pipeline) {
      this.loadFormWithCommands(this.props.pipeline).then(response => {
        this.createForm().then(form => {
          this.loadWorkflow(form);
        });
      });
    } else if (this.props.formId) {
      this.getForm().then((response) => {
        if (response.status == "success") {
          if (!this.state.content) {
            this.setState(
              { content: JSON.parse(response.data.template) }
            );
          }
          this.createForm().then((form) => {
            var that = this;
            that.setState({ currentForm: form });
            that.processProperties(form);
          });
        }
      });

    } else {
      if (this.state.content) {
        this.createForm().then(form => {
          this.loadWorkflow(form);
        });
      } else {
        this.loadWorkflow();
      }
    }
    if (this.props.fileId || this.props.dataUrl) {
      this.loadWorkflow();
    }
    $("#" + this.loaderDivID).off("customButtonAction");
    document.getElementById(this.loaderDivID).addEventListener("customButtonAction", (e) => this.customButtonAction(e), false);
    if(this.state.fileId){
        this.generateViewButton();
    }
  }

  customButtonAction = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.showFormLoader(true, 0);
    let actionDetails = e.detail;
    let formData = actionDetails.formData;
    if (this.state.workflowId) {
      formData["workflowId"] = this.state.workflowId;
    }
    if (this.state.workflowInstanceId) {
      formData["workflowInstanceId"] = this.state.workflowInstanceId;
      if (this.state.activityInstanceId) {
        formData["activityInstanceId"] = this.state.activityInstanceId;
        if (this.state.instanceId) {
          formData["instanceId"] = $this.state.instanceId;
        }
      }
    }
    if (this.props.fileId) {
      formData.fileId = this.props.fileId;
      formData["workflow_instance_id"] = undefined;
    }
    if (this.state.fileId) {
      formData.fileId = this.state.fileId;
      formData["workflow_instance_id"] = undefined;
    }
    if (actionDetails["commands"]) {
      this.callPipeline(
        actionDetails["commands"],
        this.cleanData(formData)
      ).then((response) => {
        if (response.status == "success") {
          var formData = { data: this.formatFormData(response.data) };
          if (response.data.fileId) {
            this.setState({
              fileId: response.data.fileId
            })
          }
          if (this.state.currentForm) {
            this.state.currentForm.setSubmission(formData).then(response2 => {
              this.state.currentForm.setPristine(true);
              this.showFormLoader(false, 0);
            });
          } else {
            this.showFormLoader(false, 0);
          }
          this.notif.current.notify(
            "Success",
            actionDetails.notification
              ? actionDetails.notification
              : "Operation completed successfully",
            "success"
          );
          if (actionDetails.exit) {
            clearInterval(actionDetails.timerVariable);
            this.stepDownPage();
          }
        } else {
          this.notif.current.notify(
            "Error",
            response.errors[0].message ? response.errors[0].message : "Operation failed",
            "danger"
          );
        }
      }).catch(e => {
        this.handleError(e);
      });
    }
  };

  async loadFormWithCommands(commands) {
    await this.callPipeline(commands, commands).then(response => {
      if (response.status == "success") {
        if (response.data.data) {
          var data = response.data;
          var tempdata = null;
          if (data.data) {
            tempdata = data.data
          } else if (data.form_data) {
            tempdata = data.form_data;
          }
          this.setState({
            content: JSON.parse(data.template),
            data: this.addAddlData(tempdata),
            formId: data.id,
            workflowId: response.data.workflow_id
          });
        }
      }
    }).catch(e => {
      this.handleError(e);
    });
  }


  render() {
    return super.render();
  }
}
export default FormRender;