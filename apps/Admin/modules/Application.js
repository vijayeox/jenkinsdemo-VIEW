import React, { Component } from "react";

import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";

import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from "@progress/kendo-react-grid";

import ReactNotification from "react-notifications-component";

import DialogContainer from "./dialog/DialogContainerApp";
import cellWithEditing from "./cellWithEditing";
import { orderBy } from "@progress/kendo-data-query";

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

    this.state = {
      appInEdit: undefined,
      sort: [{ field: "name", dir: "asc" }],
      products: [],
      action: ""
    };

    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();

    this.getAppData().then(response => {
      this.setState({ products: response.data });
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
    this.getAppData().then(response => {
      this.setState({ products: response.data });
      this.addDataNotification(serverResponse);
    });
  };

  async getAppData() {
    let helper = this.core.make("oxzion/restClient");
    let OrgData = await helper.request("v1", "/app", {}, "get");
    return OrgData;
  }

  edit = dataItem => {
    this.setState({
      appInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  async deleteApplicationData(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let delApp = helper.request(
      "v1",
      "/app/" + dataItem,
      {},
      "delete"
    );
    return delApp;
  }

  remove = dataItem => {
    this.deleteApplicationData(dataItem.id).then(response => {
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
    const dataItem = this.state.appInEdit;
    const products = this.state.products.slice();

    if (dataItem.id === undefined) {
      products.unshift(this.newProduct(dataItem));
    } else {
      const index = products.findIndex(p => p.id === dataItem.id);
      products.splice(index, 1, dataItem);
    }

    this.setState({
      products: products,
      appInEdit: undefined
    });
  };

  cancel = () => {
    this.setState({ appInEdit: undefined });
  };

  insert = () => {
    this.setState({ appInEdit: {}, action: "add" });
  };

  render = () => {
    return (
      <div>
        <ReactNotification ref={this.notificationDOMRef} />
        <div style={{ margin: "10px 0px 10px 0px" }} className="row">
          <div className="col s3">
            <a className="waves-effect waves-light btn goBack">
              <FaArrowLeft />
            </a>
          </div>
          <center>
            <div className="col s6" id="pageTitle">
              Manage Applications
            </div>
          </center>
        </div>

        <Grid
          data={orderBy(this.state.products, this.state.sort)}
          sortable
          sort={this.state.sort}
          onSortChange={e => {
            this.setState({
              sort: e.sort
            });
          }}
        >
          <GridToolbar>
            <div>
              <div style={{ fontSize: "20px" }}>Apps List</div>
              <button
                onClick={this.insert}
                className="k-button"
                style={{ position: "absolute", top: "8px", right: "16px" }}
              >
                <FaPlusCircle style={{ fontSize: "20px" }} />

                <p style={{ margin: "0px", paddingLeft: "10px" }}>
                  Add Application
                </p>
              </button>
            </div>
          </GridToolbar>

          <Column field="uuid" title="UUID" width="70px" />
          <Column field="name" title="Name" />

          <Column field="description" title="Description" />
          <Column field="category" title="Category" />
          <Column
            title="Edit"
            width="160px"
            cell={cellWithEditing(this.edit, this.remove)}
          />
        </Grid>

        {this.state.appInEdit && (
          <DialogContainer
            args={this.core}
            dataItem={this.state.appInEdit}
            save={this.save}
            cancel={this.cancel}
            formAction={this.state.action}
            action={this.handler}
          />
        )}
      </div>
    );
  };

  dialogTitle() {
    return `${this.state.appInEdit.id === undefined ? "Add" : "Edit"} product`;
  }

  cloneProduct(product) {
    return Object.assign({}, product);
  }

  newProduct(source) {
    const newProduct = {
      uuid: "",
      name: "",
      type: "",
      category: ""
    };

    return Object.assign(newProduct, source);
  }
}

export default Application;
