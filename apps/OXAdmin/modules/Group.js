import React, {
    Component
} from "react";
import ReactDOM from "react-dom";
import {
    Dialog,
    DialogActionsBar
} from "@progress/kendo-react-dialogs";
import {
    MultiSelect
} from "@progress/kendo-react-dropdowns";
import {
    FaArrowLeft,
    FaPlusCircle
} from "react-icons/fa";

import {
    Grid,
    GridColumn as Column,
    GridToolbar
} from "@progress/kendo-react-grid";

import ReactNotification from "react-notifications-component";

import DialogContainer from "./dialog/DialogContainerGroup";
import cellWithEditing from "./cellWithEditingGroup";
import {
    orderBy
} from "@progress/kendo-data-query";

const usersList = [
    "Rajesh",
    "Prajwal",
    "Bharat",
    "Neha",
    "Brian",
    "Karan",
    "Danish",
    "Sagar",
    "Harsha"
];

class Group extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;

        this.state = {
            usersList: [
                "Rajesh",
                "Prajwal",
                "Bharat",
                "Neha",
                "Brian",
                "Karan",
                "Danish",
                "Sagar",
                "Harsha"
            ],
            value: [],
            visible: false,

            groupInEdit: undefined,
            sort: [{
                field: "name",
                dir: "asc"
            }],
            products: [],
            action: ""
        };

        this.toggleDialog = this.toggleDialog.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();

        this.getGroupData().then(response => {
            this.setState({
                products: response.data
            });
        });
    }

    async getUserData() {
        let helper = this.core.make("oxzion/restClient");
        let userData = await helper.request("v1", "/user", {}, "get");
        return userData;
    }

    listOnChange = (event) => {
        this.setState({
            value: [...event.target.value]
        });
    };

    componentWillMount() {
        this.setState({
            items: this.state.initialItems
        });
    }

    toggleDialog() {
        this.setState({
            visible: !this.state.visible
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
            dismiss: {
                duration: 5000
            },
            dismissable: {
                click: true
            }
        });
    }

    addNotification(serverResponse) {
        this.notificationDOMRef.current.addNotification({
            title: "All Done!!!  👍",
            message: "Operation successfully completed.",
            type: "success",
            insert: "top",
            container: "bottom-right",
            animationIn: ["animated", "bounceIn"],
            animationOut: ["animated", "bounceOut"],
            dismiss: {
                duration: 5000
            },
            dismissable: {
                click: true
            }
        });
    }

    handler = serverResponse => {
        this.getGroupData().then(response => {
            this.setState({
                products: response.data
            });
            this.addDataNotification(serverResponse);
        });
    };

    async getGroupData() {
        let helper = this.core.make("oxzion/restClient");
        let groupData = await helper.request("v1", "/group", {}, "get");
        return groupData;
    }

    edit = dataItem => {
        this.setState({
            groupInEdit: this.cloneProduct(dataItem),
            action: "edit"
        });
    };

    async deleteGroupData(dataItem) {
        let helper = this.core.make("oxzion/restClient");
        let delGroup = helper.request("v1", "/group/" + dataItem, {}, "delete");
        return delGroup;
    }




    remove = dataItem => {
        this.deleteGroupData(dataItem.id).then(response => {
            this.handler();
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
        const dataItem = this.state.groupInEdit;
        const products = this.state.products.slice();

        if (dataItem.id === undefined) {
            products.unshift(this.newProduct(dataItem));
        } else {
            const index = products.findIndex(p => p.id === dataItem.id);
            products.splice(index, 1, dataItem);
        }

        this.setState({
            products: products,
            groupInEdit: undefined
        });
    };

    cancel = () => {
        this.setState({
            groupInEdit: undefined
        });
    };

    insert = () => {
        this.setState({
            groupInEdit: {},
            action: "add"
        });
    };

    addUsers = dataItem => {
        console.log(dataItem + "lol");
        this.setState({
            visible: !this.state.visible
        });
    };


    render() {
        return (
            <div id="groupPage">

       {this.state.visible && (
            <Dialog title={"Add users to Testing Group "} onClose={this.toggleDialog}>
              <div>
                <div>Select Users:</div>
                <MultiSelect
                  data={this.state.usersList}
                  onChange={this.listOnChange}
                  value={this.state.value}
                  style={{height:'auto'}}
                /><h6>
                Participants:
                {this.state.value+" "}
                </h6>
              </div>
              <DialogActionsBar>
                <button className="k-button" onClick={this.toggleDialog}>
                  Done
                </button>
              </DialogActionsBar>
            </Dialog>
          )}
        <ReactNotification ref={this.notificationDOMRef} />
        <div style={{ margin: "10px 0px 10px 0px" }} className="row">
          <div className="col s3">
            <a className="waves-effect waves-light btn goBack">
              <FaArrowLeft />
            </a>
          </div>
          <center>
            <div className="col s6" id="pageTitle">
              Manage Groups
            </div>
          </center
>        </div>

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
              <div style={{ fontSize: "20px" }}>Groups List</div>
              <button
                onClick={this.insert}
                className="k-button"
                style={{ position: "absolute", top: "8px", right: "16px" }}
              >
                <FaPlusCircle style={{ fontSize: "20px" }} />

                <p style={{ margin: "0px", paddingLeft: "10px" }}>Add Group</p>
              </button>
            </div>
          </GridToolbar>

          <Column field="id" title="ID" width="70px" />
          <Column field="name" title="Name" />

          <Column field="manager_id" title="Manager ID" />
          <Column field="description" title="Description" />
          <Column
            title="Edit"
            width="240px"
            cell={cellWithEditing(this.edit,this.remove,this.addUsers)}
          />
        </Grid>

        {this.state.groupInEdit && (
          <DialogContainer
            args={this.core}
            dataItem={this.state.groupInEdit}
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
        return `${
      this.state.groupInEdit.id === undefined ? "Add" : "Edit"
    } product`;
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

class List extends React.Component {
    render() {
        return (
            <ul>
        {this.props.items.map(function(item) {
          return <li key={item}>{item}</li>;
        })}
      </ul>
        );
    }
}

export default Group;