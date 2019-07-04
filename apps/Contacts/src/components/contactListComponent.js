import React from "react";
import {SelectContactTypeEnum} from "../enums"

class ContactListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  render() {
    if (this.props.contact) {
      return (
        <div className="teamMate" onClick={() => this.props.handleSelected(this.props.contact, SelectContactTypeEnum.SELECT)}>
          <img src={this.props.contact.icon ? this.props.contact.icon + "?" + new Date(): ""} />
          <span className="mate-info">
            <h2>{this.props.contact.first_name} {this.props.contact.last_name} </h2>
            <p>{this.props.contact.email} </p>
          </span>
        </div>
      );
    }
  }
}

export default ContactListComponent;
