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
  FaInfoCircle,
  FaUserLock
} from "react-icons/fa";
import { Notification } from "../index";
import { GridCell } from "@progress/kendo-react-grid";
import DataLoader from "./DataLoader";
import Swal from "sweetalert2";
import $ from "jquery";
// import "@progress/kendo-theme-default/dist/all.css";

export default class GridTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.core = this.props.args;
    this.baseUrl = this.core.config("wrapper.url");
    this.state = {
      dataState: {
        take: 20,
        skip: 0
      },
      gridData: this.props.gridData
    };
    this.notif = React.createRef();
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

  createColumns() {
    let table = [];
    for (var i = 0; i < this.props.config.column.length; i++) {
      if (this.props.config.column[i].field == "media") {
        table.push(
          <GridColumn
            key={i}
            width="200px"
            title={this.props.config.column[i].title}
            filterCell={this.emptyCell}
            sortable={false}
            cell={props => (
              <LogoCell {...props} myProp={this.props} url={this.baseUrl} />
            )}
          />
        );
      } else if (this.props.config.column[i].field == "logo") {
        table.push(
          <GridColumn
            key={i}
            width="200px"
            title={this.props.config.column[i].title}
            filterCell={this.emptyCell}
            sortable={false}
            cell={props => <LogoCell2 {...props} myProp={this.props} />}
          />
        );
      } else {
        table.push(
          <GridColumn
            field={this.props.config.column[i].field}
            key={i}
            title={this.props.config.column[i].title}
          />
        );
      }
    }
    return table;
  }

  rawDataPresent() {
    if (this.props.gridData) {
      return <div />;
    } else {
      return (
        <DataLoader
          ref={this.child}
          args={this.core}
          url={this.props.config.api}
          dataState={this.state.dataState}
          onDataRecieved={this.dataRecieved}
        />
      );
    }
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
        {this.rawDataPresent()}
        <Grid
          data={this.state.gridData}
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
            <div className="grid-no-records">
              <ul className="list-group" style={{ listStyle: "disc" }}>
                <div
                  href="#"
                  className="list-group-item list-group-item-action bg-warning"
                  style={{
                    display: "flex",
                    width: "110%",
                    alignItems: "center"
                  }}
                >
                  <div style={{ marginLeft: "10px" }}>
                    <FaInfoCircle />
                  </div>
                  <div
                    style={{ fontSize: "medium", paddingLeft: "30px" }}
                    className="noRecords"
                  >
                    No Records Available
                  </div>
                </div>
              </ul>
            </div>
          </GridNoRecords>
          {this.props.config.showToolBar == true && (
            <GridToolbar>
              <div>
                <div style={{ fontSize: "20px" }}>
                  {this.props.config.title + "'s"} List
                </div>
                <AddButton
                  args={this.props.manageGrid.add}
                  permission={this.props.permission}
                  label={this.props.config.title}
                />
              </div>
            </GridToolbar>
          )}
          {this.createColumns()}
          {this.props.permission != 1 && (
            <GridColumn
              title="Manage"
              width="190px"
              minResizableWidth={170}
              cell={CellWithEditing(
                this.props.config.title,
                this.props.manageGrid.edit,
                this.props.manageGrid.remove,
                this.props.manageGrid.addUsers,
                this.props.permission
              )}
              sortable={false}
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
          src={this.props.url + "resource/" + this.props.dataItem.media}
          alt="Logo"
          className="text-center circle gridBanner"
        />
      </td>
    );
  }
}

class LogoCell2 extends React.Component {
  render() {
    return (
      <td>
        <img
          src={this.props.dataItem.logo}
          alt="Logo"
          className="text-center circle gridBanner"
        />
      </td>
    );
  }
}

function CellWithEditing(title, edit, remove, addUsers, perm, setPrivileges) {
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
              type="button"
              className="btn manage-btn k-grid-remove-command"
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
                type="button"
                className=" btn manage-btn k-grid-edit-command"
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
                  type="button"
                  className="btn manage-btn"
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
