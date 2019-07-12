import React from "react";
import { ContactListWidget, ContactDetailsWidget } from "./src/widgets";
import { ContactDailog } from "./src/dailogs";
import { SelectContactTypeEnum } from "./src/enums";
import {
  GetContacts,
  SearchContact,
  DeleteContact
} from "./src/services/services";
import { Notification } from "./src/components";
import Swal from "sweetalert2";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      showContactDailog: false,
      selectedContact: {},
      contactList: [],
      myContacts: [],
      orgContacts: [],
      searchText: ""
    };
    this.notif = React.createRef();
    this.loader = this.core.make("oxzion/splash");
    this.callSearch;
  }

  componentWillMount() {
    this.getContact();
  }

  deleteContact = uuid => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        this.loader.show();
        DeleteContact(uuid).then(response => {
          if (response.status == "success") {
            this.notif.current.successNotification("Contact deleted.");
            this.getContact();
          } else {
            this.notif.current.failNotification(
              "Operation failed" + response.message
            );
          }
          this.loader.destroy();
        });
      }
    });
  };

  getContact = () => {
    this.loader.show();
    GetContacts().then(response => {
      if (response.status == "success") {
        if (response.data) {
          this.setState(
            {
              myContacts: response.data.myContacts
                ? response.data.myContacts
                : [],
              orgContacts: response.data.orgContacts
                ? response.data.orgContacts
                : []
            },
            () => {
              if (response.data.orgContacts.length > 0) {
                this.setState({
                  selectedContact: response.data.orgContacts[0]
                });
              }
            }
          );
        }
      }
      this.loader.destroy();
    });
  };

  searchContact = () => {
    SearchContact(this.state.searchText).then(response => {
      if (response.status == "success") {
        this.setState({
          myContacts: response.data.myContacts,
          orgContacts: response.data.orgContacts
        });
      }
    });
  };

  handleChange = e => {
    clearTimeout( this.callSearch );
    this.setState(
      {
        searchText: e.target.value
      },
      () => {
        this.callSearch = window.setTimeout(() => {
          this.searchContact();
        },500);
      }
    );
  };

  toggleDialog = () => {
    this.setState({
      showContactDailog: !this.state.showContactDailog,
      searchText: ""
    });
  };

  cancel = () => {
    this.toggleDialog();
    this.getContact();
  }

  success = () => {
    this.notif.current.successNotification("Operation Success.");
    this.toggleDialog();
    this.getContact();
  }

  handleSelected = (selectedContact, selectType) => {
    this.setState({
      selectedContact: selectedContact
    });
    if (
      selectType === SelectContactTypeEnum.EDIT ||
      selectType === SelectContactTypeEnum.ADD
    ) {
      this.toggleDialog();
    }
  };

  render() {
    return (
      <div className="contactPanelMainDiv">
        <Notification ref={this.notif} />
        <div className="col">
          <div className="contactPanel">
            <div className="row">
              <div className="col-md-6 topDiv">
                <input
                  type="search"
                  className="form-control searchContact"
                  placeholder="Search Contact"
                  value={this.state.searchText}
                  onChange={this.handleChange}
                />
              </div>
              <div className="col-md-6 topDiv">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ float: "right" }}
                  onClick={() =>
                    this.handleSelected({}, SelectContactTypeEnum.ADD)
                  }
                >
                  Add Contact
                </button>
              </div>
              <div className="col-md-6">
                <ContactListWidget
                  args={this.core}
                  myContacts={this.state.myContacts}
                  orgContacts={this.state.orgContacts}
                  handleSelected={this.handleSelected}
                />
              </div>
              <div className="col-md-6">
                <ContactDetailsWidget
                  args={this.core}
                  contact={this.state.selectedContact}
                  handleSelected={this.handleSelected}
                  deleteContact={this.deleteContact}
                />
              </div>
            </div>
          </div>
        </div>
        {this.state.showContactDailog && (
          <ContactDailog
            args={this.core}
            cancel={this.cancel}
            success={this.success}
            contactDetails={this.state.selectedContact}
          />
        )}
      </div>
    );
  }
}

export default App;
