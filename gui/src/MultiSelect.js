import React from "react";
import { GetData, ExistingUsers } from "./components/apiCalls";
import {
  MultiSelectComponent,
  CheckBoxSelection,
  Inject
} from "@syncfusion/ej2-react-dropdowns";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import "./public/css/syncfusion.css";

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      userList: [],
      selectedUsers: []
    };
    this.captureSelectedUsers = this.captureSelectedUsers.bind(this);
    this.checkFields = { text: "userName", value: "userid" };
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

    GetData("user").then(response => {
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
  }

  captureSelectedUsers(e) {
    this.setState({
      selectedUsers: e.value
    });
  }

  render() {
    return (
      <Dialog
        title={"Add Users to the Organization"}
        onClose={this.props.manage.toggleDialog}
      >
        <div>
          <div className="justify-content-center col-12">
            <div style={{ margin: "auto", width: "85%", paddingTop: "15px" }}>
              <MultiSelectComponent
                id="checkbox"
                dataSource={this.state.userList}
                value={this.state.selectedUsers}
                change={this.captureSelectedUsers}
                fields={this.checkFields}
                mode="CheckBox"
                placeholder="Click to add Users"
                showDropDownIcon={true}
                filterBarPlaceholder="Search Users"
                popupHeight="350px"
              >
                <Inject services={[CheckBoxSelection]} />
              </MultiSelectComponent>
            </div>
          </div>
        </div>
        <DialogActionsBar>
          <button
            className="k-button k-primary"
            onClick={() =>
              this.props.manage.postSelected(
                this.props.config.dataItem,
                this.state.selectedUsers
              )
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
