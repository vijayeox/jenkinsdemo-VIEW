import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { ImportContacts, ExportContacts } from "../services/services";
import { Notification } from "../components";

class ImportExportContactsWidget extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.loader = this.core.make("oxzion/splash");
    this.notif = React.createRef();
  }

  convertToFile = (data, fileType, fileName) => {
    const url = window.URL.createObjectURL(
      new Blob([data], { type: fileType })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  };

  exportContactsToCsv = () => {
    ExportContacts("").then(response => {
      if (response.status == "success") {
        this.convertToFile(response.data, "text/csv", "myContacts.csv");
        this.notif.current.successNotification("Successfully imported");
        this.props.getContact;
      } else {
        this.notif.current.failNotification(
          "Failed to import:" + response.message
        );
      }
    });
  };

  importContactsFormCsv = selectedFile => {
    let fileData = { file: selectedFile };
    ImportContacts(fileData).then(response => {
      if (response.status == "success") {
        this.convertToFile(
          response.data,
          "text/csv",
          "myContactsErrorList.csv"
        );
        this.notif.current.successNotification("Successfully imported");
        this.props.getContact;
      } else {
        this.notif.current.failNotification(
          "Failed to import:" + response.message
        );
      }
    });
  };

  handleClick = e => {
    this.refs.fileUploader.click();
  };

  handleFile = e => {
    this.importContactsFormCsv(e.target.files[0]);
  };

  downloadCsvTemplate = () => {
    const data =
      "Given Name,Family Name,Email 1 - Type,Email 1 - Value,E-mail 2 - Type,E-mail 2 - Value,E-mail 3 - Type,E-mail 3 - Value,Phone 1 - Type,Phone 1 - Value,Phone 2 - Type,Phone 2 - Value,Phone 3 - Type,Phone 3 - Value,Organization 1 - Name,Organization 1 - Title,Location,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name";
    this.convertToFile(data, "text/csv", "contactsTemplate.csv");
  };

  render() {
    return (
      <span>
        <Notification ref={this.notif} />
        <input
          type="file"
          id="file"
          ref="fileUploader"
          style={{ display: "none" }}
          onChange={this.handleFile}
          accept=".csv"
        />
        <DropdownButton id="dropdown-basic-button" title="Import / Export">
          <Dropdown.Item onClick={this.handleClick}>
            Import (Google csv)
          </Dropdown.Item>
          <Dropdown.Item onClick={this.exportContactsToCsv}>
            Export (csv)
          </Dropdown.Item>
          <Dropdown.Item onClick={this.downloadCsvTemplate}>
            Download csv template
          </Dropdown.Item>
        </DropdownButton>
      </span>
    );
  }
}

export default ImportExportContactsWidget;
