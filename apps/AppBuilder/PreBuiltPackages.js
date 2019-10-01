import React, { Component } from "react";

import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";

import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from "@progress/kendo-react-grid";

import ReactNotification from "react-notifications-component";
import { Button } from '@progress/kendo-react-buttons';
import DataLoader from "./DataLoader";
import { orderBy } from "@progress/kendo-data-query";

class PreBuiltPackages extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.proc = this.props.proc;
    this.state = {
      appInEdit: undefined,
      sort: [{ field: "name", dir: "asc" }],
      apps: [],
      dataState: { take: 10, skip: 0 },
      action: ""
    };
  }
    dataStateChange = (e) => {
      console.log(e);
        this.setState({
            ...this.state,
            dataState: e.data
        });
    }

    dataRecieved = (apps) => {
      console.log(apps);
        this.setState({
            ...this.state,
            apps: apps
        });
    }
  render = () => {
    return (
      <div>
        <ReactNotification ref={this.notificationDOMRef} />
        <div style={{ paddingTop: '12px' }} className="row">
          <div className="col s3">
            <Button className="goBack" primary={true} style={{ width: '45px', height: '45px' }}>
              <FaArrowLeft />
            </Button>
          </div>
          <center>
            <div className="col s6" id="pageTitle">
              Manage Pre-Built Packages
            </div>
          </center>
        </div>
        <Grid
            sortable={true}
            filterable={true}
            reorderable={true}
            resizable={true}
            {...this.state.dataState}
            {...this.state.apps}
            onDataStateChange={this.dataStateChange}
        >
          <Column field="name" title="Name" />
          <Column field="description" title="Description" />
          <Column field="category" title="Category" />
        </Grid>
        <DataLoader args={this.core} url="/app/type/1" dataState={this.state.dataState} onDataRecieved={this.dataRecieved} />
      </div>
    );
  };

  dialogTitle() {
    return `${this.state.appInEdit.id === undefined ? "Add" : "Edit"} product`;
  }

  cloneProduct(product) {
    return Object.assign({}, product);
  }

  prebuiltApp(source) {
    const prebuiltApp = {
      uuid: "",
      name: "",
      type: "",
      category: ""
    };

    return Object.assign(prebuiltApp, source);
  }
}

export default PreBuiltPackages;