import React from "react";
import { TitleBar } from "./components/titlebar";
import { GridTemplate } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import DialogContainer from "./dialog/DialogContainerRole";

class Role extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      roleInEdit: undefined,
      roleToBeEdited: [],
      action: "",
      permission: {
        canAdd: this.props.userProfile.privileges.MANAGE_ROLE_WRITE,
        canEdit: this.props.userProfile.privileges.MANAGE_ROLE_WRITE,
        canDelete: this.props.userProfile.privileges.MANAGE_ROLE_WRITE
      },
      selectedOrg: this.props.userProfile.orgid
    };
    this.child = React.createRef();
  }

  edit = dataItem => {
    dataItem = this.cloneItem(dataItem);
    this.setState({
      roleInEdit: dataItem
    });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: dataItem || null,
      cancel: this.cancel,
      formAction: "put",
      action: this.child.current.refreshHandler,
      selectedOrg: this.state.selectedOrg
    });
  };

  cloneItem(item) {
    return Object.assign({}, item);
  }

  orgChange = event => {
    this.setState({ selectedOrg: event.target.value });
  };

  remove = dataItem => {
    DeleteEntry("role", dataItem.uuid).then(response => {
      this.child.current.refreshHandler(response.status);
    });
  };

  cancel = () => {
    this.setState({ roleInEdit: undefined });
  };

  insert = () => {
    this.setState({ roleInEdit: {} });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: [],
      cancel: this.cancel,
      formAction: "post",
      action: this.child.current.refreshHandler,
      selectedOrg: this.state.selectedOrg
    });
  };

  render() {
    return (
      <div style={{ height: "inherit" }}>
        <TitleBar
          title="Manage User Roles"
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
            title: "Role",
            api: "role",
            api: "organization/" + this.state.selectedOrg + "/roles",
            column: [
              {
                title: "Name",
                field: "name"
              },

              {
                title: "Description",
                field: "description"
              }
            ],
            sortMode: [{ field: "is_system_role", dir: "desc" }]
          }}
          manageGrid={{
            add: this.insert,
            edit: this.edit,
            remove: this.remove
          }}
          permission={this.state.permission}
        />
        {this.state.roleInEdit && this.inputTemplate}
      </div>
    );
  }
}

export default Role;
