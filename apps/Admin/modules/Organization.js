import React from "react";
import { TitleBar } from "./components/titlebar";
import { GridTemplate, MultiSelect } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import DialogContainer from "./dialog/DialogContainerOrg";

class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      orgInEdit: undefined,
      orgToBeEdited: [],
      action: "",
      visible: false,
      permission: {
        canAdd: this.props.userProfile.privileges.MANAGE_ORGANIZATION_CREATE,
        canEdit: this.props.userProfile.privileges.MANAGE_ORGANIZATION_WRITE,
        canDelete: this.props.userProfile.privileges.MANAGE_ORGANIZATION_DELETE
      }
    };
    this.toggleDialog = this.toggleDialog.bind(this);
    this.child = React.createRef();
  }

  async pushOrgUsers(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addOrgUsers = await helper.request(
      "v1",
      "/organization/" + dataItem + "/save",
      {
        userid: dataObject
      },
      "post"
    );
    return addOrgUsers;
  }

  addOrgUsers = dataItem => {
    this.setState({
      visible: !this.state.visible
    });
    this.addUsersTemplate = React.createElement(MultiSelect, {
      args: this.core,
      config: {
        dataItem: dataItem,
        title: "Organization",
        mainList: "user",
        subList: "organization"
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
      var uid = { uuid: selectedUsers[i].uuid };
      temp2.push(uid);
    }
    this.pushOrgUsers(dataItem, temp2).then(response => {
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
      orgInEdit: dataItem
    });

    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: dataItem || null,
      cancel: this.cancel,
      formAction: "put",
      action: this.child.current.refreshHandler,
      diableField: required.diableField
    });
  };

  cloneItem(item) {
    return Object.assign({}, item);
  }

  remove = dataItem => {
    DeleteEntry("organization", dataItem.uuid).then(response => {
      this.child.current.refreshHandler(response.status);
    });
  };

  cancel = () => {
    this.setState({ orgInEdit: undefined });
  };

  insert = () => {
    this.setState({ orgInEdit: {} });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: [],
      cancel: this.cancel,
      formAction: "post",
      action: this.child.current.refreshHandler
    });
  };

  render = () => {
    return (
      <div style={{ height: "inherit" }}>
        {this.state.visible && this.addUsersTemplate}
        <TitleBar
          title="Manage Organizations"
          menu={this.props.menu}
          args={this.core}
        />
        <GridTemplate
          args={this.core}
          ref={this.child}
          config={{
            showToolBar: true,
            title: "Organization",
            api: "organization",
            column: [
              {
                title: "Logo",
                field: "logo"
              },

              {
                title: "Name",
                field: "name"
              },
              {
                title: "State",
                field: "state"
              },
              {
                title: "Zip Code",
                field: "zip"
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
        {this.state.orgInEdit && this.inputTemplate}
      </div>
    );
  };
}

export default Organization;
