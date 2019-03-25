import React, { Component } from "react";
import ReactNotification from "react-notifications-component";

class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      type: 'password',
      type1: 'password',
      type2: 'password',
      fields: {},
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.showHide = this.showHide.bind(this);
    this.showHide1 = this.showHide1.bind(this);
    this.showHide2 = this.showHide2.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.addNotificationFail = this.addNotificationFail.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  addNotification() {
    this.notificationDOMRef.current.addNotification({
      message: "Password Update Successfull",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  addNotificationFail(serverResponse) {
    this.notificationDOMRef.current.addNotification({
      message: serverResponse,
      type: "danger",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }


  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validateForm()) {
      const formData = {};
      Object.keys(this.state.fields).map(key => {
        formData[key] = this.state.fields[key];
      });

      console.log(formData);
      this.props.changePassword(formData).then((response) => {
        if (response.status == "error") {
         this.addNotificationFail(response.message);
        }else{
         this.addNotification();
        }
      });
    }
  }
  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'text' ? 'password' : 'text'
    })
  }
  showHide1(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type1: this.state.type1 === 'text' ? 'password' : 'text'
    })
  }
  showHide2(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type2: this.state.type2 === 'text' ? 'password' : 'text'
    })
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["old_password"]) {
      formIsValid = false;
      errors["old_password"] = "*Please enter your Old Password";
    }

    if (!fields["new_password"]) {
      formIsValid = false;
      errors["new_password"] = "*Please enter your New Password";
    }

    if (!fields["confirm_password"]) {
      formIsValid = false;
      errors["confirm_password"] = "*Please confirm your password";
    }

    if (fields["new_password"]!=fields["confirm_password"]) {
      formIsValid = false;
      errors["confirm_password"] = "*Password does not match";
    }    
    if(fields["new_password"].length < 8) {
      formIsValid = false;
      errors["new_password"] = "Password must contain at least eight characters!";
    }
    var re = /[0-9]/;
    if(!re.test(fields["new_password"])) {
      formIsValid = false;
      errors["new_password"]="Password must contain at least one number (0-9)!";        
    }

    re = /[a-z]/;
    if(!re.test(fields["new_password"])) {
      formIsValid = false;
      errors["new_password"]="Password must contain at least one lowercase letter (a-z)!";
    }

    re = /[A-Z]/;
    if(!re.test(fields["new_password"])) {
     formIsValid = false;
     errors["new_password"]= "Password must contain at least one uppercase letter (A-Z)!";
   }

   re=/[$ & + , : ; = ? @ # | ' < > . - ^ * ( ) % !]/;
   if(!re.test(fields["new_password"])) {
    formIsValid = false;
    errors["new_password"]= "Password must contain at least one Special Character($&+,:;=?@#|'<>.-^*()%!)!";
  }


  this.setState({
    errors: errors
  });
  return formIsValid;
}

init() {}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <ReactNotification ref={this.notificationDOMRef}/>         
      <div className="form">
        <div className="row">
            <div className="col s12">
              <div className="password input-field">     
                <input
                  type={this.state.type}
                  className="password_input"
                  name="old_password"
                  ref="old_password"
                  onChange={this.handleChange}
                />
                <label>Old Password *</label>
                <span style={{ height: "25px" }}
                  className="password__show"
                  onClick={this.showHide}>{this.state.type === 'text' ? 'Hide' : 'Show'}
                </span>
                <div className="errorMsg">{this.state.errors.old_password}</div>
              </div>
            </div>
        </div>
        <div className="row">
            <div className="col s12">
                <div className="password input-field">     
                  <input
                      id="new"
                      type={this.state.type1}
                      name="new_password"
                      ref="new_password"
                      onChange={this.handleChange}
                  />
                  <label>New Password *</label>
                  <span style={{ height: "25px" }}
                      className="password__show"
                      onClick={this.showHide1}>{this.state.type1 === 'text' ? 'Hide' : 'Show'}
                  </span>
                  <div className="errorMsg">{this.state.errors.new_password}</div>
                </div>
              </div>
            </div>
        <div className="row">
          <div className="col s12">
            <div className="password input-field">     
              <input
                id="confirm"
                type={this.state.type2}
                name="confirm_password"
                ref="confirm_password"
                onChange={this.handleChange}
              />
              
              <label>Confirm Password *</label>
              <span style={{ height: "25px" }}
                className="password__show"
                onClick={this.showHide2}>{this.state.type2 === 'text' ? 'Hide' : 'Show'}
              </span>
              <div className="errorMsg">{this.state.errors.confirm_password}</div>
            </div>
          </div>
        </div>
      <div className="row">
      <div className="col s12 input-field">
         <button className="btn waves-effect waves-light waves-effect black" type="submit">
          Submit
         </button>
        </div>
      </div>
      </div>
     </form>
    );
  }
}

export default ChangePassword;
