import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import {
  MultiSelectComponent,
  CheckBoxSelection,
  Inject
} from "@syncfusion/ej2-react-dropdowns";
import { GridTemplate, Notification } from "@oxzion/gui";
import { GetData, DeleteEntry } from "./components/apiCalls";

import DialogContainer from "./dialog/DialogContainerOrg";

class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      orgInEdit: undefined,
      userList: [],
      selectedUsers: [],
      orgToBeEdited: [],
      action: "",
      visible: false,
      permission: "15"
    };

    this.toggleDialog = this.toggleDialog.bind(this);
    this.captureSelectedUsers = this.captureSelectedUsers.bind(this);
    this.notif = React.createRef();
    this.child = React.createRef();
    this.checkFields = { text: "userName", value: "userid" };
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
    let loader = this.core.make("oxzion/splash");
    loader.show();

    this.setState({
      orgToBeEdited: dataItem.id,
      visible: !this.state.visible
    });

    GetData("user").then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName =
          response.data[i].firstname + " " + response.data[i].lastname;
        var userid = response.data[i].id;
        tempUsers.push({ userid: userid, userName: userName });
      }
      this.setState({
        userList: tempUsers
      });

      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });
  };

  captureSelectedUsers(e) {
    this.setState({
      selectedUsers: e.value
    });
  }

  saveAndSend = () => {
    this.sendTheData();
    this.toggleDialog();
  };

  sendTheData = () => {
    var temp1 = this.state.selectedUsers;
    for (var i = 0; i <= temp1.length - 1; i++) {
      this.pushOrgUsers(this.state.orgToBeEdited, temp1[i]);
    }
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      selectedUsers: [],
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
      <div style={{height:"inherit"}}>
        {this.state.visible && (
          <Dialog
            title={"Add Users to the Organization"}
            onClose={this.toggleDialog}
          >
            <div>
              <div className="control-section col-lg-8">
                <div id="multigroup">
                  <MultiSelectComponent
                    id="checkbox"
                    dataSource={this.state.userList}
                    value={this.state.selectedUsers}
                    change={this.captureSelectedUsers}
                    fields={this.checkFields}
                    mode="CheckBox"
                    placeholder="Click to add Users"
                    showDropDownIcon={true}
                    filterBarPlaceholder="Search Users"
                    popupHeight="350px"
                  >
                    <Inject services={[CheckBoxSelection]} />
                  </MultiSelectComponent>
                </div>
              </div>
            </div>
            <DialogActionsBar>
              <button className="k-button" onClick={this.saveAndSend}>
                Save
              </button>
              <button className="k-button" onClick={this.toggleDialog}>
                Cancel
              </button>
            </DialogActionsBar>
          </Dialog>
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
            column: ["id", "name", "state", "zip"]
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
