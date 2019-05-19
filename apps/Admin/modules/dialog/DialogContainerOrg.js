import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { PushData } from "../components/apiCalls";
import { FileUploader } from "@oxzion/gui";
import { SaveCancel } from "../components/saveCancel";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      orgInEdit: this.props.dataItem || null
    };
    this.fUpload = React.createRef();
  }

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.orgInEdit;
    edited[name] = value;

    this.setState({
      orgInEdit: edited
    });
  };

  submitData = event => {
    PushData("attachment", "filepost", {
      type: "ORGANIZATION",
      files: this.fUpload.current.firstUpload.cachedFileArray[0]
    }).then(response => {
      PushData("organization", this.props.formAction, {
        name: this.state.orgInEdit.name,
        address: this.state.orgInEdit.address,
        city: this.state.orgInEdit.city,
        state: this.state.orgInEdit.state,
        zip: this.state.orgInEdit.zip,
        logo: response.data.filename[0],
        languagefile: this.state.orgInEdit.languagefile,
        contact: this.state.orgInEdit.contact
      }).then(response => {
        this.props.action(response.status);
      });
    });
    this.props.cancel();
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <div className="container-fluid">
          <form>
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={this.state.orgInEdit.name || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Organization Name"
                required={true}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                name="address"
                value={this.state.orgInEdit.address || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Organization Address"
                style={{ marginTop: "5px" }}
              />
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label>City</label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={this.state.orgInEdit.city || ""}
                      onChange={this.onDialogInputChange}
                      placeholder="Enter City"
                      required={true}
                    />
                  </div>
                </div>
                <div className="col">
                  <label>State</label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={this.state.orgInEdit.state || ""}
                      onChange={this.onDialogInputChange}
                      placeholder="Enter State"
                      required={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div className="col">
                  <label>Zip Code</label>
                  <input
                    type="number"
                    name="zip"
                    value={this.state.orgInEdit.zip || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Zip Code"
                  />
                </div>
                <div className="col">
                  <label>Language</label>
                  <input
                    type="text"
                    name="languagefile"
                    value={this.state.orgInEdit.languagefile || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Language"
                  />
                </div>
              </div>
            </div>

            <div className="form-group border-box">
              <label>Contact Details</label>
              <div className="form-row">
                <div className="col">
                  <input
                    type="text"
                    name="fname"
                    value={this.state.orgInEdit.temp || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter First Name"
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="lname"
                    value={this.state.orgInEdit.temp || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Last Name"
                  />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: "10px" }}>
                <div className="col">
                  <input
                    type="email"
                    name="email"
                    value={this.state.orgInEdit.temp || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Email ID"
                  />
                </div>
              </div>
            </div>
            <FileUploader
              ref={this.fUpload}
              title={"Upload Organization Logo"}
              uploadID={"organizationLogo"}
            />
          </form>
        </div>
        <SaveCancel save={this.submitData} cancel={this.props.cancel} />
      </Window>
    );
  }
}
