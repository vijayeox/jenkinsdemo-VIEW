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

  uploadImage(){
    this.notificationDOMRef.current.addNotification({
      title: "Warning",
      message: "Please choose an image.",
      type: "warning",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
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

  failNotification() {
    this.notificationDOMRef.current.addNotification({
      title: "Error",
      message: "Operation failed.",
      type: "danger",
      insert: "top",
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
