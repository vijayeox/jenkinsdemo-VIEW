import React from "react";
import { GetDataSearch, ExistingUsers } from "./components/apiCalls";
import { MultiSelect as MSelect } from "@progress/kendo-react-dropdowns";
import {
  FaArrowCircleRight,
  FaInfoCircle,
  FaQuestionCircle
} from "react-icons/fa";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import "./public/css/syncfusion.css";
import {
  Grid,
  GridColumn,
  GridToolbar,
  GridNoRecords
} from "@progress/kendo-react-grid";
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
    let loader = this.core.make("oxzion/splash");
    loader.show();

    ExistingUsers(this.props.config.subList, this.props.config.dataItem).then(
      response => {
        var ExistingUsers = [];
        for (var i = 0; i <= response.data.length - 1; i++) {
          var userid = response.data[i].id;
          ExistingUsers.push(userid);
        }
        this.setState({
          selectedUsers: ExistingUsers
        });
      }
    );
    this.getMainList("", 20);
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
    this.getMainList(e.filter.value, 20);
  };

  handleChange(e) {
    this.setState({
      selectedUsers: e.target.value
    });
  }
  tagRender = (tagData, li) => {};

  onHelpClick = () => {
    this.setState({ showHelp: !this.state.showHelp });
  };

  render() {
    return (
      <Dialog
        title={"Add Users to the Organization"}
        onClose={this.props.manage.toggleDialog}
      >
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
                autoClose={false}
                textField="userName"
                dataItemKey="userid"
                tagRender={this.tagRender}
                placeholder="Click to add Users"
              />
            </div>
          </div>
          {/* <div
            className="col-3"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
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
          </div> */}
        </div>

        {/* <Popup
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
                <FaArrowCircleRight /> &nbsp; &nbsp; Initially the list displays
                only the first 20 users.
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
        </Popup> */}
        <div
          className="col-6 justify-content-center"
          style={{ margin: "auto" }}
        >
          <Grid data={this.state.selectedUsers}>
            <GridColumn field="userName" title="Selected Users" />
            <GridNoRecords>
              <center>Please select some Users using the Dropdown List.</center>
            </GridNoRecords>
          </Grid>
        </div>
        <DialogActionsBar>
          <button
            className="k-button k-primary"
            onClick={() =>
              this.props.manage.postSelected(this.state.selectedUsers)
            }
          >
            Save
          </button>
          <button className="k-button" onClick={this.props.manage.closeDialog}>
            Cancel
          </button>
        </DialogActionsBar>
      </Dialog>
    );
  }
}

export default MultiSelect;
