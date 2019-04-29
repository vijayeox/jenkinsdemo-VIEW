import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from '@progress/kendo-react-buttons';
import { MultiSelectComponent, CheckBoxSelection, Inject } from '@syncfusion/ej2-react-dropdowns';
import { GridTemplate } from "@oxzion/gui";
import ReactNotification from "react-notifications-component";

import DialogContainer from "./dialog/DialogContainerOrg";

class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

    this.state = {
      products: [],
      orgInEdit: undefined,
      userList: [],
      selectedUsers: [],
      orgToBeEdited: [],
      action: "",
      visible: false,
      permission: "15"
    };

    this.toggleDialog = this.toggleDialog.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.captureSelectedUsers = this.captureSelectedUsers.bind(this);
    this.notificationDOMRef = React.createRef();
    this.checkFields = { text: 'userName', value: 'userid' };
  }

  addDataNotification(serverResponse) {
    this.notificationDOMRef.current.addNotification({
      title: "Operation Successful",
      message: "Entry created with ID:" + serverResponse,
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  addNotification() {
    this.notificationDOMRef.current.addNotification({
      title: "All Done!!!  👍",
      message: "Operation succesfully completed.",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  handler = serverResponse => {
    if (serverResponse == "success") {
      this.addNotification();
    } else {
      this.getOrganizationData().then(response => {
        this.setState({ products: response.data.data });
        this.addDataNotification(serverResponse);
        let loader = this.core.make("oxzion/splash");
        loader.destroy();
      });
    }
  };

  async getUserData() {
    let helper = this.core.make("oxzion/restClient");
    let userData = await helper.request("v1", "/user", {}, "get");
    return userData.data;
  }

  async pushOrgUsers(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addProjectUsers = await helper.request("v1", "/organization/" + dataItem + "/adduser/" + dataObject,
      {},
      "get"
    );
    return addProjectUsers;
  }

  async deleteOrganizationData(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let delOrg = helper.request(
      "v1",
      "/organization/" + dataItem,
      {},
      "delete"
    );
    return delOrg;
  }

  addOrgUsers = (dataItem) => {
    let loader = this.core.make("oxzion/splash");
    loader.show();

    this.setState({
      orgToBeEdited: dataItem.id,
      visible: !this.state.visible
    })

    this.getUserData().then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName = response.data[i].firstname + " " + response.data[i].lastname;
        var userid = response.data[i].id;
        tempUsers.push({ userid: userid, userName: userName });
      }
      this.setState({
        userList: tempUsers
      });

      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });

  }

  captureSelectedUsers(e) {
    this.setState({
      selectedUsers: e.value
    })
  }

  saveAndSend = () => {
    this.sendTheData();
    this.toggleDialog();
  }

  sendTheData = () => {
    var temp1 = this.state.selectedUsers;
    for (var i = 0; i <= temp1.length - 1; i++) {
      this.pushOrgUsers(this.state.orgToBeEdited, temp1[i]);
    }
  }

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      selectedUsers: [],
      orgToBeEdited: []
    })
  }

  edit = dataItem => {
    this.setState({
      orgInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  remove = dataItem => {
    this.deleteOrganizationData(dataItem.id).then(response => {
      this.addNotification();
    });

    const products = this.state.products;
    const index = products.findIndex(p => p.id === dataItem.id);
    if (index !== -1) {
      products.splice(index, 1);
      this.setState({
        products: products
      });
    }
  };

  save = () => {
    const dataItem = this.state.orgInEdit;
    const products = this.state.products.slice();

    if (dataItem.id === undefined) {
      products.unshift(this.newProduct(dataItem));
    } else {
      const index = products.findIndex(p => p.id === dataItem.id);
      products.splice(index, 1, dataItem);
    }

    this.setState({
      products: products,
      orgInEdit: undefined
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
      <div id="organization">
        {this.state.visible && (
          <Dialog
            title={"Add Users to the Organization"}
            onClose={this.toggleDialog}
          >
            <div>
              <div className='control-section col-lg-8'>
                <div id="multigroup">
                  <MultiSelectComponent id="checkbox"
                    dataSource={this.state.userList}
                    value={this.state.selectedUsers}
                    change={this.captureSelectedUsers}
                    fields={this.checkFields}
                    mode="CheckBox"
                    placeholder="Click to add Users"
                    showDropDownIcon={true}
                    filterBarPlaceholder="Search Users"
                    popupHeight="350px">
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
        <ReactNotification ref={this.notificationDOMRef} />
        <div style={{ paddingTop: '12px' }} className="row">
          <div className="col s3">
            <Button className="goBack" primary={true} style={{ width: '45px', height: '45px' }}>
              <FaArrowLeft />
            </Button>
          </div>
          <center>
            <div className="col s6" id="pageTitle">
              Manage Organizations
            </div>
          </center>
        </div>

        <GridTemplate args={this.core}
          config={{ "title": "organization", "column": ["id", "name", "state", "zip"] }}
          manageGrid={{
            "add": this.insert, "edit": this.edit,
            "remove": this.remove, "addUsers": this.addOrgUsers
          }}
          permission={this.state.permission} />

        {this.state.orgInEdit && (
          <DialogContainer
            args={this.core}
            dataItem={this.state.orgInEdit}
            save={this.save}
            cancel={this.cancel}
            formAction={this.state.action}
            action={this.handler}
          />
        )}
      </div>
    );
  };

  cloneProduct(product) {
    return Object.assign({}, product);
  }

  newProduct(source) {
    const newProduct = {
      id: "",
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      logo: "",
      languagefile: ""
    };

    return Object.assign(newProduct, source);
  }
}

export default Organization;
