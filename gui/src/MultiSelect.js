import React from "react";
import { GetDataSearch, ExistingUsers } from "./components/apiCalls";
import { MultiSelect as MSelect } from "@progress/kendo-react-dropdowns";
import {
  FaArrowRight,
  FaSearch
} from "react-icons/fa";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import "./public/css/syncfusion.css";
import { Grid, GridColumn, GridCell } from "@progress/kendo-react-grid";
import $ from "jquery";

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
    let loader = this.core.make("oxzion/splash");
    loader.show();

    ExistingUsers(
      this.props.config.subList,
      this.props.config.dataItem.id
    ).then(response => {
      this.setState({
        selectedUsers: response.data
      });
      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    });
  }

  getMainList = (query, size) => {
    GetDataSearch("user", query, size).then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName =
          response.data[i].firstname + " " + response.data[i].lastname;
        var userid = response.data[i].id;
        tempUsers.push({ id: userid, name: userName });
      }
      this.setState({
        userList: tempUsers
      });
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
        <span style={{ fontSize: "2.5em" }}>
          <FaSearch />
        </span>
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
          <nav className="navbar bg-dark">
            <h6 style={{ color: "white", paddingTop: "3px" }}>
              Project &nbsp; -&nbsp; {this.props.config.dataItem.name}
              &nbsp;&nbsp; <FaArrowRight /> &nbsp; Manage Users
            </h6>
          </nav>
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
                textField="name"
                dataItemKey="id"
                tagRender={this.tagRender}
                listNoDataRender={this.listNoDataRender}
                placeholder="Click to add Users"
              />
            </div>
          </div>
          {this.state.selectedUsers.length > 0 && (
            <div
              className="col-10 justify-content-center"
              style={{ margin: "auto" }}
            >
              <Grid data={this.state.selectedUsers}>
                <GridColumn
                  field="name"
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
