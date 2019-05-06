import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@progress/kendo-react-buttons";
import { GridTemplate, Notification, MultiSelect } from "@oxzion/gui";
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
    this.child.current.child.current.refresh();
  };

  async pushOrgUsers(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addProjectUsers = await helper.request(
      "v1",
      "/organization/" + dataItem + "/adduser/" + dataObject,
      {},
      "get"
    );
    return addProjectUsers;
  }

  addOrgUsers = dataItem => {
    this.setState({
      orgToBeEdited: dataItem.id,
      visible: !this.state.visible
    });
  };

  sendTheData = selectedUsers => {
    for (var i = 0; i <= selectedUsers.length - 1; i++) {
      this.pushOrgUsers(this.state.orgToBeEdited, selectedUsers[i]);
    }
    this.toggleDialog();
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      orgToBeEdited: []
    });
  }

  edit = dataItem => {
    this.setState({
      orgInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  cloneProduct(product) {
    return Object.assign({}, product);
  }

  remove = dataItem => {
    DeleteEntry("organization", dataItem.id).then(response => {
      this.handler(response.status);
    });
  };

  cancel = () => {
    this.setState({ orgInEdit: undefined });
  };

  insert = () => {
    this.setState({ orgInEdit: {}, action: "add" });
  };

  render = () => {
    return (
      <div style={{ height: "inherit" }}>
        {this.state.visible && (
          <MultiSelect
            args={this.core}
            config={{
              dataItem: this.state.orgToBeEdited,
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
        <div style={{ paddingTop: "12px" }} className="row">
          <div className="col s3">
            <Button
              className="goBack"
              primary={true}
              style={{ width: "45px", height: "45px" }}
            >
              <FaArrowLeft />
            </Button>
          </div>
          <center>
            <div className="col s6" id="pageTitle">
              Manage Organizations
            </div>
          </center>
        </div>
        <GridTemplate
          args={this.core}
          ref={this.child}
          config={{
            title: "organization",
            column: ["logo", "name", "state", "zip"]
          }}
          manageGrid={{
            add: this.insert,
            edit: this.edit,
            remove: this.remove,
            addUsers: this.addOrgUsers
          }}
          permission={this.state.permission}
        />

        {this.state.orgInEdit && (
          <DialogContainer
            args={this.core}
            dataItem={this.state.orgInEdit}
            cancel={this.cancel}
            formAction={this.state.action}
            action={this.handler}
          />
        )}
      </div>
    );
  };
}

export default Organization;
