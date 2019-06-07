import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import TextareaAutosize from "react-textarea-autosize";
import { PushData } from "../components/apiCalls";
import { FileUploader, Notification } from "@oxzion/gui";
import { SaveCancel } from "../components/index";
import scrollIntoView from "scroll-into-view-if-needed";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.url = this.core.config("wrapper.url");
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

  sendData = e => {
    e.preventDefault();
    if (this.fUpload.current.firstUpload.cachedFileArray.length == 0) {
      var elm = document.getElementsByClassName("orgFileUploader")[0];
      scrollIntoView(elm, {
        scrollMode: "if-needed",
        block: "center",
        behavior: "smooth",
        inline: "nearest"
      });
    } else {
      PushData(
        "organization",
        this.props.formAction,
        this.state.orgInEdit.uuid,
        {
          name: this.state.orgInEdit.name,
          address: this.state.orgInEdit.address,
          city: this.state.orgInEdit.city,
          state: this.state.orgInEdit.state,
          zip: this.state.orgInEdit.zip,
          logo: this.fUpload.current.firstUpload.cachedFileArray[0],
          languagefile: this.state.orgInEdit.languagefile,
          contact: JSON.stringify({
            firstname: this.state.orgInEdit.firstname,
            lastname: this.state.orgInEdit.lastname,
            email: this.state.orgInEdit.email
          })
        }
      ).then(response => {
        this.props.action(response.status);
      });
      this.props.cancel();
    }
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <Notification ref={this.notif} />
        <div className="container-fluid">
          <form id="orgForm" onSubmit={this.sendData}>
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                className="form-control"
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
                value={this.state.orgInEdit.address || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Organization Address"
                style={{ marginTop: "5px" }}
                required={true}
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
                    value={this.state.orgInEdit.zip || ""}
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Zip Code"
                  />
                </div>
                <div className="col">
                  <label>Language</label>
                  <input
                    type="text"
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
                    value={
                      this.state.orgInEdit.contact
                        ? this.state.orgInEdit.contact.firstname
                        : ""
                    }
                    onChange={this.onDialogInputChange}
                    placeholder="Enter First Name"
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    value={
                      this.state.orgInEdit.contact
                        ? this.state.orgInEdit.contact.lastname
                        : ""
                    }
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Last Name"
                  />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: "10px" }}>
                <div className="col">
                  <input
                    type="email"
                    value={
                      this.state.orgInEdit.contact
                        ? this.state.orgInEdit.contact.email
                        : ""
                    }
                    onChange={this.onDialogInputChange}
                    placeholder="Enter Email ID"
                  />
                </div>
              </div>
            </div>
            <div className="orgFileUploader">
              <FileUploader
                ref={this.fUpload}
                url={this.url}
                media={this.props.dataItem.media}
                title={"Upload Organization Logo"}
                uploadID={"organizationLogo"}
              />
            </div>
          </form>
        </div>
        <SaveCancel save="orgForm" cancel={this.props.cancel} />
      </Window>
    );
  }
}
