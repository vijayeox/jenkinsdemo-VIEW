import React, { Component } from "react";
import ReactDOM from "react-dom";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from "@progress/kendo-react-grid";

import ReactNotification from "react-notifications-component";
import Button from '@material-ui/core/Button';
import DialogContainer from "./DialogContainer";
import ReactBpmn from "./ReactBpmn";
import FormBuilderContainer from "./FormBuilderContainer";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});
class AdHocApps extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.proc = this.props.proc;
    this.state = {
      appInEdit: undefined,
      sort: [{ field: "name", dir: "asc" }],
      apps: [],
      action: ""
    };

    this.addNotification = this.addNotification.bind(this);
    this.insert = this.insert.bind(this);
    this.notificationDOMRef = React.createRef();

    this.getAppData().then(response => {
      this.setState({ apps: response.data });
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
      title: "All Done!",
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
      this.setState({ apps: response.data });
      this.addDataNotification(serverResponse);
    });
  };

  async getAppData() {
    let helper = this.core.make("oxzion/restClient");
    let OrgData = await helper.request("v1", "/app/type/2", {}, "get");
    return OrgData;
  }

  edit = (dataItem) => {
    this.setState({
      appInEdit: this.cloneProduct(dataItem),
      action: "edit"
    });
  };

  buildworkflow = dataItem => {
    this.setState({
      appInEdit: this.cloneProduct(dataItem),
      action: "buildworkflow"
    });
  };

  buildform = dataItem => {
    this.setState({
      appInEdit: this.cloneProduct(dataItem),
      action: "buildform"
    });
  };

  async deleteAdHocAppsData(dataItem) {
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
    this.deleteAdHocAppsData(dataItem.id).then(response => {
      this.addNotification();
    });

    const apps = this.state.apps;
    const index = apps.findIndex(p => p.id === dataItem.id);
    if (index !== -1) {
      apps.splice(index, 1);
      this.setState({
        apps: apps
      });
    }
  };

  save = () => {
    const dataItem = this.state.appInEdit;
    const apps = this.state.apps.slice();

    if (dataItem.id === undefined) {
      apps.unshift(this.newApp(dataItem));
    } else {
      const index = apps.findIndex(p => p.id === dataItem.id);
      apps.splice(index, 1, dataItem);
    }

    this.setState({
      apps: apps,
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
      <div style={{ paddingTop: '12px' }} className="row">
      <div className="col s3">
      <Button className="goBack" primary={true} style={{ width: '45px', height: '45px' }}>
      <FaArrowLeft />
      </Button>
      </div>
      </div>
      <GridList className="AdHocAppGrid" cellHeight={180}>
      <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
      <ListSubheader component="div">Manage Ad-Hoc Packages</ListSubheader>
      </GridListTile>
      {this.state.apps.map(app => (
        <GridListTile key={app.id}>
        <img src={app.logo} alt={app.name} />
        <GridListTileBar
        title={app.name}
        />
        <div className="appButtons">
        <Button
             variant="contained" color="primary"
            onClick={() => {
              this.edit(app);
            }}
          >
            Edit
          </Button>
          &nbsp;
          <Button
             variant="contained" color="primary" 
            onClick={() => {
              this.buildworkflow(app);
            }}
          >
            Build
          </Button>
          &nbsp;
          <Button
             variant="contained" color="primary" 
            onClick={() => {
              this.buildform(app);
            }}
          >
            Publish
          </Button>
          &nbsp;
          <Button 
             variant="contained" color="secondary" 
            onClick={() => {
              this.delete(app);
            }}
          >
            Delete
          </Button>
          </div>
        </GridListTile>
        ))}
        </GridList>

        {this.state.appInEdit && (
          <DialogContainer
          core={this.core}
          proc={this.proc}
          dataItem={this.state.appInEdit}
          save={this.save}
          cancel={this.cancel}
          formAction={this.state.action}
          action={this.handler}
          />
          )}
        {this.state.appInEdit && this.state.action=='buildworkflow' && (
          <ReactBpmn
          core={this.core}
          proc={this.proc}
          dataItem={this.state.appInEdit}
          save={this.save}
          cancel={this.cancel}
          formAction={this.state.action}
          action={this.handler}
          />
          )}
        {this.state.appInEdit && this.state.action=='buildform' && (
          <FormBuilderContainer
          core={this.core}
          proc={this.proc}
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

      newApp(source) {
        const newApp = {
          name: "",
          type: "",
          category: ""
        };

        return Object.assign(newApp, source);
      }
    }

    export default AdHocApps;
