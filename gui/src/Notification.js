import React from "react";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
    this.successNotification = this.successNotification.bind(this);
    this.failNotification = this.failNotification.bind(this);
  }

  uploadingData() {
    this.notificationDOMRef.current.addNotification({
      title: "Uploading Data",
      message: "Please wait for a few seconds.",
      type: "default",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  }

  successNotification() {
    this.notificationDOMRef.current.addNotification({
      message: "Operation succesfully completed.",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  failNotification(title, message) {
    this.notificationDOMRef.current.addNotification({
      title: title ? title : "Error",
      message: message ? message : "Operation failed.",
      type: "danger",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  customSuccessNotification(title, message) {
    this.notificationDOMRef.current.addNotification({
      title: title ? title : "Success",
      message: message ? message : "Operation successful.",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  customWarningNotification(title, message) {
    this.notificationDOMRef.current.addNotification({
      title: title ? title : "Warning",
      message: message ? message : "Operation failed.",
      type: "warning",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }


  customFailNotification(title, message) {
    this.notificationDOMRef.current.addNotification({
      title: title ? title : "Error",
      message: message ? message : "Operation failed.",
      type: "danger",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  duplicateEntry() {
    this.notificationDOMRef.current.addNotification({
      title: "Operation failed",
      message: "Name already exists. Please try again.",
      type: "danger",
      insert: "bottom",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  render() {
    return (
      <div>
        <ReactNotification ref={this.notificationDOMRef} />
      </div>
    );
  }
}

export default Notification;
