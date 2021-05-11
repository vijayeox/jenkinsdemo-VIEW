import React from "react";
import { SelectContactTypeEnum, ContactTypeEnum } from "../enums";

class ContactDetailsWidget extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  permissions = () => {
    return (
      <p className="paddingTop">
        <span
          className="buttonHover"
          onClick={() =>
            this.props.handleSelected(
              this.props.contact,
              SelectContactTypeEnum.EDIT
            )
          }
        >
          <b>EDIT</b> <i className="fa fa-edit" />
        </span>
        {this.props.contact.contact_type == ContactTypeEnum.myContact ? (
          <span
            className="buttonHover"
            onClick={() => this.props.deleteContact(this.props.contact.uuid)}
          >
            {" "}
            | <b>DELETE</b> <i className="fa fa-trash" />
          </span>
        ) : null}
      </p>
    );
  };

  render() {
    if (this.props.contact && Object.keys(this.props.contact).length != 0) {
      return (
        <div className="panelbar-wrapper contactInfoDiv">
          <div className="teamMate teamMatetopDiv">
            <div className="teamMateIcon">
              <img
                className="contactDetailsImage"
                src={this.props.contact.icon}
                key={this.props.contact.icon + "?" + new Date()}
              />
            </div>
            <div className="mate-info teamMateInfo">
              <h2>
                {this.props.contact.first_name} {this.props.contact.last_name}{" "}
              </h2>
              {this.props.contact.designation ? (
                <p>{this.props.contact.designation}</p>
              ) : null}
              {this.props.contact.company_name ? (
                <p>({this.props.contact.company_name})</p>
              ) : null}
              {this.permissions()}
            </div>
          </div>
          <div className="panelbar-wrapper generalInfoDiv">
            <p>
              <b>GENERAL INFO</b>
            </p>
            <div className="panelbar-wrapper">
              <div className="row">
                {this.props.contact.email ? (
                  <div className="col-md-12 paddingBottom">
                    <span>
                      <i className="fa fa-envelope" />{" "}
                      {this.props.contact.email}
                    </span>
                  </div>
                ) : null}

                {this.props.contact.email_list
                  ? this.props.contact.email_list.map((email, key) => {
                      return (
                        <div className="col-md-12 paddingBottom" key={key}>
                          <span>
                            <i className="fa fa-envelope" />
                            <b> {email.type}:</b> {email.value}
                          </span>
                        </div>
                      );
                    })
                  : null}

                {this.props.contact.phone_1 ? (
                  <div className="col-md-12 paddingBottom">
                    <span>
                      <i className="fa fa-phone" /> {this.props.contact.phone_1}
                    </span>
                  </div>
                ) : null}

                {this.props.contact.phone_list
                  ? this.props.contact.phone_list.map((phone, key) => {
                      return (
                        <div className="col-md-12 paddingBottom" key={key}>
                          <span>
                            <i className="fa fa-phone" />
                            <b> {phone.type}:</b> {phone.value}
                          </span>
                        </div>
                      );
                    })
                  : null}

                {this.props.contact.country ? (
                  <div className="col-md-12 paddingBottom">
                    <span>
                      <i className="fa fa-globe" /> {this.props.contact.country}
                      {this.props.contact.state
                        ? ", " + this.props.contact.state
                        : null}
                    </span>
                  </div>
                ) : null}

                {this.props.contact.city ? (
                  <div className="col-md-12 paddingBottom">
                    <span>
                      <i className="fa fa-building" /> {this.props.contact.city}
                    </span>
                  </div>
                ) : null}

                {this.props.contact.zip ? (
                  <div className="col-md-12 paddingBottom">
                    <span>
                      <i className="fa fa-map-marker" /> {this.props.contact.zip}
                    </span>
                  </div>
                ) : null}

                {this.props.contact.address_1 ? (
                  <div className="col-md-12 paddingBottom">
                    <i className="fa fa-location-arrow" />{" "}
                    <span>{this.props.contact.address_1}</span>
                  </div>
                ) : null}

                {this.props.contact.address_2 ? (
                  <div className="col-md-12 paddingBottom">
                    <span>
                      <i className="fa fa-location-arrow" />{" "}
                      {this.props.contact.address_2}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default ContactDetailsWidget;
