import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { PushData } from "../components/apiCalls";
import { SaveCancel } from "../components/index";
import { Input } from "@progress/kendo-react-inputs";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      prjInEdit: this.props.dataItem || null
    };
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

  sendData = e => {
    e.preventDefault();
    PushData("project", this.props.formAction, this.props.dataItem.uuid, {
      name: this.state.prjInEdit.name,
      description: this.state.prjInEdit.description
    }).then(response => {
      this.props.action(response.status);
    });
    this.props.cancel();
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <div>
          <form id="prjForm" onSubmit={this.sendData}>
            <div className="form-group">
              <label>Project Name</label>
              <Input
                type="text"
                className="form-control"
                name="name"
                value={this.state.prjInEdit.name || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Project Name"
              />
            </div>
            <div className="form-group">
              <label>Project Description</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                name="description"
                value={this.state.prjInEdit.description || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Project Description"
                style={{ marginTop: "5px" }}
              />
            </div>
          </form>
        </div>
        <SaveCancel save="prjForm" cancel={this.props.cancel} />
      </Window>
    );
  }
}
