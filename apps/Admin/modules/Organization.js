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

import DialogContainer from "./dialog/DialogContainerOrg";
import cellWithEditing from "./manage/cellWithEditing";
import { withState } from '../public/js/gridFilter';

const StatefulGrid = withState(Grid);

class Permissionallowed extends React.Component {
  render() {
    if(this.props.perm == 7 || this.props.perm == 15){
      return (
        <button
        onClick={this.props.args}
        className="k-button"
        style={{ position: "absolute", top: "8px", right: "16px" }}
      >
        <FaPlusCircle style={{ fontSize: "20px" }} />

        <p style={{ margin: "0px", paddingLeft: "10px" }}>
          Add Organization
        </p>
      </button>
      );
    }
    else{
     return(
       <div></div>
     )
    }
  }
}

class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;

    this.state = {
      orgInEdit: undefined,
      products: [],
      action: "",
      permission:"15"
    };
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();

    this.getOrganizationData().then(response => {
      this.setState({ products: response.data });
    });

  }

  componentDidMount() {
    $(document).ready(function () {
      $(".k-textbox").attr("placeholder", "Search");

      M.AutoInit();
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
        this.setState({ products: response.data });
        this.addDataNotification(serverResponse);
      });
    }
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

  searchUnavailable() {
    return (
      <div></div>
    );
  }

  disp(){
    if(this.state.permission!=1){
      console.log(this.state.permission);
      return(
    <Column
    title="Edit"
    width="160px"
    cell={cellWithEditing(this.edit, this.remove, this.state.permission)}
    filterCell={this.searchUnavailable}
  />
      );
    } else {
      console.log(
        "No Permissions"
      )
    }
  }


  render = () => {
    return (
      <div id="organization">
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

        <StatefulGrid data={this.state.products}>
          <GridToolbar>
            <div>
              <div style={{ fontSize: "20px" }}>Organizations List</div>
              
              <Permissionallowed
               args={this.insert}
               perm={this.state.permission}
               />
              
            </div>
          </GridToolbar>

          <Column field="id" title="ID" width="70px" />
          <Column field="name" title="Name" />

          <Column field="state" title="State" />
          <Column field="zip" title="Zip" />
          {this.disp()}
        </StatefulGrid>

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
