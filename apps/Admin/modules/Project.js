import React from "react";
import { GridTemplate, Notification, MultiSelect } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import { TitleBar } from "./components/titlebar";
import Swal from "sweetalert2";
import DialogContainer from "./dialog/DialogContainerPrj";

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      prjInEdit: undefined,
      projectToBeEdited: [],
      visible: false,
      permission: {
        canAdd: this.props.userProfile.privileges.MANAGE_PROJECT_WRITE,
        canEdit: this.props.userProfile.privileges.MANAGE_PROJECT_WRITE,
        canDelete: this.props.userProfile.privileges.MANAGE_PROJECT_WRITE
      },
      selectedOrg: this.props.userProfile.orgid
    };
    this.toggleDialog = this.toggleDialog.bind(this);
    this.notif = React.createRef();
    this.child = React.createRef();
  }

  async pushProjectUsers(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addProjectUsers = await helper.request(
      "v1",
      "/project/" + dataItem + "/save",
      {
        userid: dataObject
      },
      "post"
    );
    return addProjectUsers;
  }

  saveAndSend = selectedUsers => {
    if (selectedUsers.length == 0) {
      Swal.fire({
        title: "Action not possible",
        text: "Please have atleast one user for the project.",
        imageUrl: "https://image.flaticon.com/icons/svg/1006/1006115.svg",
        imageWidth: 75,
        imageHeight: 75,
        confirmButtonText: "OK",
        confirmButtonColor: "#66bb6a",
        target: ".Window_Admin"
      });
    } else {
      this.sendTheData(selectedUsers);
      this.toggleDialog();
    }
  };

  addProjectUsers = dataItem => {
    this.setState({
      visible: !this.state.visible
    });
    self = this.addUsersTemplate = React.createElement(MultiSelect, {
      args: this.core,
      config: {
        dataItem: dataItem,
        title: "Project",
        mainList: "organization/" + this.state.selectedOrg + "/users/list",
        subList: "project"
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
        text: "Please have atleast one user for the project.",
        imageUrl: "https://image.flaticon.com/icons/svg/1006/1006115.svg",
        imageWidth: 75,
        imageHeight: 75,
        confirmButtonText: "OK",
        confirmButtonColor: "#66bb6a",
        target: ".Window_Admin"
      });
    } else {
      var temp1 = selectedUsers;
      var temp2 = [];
      for (var i = 0; i <= temp1.length - 1; i++) {
        var uid = { uuid: temp1[i].uuid };
        temp2.push(uid);
      }
      this.pushProjectUsers(item, temp2).then(response => {
        this.child.current.refreshHandler(response.status);
      });
      this.toggleDialog();
    }
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible
    });
  }

  orgChange = event => {
    this.setState({ selectedOrg: event.target.value });
  };

  edit = (dataItem, required) => {
    dataItem = this.cloneItem(dataItem);
    this.setState({
      prjInEdit: dataItem
    });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: dataItem,
      selectedOrg: this.state.selectedOrg,
      cancel: this.cancel,
      formAction: "put",
      action: this.child.current.refreshHandler,
      diableField: required.diableField
    });
  };

  cloneItem(dataItem) {
    return Object.assign({}, dataItem);
  }

  remove = dataItem => {
    DeleteEntry("project", dataItem.uuid).then(response => {
      this.child.current.refreshHandler(response.status);
    });
  };

  cancel = () => {
    this.setState({ prjInEdit: undefined });
  };

  insert = () => {
    this.setState({ prjInEdit: {} });
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
        <Notification ref={this.notif} />
        <TitleBar
          title="Manage Projects"
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
            title: "Project",
            api: "organization/" + this.state.selectedOrg + "/projects",
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
            addUsers: this.addProjectUsers
          }}
          permission={this.state.permission}
        />
        {this.state.prjInEdit && this.inputTemplate}
      </div>
    );
  }
}

export default Project;
