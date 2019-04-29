import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from '@progress/kendo-react-buttons';
import { GridTemplate } from "@oxzion/gui";
import ReactNotification from "react-notifications-component";

import DialogContainer from "./dialog/DialogContainerUser";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      userInEdit: undefined,
      products: [],
      action: "",
      permission:"15"
    };

    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
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

        <GridTemplate args={this.core}
          config={{ "title": "user", "column": ["id", "name", "designation", "country"] }}
          manageGrid={{
            "add": this.insert, "edit": this.edit,
            "remove": this.remove
          }}
          permission={this.state.permission} />

        {this.state.userInEdit && (
          <DialogContainer
            args={this.core}
            dataItem={this.state.userInEdit}
            save={this.save}
            cancel={this.cancel}
            formAction={this.state.action}
            action={this.handler}
          />
        )}
      </div>
    );
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
