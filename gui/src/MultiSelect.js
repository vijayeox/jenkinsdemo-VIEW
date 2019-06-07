import React from "react";
import { GetDataSearch, ExistingUsers } from "./components/apiCalls";
import { MultiSelect as MSelect } from "@progress/kendo-react-dropdowns";
import {
  FaArrowCircleRight,
  FaInfoCircle,
  FaQuestionCircle,
  FaArrowRight
} from "react-icons/fa";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import "./public/css/syncfusion.css";
import { Grid, GridColumn, GridCell } from "@progress/kendo-react-grid";
import $ from "jquery";
import { Popup } from "@progress/kendo-react-popup";

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      userList: [],
      selectedUsers: [],
      showHelp: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    // let loader = this.core.make("oxzion/splash");
    // loader.show();

    ExistingUsers(
      this.props.config.subList,
      this.props.config.dataItem.id
    ).then(response => {
      var ExistingUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userid = response.data[i].id;
        ExistingUsers.push(userid);
      }
      this.setState({
        selectedUsers: ExistingUsers
      });
    });
  }

  getMainList = (query, size) => {
    GetDataSearch("user", query, size).then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName =
          response.data[i].firstname + " " + response.data[i].lastname;
        var userid = response.data[i].id;
        tempUsers.push({ userid: userid, userName: userName });
      }
      this.setState({
        userList: tempUsers
      });

      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });
  };

  filterChange = e => {
    if (e.filter.value.length > 0) {
      setTimeout(() => {
        this.getMainList(e.filter.value, 20);
      }, 500);
    }
  };

  handleChange(e) {
    this.setState({
      selectedUsers: e.target.value
    });
  }

  listNoDataRender = element => {
    const noData = (
      <h4 style={{ fontSize: "1em" }}>
        <span className="k-icon .k-i-search" style={{ fontSize: "2.5em" }} />
        <br />
        <br />
        Please type a name to search.
      </h4>
    );

    return React.cloneElement(element, { ...element.props }, noData);
  };

  tagRender = (tagData, li) => {
    $(document).ready(function() {
      $(".k-searchbar")
        .children()
        .attr({ placeholder: "Search For Users" })
        .css("min-width", "387px");
    });
  };

  onOpen = () => {
    $(document).ready(function() {
      $(".k-searchbar")
        .children()
        .attr({ placeholder: "Search For Users" })
        .css("min-width", "387px");
    });
  };

  onClose = () => {
    $(document).ready(function() {
      $(".k-searchbar")
        .children()
        .attr({ placeholder: "Search For Users" })
        .css("min-width", "387px");
    });
  };

  onHelpClick = () => {
    this.setState({ showHelp: !this.state.showHelp });
  };

  deleteRecord = item => {
    const selectedUsers = this.state.selectedUsers.slice();
    const index = selectedUsers.findIndex(p => p.userid === item.userid);
    if (index !== -1) {
      selectedUsers.splice(index, 1);
      this.setState({
        selectedUsers: selectedUsers
      });
    }
  };

  render() {
    return (
      <div className="multiselectWindow">
        <Dialog
          title={"Add Users to the Organization"}
          onClose={this.props.manage.toggleDialog}
        >
          <nav class="navbar bg-dark">
            <h6 style={{ color: "white", paddingTop: "3px" }}>
              Project &nbsp; -&nbsp; {this.props.config.dataItem.name}
              &nbsp;&nbsp; <FaArrowRight /> &nbsp; Manage Users
            </h6>
          </nav>
          <div style={{ display: "flex" }}>
            <div
              className="col-10 justify-content-center"
              style={{ margin: "auto" }}
            >
              <div style={{ margin: "auto", width: "85%", paddingTop: "15px" }}>
                <MSelect
                  data={this.state.userList}
                  onChange={this.handleChange}
                  value={this.state.selectedUsers}
                  filterable={true}
                  onFilterChange={this.filterChange}
                  onOpen={this.onOpen}
                  onClose={this.onClose}
                  autoClose={false}
                  clearButton={false}
                  textField="userName"
                  dataItemKey="userid"
                  tagRender={this.tagRender}
                  listNoDataRender={this.listNoDataRender}
                  placeholder="Click to add Users"
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: "64px",
              right: "33px"
            }}
          >
            <button
              type="button"
              class="btn btn-primary btn-square"
              onClick={this.onHelpClick}
              ref={button => {
                this.anchor = button;
              }}
            >
              <FaQuestionCircle />
            </button>
          </div>

          <Popup
            anchor={this.anchor}
            show={this.state.showHelp}
            popupClass={"popup-content"}
            anchorAlign={{
              horizontal: "right",
              vertical: "bottom"
            }}
            popupAlign={{
              horizontal: "right",
              vertical: "top"
            }}
          >
            <div
              style={{
                height: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "2px"
              }}
            >
              <ul className="list-group" style={{ listStyle: "disc" }}>
                <div
                  href="#"
                  className="list-group-item list-group-item-action active"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div style={{ fontSize: "medium" }}>Please Note:</div>
                  <div style={{ marginLeft: "auto" }}>
                    <FaInfoCircle />
                  </div>
                </div>
                <li
                  className="list-group-item"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FaArrowCircleRight /> &nbsp; &nbsp; Initially the list
                  displays only the first 20 users.
                </li>
                <li
                  className="list-group-item"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FaArrowCircleRight /> &nbsp; &nbsp; Please use the search
                  filter to find other users.
                </li>
              </ul>
            </div>
          </Popup>
          {this.state.selectedUsers.length > 0 && (
            <div
              className="col-10 justify-content-center"
              style={{ margin: "auto" }}
            >
              <Grid
                data={this.state.selectedUsers}
                onRowClick={e => {
                  this.deleteRecord(e.dataItem);
                }}
              >
                <GridColumn
                  field="userName"
                  title="Selected Users"
                  headerCell={this.columnTitle}
                />
                <GridColumn
                  title="Edit"
                  width="100px"
                  cell={cellWithEditing(this.deleteRecord)}
                />
              </Grid>
            </div>
          )}
          <DialogActionsBar>
            <button
              className="k-button k-primary"
              onClick={() =>
                this.props.manage.postSelected(this.state.selectedUsers)
              }
            >
              Save
            </button>
            <button
              className="k-button"
              onClick={this.props.manage.closeDialog}
            >
              Cancel
            </button>
          </DialogActionsBar>
        </Dialog>
      </div>
    );
  }
}

function cellWithEditing(remove) {
  return class extends GridCell {
    render() {
      return (
        <td>
          <button
            className="k-primary k-button k-grid-edit-command"
            onClick={() => {
              remove(this.props.dataItem);
            }}
          >
            Remove
          </button>
        </td>
      );
    }
  };
}

export default MultiSelect;
