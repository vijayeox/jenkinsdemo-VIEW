import React, { Component } from "react";
import Codes from "./Codes";
import ReactNotification from "react-notifications-component";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import $ from "jquery";
import Moment from "moment";
import "@progress/kendo-ui";
import TextareaAutosize from 'react-textarea-autosize';
import { DatePicker } from "@progress/kendo-react-dateinputs";

 
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
      DOBInEdit: undefined,
      phone: "",
      heightSet: 0,
      selectedCountry: [],
      country : "India",
      dial_code: "India +91",
      fields: {},
      errors: {},
      initialized: -1,
      phonenumber: {},
      dateformat:this.userprofile.key.preferences['dateformat'],
      fields:this.userprofile.key
    };


    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSelect2 = this.onSelect2.bind(this);
    this.onSelect1 = this.onSelect1.bind(this);
    this.joinPhNo = this.joinPhNo.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.addNotificationFail = this.addNotificationFail.bind(this);
    this.notificationDOMRef = React.createRef();
  }

  addNotification() {
    this.notificationDOMRef.current.addNotification({
      message: "Profile has been successfully updated.",
      type: "success",
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "bounceIn"],
      animationOut: ["animated", "bounceOut"],
      dismiss: { duration: 1000 },
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
      dismiss: { duration: 1000 },
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


  componentWillMount(){
      this.splitPhoneNumber();
      console.log(this.state.fields);
      let fieldsTemp = { ...this.state.fields };
      if (
        this.state.fields.date_of_birth == "0000-00-00" ||
        this.state.fields.date_of_birth == null
      ) {
        if (
          this.state.fields.date_of_birth == "0000-00-00" ||
          this.state.fields.date_of_birth == null
        ) {
          fieldsTemp.date_of_birth = "";
          this.setState({ fields: fieldsTemp });
          this.setState({ DOBInEdit: "" });
        } else {
          const DOBDate = this.state.fields.date_of_birth;
          const DOBiso = new Moment(DOBDate, "YYYY-MM-DD").format();
          const DOBkendo = new Date(DOBiso);

          fieldsTemp.date_of_birth = DOBkendo;
          this.setState({ fields: fieldsTemp });

          this.setState({ DOBInEdit: DOBiso });
        }
      } else {
        const DOBDate = this.state.fields.date_of_birth;
        const DOBiso = new Moment(DOBDate, "YYYY-MM-DD").format();
        const DOBkendo = new Date(DOBiso);
       
        let fields = { ...this.state.fields };
        fields.date_of_birth = DOBkendo;
        this.setState({ fields: fields });

        this.setState({ DOBInEdit: DOBiso });
      }
    }

  handleDOBChange = event => {
    let fields = { ...this.state.fields };
    fields.date_of_birth = event.target.value;
    this.setState({ fields: fields });

    var DOBiso = new Moment(event.target.value).format();
    this.setState({ DOBInEdit: DOBiso });
  };


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
    
    return new Date(date1.toISOString().slice(0,10));
  }

async handleSubmit(event) {
    event.preventDefault();
    
    if (this.validateForm()) {
      const formData = {};
      this.joinPhNo();

      let date_of_birth = this.getStandardDateString(this.state.fields.date_of_birth);
      if(date_of_birth){
        this.state.fields.date_of_birth=date_of_birth;
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
   return (
        <div>
        <ReactNotification ref={this.notificationDOMRef}/>
        <div></div>
          
          <form className="formmargin" onSubmit={this.handleSubmit}>
            <div className="row" style={{marginTop:"20px"}}>
              <div className="col-md-6 input-field">
              <label>First Name *</label>          
                <input
                  type="text"
                  name="firstname"
                  ref="firstname"
                  id="firstname"
                  pattern={"[A-Za-z ]+"}
                  value={this.state.fields.firstname}
                  onChange={this.handleChange}
                  required
                  className="validate"
                  
                />
                <div className="errorMsg">{this.state.errors.firstname}</div>
              </div>

              <div className="col-md-6 input-field">
              <label>Last Name *</label>
                <input
                  type="text"
                  name="lastname"
                  ref="lastname"
                  id="lastname"
                  pattern={"[A-Za-z ]+"}
                  value={this.state.fields.lastname}
                  onChange={this.handleChange}
                  required
                  className="validate"
                  
                />
                <div className="errorMsg">{this.state.errors.lastname}</div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 input-field">
                <label htmlFor="email">Email *</label>
                <input
                  name="email"
                  type="text"
                  value={this.state.fields.email}
                  ref="email"
                  id="email"
                  readonly={true}
                />
              </div>
            </div>

            <div className="row marginstyle">
              <div className="col input-field marginbottom">
              <label id="rowdob">Date of Birth *</label>
              <div>
                <DatePicker
                  format={this.state.dateformat}
                  name="date_of_birth"
                  id="date_of_birth"
                  ref="date_of_birth"
                  value={this.state.fields.date_of_birth}
                  onChange={this.handleDOBChange}
                />
                </div>

                <div className="errorMsg">{this.state.errors.date_of_birth}</div>
             </div>


             <div className="col input-field">
             <label id="name" className="active"  style={{fontSize:"16px"}}>Gender *</label>
             <div className="row gender">
                <div className="col-md-3 input-field">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    onChange={this.handleChange}
                    ref="gender"
                    checked={this.state.fields.gender == "Male"}
                    className="validate"
                    required
                  />
                  <span id="gender">Male</span>
                </label>
              </div>
              <div className="col-md-5 input-field">

                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    onChange={this.handleChange}
                    ref="gender"
                    checked={this.state.fields.gender == "Female"}
                    className="validate"
                    required
                  />
                  <span id="gender">Female</span>
                </label>
                <div className="errorMsg">{this.state.errors.gender}</div>            
                </div>
                </div>
               </div>
               </div>


          
            <div className="row">
            <div className="col-md-12" style={{fontSize:"17px"}}>Contact Number *</div>
              <div className="row">
              <div className="col-md-5">
                <select
                  className="dropdownstyle"
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

              <div className="col-md-7">
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
              <div className="col-md-12 input-field">
               <label style={{fontSize:"17px"}}>Address *</label>
               <div>
               <TextareaAutosize
                  className ="borderStyle"
                  type="text"
                  id="textareaField"
                  ref="address"
                  required
                  name="address"
                  value={this.state.fields.address}
                  onChange={this.handleChange}
                />
                </div>        
                <div className="errorMsg">{this.state.errors.address}</div>
              </div>
            </div>

              
            <div className="row">
            <label className = "country" style={{marginTop:""}}>Country *</label>
              
              <div className="col-md-12">
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
               </div>
              </div>
            
            <div className="row marginsize2">
              <div className="col-md-12 input-field">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  ref="website"
                  name="website"
                  value={this.state.fields.website}
                  onChange={this.handleChange} 
                />
              
              </div>
            </div>
            <div className="row about">
              <div className="col-md-12 input-field">
                <label>About Me</label>
                 <div>
               <TextareaAutosize
                  className ="borderStyle"
                  type="text"
                  id="textareaField"
                  ref="about"
                  required
                  name="about"
                  value={this.state.fields.about}
                  onChange={this.handleChange}
                />
                </div> 
           
              </div>
            </div>

            <div className="row">

              <div className="col-md-12 input-field interest">
              <label htmlFor="interest">Interest *</label>
                
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
                <div className="errorMsg">{this.state.errors.interest}</div>
              </div>
            </div>
           
            <div className="row">
              <div className="col s12 input-field">
                <button className="k-button k-primary" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
          </div>
    );
  }
}

export default EditProfile;
