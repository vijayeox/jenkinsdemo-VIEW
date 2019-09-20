import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { Notification } from "../../GUIComponents";
import { PushData, GetSingleEntityData } from "../components/apiCalls";
import { DropDown, SaveCancel } from "../components/index";
import { Input } from "@progress/kendo-react-inputs";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      groupInEdit: this.props.dataItem || null,
      managerName: null,
      parentGroupName: null
    };
    this.notif = React.createRef();
  }

  UNSAFE_componentWillMount() {
    if (this.props.formAction == "put") {
      GetSingleEntityData(
        "organization/" +
          this.props.selectedOrg +
          "/user/" +
          this.props.dataItem.manager_id +
          "/profile"
      ).then(response => {
        this.setState({
          managerName: {
            id: "111",
            name: response.data.name
          }
        });
      });
      this.props.dataItem.parent_id
        ? GetSingleEntityData(
            "organization/" +
              this.props.selectedOrg +
              "/group/" +
              this.props.dataItem.parent_id
          ).then(response => {
            this.setState({
              parentGroupName: {
                id: "111",
                name: response.data.name
              }
            });
          })
        : null;
    }
  }

  listOnChange = (event, item) => {
    console.log(event.target.value);

    const edited = this.state.groupInEdit;
    edited[item] = event.target.value;
    this.setState({
      groupInEdit: edited
    });
    item == "manager_id"
      ? this.setState({
          managerName: event.target.value
        })
      : this.setState({
          parentGroupName: event.target.value
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
      "organization/" + this.props.selectedOrg + "/group",
      this.props.formAction,
      this.state.groupInEdit.uuid,
      tempData
    ).then(response => {
      if (response.status == "success") {
        this.props.action(response);
        this.props.cancel();
      } else {
        this.notif.current.failNotification(
          "Error",
          response.message ? response.message : null
        );
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
                <i className="fas fa-user-lock"></i>
              </div>
            ) : null}
            <div className="form-group">
              <label className="required-label">Group Name</label>
              <Input
                type="text"
                className="form-control"
                name="name"
                maxLength="50"
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
                maxLength="200"
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
                      selectedItem={this.state.managerName}
                      selectedEntityType={"text"}
                      preFetch={true}
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
                      selectedItem={this.state.parentGroupName}
                      selectedEntityType={"text"}
                      preFetch={true}
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
