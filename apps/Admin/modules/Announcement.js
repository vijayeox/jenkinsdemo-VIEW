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
      permission: "15",
      visible: false
    };
    this.notif = React.createRef();
    this.child = React.createRef();
  }

  async pushAnnouncementGroups(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addGroups = await helper.request(
      "v1",
      "/announcement/" + dataItem + "/save",
      {
        userid: dataObject
      },
      "post"
    );
    return addGroups;
  }

  handler = serverResponse => {
    if (serverResponse == "success") {
      this.notif.current.successNotification();
    } else {
      this.notif.current.failNotification();
    }
    this.child.current.child.current.refresh();
  };

  addAncUsers = dataItem => {
    this.setState({
      visible: !this.state.visible
    });
    this.addUsersTemplate = React.createElement(MultiSelect, {
      args: this.core,
      config: {
        dataItem: dataItem,
        mainList: "group",
        subList: "announcement"
      },
      manage: {
        postSelected: this.sendTheData,
        closeDialog: this.toggleDialog
      }
    });
  };


  sendTheData = (selectedUsers, dataItem) => {
    var temp2 = [];
    for (var i = 0; i <= selectedUsers.length - 1; i++) {
      var uid = { id: selectedUsers[i].id };
      temp2.push(uid);
    }
    this.pushAnnouncementGroups(dataItem, JSON.stringify(temp2));
    this.toggleDialog();
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible
    });
  }


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
        {this.state.visible && this.addUsersTemplate}
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
