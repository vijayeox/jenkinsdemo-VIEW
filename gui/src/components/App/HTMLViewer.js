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

    return (
      this.state.dataReady && (
        <JsxParser className ={this.props.className}
          jsx={this.state.content}
          bindings={{
            data: this.state.fileData ? this.state.fileData : {},
            item: this.state.fileData ? this.state.fileData : {},
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
