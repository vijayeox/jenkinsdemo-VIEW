import React, { Component } from "react";

import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";

import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from "@progress/kendo-react-grid";

import ReactNotification from "react-notifications-component";

import DialogContainer from "./dialog/DialogContainerOrg";
import cellWithEditing from "./cellWithEditing";
import { orderBy } from "@progress/kendo-data-query";

class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

    this.state = {
      orgInEdit: undefined,
      sort: [{ field: "name", dir: "asc" }],
      products: [],
      action: ""
    };

    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();

    this.getOrganizationData().then(response => {
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
    this.getOrganizationData().then(response => {
      this.setState({ products: response.data });
      this.addDataNotification(serverResponse);
    });
  };

  async getOrganizationData() {
    let helper = this.core.make("oxzion/restClient");
    let OrgData = await helper.request("v1", "/organization", {}, "get");
    return OrgData;
  }

  edit = dataItem => {
    this.setState({
      orgInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

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
        <ReactNotification ref={this.notificationDOMRef} />
        <div style={{ margin: "10px 0px 10px 0px" }} className="row">
          <div className="col s3">
            <a className="waves-effect waves-light btn goBack">
              <FaArrowLeft />
            </a>
          </div>
          <center>
            <div className="col s6" id="pageTitle">
              Manage Organizations
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
              <div style={{ fontSize: "20px" }}>Organizations List</div>
              <button
                onClick={this.insert}
                className="k-button"
                style={{ position: "absolute", top: "8px", right: "16px" }}
              >
                <FaPlusCircle style={{ fontSize: "20px" }} />

                <p style={{ margin: "0px", paddingLeft: "10px" }}>
                  Add Organization
                </p>
              </button>
            </div>
          </GridToolbar>

          <Column field="id" title="ID" width="70px" />
          <Column field="name" title="Name" />

          <Column field="state" title="State" />
          <Column field="zip" title="Zip" />
          <Column
            title="Edit"
            width="160px"
            cell={cellWithEditing(this.edit, this.remove)}
          />
        </Grid>

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

  dialogTitle() {
    return `${this.state.orgInEdit.id === undefined ? "Add" : "Edit"} product`;
  }

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
