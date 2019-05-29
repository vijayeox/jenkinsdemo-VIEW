import React from "react";
import {
  Grid,
  GridColumn,
  GridToolbar,
  GridNoRecords
} from "@progress/kendo-react-grid";
import {
  FaPlusCircle,
  FaPencilAlt,
  FaUserPlus,
  FaTrashAlt,
  FaArrowCircleRight,
  FaInfoCircle
} from "react-icons/fa";
import { Notification } from "../index";
import { GridCell } from "@progress/kendo-react-grid";
import DataLoader from "./DataLoader";
import Swal from "sweetalert2";
import $ from "jquery";
import "@progress/kendo-theme-default/dist/all.css";
import "./public/css/gridStyles.css";

export default class GridTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.core = this.props.args;
    this.state = {
      dataState: {
        take: 20,
        skip: 0,
        sort: [{ field: "id", dir: "asc" }]
      },
      gridData: this.props.gridData,
      filter: [],
      pageSizes: {}
    };
    this.notif = React.createRef();
    this.title = this.capitalizeFirstLetter(this.props.config.title);
  }

  componentDidMount() {
    $(document).ready(function() {
      $(".k-textbox").attr("placeholder", "Search");
    });
  }

  dataStateChange = e => {
    this.setState({
      ...this.state,
      dataState: e.data
    });
  };

  dataRecieved = data => {
    this.setState({
      gridData: data
    });
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  createColumns(manageButton) {
    let table = [];
    for (var i = 0; i < this.props.config.column.length; i++) {
      if (this.props.config.column[i] == "id") {
        table.push(
          <GridColumn
            field={this.props.config.column[i]}
            key={i}
            width="70px"
            title="ID"
          />
        );
      } else if (this.props.config.column[i] == "logo") {
        table.push(
          <GridColumn
            key={i}
            width="100px"
            title="Logo"
            cell={props => <LogoCell {...props} myProp={this.props} />}
          />
        );
      } else {
        table.push(
          <GridColumn
            field={this.props.config.column[i]}
            key={i}
            title={this.capitalizeFirstLetter(this.props.config.column[i])}
          />
        );
      }
    }
    table.push(manageButton);
    return table;
  }

  refreshHandler = serverResponse => {
    if (serverResponse == "success") {
      this.notif.current.successNotification();
    } else {
      this.notif.current.failNotification();
    }
    this.child.current.refresh();
  };

  emptyCell = () => {
    return <div />;
  };

  render() {
    return (
      <div style={{ height: "90%", display: "flex", marginTop: "10px" }}>
        <Notification ref={this.notif} />
        {this.props.gridData !== "" && (
          <DataLoader
            ref={this.child}
            args={this.core}
            url={this.props.config.title}
            dataState={this.state.dataState}
            onDataRecieved={this.dataRecieved}
          />
        )}
        <Grid
          {...this.state.gridData}
          {...this.state.dataState}
          sortable={{ mode: "multiple" }}
          filterable={true}
          resizable={true}
          reorderable={true}
          scrollable={"scrollable"}
          pageable={{ buttonCount: 5, pageSizes: true, info: true }}
          onDataStateChange={this.dataStateChange}
          onRowClick={e => {
            this.props.manageGrid.edit(e.dataItem);
          }}
        >
          <GridNoRecords>
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "4%"
              }}
            >
              <ul className="list-group" style={{ listStyle: "disc" }}>
                <div
                  href="#"
                  className="list-group-item list-group-item-action bg-warning"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div style={{ fontSize: "medium" }}>No Records Available</div>
                  <div style={{ marginLeft: "auto" }}>
                    <FaInfoCircle />
                  </div>
                </div>
                <li
                  className="list-group-item"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FaArrowCircleRight /> &nbsp; &nbsp; Please try a different
                  search keyword.
                </li>
                <li
                  className="list-group-item"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FaArrowCircleRight /> &nbsp; &nbsp; If you see this warning
                  all the time, please contact System Administrator.
                </li>
              </ul>
            </div>
          </GridNoRecords>
          {this.props.config.showToolBar == true && (
            <GridToolbar>
              <div>
                <div style={{ fontSize: "20px" }}>{this.title + "'s"} List</div>
                <AddButton
                  args={this.props.manageGrid.add}
                  permission={this.props.permission}
                  label={this.title}
                />
              </div>
            </GridToolbar>
          )}
          {this.createColumns()}
          {this.props.permission != 1 && (
            <GridColumn
              title="Edit"
              width="170px"
              minResizableWidth={170}
              cell={CellWithEditing(
                this.title,
                this.props.manageGrid.edit,
                this.props.manageGrid.remove,
                this.props.manageGrid.addUsers,
                this.props.permission
              )}
              filterCell={this.emptyCell}
            />
          )}
        </Grid>
      </div>
    );
  }
}

class AddButton extends React.Component {
  render() {
    if (this.props.permission == 7 || this.props.permission == 15) {
      return (
        <button
          onClick={this.props.args}
          className="k-button"
          style={{ position: "absolute", top: "8px", right: "16px" }}
        >
          <FaPlusCircle style={{ fontSize: "20px" }} />

          <p style={{ margin: "0px", paddingLeft: "10px" }}>
            Add {this.props.label}
          </p>
        </button>
      );
    } else {
      return <div />;
    }
  }
}

class LogoCell extends React.Component {
  render() {
    return (
      <td>
        <img
          src="https://image.flaticon.com/icons/svg/145/145812.svg"
          alt="Organization Logo"
          className="text-center circle"
          style={{ maxWidth: "60px", margin: "10px" }}
        />
      </td>
    );
  }
}

function CellWithEditing(title, edit, remove, addUsers, perm) {
  return class extends GridCell {
    constructor(props) {
      super(props);
      this.core = this.props.args;
    }

    deleteButton() {
      if (perm == 15) {
        return (
          <abbr title={"Delete " + title}>
            <button
              className="k-button k-grid-remove-command"
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text:
                    "Do you really want to delete the record? This cannot be undone.",
                  imageUrl:
                    "https://image.flaticon.com/icons/svg/1632/1632714.svg",
                  imageWidth: 75,
                  imageHeight: 75,
                  confirmButtonText: "Delete",
                  confirmButtonColor: "#d33",
                  showCancelButton: true,
                  cancelButtonColor: "#3085d6",
                  target: ".Window_Admin"
                }).then(result => {
                  if (result.value) {
                    remove(this.props.dataItem);
                  }
                });
              }}
            >
              <FaTrashAlt className="manageIcons" />
            </button>
          </abbr>
        );
      }
    }

    render() {
      return (
        <td>
          <center>
            <abbr title={"Edit " + title + " Details"}>
              <button
                className=" k-button k-grid-edit-command"
                onClick={() => {
                  edit(this.props.dataItem);
                }}
              >
                <FaPencilAlt className="manageIcons" />
              </button>
            </abbr>
            &nbsp; &nbsp;
            {addUsers && (
              <abbr title={"Add Users to " + title}>
                <button
                  className="k-button"
                  onClick={() => {
                    addUsers(this.props.dataItem);
                  }}
                >
                  <FaUserPlus className="manageIcons" />
                </button>
              </abbr>
            )}
            &nbsp; &nbsp;
            {this.deleteButton()}
          </center>
        </td>
      );
    }
  };
}
