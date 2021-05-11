import React from "react";
import ReactNotification from "react-notifications-component";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
    this.successNotification = this.successNotification.bind(this);
    this.failNotification = this.failNotification.bind(this);
  }

  successNotification = (msg) =>{
    this.notificationDOMRef.current.addNotification({
      message: msg,
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  failNotification = (msg) => {
    this.notificationDOMRef.current.addNotification({
      title: "Error",
      message: msg,
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
