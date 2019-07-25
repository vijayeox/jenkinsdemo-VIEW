import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { ExportToCsv } from "export-to-csv-file";
import { GetContacts, ImportContacts } from "../services/services";
import { Notification } from "../components";

class ImportExportContactsWidget extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.loader = this.core.make("oxzion/splash");
    this.notif = React.createRef();
  }

  exportContactsToCsv = () => {
    var myContacts = [];
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      title: "My Contacts",
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    this.loader.show();
    GetContacts().then(response => {
      if (response.status == "success") {
        if (response.data) {
          myContacts = response.data.myContacts ? response.data.myContacts : [];
          if (myContacts.length > 0) {
            const csvExporter = new ExportToCsv(options);
            csvExporter.generateCsv(myContacts);
            this.notif.current.successNotification("Export Success.");
          } else {
            this.notif.current.failNotification("My Contacts List is Empty.");
          }
        }
      }
      this.loader.destroy();
    });
  };

  importContactsFormCsv = (selectedFile) => {
    let fileData = {file:selectedFile}
    ImportContacts(fileData).then(response => {
        if(response.status == "success"){
            this.notif.current.successNotification("Successfully imported");
            this.props.getContact;
        }
        else{
            this.notif.current.failNotification("Failed to import:" + response.message);
        }
    })
  }

  handleClick = e => {
    this.refs.fileUploader.click();
  };

  handleFile = e => {
    this.importContactsFormCsv(e.target.files[0]);
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
        />
        <DropdownButton
          id="dropdown-basic-button"
          title="Import / Export Contacts"
        >
          <Dropdown.Item onClick={this.handleClick}>Import (csv)</Dropdown.Item>
          <Dropdown.Item onClick={this.exportContactsToCsv}>
            Export (csv)
          </Dropdown.Item>
        </DropdownButton>
      </span>
    );
  }
}

export default ImportExportContactsWidget;
