import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@progress/kendo-react-buttons";
import { GridTemplate, Notification, MultiSelect } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";

import DialogContainer from "./dialog/DialogContainerGroup";

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      groupInEdit: undefined,
      groupToBeEdited: [],
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
      groupToBeEdited: dataItem.id,
      visible: !this.state.visible
    });
  };

  sendTheData = selectedUsers => {
    var temp2 = [];
    for (var i = 0; i <= selectedUsers.length - 1; i++) {
      var uid = { id: selectedUsers[i] };
      temp2.push(uid);
    }
    this.pushGroupUsers(this.state.groupToBeEdited, JSON.stringify(temp2));
    this.toggleDialog();
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      groupToBeEdited: []
    });
  }

  edit = dataItem => {
    this.setState({
      groupInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  cloneProduct(product) {
    return Object.assign({}, product);
  }

  remove = dataItem => {
    DeleteEntry("group", dataItem.id).then(response => {
      this.handler(response.status);
    });
  };

  cancel = () => {
    this.setState({ groupInEdit: undefined });
  };

  insert = () => {
    this.setState({ groupInEdit: {}, action: "add" });
  };

  render() {
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
              Manage Groups
            </div>
          </center>
        </div>
        <GridTemplate
          args={this.core}
          ref={this.child}
          config={{
            title: "group",
            column: ["id", "name", "description"]
          }}
          manageGrid={{
            add: this.insert,
            edit: this.edit,
            remove: this.remove,
            addUsers: this.addGroupUsers
          }}
          permission={this.state.permission}
        />
        {this.state.groupInEdit && (
          <DialogContainer
            args={this.core}
            dataItem={this.state.groupInEdit}
            cancel={this.cancel}
            formAction={this.state.action}
            action={this.handler}
          />
        )}
      </div>
    );
  }
}

export default Group;
