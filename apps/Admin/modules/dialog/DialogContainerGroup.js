import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { Notification } from "@oxzion/gui";
import { PushData } from "../components/apiCalls";
import { DropDown, SaveCancel } from "../components/index";
import { Input } from "@progress/kendo-react-inputs";
import { FaUserLock } from "react-icons/fa";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      groupInEdit: this.props.dataItem || null
    };
    this.notif = React.createRef();
  }

  listOnChange = (event, item) => {
    const edited = this.state.groupInEdit;
    edited[item] = event.target.value;
    this.setState({
      groupInEdit: edited
    });
  };

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.groupInEdit;
    edited[name] = value;

    this.setState({
      groupInEdit: edited
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.notif.current.uploadingData();
    let tempData = {
      name: this.state.groupInEdit.name,
      parent_id: this.state.groupInEdit.parent_id,
      manager_id: this.state.groupInEdit.manager_id,
      description: this.state.groupInEdit.description
    };

    for (var i = 0; i <= Object.keys(tempData).length; i++) {
      let propertyName = Object.keys(tempData)[i];
      if (tempData[propertyName] == undefined) {
        delete tempData[propertyName];
      }
    }
    PushData(
      "group",
      this.props.formAction,
      this.state.groupInEdit.uuid,
      tempData,
      this.props.selectedOrg
    ).then(response => {
      this.props.action(response.status);
      if (response.status == "success") {
        this.props.cancel();
      } else if (
        response.errors[0].exception.message.indexOf("name_UNIQUE") >= 0
      ) {
        this.notif.current.duplicateEntry();
      } else {
        this.notif.current.failNotification();
      }
    });
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <Notification ref={this.notif} />
        <div>
          <form id="groupForm" onSubmit={this.handleSubmit}>
            {this.props.diableField ? (
              <div className="read-only-mode">
                <h5>(READ ONLY MODE)</h5>
                <FaUserLock />
              </div>
            ) : null}
            <div className="form-group">
              <label className="required-label">Group Name</label>
              <Input
                type="text"
                className="form-control"
                name="name"
                value={this.state.groupInEdit.name || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Group Name"
                required={true}
                validationMessage={"Please enter the Group name."}
                readOnly={this.props.diableField ? true : false}
              />
            </div>
            <div className="form-group text-area-custom">
              <label className="required-label">Description</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                name="description"
                value={this.state.groupInEdit.description || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Group Description"
                required={true}
                readOnly={this.props.diableField ? true : false}
              />
            </div>
            <div className="form-group">
              <div className="form-row">
                <div className="col-4">
                  <label className="required-label">Group Manager</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={
                        "organization/" + this.props.selectedOrg + "/users"
                      }
                      selectedItem={this.state.groupInEdit.manager_id}
                      onDataChange={event =>
                        this.listOnChange(event, "manager_id")
                      }
                      disableItem={this.props.diableField}
                      required={true}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <label>Parent Group</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={
                        "organization/" + this.props.selectedOrg + "/groups"
                      }
                      selectedItem={this.state.groupInEdit.parent_id}
                      onDataChange={event =>
                        this.listOnChange(event, "parent_id")
                      }
                      disableItem={this.props.diableField}
                      required={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <SaveCancel
          save="groupForm"
          cancel={this.props.cancel}
          hideSave={this.props.diableField}
        />
      </Window>
    );
  }
}
