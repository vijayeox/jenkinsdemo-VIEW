import React, { Component } from "react";

import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";

import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from "@progress/kendo-react-grid";

import ReactNotification from "react-notifications-component";

import DialogContainer from "./dialog/DialogContainerAnnounc";
import cellWithEditing from "./cellWithEditing";
import { orderBy } from "@progress/kendo-data-query";

class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

   this.state = {
      ancInEdit: undefined,
      sort: [{ field: "name", dir: "asc" }],
      products: [],
      action: ""
    };

      this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();

    this.getAnnouncementData().then(response => {
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
    this.getAnnouncementData().then(response => {
      this.setState({ products: response.data });
      this.addDataNotification(serverResponse);
    });
  };

  async getAnnouncementData() {
    let helper = this.core.make("oxzion/restClient");
    let AncData = await helper.request("v1", "/announcement", {}, "get");
    return AncData;
  }

  edit = dataItem => {
    this.setState({
      ancInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  async deleteAnnouncementData(dataItem) {
    let helper = this.core.make("oxzion/restClient");
    let delOrg = helper.request(
      "v1",
      "/announcement/" + dataItem,
      {},
      "delete"
    );
    return delOrg;
  }

  remove = dataItem => {
    this.deleteAnnouncementData(dataItem.id).then(response => {
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
    const dataItem = this.state.ancInEdit;
    const products = this.state.products.slice();

    if (dataItem.id === undefined) {
      products.unshift(this.newProduct(dataItem));
    } else {
      const index = products.findIndex(p => p.id === dataItem.id);
      products.splice(index, 1, dataItem);
    }

    this.setState({
      products: products,
      ancInEdit: undefined
    });
  };

  cancel = () => {
    this.setState({ ancInEdit: undefined });
  };

  insert = () => {
    this.setState({ ancInEdit: {}, action: "add" });
  };



  render = () => {
    return (
      <div id="announcement">
        <div style={{ margin: "10px 0px 10px 0px" }} className="row">
          <div className="col s3">
            <a className="waves-effect waves-light btn goBack">
              <FaArrowLeft />
            </a>
          </div>
          <center>
            <div className="col s6" id="pageTitle">
              Manage Announcements
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
              <div style={{ fontSize: "20px" }}>Announcements List</div>
              <button
                onClick={this.insert}
                className="k-button"
                style={{ position: "absolute", top: "8px", right: "16px" }}
              >
                <FaPlusCircle style={{ fontSize: "20px" }} />

                <p style={{ margin: "0px", paddingLeft: "10px" }}>
                  New Announcement
                </p>
              </button>
            </div>
          </GridToolbar>

          <Column field="id" title="ID" width="70px" />
          <Column field="name" title="Title" />

          <Column field="status" title="Status" />
          <Column field="description" title="Description" />
          <Column
            title="Edit"
            width="160px"
            cell={cellWithEditing(this.edit, this.remove)}
          />
        </Grid>

        {this.state.ancInEdit && (
          <DialogContainer
            args={this.core}
            dataItem={this.state.ancInEdit}
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
    return `${this.state.ancInEdit.id === undefined ? "Add" : "Edit"} product`;
  }

  cloneProduct(product) {
    return Object.assign({}, product);
  }

    newProduct(source) {
    const newProduct = {
      id: "",
      name: "",
      media: "",
      status: ""
    };

    return Object.assign(newProduct, source);
  }

}

export default Announcement;
