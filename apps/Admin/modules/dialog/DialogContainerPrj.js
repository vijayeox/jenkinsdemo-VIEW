import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { Notification } from "@oxzion/gui";
import { PushData } from "../components/apiCalls";
import { SaveCancel, DropDown } from "../components/index";
import { Input } from "@progress/kendo-react-inputs";
import { FaUserLock } from "react-icons/fa";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      prjInEdit: this.props.dataItem || null
    };
    this.notif = React.createRef();
  }

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.prjInEdit;
    edited[name] = value;

    this.setState({
      prjInEdit: edited
    });
  };

  listOnChange = (event, item) => {
    const edited = this.state.prjInEdit;
    edited[item] = event.target.value;
    this.setState({
      prjInEdit: edited
    });
  };

  sendData = e => {
    e.preventDefault();
    this.notif.current.uploadingData();
    PushData(
      "project",
      this.props.formAction,
      this.props.dataItem.uuid,
      {
        name: this.state.prjInEdit.name,
        description: this.state.prjInEdit.description,
        manager_id: this.state.prjInEdit.manager_id
      },
      this.props.selectedOrg
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
          <form id="prjForm" onSubmit={this.sendData}>
            {this.props.diableField ? (
              <div className="read-only-mode">
                <h5>(READ ONLY MODE)</h5>
                <FaUserLock />
              </div>
            ) : null}
            <div className="form-group">
              <label className="required-label">Project Name</label>
              <Input
                type="text"
                className="form-control"
                name="name"
                maxlength="50"
                value={this.state.prjInEdit.name || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Project Name"
                readOnly={this.props.diableField ? true : false}
                required={true}
              />
            </div>
            <div className="form-group text-area-custom">
              <label className="required-label">Project Description</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                name="description"
                maxlength="200"
                value={this.state.prjInEdit.description || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Project Description"
                style={{ marginTop: "5px" }}
                readOnly={this.props.diableField ? true : false}
                required={true}
              />
            </div>
            <div className="form-group">
              <div className="form-row">
                <div className="col-4">
                  <label className="required-label">Project Manager</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={
                        "organization/" + this.props.selectedOrg + "/users"
                      }
                      selectedItem={this.state.prjInEdit.manager_id}
                      preFetch={true}
                      onDataChange={event =>
                        this.listOnChange(event, "manager_id")
                      }
                      required={true}
                      disableItem={this.props.diableField}
                      validationMessage={"Please select a Project Manager."}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <SaveCancel
          save="prjForm"
          cancel={this.props.cancel}
          hideSave={this.props.diableField}
        />
      </Window>
    );
  }
}
