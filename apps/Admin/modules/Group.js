import React from "react";

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";

import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from "@progress/kendo-react-grid";

import ReactNotification from "react-notifications-component";
import { Button } from '@progress/kendo-react-buttons';

import DialogContainer from "./dialog/DialogContainerGroup";
import cellWithEditing from "./manage/cellWithEditingGroup";

import "jquery/dist/jquery.js";
import $ from "jquery";
import { withState } from '../public/js/gridFilter';


const StatefulGrid = withState(Grid);

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      useridList: [],
      usersList: [],
      value: [],
      visible: false,
      groupInEdit: undefined,
      sort: [
        {
          field: "name",
          dir: "asc"
        }
      ],
      products: [],
      action: ""
    };
    this.toggleDialog = this.toggleDialog.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();

    this.getGroupData().then(response => {
      this.setState({
        products: response.data
      });
      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });
  }

  componentDidMount() {
    $(document).ready(function () {
      $(".k-textbox").attr("placeholder", "Search");
    });
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
      dismiss: {
        duration: 5000
      },
      dismissable: {
        click: true
      }
    });
  }

  addNotification(serverResponse) {
    this.notificationDOMRef.current.addNotification({
      title: "All Done!!!  👍",
      message: "Operation successfully completed.",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: {
        duration: 5000
      },
      dismissable: {
        click: true
      }
    });
  }

  handler = serverResponse => {
    this.getGroupData().then(response => {
      this.setState({
        products: response.data
      });
      this.addDataNotification(serverResponse);
      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });
  };

  listOnChange = event => {
    this.setState({
      value: [...event.target.value]
    });
  };

  sendTheData = () => { 
    var temp1 = this.state.value;
    var temp2 = [];
    for (var i = 0; i <= temp1.length - 1; i++) {
      var uid = { "id": temp1[i].userid };
      temp2.push(uid);
    }

    this.pushGroupUsers(this.state.groupToBeEdited, JSON.stringify(temp2));


    this.setState({
      visible: !this.state.visible,
      usersList: [],
      value: [],
      groupToBeEdited: []
    });
  }

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      usersList: [],
      value: [],
      groupToBeEdited: []
    })
  }

  async getGroupData() {
    let loader = this.core.make("oxzion/splash");
    loader.show();
    let helper = this.core.make("oxzion/restClient");
    let groupData = await helper.request("v1", "/group", {}, "get");
    return groupData;
  }

  async getUserData() {
    let helper = this.core.make("oxzion/restClient");
    let userData = await helper.request("v1", "/user", {}, "get");
    return userData;
  }

  async getGroupUsers(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let groupUsers = await helper.request(
      "v1", "/group/" + dataItem + "/users", {}, "get");
    return groupUsers;
  }

  async deleteGroupData(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let delGroup = helper.request("v1", "/group/" + dataItem, {}, "delete");
    return delGroup;
  }

  async pushGroupUsers(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addGroupUsers = await helper.request("v1", "/group/" + dataItem + "/save",
      {
        userid: dataObject
      },
      "post"
    );
    return addGroupUsers;
  }

  edit = dataItem => {
    this.setState({
      groupInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  addUsers = dataItem => {
    this.setState({
      groupToBeEdited: dataItem.id
    })
    this.getUserData(dataItem.id).then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName = response.data[i].firstname + " " + response.data[i].lastname;
        var userid = response.data[i].id;
        tempUsers.push({ userid: userid, userName: userName });
      }
      this.setState({
        usersList: tempUsers
      });
      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });
  };

  addGroupUsers = dataItem => {
    let loader = this.core.make("oxzion/splash");
    loader.show();
    this.addUsers(dataItem);
    this.getGroupUsers(dataItem.id).then(response => {
      var tempGroupUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName = response.data[i].name;
        var userid = response.data[i].id;
        tempGroupUsers.push({ userid: userid, userName: userName });
      }
      this.setState({
        value: tempGroupUsers
      });
    });
    this.setState({
      visible: !this.state.visible
    });
  };
  
  remove = dataItem => {
    this.deleteGroupData(dataItem.id).then(response => {
      this.handler();
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
    const dataItem = this.state.groupInEdit;
    const products = this.state.products.slice();

    if (dataItem.id === undefined) {
      products.unshift(this.newProduct(dataItem));
    } else {
      const index = products.findIndex(p => p.id === dataItem.id);
      products.splice(index, 1, dataItem);
    }

    this.setState({
      products: products,
      groupInEdit: undefined
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
      <div id="groupPage">
        {this.state.visible && (
          <Dialog
            title={"Add users to the group "}
            onClose={this.toggleDialog}
          >
            <div>
              <h6>Select Users:</h6>
              <MultiSelect
                data={this.state.usersList}
                onChange={this.listOnChange}
                value={this.state.value}
                style={{ height: "auto" }}
                textField="userName"
                dataItemKey="userid"
              />

              <button className="k-button" onClick={this.sendTheData}>
                Save
              </button>
            </div>
            <DialogActionsBar>

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
              Manage Groups
            </div>
          </center>
        </div>

        <StatefulGrid data={this.state.products}>
          <GridToolbar>
            <div>
              <div style={{ fontSize: "20px" }}>Groups List</div>
              <button
                onClick={this.insert}
                className="k-button"
                style={{ position: "absolute", top: "8px", right: "16px" }}
              >
                <FaPlusCircle style={{ fontSize: "20px" }} />

                <p style={{ margin: "0px", paddingLeft: "10px" }}>Add Group</p>
              </button>
            </div>
          </GridToolbar>

          <Column field="id" title="ID" width="70px" />
          <Column field="name" title="Name" />
          <Column field="description" title="Description" />
          <Column
            title="Edit"
            width="160px"
            cell={cellWithEditing(this.edit, this.remove, this.addGroupUsers)}
          />
        </StatefulGrid>

        {this.state.groupInEdit && (
          <DialogContainer
            args={this.core}
            groupsList={this.state.products}
            dataItem={this.state.groupInEdit}
            save={this.save}
            cancel={this.cancel}
            formAction={this.state.action}
            action={this.handler}
          />
        )}
      </div>
    );
  }

  dialogTitle() {
    return `${
      this.state.groupInEdit.id === undefined ? "Add" : "Edit"
      } product`;
  }

  cloneProduct(product) {
    return Object.assign({}, product);
  }

  newProduct(source) {
    const newProduct = {
      id: "",
      name: "",
      org_id: "",
      manager_id: "",
      parent_id: "",
      description: ""
    };
    return Object.assign(newProduct, source);
  }
}

class List extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(function (item) {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    );
  }
}

export default Group;
