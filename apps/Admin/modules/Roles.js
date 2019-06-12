import React from "react";
import { TitleBar } from "./components/titlebar";
import { GridTemplate, MultiSelect } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import DialogContainer from "./dialog/DialogContainerRole";
import PrivilegeTemplate from "./dialog/PrivilegeTemplate";

class Role extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      roleInEdit: undefined,
      roleToBeEdited: [],
      action: "",
      visible: false,
      permission: "15"
    };
    this.child = React.createRef();
  }

  setPrivileges = dataItem => {
    this.setState({
      visible: !this.state.visible
    });
    this.privilegeTemplate = React.createElement(PrivilegeTemplate, {
      args: this.core,
      dataItem: dataItem || null,
      cancel: () => {
        this.setState({
          visible: !this.state.visible
        });
      }
    });
  };

  edit = dataItem => {
    this.setState({
      roleInEdit: this.cloneItem(dataItem)
    });
    this.inputTemplate = React.createElement(DialogContainer, {
      args: this.core,
      dataItem: dataItem || null,
      cancel: this.cancel,
      formAction: "put",
      action: this.child.current.refreshHandler
    });
  };

  cloneItem(item) {
    return Object.assign({}, item);
  }

  remove = dataItem => {
    DeleteEntry("role", dataItem.id).then(response => {
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
      action: this.child.current.refreshHandler
    });
  };

  render() {
    return (
      <div style={{ height: "inherit" }}>
        {this.state.visible && this.privilegeTemplate}
        <TitleBar title="Manage User Roles" />
        <GridTemplate
          args={this.core}
          ref={this.child}
          config={{
            showToolBar: true,
            title: "Role",
            api: "role",
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
            setPrivileges: this.setPrivileges
          }}
          permission={this.state.permission}
        />
        {this.state.roleInEdit && this.inputTemplate}
      </div>
    );
  }
}

export default Role;
