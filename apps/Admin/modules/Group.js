import React from "react";
import { GridTemplate, MultiSelect } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import { TitleBar } from "./components/titlebar";
import Swal from "sweetalert2";

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
      }
    };
    this.toggleDialog = this.toggleDialog.bind(this);
    this.child = React.createRef();
  }

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
      visible: !this.state.visible
    });

    this.addUsersTemplate = React.createElement(MultiSelect, {
      args: this.core,
      config: {
        dataItem: dataItem,
        title: "Group",
        mainList: "user",
        subList: "group"
      },
      manage: {
        postSelected: this.sendTheData,
        closeDialog: this.toggleDialog
      }
    });
  };

  sendTheData = (selectedUsers, item) => {
    if (selectedUsers.length == 0) {
      Swal.fire({
        title: "Action not possible",
        text: "Please have atleast one user for the group.",
        imageUrl: "https://image.flaticon.com/icons/svg/1006/1006115.svg",
        imageWidth: 75,
        imageHeight: 75,
        confirmButtonText: "OK",
        confirmButtonColor: "#66bb6a",
        target: ".Window_Admin"
      });
    } else {
      var temp2 = [];
      for (var i = 0; i <= selectedUsers.length - 1; i++) {
        var uid = { id: selectedUsers[i].id };
        temp2.push(uid);
      }
      this.pushGroupUsers(item, JSON.stringify(temp2));
      this.toggleDialog();
    }
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      groupToBeEdited: []
    });
  }

  edit = dataItem => {
    this.setState({
      groupInEdit: this.cloneProduct(dataItem)
    });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: dataItem || null,
      cancel: this.cancel,
      formAction: "put",
      action: this.child.current.refreshHandler
    });
  };

  cloneProduct(product) {
    return Object.assign({}, product);
  }

  remove = dataItem => {
    DeleteEntry("group", dataItem.uuid).then(response => {
      this.child.current.refreshHandler(response.status);
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
          // orgSwitch={
          //   this.props.userProfile.privileges.MANAGE_ORGANIZATION_WRITE
          //     ? true
          //     : false
          // }
        />
        <GridTemplate
          args={this.core}
          ref={this.child}
          config={{
            showToolBar: true,
            title: "Group",
            api: "group",
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
