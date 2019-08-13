import React from "react";
import { TitleBar } from "./components/titlebar";
import { GridTemplate, Notification, MultiSelect } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import DialogContainer from "./dialog/DialogContainerAnnounc";

class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      ancInEdit: undefined,
      visible: false,
      permission: {
        canAdd: this.props.userProfile.privileges.MANAGE_ANNOUNCEMENT_WRITE,
        canEdit: this.props.userProfile.privileges.MANAGE_ANNOUNCEMENT_WRITE,
        canDelete: this.props.userProfile.privileges.MANAGE_ANNOUNCEMENT_WRITE
      },
      selectedOrg: this.props.userProfile.orgid
    };

    this.notif = React.createRef();
    this.child = React.createRef();
    this.toggleDialog = this.toggleDialog.bind(this);
  }

  async pushAnnouncementGroups(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addGroups = await helper.request(
      "v1",
      "organization/" +
        this.state.selectedOrg +
        "/announcement/" +
        dataItem +
        "/save",
      {
        groups: dataObject
      },
      "post"
    );
    return addGroups;
  }

  async getAnnouncementGroups(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let groupUsers = await helper.request(
      "v1",
      "/announcement/" + dataItem + "/groups",
      {},
      "get"
    );
    return groupUsers;
  }

  handler = serverResponse => {
    if (serverResponse == "success") {
      this.notif.current.successNotification();
    } else {
      this.notif.current.failNotification(
        "Error",
        response.message ? response.message : "Announcement not created."
      );
    }
    this.child.current.child.current.refresh();
  };

  addAncUsers = dataItem => {
    this.getAnnouncementGroups(dataItem.uuid).then(response => {
      this.addUsersTemplate = React.createElement(MultiSelect, {
        args: this.core,
        config: {
          dataItem: dataItem,
          title: "Announcement",
          mainList: "organization/" + this.state.selectedOrg + "/groups/list",
          subList: response.data
        },
        manage: {
          postSelected: this.sendTheData,
          closeDialog: this.toggleDialog
        }
      });
      this.setState({
        visible: !this.state.visible
      });
    });
  };

  sendTheData = (selectedUsers, dataItem) => {
    var temp2 = [];
    for (var i = 0; i <= selectedUsers.length - 1; i++) {
      var uid = { uuid: selectedUsers[i].uuid };
      temp2.push(uid);
    }
    this.pushAnnouncementGroups(dataItem, temp2).then(response => {
      this.child.current.refreshHandler(response.status);
    });
    this.toggleDialog();
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible
    });
  }

  edit = (dataItem, required) => {
    dataItem = this.cloneItem(dataItem);
    this.setState({
      ancInEdit: dataItem
    });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: dataItem,
      selectedOrg: this.state.selectedOrg,
      cancel: this.cancel,
      formAction: "put",
      action: this.handler,
      userPreferences: this.props.userProfile.preferences,
      diableField: required.diableField
    });
  };

  cloneItem(item) {
    return Object.assign({}, item);
  }

  orgChange = event => {
    this.setState({ selectedOrg: event.target.value });
  };

  remove = dataItem => {
    DeleteEntry("announcement", dataItem.uuid).then(response => {
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
      selectedOrg: this.state.selectedOrg,
      cancel: this.cancel,
      formAction: "post",
      action: this.handler,
      userPreferences: this.props.userProfile.preferences
    });
  };

  render = () => {
    return (
      <div style={{ height: "inherit" }}>
        {this.state.visible && this.addUsersTemplate}
        <Notification ref={this.notif} />
        <TitleBar
          title="Manage Announcements"
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
            title: "Announcement",
            api: "organization/" + this.state.selectedOrg + "/announcements",

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
            addUsers: this.addAncUsers
          }}
          permission={this.state.permission}
        />
        {this.state.ancInEdit && this.inputTemplate}
      </div>
    );
  };
}

export default Announcement;
