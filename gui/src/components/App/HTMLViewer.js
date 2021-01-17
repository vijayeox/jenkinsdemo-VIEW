import React from "react";
import JsxParser from "react-jsx-parser";
import moment from "moment";
import ParameterHandler from "./ParameterHandler";
import Requests from '../../Requests';
import Swal from 'sweetalert2';
import '../../public/css/ckeditorStyle.scss';
import WidgetRenderer from '../../WidgetRenderer';
import WidgetDrillDownHelper from '../../WidgetDrillDownHelper';

class HTMLViewer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get();
    this.appId = this.props.appId;
    this.renderedWidgets = {};
    this.loader = this.core.make('oxzion/splash');
    this.state = {
      content: this.props.content,
      fileData: this.props.fileData,
      fileId: this.props.fileId,
      widgetCounter: 0,
      dataReady: this.props.fileId ? false : true,
      dataReady: this.props.url ? false : true
    };
  }
  formatDate = (dateTime, dateTimeFormat) => {
    let userTimezone, userDateTimeFomat = null;
    userTimezone = this.profile.key.preferences.timezone ? this.profile.key.preferences.timezone : moment.tz.guess();
    userDateTimeFomat = this.profile.key.preferences.dateformat ? this.profile.key.preferences.dateformat : "YYYY-MM-DD";
    dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
    return moment(dateTime).utc(dateTime, "MM/dd/yyyy HH:mm:ss").clone().tz(userTimezone).format(userDateTimeFomat);
  };
  formatDateWithoutTimezone = (dateTime, dateTimeFormat) => {
    let userDateTimeFomat = null;
    userDateTimeFomat = this.profile.key.preferences.dateformat ? this.profile.key.preferences.dateformat : "YYYY-MM-DD";
    dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
    return moment(dateTime).format(userDateTimeFomat);
  };

  async getFileDetails(fileId) {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request("v1","/app/" + this.appId + "/file/" + fileId + "/data" ,{},"get");
    return fileContent;
  }
  async getURL(url) {
    let helper = this.core.make("oxzion/restClient");
    let fileContent = await helper.request("v1",url,{},"get");
    return fileContent;
  }

  componentDidMount() {
    var that = this;
    if (this.state.fileId != undefined) {
      this.getFileDetails(this.state.fileId).then(response => {
        if (response.status == "success") {
          this.setState({ fileData: response.data.data });
          that.preRender();
        }
      });
    }
    if (this.props.url != undefined) {
      this.getURL(this.props.url).then(response => {
        if (response.status == "success") {
          this.setState({ fileData: response.data });
          that.preRender();
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      this.setState({ content: this.props.content });
    }
  }
  isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;
    for (var c = a.childNodes, i = c.length; i--; ) {
      if (c[i].nodeType == 1) return true; 
    }
    return false;
  }
  searchAndReplaceParams(content,params){
    var regex = /\{data\.(.*)?\}/g;
    let m;
    var matches=[];
    do {
      m = regex.exec(content)
      if(m){
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        matches.push(m);
      }
    } while (m);
    matches.forEach((match, groupIndex) => {
      if(params[match[1]] !=undefined && this.isHTML(params[match[1]])){
        content = content.replace(match[0],params[match[1]]);
      }
    });
    content = this.getXrefFields(content);
    return content
  }
  preRender(){
    var fileData = {};
    for (const [key, value] of Object.entries(this.state.fileData)) {
      fileData[key] = value;
    }
    var content = this.searchAndReplaceParams(this.state.content,fileData);
    this.setState({content: content,fileData:fileData,dataReady: true});
    this.updateGraph();
  }
  getXrefFields(content){
    var regex = /\{file\.(.*)?\}/g;
    let m;
    var editContent=content;
    var matches=[];
    do {
      m = regex.exec(content)
      if(m){
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        matches.push(m);
      }
    } while (m);
    matches.forEach((match, groupIndex) => {
      var field = match[1].split(':');
      this.getFileDetails(field[0]).then(response => {
        if (response.status == "success") {
            var fileData = response.data;
            if(field[1] && fileData.data && fileData.data[field[1]]){
              content = content.replace(match[0],fileData.data[field[1]]);
            }
        }
      });
    });
    return editContent
  }
  
updateGraph =  async(filterParams) => {
  if (null === this.state.htmlData) {
    return;
  }
  let root = document;
  var widgets = root.getElementsByClassName('oxzion-widget');
  let thiz = this;
  // this.loader.show();
  let errorFound = false;
  for (let elementId in this.renderedWidgets) {
    let widget = this.renderedWidgets[elementId];
    if (widget) {
      if (widget.dispose) {
        widget.dispose();
      }
      delete this.renderedWidgets[elementId];
    }
  }
  if (widgets.length == 0) {
    this.loader.destroy();
  }
  else {
    for (let widget of widgets) {
      var attributes = widget.attributes;
      //dispose 
      var that = this;
      var widgetUUId = attributes[WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE].value;
      Requests.getWidgetByUuid(this.core, widgetUUId, filterParams)
        .then(response => {
          if (response.status == "success") {
            response.data.widget && console.timeEnd("analytics/widget/" + response.data.widget.uuid + "?data=true")
            that.setState({ widgetCounter: that.state.widgetCounter + 1 });
            if ('error' === response.status) {
              console.error('Could not load widget.');
              console.error(response);
              errorFound = true;
            }
            else {
              //dispose if widget exists
              let hasDashboardFilters = this.state.preparedDashboardFilter ? true : false;
              let renderproperties = { "element": widget, "widget": response.data.widget, "hasDashboardFilters": hasDashboardFilters, "dashboardEditMode": false }

              let widgetObject = WidgetRenderer.render(renderproperties);
              if (widgetObject) {
                this.renderedWidgets[widgetUUId] = widgetObject;
              }
            }
            if (that.state.widgetCounter >= widgets.length) {
              this.loader.destroy();
            }
          } else {
            that.setState({ widgetCounter: that.state.widgetCounter + 1 });
            if (this.state.widgetCounter >= widgets.length) {
              that.loader.destroy();
            }
          }
        });
    }
  }
  if (errorFound) {
    Swal.fire({
      type: 'error',
      title: 'Oops ...',
      text: 'Could not load one or more widget(s). Please try after some time.'
    });
    return;
  }
}

  render() {
    if(this.state.dataReady){
        return (
          <div>
            <JsxParser autoCloseVoidElements className ={this.props.className}
              jsx={this.state.content}
              bindings={{
                data: this.statefileData ? this.statefileData : {},
                item: this.statefileData ? this.statefileData : {},
                moment: moment,
                formatDate: this.formatDate,
                formatDateWithoutTimezone: this.formatDateWithoutTimezone,
                profile: this.profile.key
              }}
            /></div>);
    } else {
      return (<div></div>);
    }
  }
}

export default HTMLViewer;