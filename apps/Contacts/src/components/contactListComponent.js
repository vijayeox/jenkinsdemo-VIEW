import React from "react";
import { SelectContactTypeEnum, ContactTypeEnum } from "../enums";

class ContactListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  render() {
    if (this.props.contact) {
      return (
        <span>
          {this.props.contact.contact_type == ContactTypeEnum.myContact ? (
            <div className="checkBoxIndividual">
              <input
                type="checkbox"
                className="checkbox"
                value={this.props.contact.uuid}
                onChange={this.props.handleChecked}
                key={this.props.contact.uuid}
              />
            </div>
          ) : null}
          <div
            className="teamMate"
            onClick={() =>
              this.props.handleSelected(
                this.props.contact,
                SelectContactTypeEnum.SELECT
              )
            }
          >
            <div className="teamMateIcon">
              <img
                src={
                  this.props.contact.icon
                    ? this.props.contact.icon + "?" + new Date()
                    : ""
                }
                key={this.props.contact.icon ? this.props.contact.icon : ""}
              />
            </div>
            <div className="mate-info teamMateInfo">
              <h2>
                {this.props.contact.first_name} {this.props.contact.last_name}{" "}
              </h2>
              <p>{this.props.contact.email} </p>
            </div>
          </div>
        </span>
      );
    }
  }
}

export default ContactListComponent;
