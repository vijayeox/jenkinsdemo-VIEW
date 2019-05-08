import React from "react";
import { TitleBar } from "./components/titlebar";
import { GridTemplate, Notification } from "@oxzion/gui";
import { DeleteEntry } from "./components/apiCalls";
import DialogContainer from "./dialog/DialogContainerUser";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      userInEdit: undefined,
      products: [],
      action: "",
      permission: "15"
    };
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
  }

  edit = dataItem => {
    this.setState({
      userInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  remove = dataItem => {
    DeleteEntry("user", dataItem.id).then(response => {
      this.handler(response.status);
    });
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
      <div style={{ height: "inherit" }}>
        <Notification ref={this.notif} />
        <TitleBar title="Manage Users" />
        <GridTemplate args={this.core} ref={this.child}
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
