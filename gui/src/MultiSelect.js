import React from "react";
import { GetDataSearch, ExistingUsers } from "./components/MultiSelect/Requests";
import { MultiSelect as MSelect } from "@progress/kendo-react-dropdowns";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import "./public/css/syncfusion.css";
import { Grid, GridColumn, GridCell } from "@progress/kendo-react-grid";
import Swal from "sweetalert2";
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
    this.getMainList = this.getMainList.bind(this);
  }

  componentDidMount() {
    let loader = this.core.make("oxzion/splash");
    loader.show();

    if (typeof this.props.config.subList == "object") {
      this.setState({
        selectedUsers: this.props.config.subList
      });
      let loader = this.core.make("oxzion/splash");
      loader.destroy();
    } else {
      ExistingUsers(
        this.props.config.subList,
        this.props.config.dataItem.uuid
      ).then(response => {
        var tempUsers = [];
        for (var i = 0; i <= response.data.length - 1; i++) {
          var userName = response.data[i].name;
          var userid = response.data[i].uuid;
          tempUsers.push({ uuid: userid, name: userName });
        }
        this.setState({
          selectedUsers: tempUsers
        });
        let loader = this.core.make("oxzion/splash");
        loader.destroy();
      });
    }
  }

  getMainList = (query, size) => {
    GetDataSearch(this.props.config.mainList, query, size).then(response => {
      var tempUsers = [];
      for (var i = 0; i <= response.data.length - 1; i++) {
        var userName = response.data[i].name;
        var userid = response.data[i].uuid;
        tempUsers.push({ uuid: userid, name: userName });
      }
      this.setState({
        userList: tempUsers
      });
    });
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
    const self = this;
    $(document).ready(function(item) {
      $(".k-searchbar")
        .children()
        .attr({
          placeholder:
            "Search For " +
            self.capitalizeFirstLetter(self.props.config.mainList) +
            "'s"
        })
        .css("min-width", "387px");
    });
  };

  onOpen = () => {
    const self = this;
    $(document).ready(function() {
      $(".k-searchbar")
        .children()
        .attr({
          placeholder:
            "Search For " +
            self.capitalizeFirstLetter(self.props.config.mainList) +
            "'s"
        })
        .css("min-width", "387px");
    });
  };

  onClose = () => {
    const self = this;
    $(document).ready(function() {
      $(".k-searchbar")
        .children()
        .attr({
          placeholder:
            "Search For " +
            self.capitalizeFirstLetter(self.props.config.mainList) +
            "'s"
        })
        .css("min-width", "387px");
    });
  };

  onHelpClick = () => {
    this.setState({ showHelp: !this.state.showHelp });
  };

  deleteRecord = item => {
    const selectedUsers = this.state.selectedUsers.slice();
    const index = selectedUsers.findIndex(p => p.uuid === item.uuid);
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
        <Dialog onClose={this.props.manage.toggleDialog}>
          <nav className="navbar bg-dark">
            <h6 style={{ color: "white", paddingTop: "3px" }}>
              {this.props.config.title} &nbsp; -&nbsp;
              {this.props.config.dataItem.name}
              &nbsp;&nbsp; <FaArrowRight /> &nbsp; Manage &nbsp;
              {this.capitalizeFirstLetter(this.props.config.mainList + "'s")}
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
                dataItemKey="uuid"
                tagRender={this.tagRender}
                listNoDataRender={this.listNoDataRender}
                placeholder={"Click to add " + this.props.config.mainList}
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
                this.props.manage.postSelected(
                  this.state.selectedUsers,
                  this.props.config.dataItem.uuid
                )
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
              Swal.fire({
                title: "Are you sure?",
                text:
                  "You are about to remove " + this.props.dataItem.name + ".",
                imageUrl:
                  "https://image.flaticon.com/icons/svg/1006/1006115.svg",
                imageWidth: 75,
                imageHeight: 75,
                confirmButtonText: "OK",
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
            Remove
          </button>
        </td>
      );
    }
  };
}

export default MultiSelect;
