import React from "react";
import { GridTemplate, MultiSelect } from "../GUIComponents";
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
      visible: false,
      permission: {
        canAdd: this.props.userProfile.privileges.MANAGE_GROUP_WRITE,
        canEdit: this.props.userProfile.privileges.MANAGE_GROUP_WRITE,
        canDelete: this.props.userProfile.privileges.MANAGE_GROUP_WRITE
      },
      selectedOrg: this.props.userProfile.orgid
    };
    this.toggleDialog = this.toggleDialog.bind(this);
    this.child = React.createRef();
  }

  async pushGroupUsers(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addGroupUsers = await helper.request(
      "v1",
      "organization/" + this.state.selectedOrg + "/group/" + dataItem + "/save",
      {
        userid: dataObject
      },
      "post"
    );
    return addGroupUsers;
  }

  addGroupUsers = dataItem => {
    this.setState({
      visible: !this.state.visible
    });

    this.addUsersTemplate = React.createElement(MultiSelect, {
      args: this.core,
      config: {
        dataItem: dataItem,
        title: "Group",
        mainList: "organization/" + this.state.selectedOrg + "/users/list",
        subList: "group",
        members: "Users"
      },
      manage: {
        postSelected: this.sendTheData,
        closeDialog: this.toggleDialog
      }
    });
  };

  sendTheData = (selectedUsers, item) => {
    var temp2 = [];
    for (var i = 0; i <= selectedUsers.length - 1; i++) {
      var uid = { uuid: selectedUsers[i].uuid };
      temp2.push(uid);
    }
    this.pushGroupUsers(item, temp2).then(response => {
      this.child.current.refreshHandler(response);
    });
    this.toggleDialog();
  };

  orgChange = event => {
    this.setState({ selectedOrg: event.target.value });
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      groupToBeEdited: []
    });
  }

  edit = (dataItem, required) => {
    dataItem = this.cloneItem(dataItem);
    this.setState({
      groupInEdit: dataItem
    });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: dataItem || null,
      selectedOrg: this.state.selectedOrg,
      cancel: this.cancel,
      formAction: "put",
      action: this.child.current.refreshHandler,
      diableField: required.diableField
    });
  };

  cloneItem(product) {
    return Object.assign({}, product);
  }

  remove = dataItem => {
    DeleteEntry(
      "organization/" + this.state.selectedOrg + "/group",
      dataItem.uuid
    ).then(response => {
      this.child.current.refreshHandler(response);
    });
  };

  cancel = () => {
    this.setState({ groupInEdit: undefined });
  };

  insert = () => {
    this.setState({ groupInEdit: {} });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: [],
      selectedOrg: this.state.selectedOrg,
      cancel: this.cancel,
      formAction: "post",
      action: this.child.current.refreshHandler
    });
  };

  render() {
    return (
      <div style={{ height: "inherit" }}>
        {this.state.visible && this.addUsersTemplate}
        <TitleBar
          title="Manage Groups"
          menu={this.props.menu}
          args={this.core}
          orgChange={this.orgChange}
          orgSwitch={
            this.props.userProfile.privileges.MANAGE_ORGANIZATION_WRITE
              ? true
              : false
          }
        />
        <GridTemplate
          args={this.core}
          ref={this.child}
          config={{
            showToolBar: true,
            title: "Group",
            api: "organization/" + this.state.selectedOrg + "/groups",

            column: [
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
            addUsers: this.addGroupUsers
          }}
          permission={this.state.permission}
        />
        {this.state.groupInEdit && this.inputTemplate}
      </div>
    );
  }
}

export default Group;
