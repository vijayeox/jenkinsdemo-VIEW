import React from "react";
import { ContactListComponent } from "../components";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";

class ContactListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      myContacts: this.props.myContacts,
      orgContacts: this.props.orgContacts,
      orgContactsTempData: [],
      myContactsTempData: []
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.myContacts !== prevProps.myContacts ||
      this.props.orgContacts !== prevProps.orgContacts
    ) {
      this.setState(
        {
          myContacts: this.props.myContacts,
          orgContacts: this.props.orgContacts
        },
        () => {
          this.setState({
            myContactsTempData: this.state.myContacts.splice(0, 20),
            orgContactsTempData: this.state.orgContacts.splice(0, 20)
          });
        }
      );
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

  scrollHandler = (event, scrollType) => {
    const e = event.nativeEvent;
    if (
      e.target.scrollTop + 10 >=
      e.target.scrollHeight - e.target.clientHeight
    ) {
      if (scrollType == "orgContacts") {
        const moreData = this.state.orgContacts.splice(0, 10);
        if (moreData.length > 0) {
          this.setState({
            orgContactsTempData: this.state.orgContactsTempData.concat(moreData)
          });
        }
      } else {
        const moreData = this.state.myContacts.splice(0, 10);
        if (moreData.length > 0) {
          this.setState({
            myContactsTempData: this.state.myContactsTempData.concat(moreData)
          });
        }
      }
    }
  };

  render() {
    return (
      <div className="panelbar-wrapper">
        <PanelBar expandMode={"single"}>
          <PanelBarItem expanded={true} title={"My Contacts"}>
            <div
              className="contactList"
              onScroll={event => {
                this.scrollHandler(event, "myContacts");
              }}
            >
              {this.contactListComponentData(this.state.myContactsTempData)}
            </div>
          </PanelBarItem>
          <PanelBarItem expanded={true} title={"Organization Contacts"}>
            <div
              className="contactList"
              onScroll={event => {
                this.scrollHandler(event, "orgContacts");
              }}
            >
              {this.contactListComponentData(this.state.orgContactsTempData)}
            </div>
          </PanelBarItem>
        </PanelBar>
      </div>
    );
  }
}

export default ContactListWidget;
