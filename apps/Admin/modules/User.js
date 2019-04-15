import React from "react";

import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import {
  Grid,
  GridColumn,
  GridToolbar
} from "@progress/kendo-react-grid";
import { Button } from '@progress/kendo-react-buttons';

import ReactNotification from "react-notifications-component";

import "jquery/dist/jquery.js";
import $ from "jquery";

import DialogContainer from "./dialog/DialogContainerUser";
import cellWithEditing from "./cellWithEditing";
import { withState } from './with-state';

const StatefulGrid = withState(Grid);

class User extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      userInEdit: undefined,
      products: [],
      action: ""
    };

    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();

    this.getUserData().then(response => {
      this.setState({ products: response.data });
      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });
  }

  componentDidMount() {
    $(document).ready(function () {
      $(".k-textbox").attr("placeholder", "Search");
    });
    M.AutoInit();
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

  addNotification(serverResponse) {
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
    this.getUserData().then(response => {
      let loader = this.core.make("oxzion/splash");
      loader.destroy();
      this.setState({ products: response.data });
      this.addDataNotification(serverResponse);
    });
  };

  async getUserData() {
    let helper = this.core.make("oxzion/restClient");
    let loader = this.core.make("oxzion/splash");
    loader.show();
    let userData = await helper.request("v1", "/user", {}, "get");
    return userData;
  }

  async deleteUserData(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let delUser = helper.request("v1", "/user/" + dataItem, {}, "delete");
    return delUser;
  }

  edit = dataItem => {
    this.setState({
      userInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  remove = dataItem => {
    this.deleteUserData(dataItem.id).then(response => {
      addNotification();
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
    const dataItem = this.state.userInEdit;
    const products = this.state.products.slice();

    if (dataItem.id === undefined) {
      products.unshift(this.newProduct(dataItem));
    } else {
      const index = products.findIndex(p => p.id === dataItem.id);
      products.splice(index, 1, dataItem);
    }

    this.setState({
      products: products,
      userInEdit: undefined
    });
  };

  cancel = () => {
    this.setState({ userInEdit: undefined });
  };

  insert = () => {
    this.setState({ userInEdit: {}, action: "add" });
  };

  searchUnavailable() {
    return (
      <div></div>
    );
  }

  render() {
    return (
      <div id="userPage">
        <ReactNotification ref={this.notificationDOMRef} />
        <div style={{ paddingTop: '12px' }} className="row">
          <div className="col s3">
            <Button className="goBack" primary={true} style={{ width: '45px', height: '45px' }}>
              <FaArrowLeft />
            </Button>
          </div>
          <center>
            <div className="col s6" id="pageTitle">
              Manage Users
            </div>
          </center>
        </div>

        <StatefulGrid data={this.state.products}>
          <GridToolbar>
            <div>
              <div style={{ fontSize: "20px" }}>Users List</div>
              <button
                onClick={this.insert}
                className="k-button"
                style={{ position: "absolute", top: "8px", right: "16px" }}
              >
                <FaPlusCircle style={{ fontSize: "20px" }} />
                <p style={{ margin: "0px", paddingLeft: "10px" }}>Add User</p>
              </button>
            </div>
          </GridToolbar>
          <GridColumn field="id" title="User ID" width="110px" />
          <GridColumn field="name" title="Name" />
          <GridColumn field="designation" title="Designation" />
          <GridColumn field="country" title="Country" />
          <GridColumn
            title="Edit"
            width="150px"
            cell={cellWithEditing(this.edit, this.remove)}
            filterCell={this.searchUnavailable}
          />
        </StatefulGrid>

        {this.state.userInEdit && (
          <DialogContainer
            args={this.core}
            dataItem={this.state.userInEdit}
            usersList={this.state.products}
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
    return `${this.state.userInEdit.id === undefined ? "Add" : "Edit"} product`;
  }
  cloneProduct(product) {
    return Object.assign({}, product);
  }

  newProduct(source) {
    const newProduct = {
      id: "",
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      email: "",
      date_of_birth: "",
      designation: "",
      gender: "",
      managerid: "",
      date_of_join: "",
      country: ""
    };

    return Object.assign(newProduct, source);
  }
}

export default User;
