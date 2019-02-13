import React, { Component } from 'react';


class ChangePassword extends Component {
  constructor() {
    super();
   
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleSubmit(event) {
    event.preventDefault();
    const formData = {};

if(this.refs.newpassword.value!=this.refs.confirmpassword.value){
  alert("Password does not match");
}
else{
  for (const field in this.refs) {
    if (this.refs[field].value) {
      formData[field] = this.refs[field].value;
    }
  }
}
console.log("-->", formData);

  }

  init() {
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>

    <div className="form">
        <div className="row">
          <div className="col s12 input-field">
            <input id="old" type="password" name="oldpassword" className="validate" required 
                            ref="oldpassword"
                            />
            <label htmlFor="old">Old Password *</label>
          </div>
          </div>
        <div className="row">
          <div className="col s12 input-field">
            <input id="new" type="password" name="newpassword" className="validate" required
                            ref="newpassword"
                            />
            <label htmlFor="new">New Password *</label>
          </div>
          </div>
          
        <div className="row">
          <div className="col s12 input-field">
            <input id="confirm" type="password" name="confirmpassword" className="validate" required 
                            ref="confirmpassword"
                            />
            <label htmlFor="confirm">Confirm Password *</label>
          </div>
          </div>

        <div className="row">
          <div className="col s12 input-field">
          <button className="btn waves-effect waves-light" type="submit">
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