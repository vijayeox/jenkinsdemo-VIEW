import React from "react";

import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from "@progress/kendo-react-grid";
import { Button } from '@progress/kendo-react-buttons';

import ReactNotification from "react-notifications-component";
import "jquery/dist/jquery.js";
import $ from "jquery";

import { withState } from './with-state';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import DialogContainer from "./dialog/DialogContainerPrj";
import cellWithEditing from "./cellWithEditingProject";


import { MultiSelectComponent, CheckBoxSelection, Inject } from '@syncfusion/ej2-react-dropdowns';
import "../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../node_modules/@syncfusion/ej2-react-inputs/styles/material.css";
import "../node_modules/@syncfusion/ej2-react-dropdowns/styles/material.css";
import "../node_modules/@syncfusion/ej2-react-buttons/styles/material.css";

const StatefulGrid = withState(Grid);

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      userList: [],
      selectedUsers: [],
      projectToBeEdited:[],
      prjInEdit: undefined,
      products: [],
      action: "",
      visible: false
    };
    this.toggleDialog = this.toggleDialog.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.captureSelectedUsers = this.captureSelectedUsers.bind(this);
    this.notificationDOMRef = React.createRef();
    this.checkFields = { text: 'userName', value: 'userid' };

    this.getProjectData().then(response => {
      this.setState({ products: response.data });
    });
    let loader = this.core.make("oxzion/splash");
    loader.destroy();
  }

  componentDidMount() {
    $(document).ready(function () {
      $(".k-textbox").attr("placeholder", "Search");
      M.AutoInit();
    });
  }

  handler = serverResponse => {
    this.getProjectData().then(response => {
      this.setState({
        products: response.data
      });
      let loader = this.core.make("oxzion/splash");
      loader.destroy();
      this.addDataNotification(serverResponse);
    });
  };

  async getProjectData() {
    let helper = this.core.make("oxzion/restClient");
    let loader = this.core.make("oxzion/splash");
    loader.show();
    let PrjData = await helper.request("v1", "/project", {}, "get");
    return PrjData;
  }

  async getUserData() {
    let helper = this.core.make("oxzion/restClient");
    let userData = await helper.request("v1", "/user", {}, "get");
    return userData;
  }

  async getProjectUsers(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let groupUsers = await helper.request(
      "v1", "/project/" + dataItem + "/users", {}, "get");
    return groupUsers;
  }

  async pushProjectUsers(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addProjectUsers = await helper.request("v1", "/project/" + dataItem + "/save",
      {
        userid: dataObject
      },
      "post"
    );
    return addProjectUsers;
  }

  async deleteProjectData(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let delOrg = helper.request("v1", "/project/" + dataItem, {}, "delete");
    return delOrg;
  }

  addProjectUsers = (dataItem) => {
    this.setState({
      projectToBeEdited: dataItem.id
    })

    this.setState({
      visible: !this.state.visible
    });

    let loader = this.core.make("oxzion/splash");
    loader.show();


    this.getProjectUsers(dataItem.id).then(response => {
      var tempProjectUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userid = response.data[i].id;
        tempProjectUsers.push(userid);
      }
      this.setState({
        selectedUsers: tempProjectUsers
      });
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
    var temp2 = [];
    for (var i = 0; i <= temp1.length - 1; i++) {
      var uid = { "id": temp1[i] };
      temp2.push(uid);
    }
    this.pushProjectUsers(this.state.projectToBeEdited, JSON.stringify(temp2));

    this.setState({
      visible: !this.state.visible,
      usersList: [],
      value: [],
      groupToBeEdited: [],
      pushProjectUsers:[]
    });
  }

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      selectedUsers: []
    })
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

  edit = dataItem => {
    this.setState({
      prjInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  remove = dataItem => {
    this.deleteProjectData(dataItem.id).then(response => {
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
    const dataItem = this.state.prjInEdit;
    const products = this.state.products.slice();

    if (dataItem.id === undefined) {
      products.unshift(this.newProduct(dataItem));
    } else {
      const index = products.findIndex(p => p.id === dataItem.id);
      products.splice(index, 1, dataItem);
    }

    this.setState({
      products: products,
      prjInEdit: undefined
    });
  };


  cancel = () => {
    this.setState({ prjInEdit: undefined });
  };

  insert = () => {
    this.setState({ prjInEdit: {}, action: "add" });
  };

  searchUnavailable() {
    return (
      <div></div>
    );
  }

  render() {
    return (<div id="project">
      {this.state.visible && (
        <Dialog
          title={"Add Users to the Project"}
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
                  openOnClick="false"
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
            Manage Projects
          </div>
        </center>
      </div>

      <StatefulGrid data={this.state.products}>
        <GridToolbar>
          <div>
            <div style={{ fontSize: "20px" }}>Projects List</div>
            <button onClick={this.insert} className="k-button" style={{
              position: "absolute", top: "8px", right: "16px"
            }}>
              <FaPlusCircle style={{
                fontSize: "20px",
                color: "#002C3E"
              }} />

              <p style={{ margin: "0px", paddingLeft: "10px" }}>
                Add Project
              </p>
            </button>
          </div>
        </GridToolbar>

        <Column field="id" title="ID" width="70px" />
        <Column field="name" title="Name" width="200px" />

        <Column field="description" title="Description" />
        <Column title="Manage" width="180px"
          cell={cellWithEditing(this.edit, this.remove, this.addProjectUsers)}
          filterCell={this.searchUnavailable} />
      </StatefulGrid>

      {
        this.state.prjInEdit && (
          <DialogContainer
            args={this.core}
            dataItem={this.state.prjInEdit}
            save={this.save}
            cancel={this.cancel}
            formAction={this.state.action}
            action={this.handler} />
        )}
    </div>);
  }

  cloneProduct(product) {
    return Object.assign({}, product);
  }

  newProduct(source) {
    const newProduct = {
      id: "",
      name: ""
    };

    return Object.assign(newProduct, source);
  }
}

export default Project;
