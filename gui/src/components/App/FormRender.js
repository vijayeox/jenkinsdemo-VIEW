import "../../public/css/formstyles.scss";
import { Formio } from "formiojs";
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
      workflowInstanceId: this.props.workflowInstanceId,
      activityInstanceId: this.props.activityInstanceId,
      activityId: this.props.activityId,
      instanceId: this.props.instanceId,
      formId: this.props.formId,
      content: this.props.content,
      data: this.props.data,
      page: this.props.page
    };
    this.formDivID = "formio_" + this.props.formId ? this.props.formId : "123";
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
    let response = await helper.request("v1", route, data, method);
    if (response.status == "success") {
      this.props.postSubmitCallback(data);
    }
    return response;
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
        form.on("nextPage", changed => that.setState({ page: changed.page }));
        form.on("submit", submission => that.saveForm(submission.data));
        form.on("render", () => console.log(form));

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
          console.log(event);
          var component = form.getComponent(event.target.id);
          if (component) {
            var properties = component.component.properties;
            if (properties) {
              if (properties["delegate"]) {
                that
                  .callDelegate(properties["delegate"], changed)
                  .then(response => {
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
            data: response.data
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
    return <div className="form-render" id={this.formDivID}></div>;
  }
}
export default FormRender;
