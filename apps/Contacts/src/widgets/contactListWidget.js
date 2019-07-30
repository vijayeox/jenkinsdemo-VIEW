import React from "react";
import { ContactListComponent } from "../components";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";

class ContactListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      contactList: [
        {
          title: "My Contacts",
          data: this.props.myContacts,
          expanded: false
        },
        {
          title: "Organization Contacts",
          data: this.props.orgContacts,
          expanded: true
        }
      ]
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.myContacts !== prevProps.myContacts ||
      this.props.orgContacts !== prevProps.orgContacts
    ) {
      let contactList = this.state.contactList;
      contactList[0].data = this.props.myContacts;
      contactList[1].data = this.props.orgContacts;
      this.setState({
        contactList
      });
    }
  }

  contactListComponentData = data => {
    if (Object.keys(data).length != 0) {
      return data.map((contact, key) => {
        return (
          <ContactListComponent
            args={this.core}
            contact={contact}
            handleSelected={this.props.handleSelected}
            key={key}
          />
        );
      });
    } else {
      return <p>No Contacts.</p>;
    }
  };

  render() {
    return (
      <div className="panelbar-wrapper">
        <PanelBar expandMode={"single"}>
          {this.state.contactList.map((contactListItem, key) => {
            return (
              <PanelBarItem
                expanded={contactListItem.expanded}
                title={contactListItem.title}
                key={key}
              >
                <div className="contactList">
                  {this.contactListComponentData(contactListItem.data)}
                </div>
              </PanelBarItem>
            );
          })}
        </PanelBar>
      </div>
    );
  }
}

export default ContactListWidget;
