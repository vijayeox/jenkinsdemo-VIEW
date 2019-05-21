import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { PushData } from "../components/apiCalls";
import { DropDown } from "../components/DropDownList";
import { SaveCancel } from "../components/saveCancel";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      groupInEdit: this.props.dataItem || null
    };
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

  submitData = event => {
    PushData("group", this.props.formAction, {
      name: this.state.groupInEdit.name,
      parent_id: this.state.groupInEdit.parent_id,
      manager_id: this.state.groupInEdit.manager_id,
      org_id: this.state.groupInEdit.org_id,
      description: this.state.groupInEdit.description
    }).then(response => {
      this.props.action(response.status);
    });
    this.props.cancel();
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <div>
          <form>
            <div className="form-group">
              <label>Group Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={this.state.groupInEdit.name || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Group Name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                name="description"
                value={this.state.groupInEdit.description || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Group Description"
              />
            </div>
            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label>Group Manager</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={"user"}
                      selectedItem={this.state.groupInEdit.manager_id}
                      onDataChange={event =>
                        this.listOnChange(event, "manager_id")
                      }
                    />
                  </div>
                </div>
                <div className="col">
                  <label>Parent Group</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={"group"}
                      selectedItem={this.state.groupInEdit.parent_id}
                      onDataChange={event =>
                        this.listOnChange(event, "parent_id")
                      }
                    />
                  </div>
                </div>
                <div className="col">
                  <label>Organization</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={"organization"}
                      selectedItem={this.state.groupInEdit.org_id}
                      onDataChange={event => this.listOnChange(event, "org_id")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <SaveCancel save={this.submitData} cancel={this.props.cancel} />
      </Window>
    );
  }
}
