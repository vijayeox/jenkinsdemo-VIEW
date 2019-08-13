import React from "react";
import { TitleBar } from "./components/titlebar";
import { GridTemplate } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import DialogContainer from "./dialog/DialogContainerUser";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      userInEdit: undefined,
      permission: {
        canAdd: this.props.userProfile.privileges.MANAGE_USER_CREATE,
        canEdit: this.props.userProfile.privileges.MANAGE_USER_WRITE,
        canDelete: this.props.userProfile.privileges.MANAGE_USER_DELETE
      },
      selectedOrg: this.props.userProfile.orgid
    };
    this.child = React.createRef();
  }

  orgChange = event => {
    this.setState({ selectedOrg: event.target.value });
  };

  edit = (dataItem, required) => {
    dataItem = this.cloneItem(dataItem);
    this.setState({
      userInEdit: dataItem
    });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: dataItem || null,
      selectedOrg:this.state.selectedOrg,
      cancel: this.cancel,
      formAction: "put",
      action: this.child.current.refreshHandler,
      userPreferences: this.props.userProfile.preferences,
      diableField: required.diableField
    });
  };

  cloneItem(item) {
    return Object.assign({}, item);
  }

  remove = dataItem => {
    DeleteEntry("user", dataItem.uuid).then(response => {
      this.child.current.refreshHandler(response.status);
    });
  };

  cancel = () => {
    this.setState({ userInEdit: undefined });
  };

  insert = () => {
    this.setState({ userInEdit: {} });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: [],
      cancel: this.cancel,
      formAction: "post",
      selectedOrg:this.state.selectedOrg,
      userPreferences: this.props.userProfile.preferences,
      action: this.child.current.refreshHandler
    });
  };

  render() {
    return (
      <div style={{ height: "inherit" }}>
        <TitleBar
          title="Manage Users"
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
            title: "User",
            api: "organization/" + this.state.selectedOrg + "/users",
            column: [
              {
                title: "Profile Image",
                field: "logo"
              },
              {
                title: "Name",
                field: "name"
              },
              {
                title: "Designation",
                field: "designation"
              },
              {
                title: "Country",
                field: "country"
              }
            ]
          }}
          manageGrid={{
            add: this.insert,
            edit: this.edit,
            remove: this.remove
          }}
          permission={this.state.permission}
        />
        {this.state.userInEdit && this.inputTemplate}
      </div>
    );
  }
}

export default User;
