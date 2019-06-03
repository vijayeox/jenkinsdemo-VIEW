import React from "react";
import { TitleBar } from "./components/titlebar";
import { GridTemplate, Notification } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import DialogContainer from "./dialog/DialogContainerAnnounc";

class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      ancInEdit: undefined,
      permission: "15"
    };

    this.notif = React.createRef();
    this.child = React.createRef();
  }

  handler = serverResponse => {
    if (serverResponse == "success") {
      this.notif.current.successNotification();
    } else {
      this.notif.current.failNotification();
    }
    this.child.current.child.current.refresh();
  };

  edit = dataItem => {
    this.setState({
      ancInEdit: this.cloneItem(dataItem)
    });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: dataItem,
      cancel: this.cancel,
      formAction: "put",
      action: this.handler
    });
  };

  cloneItem(item) {
    return Object.assign({}, item);
  }

  remove = dataItem => {
    DeleteEntry("announcement", dataItem.id).then(response => {
      this.handler(response.status);
    });
  };

  cancel = () => {
    this.setState({ ancInEdit: undefined });
  };

  insert = () => {
    this.setState({ ancInEdit: {} });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: [],
      cancel: this.cancel,
      formAction: "post",
      action: this.handler
    });
  };

  render = () => {
    return (
      <div style={{ height: "inherit" }}>
        <Notification ref={this.notif} />
        <TitleBar title="Manage Announcements" />
        <GridTemplate
          args={this.core}
          ref={this.child}
          config={{
            showToolBar: true,
            title: "Announcement",
            api:"announcement/a",
            column: [
              {
                title: "Banner",
                field: "media"
              },

              {
                title: "Name",
                field: "name"
              },
              {
                title: "Description",
                field: "description"
              }
            ]
          }}
          manageGrid={{
            add: this.insert,
            edit: this.edit,
            remove: this.remove,
            addUsers: this.addOrgUsers
          }}
          permission={this.state.permission}
        />
        {this.state.ancInEdit && this.inputTemplate}
      </div>
    );
  };
}

export default Announcement;
