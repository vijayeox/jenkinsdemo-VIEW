import React from "react";
import JsxParser from "react-jsx-parser";
import moment from "moment";

class HTMLViewer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.profileAdapter = this.core.make("oxzion/profile");
    this.profile = this.profileAdapter.get();
    this.appId = this.props.appId;
    this.state = {
      content: this.props.content,
      fileData: this.props.fileData,
      dataReady: this.props.fileId ? false : true,
      dataReady: this.props.url ? false : true
    };
  }

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
    if (this.props.fileId != undefined) {
      this.getFileDetails(this.props.fileId).then(response => {
        if (response.status == "success") {
          this.setState({
            fileData: response.data.data,
            dataReady: true
          });
        }
      });
    }
    if (this.props.url != undefined) {
      this.getURL(this.props.url).then(response => {
        if (response.status == "success") {
          this.setState({
            fileData: response.data,
            dataReady: true
          });
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
        content = content.replace(
          match[0],
          params[match[1]]
          );
      }
    });
    return content
  }

  render() {
      
  var _moment = moment;
  var formatDate = (dateTime, dateTimeFormat) => {
    let userTimezone,
      userDateTimeFomat = null;
    userTimezone = this.profile.key.preferences.timezone
      ? this.profile.key.preferences.timezone
      : moment.tz.guess();
    userDateTimeFomat = this.profile.key.preferences.dateformat
      ? this.profile.key.preferences.dateformat
      : "YYYY-MM-DD";
    dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
    return moment(dateTime)
      .utc(dateTime, "MM/dd/yyyy HH:mm:ss")
      .clone()
      .tz(userTimezone)
      .format(userDateTimeFomat);
  };
  var formatDateWithoutTimezone = (dateTime, dateTimeFormat) => {
    let userDateTimeFomat = null;
    userDateTimeFomat = this.profile.key.preferences.dateformat
      ? this.profile.key.preferences.dateformat
      : "YYYY-MM-DD";
    dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
    return moment(dateTime).format(userDateTimeFomat);
  };

  var fileData = {};
  for (const [key, value] of Object.entries(this.state.fileData)) {
    fileData[key] = value;
  }
  var content = this.searchAndReplaceParams(this.state.content,fileData);
    return (
      this.state.dataReady && (
        <JsxParser className ={this.props.className}
          jsx={content}
          bindings={{
            data: fileData ? fileData : {},
            item: fileData ? fileData : {},
            moment: moment,
            formatDate: formatDate,
            formatDateWithoutTimezone: formatDateWithoutTimezone,
            profile: this.profile.key
          }}
        />
      )
    );
  }
}

export default HTMLViewer;
