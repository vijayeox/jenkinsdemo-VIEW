import React from "react";
import { GridTemplate, Notification, MultiSelect } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import { TitleBar } from "./components/titlebar";

import DialogContainer from "./dialog/DialogContainerGroup";
class Group extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      groupInEdit: undefined,
      groupToBeEdited: [],
      action: "",
      visible: false,
      permission: "15"
    };
    this.toggleDialog = this.toggleDialog.bind(this);
    this.notif = React.createRef();
    this.child = React.createRef();
  }

  handler = serverResponse => {
    if (serverResponse == "success") {
      this.notif.current.successNotification();
    } else {
      this.notif.current.failNotification();
    }
    this.child.current.child.current.refresh("group");
  };

  async pushGroupUsers(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addGroupUsers = await helper.request(
      "v1",
      "/group/" + dataItem + "/save",
      {
        userid: dataObject
      },
      "post"
    );
    return addGroupUsers;
  }

  addGroupUsers = dataItem => {
    this.setState({
      groupToBeEdited: dataItem.id,
      visible: !this.state.visible
    });
  };

  sendTheData = selectedUsers => {
    var temp2 = [];
    for (var i = 0; i <= selectedUsers.length - 1; i++) {
      var uid = { id: selectedUsers[i] };
      temp2.push(uid);
    }
    this.pushGroupUsers(this.state.groupToBeEdited, JSON.stringify(temp2));
    this.toggleDialog();
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      groupToBeEdited: []
    });
  }

  edit = dataItem => {
    this.setState({
      groupInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
    this.inputTemplate =
      React.createElement(DialogContainer, {
        args: this.core,
        dataItem: dataItem || null,
        cancel: this.cancel,
        formAction: this.state.action,
        action: this.handler
      });
  };

  cloneProduct(product) {
    return Object.assign({}, product);
  }

  remove = dataItem => {
    DeleteEntry("group", dataItem.id).then(response => {
      this.handler(response.status);
    });
  };

  cancel = () => {
    this.setState({ groupInEdit: undefined });
  };

  insert = () => {
    this.setState({ groupInEdit: {}, action: "add" });
    this.inputTemplate =
      React.createElement(DialogContainer, {
        args: this.core,
        dataItem: [],
        cancel: this.cancel,
        formAction: this.state.action,
        action: this.handler
      });
  };

  render() {
    return (
      <div style={{ height: "inherit" }}>
        {this.state.visible && (
          <MultiSelect
            args={this.core}
            config={{
              dataItem: this.state.groupToBeEdited,
              mainList: "user",
              subList: "group"
            }}
            manage={{
              postSelected: this.sendTheData,
              closeDialog: this.toggleDialog
            }}
          />
        )}
        <Notification ref={this.notif} />
        <TitleBar title="Manage Groups" />
        <GridTemplate
          args={this.core}
          ref={this.child}
          config={{
            title: "group",
            column: ["id", "name", "description"]
          }}
          manageGrid={{
            add: this.insert,
            edit: this.edit,
            remove: this.remove,
            addUsers: this.addGroupUsers
          }}
          permission={this.state.permission}
        /> {this.state.groupInEdit && this.inputTemplate}
      </div>
    );
  }
}

export default Group;
