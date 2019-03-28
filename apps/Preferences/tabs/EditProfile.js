import React, { Component } from "react";
import Countries from "./Countries";
import M from "materialize-css";
import Codes from "./Codes";
import ErrorBoundary from "./ErrorBoundary";
import ReactNotification from "react-notifications-component";
import $ from "jquery";
import Moment from "moment";
 
class EditProfile extends Component {
  constructor(props) {
    super(props);
    
    this.core = this.props.args;
    this.userprofile = this.core.make('oxzion/profile').get();
    this.userprofile.key.preferences['dateformat'] = 
    this.userprofile.key.preferences['dateformat'] && this.userprofile.key.preferences['dateformat'] != '' ? 
    this.userprofile.key.preferences['dateformat'] : "yyyy/m/dd"
    this.dob = null;
    this.doj = null;
    this.state = {
      phone: "",
      heightSet: 0,
      country: "India",
      dial_code: "India +91",
      fields: {},
      errors: {},
      initialized: -1,
      phonenumber: {},
     dateformat:this.userprofile.key.preferences['dateformat']
     
    };

    this.getProfile().then(response => {
      this.setState({ fields: response.key });
      this.splitPhoneNumber();
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSelect2 = this.onSelect2.bind(this);
    this.onSelect1 = this.onSelect1.bind(this);
    this.joinPhNo = this.joinPhNo.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.addNotificationFail = this.addNotificationFail.bind(this);
    this.notificationDOMRef = React.createRef();
  }
  


  async getProfile() {
    // call to api using wrapper
    let profile = await this.core.make("oxzion/profile").get();
    
    if (this.state.initialized < 0) {
      this.setState({ initialized: this.state.initialized + 1 });
    }
    return profile;
  }

  addNotification() {
    this.notificationDOMRef.current.addNotification({
      message: "Profile has been successfully updated.",
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
      message: "Updation Failed: " + serverResponse,
      type: "danger",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }



  onSelect1(event) {
    const field = {};
    field[event.target.name] = event.target.value;
    this.setState(field);
  }


  splitPhoneNumber() {
    const phoneno = this.state.fields.phone;
    const phone1=phoneno.indexOf("-");
    this.setState({
      dial_code:phoneno.substring(0,phone1),
      phoneno:phoneno.substring(phone1+1)
    })
  }

  onSelect2(event) {
    const field = {};
    field[event.target.name] = event.target.value;
    this.setState(field);
  }


  componentDidMount() {
    let dobElem = document.getElementById("date_of_birth")
    M.Datepicker.init(dobElem, {
      format: this.state.dateformat,
      // format: 'yyyy/mm/dd',
      showClearBtn: true,
      yearRange: 100,
      maxDate: new Date(),
      defaultDate:this.dateobj(this.state.fields.date_of_birth),
      setDefaultDate:false
    });
    let dojElem = document.getElementById("date_of_join");
    M.Datepicker.init(dojElem, {
      format: this.state.dateformat,
      // format: 'dd/mm/yyyy',
      showClearBtn: true,
      yearRange: 100,
      maxDate: new Date(),
      defaultDate:this.dateobj(this.state.fields.date_of_join),
      setDefaultDate:false
    });
     this.dob = M.Datepicker.getInstance(dobElem);
     this.doj = M.Datepicker.getInstance(dojElem);
     M.updateTextFields();
     M.textareaAutoResize($("#address"));
     M.textareaAutoResize($("#about"));
  }


  handleDateChange(event) {
    console.log(event.timeStamp);
    event.target.value = event.timestamp;
    console.log(event);
    let fields = this.state.fields;
    fields[this.target.name] = date;
    self.setState({
      fields
    });
    console.log(fields);
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  joinPhNo() {
    const phoneno1 = this.state.dial_code + "-" + this.state.phoneno;
    this.state.fields.phone = phoneno1;
    console.log(this.state.fields.phone);
  }

  getStandardDateString(date1){
    if(!date1.date){
      return null;
    }      
    return (date1.date.getFullYear() + "-" + (date1.date.getMonth() + 1) + "-" + date1.date.getDate());
  }

  dateobj(date2){
    if(!date2 || date2 === ''){
      return null
    }
    var momentObj = Moment(date2, 'YYYY-MM-DD');
    var momentString = momentObj.format((this.state.dateformat).toUpperCase());
    return momentString;
  }


async handleSubmit(event) {
    event.preventDefault();
    
    if (this.validateForm()) {
      const formData = {};
      this.joinPhNo();

      let date_of_birth = this.getStandardDateString(this.dob);
      let date_of_join= this.getStandardDateString(this.doj);
      if(date_of_birth){
        this.state.fields.date_of_birth=date_of_birth;
      }
      if(date_of_join){
        this.state.fields.date_of_join=date_of_join;
      }
      Object.keys(this.state.fields).map(key => {
        formData[key] = this.state.fields[key];
      });
    
      console.log(formData);

      let helper = this.core.make("oxzion/restClient");

      let editresponse = await helper.request(
        "v1",
        "/user/" + this.state.fields.id,JSON.stringify(formData),
        "put"
      );
      if (editresponse.status == "error") {
         this.addNotificationFail(editresponse.message);
      }else{
         this.addNotification();
         this.core.make("oxzion/profile").update();
      }       
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["firstname"]) {
      formIsValid = false;
      errors["firstname"] = "*Please enter your firstname.";
    } else if (!fields["firstname"].match(/^[a-zA-Z ]*$/)) {
      formIsValid = false;
      errors["firstname"] = "*Please enter alphabets only.";
    }

    if (!fields["lastname"]) {
      formIsValid = false;
      errors["lastname"] = "*Please enter your lastname.";
    }

    if (typeof fields["lastname"] !== "undefined") {
      if (!fields["lastname"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["lastname"] = "*Please enter alphabets only.";
      }
    }

    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "*Please enter your email-ID.";
    }

    if (typeof fields["email"] !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(fields["email"])) {
        formIsValid = false;
        errors["email"] = "*Please enter valid email-ID.";
      }
    }

    if(this.doj.date < this.dob.date){
       formIsValid = false;
       alert("*Date of Joining cannot be earlier than Date of Birth");
     }

    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = "*Please enter your address";
    }

    if (!fields["interest"]) {
      formIsValid = false;
      errors["interest"] = "*Please enter your interest";
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  init() {}
  render() {
    const self = this;
    window.setTimeout(function() {
      M.updateTextFields();
      if (self.state.initialized === 0) {
        M.textareaAutoResize($("#address"));
        M.textareaAutoResize($("#about"));
        var selectElems = document.querySelectorAll("select");
        var instances = M.FormSelect.init(selectElems, {
          classes: "createSelect"
        });
        self.setState({ initialized: 1 });
      }
    }, 0);

    
   return (
      <ErrorBoundary>
        <div>
        <ReactNotification ref={this.notificationDOMRef}/>
        <div></div>
          
          <form onSubmit={this.handleSubmit} className="formmargin">
            <div className="row" style={{marginTop:"20px"}}>
              <div className="col s6 input-field">
                <input
                  type="text"
                  name="firstname"
                  ref="firstname"
                  id="firstname"
                  pattern={"[A-Za-z]+"}
                  value={this.state.fields.firstname}
                  onChange={this.handleChange}
                  required
                  className="validate"
                  
                />
                <label htmlFor="firstname">First Name *</label>
                <div className="errorMsg">{this.state.errors.firstname}</div>
              </div>

              <div className="col s6 input-field">
                <input
                  type="text"
                  name="lastname"
                  ref="lastname"
                  id="lastname"
                  pattern={"[A-Za-z]+"}
                  value={this.state.fields.lastname}
                  onChange={this.handleChange}
                  required
                  className="validate"
                  
                />
                <label htmlFor="lastname">Last Name *</label>
                <div className="errorMsg">{this.state.errors.lastname}</div>
              </div>
            </div>

            <div className="row">
              <div className="col s12 input-field">
                <input
                  name="email"
                  type="text"
                  value={this.state.fields.email}
                  onChange={this.handleChange}
                  ref="email"
                  id="email"
                  required
                  className="validate"
                  
                />
                <label htmlFor="email">Email *</label>
                <div className="errorMsg">{this.state.errors.email}</div>
              </div>
            </div>

            <div className="row">
              <div className="col s6 input-field">
                <input
                  className="datepicker"
                  ref="date_of_birth"
                  id="date_of_birth"
                  name="date_of_birth"
                  required
                 defaultValue={this.dateobj(this.state.fields.date_of_birth)}
                onChange={this.handleDateChange}
                />
                <label htmlFor="date_of_birth" className="active">Date of Birth *</label>
                <div className="errorMsg">{this.state.errors.date_of_birth}</div>
             </div>

             <div className="col s6 input-field">
             <label id="name" htmlFor="gender" className="active">Gender *</label>
                <div className="col s3 input-field gender1">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    onChange={this.handleChange}
                    ref="gender"
                    checked={this.state.fields.gender == "Male"}
                  />
                  <span id="name">Male</span>
                </label>
              </div>
              <div className="col s3 input-field gender2">

                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    onChange={this.handleChange}
                    ref="gender"
                    checked={this.state.fields.gender == "Female"}
                  />
                  <span id="name">Female</span>
                </label>
                </div>
               </div>
               </div>
              
            <div className="row marginsize">
              <div className="col s12 input-field">
                <select
                  value={this.state.fields.country}
                  onChange={this.handleChange}
                  ref="country" id="country"
                  name="country"
                  
                >
                  {Codes.map((country, key) => (
                    <option key={key} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <label id="country" style={{fontSize:"14px"}}>Country *</label>
              </div>
            </div>

          
            <div className="row marginsize input-field">
            <div className="col s12" style={{fontSize:"14px"}}>Contact Number *</div>
              <div className="row">
              <div className="col s3">
                <select
                  value={this.state.dial_code}
                  onChange={this.onSelect1}
                  id="dial_code"
                  name="dial_code"
                  ref="dial_code"
                  
                >
                  {Codes.map((dial_code, key) => (
                    <option key={key} value={dial_code.dial_code}>
                      {dial_code.name} {dial_code.dial_code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col s9">
                <input
                  id="phoneno"
                  type="text"
                  ref="phoneno"
                  name="phoneno"
                  required
                  value={this.state.phoneno}
                  onChange={this.onSelect2}
                  
                />
              </div>
              </div>
            </div>
            <label type="hidden" id="joint" ref="phone" name="phone" />

            <div className="row">
              <div className="col s12 input-field ">
                <textarea className="materialize-textarea"
                  id="address"
                  type="text"
                  ref="address"
                  name="address"
                  required
                  value={this.state.fields.address}
                  onChange={this.handleChange}
                />
                <label htmlFor="address">Address *</label>
                <div className="errorMsg">{this.state.errors.address}</div>
              </div>
            </div>

            <div className="row">
              <div className="col s12 input-field">
                <input
                  className="datepicker"
                  ref="date_of_join"
                  id="date_of_join"
                  name="date_of_join"
                  required
                  defaultValue={this.dateobj(this.state.fields.date_of_join)}
                  onChange={this.handleDateChange}
                  
                />
                <label htmlFor="date_of_join" className="active">Date of Joining *</label>
                <div className="errorMsg">{this.state.errors.date_of_join}</div>

              </div>
            </div>

            <div className="row marginsize">
              <div className="col s12 input-field">
                <input
                  id="website"
                  type="text"
                  ref="website"
                  name="website"
                  value={this.state.fields.website}
                  onChange={this.handleChange}
                  
                />
                <label htmlFor="website">Website</label>
              </div>
            </div>
            <div className="row marginsize">
              <div className="col s12 input-field">
                <textarea className="materialize-textarea" 
                  id="about"
                  ref="about"
                  name="about"
                  type="text"
                  value={this.state.fields.about}
                  onChange={this.handleChange}
                  
                />
                <label htmlFor="about">About Me</label>
              </div>
            </div>

            <div className="row">
              <div className="col s12 input-field">
                <input
                  id="interest"
                  type="text"
                  ref="interest"
                  required
                  className="validate"
                  name="interest"
                  value={this.state.fields.interest}
                  onChange={this.handleChange}
                  
                />
                <label htmlFor="interest">Interest *</label>
                <div className="errorMsg">{this.state.errors.interest}</div>
              </div>
            </div>
           
            <div className="row">
              <div className="col s12 input-field">
                <button className="btn waves-effect waves-light black" type="submit" onClick={this.functionreferesh}>
                  Submit
                </button>
              </div>
            </div>
          </form>
          </div>
      </ErrorBoundary>
    );
  }
}

export default EditProfile;