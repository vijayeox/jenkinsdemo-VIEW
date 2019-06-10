import React, { Component } from "react";
import Codes from "./Codes";
import Moment from "moment";
import "@progress/kendo-ui";
import TextareaAutosize from 'react-textarea-autosize';
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Notification from "../components/Notification"


class EditProfile extends Component {

  constructor(props) {
    super(props);
    
    this.core = this.props.args;
    this.userprofile = this.core.make('oxzion/profile').get();
    this.userprofile.key.preferences['dateformat'] = 
    this.userprofile.key.preferences['dateformat'] && this.userprofile.key.preferences['dateformat'] != '' ? 
    this.userprofile.key.preferences['dateformat'] : "yyyy/MM/dd"
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
    this.notif = React.createRef();
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
      this.state.dateformat = this.state.dateformat.replace(/m/g,"M");
      this.splitPhoneNumber();
      if (Moment(this.state.fields.date_of_birth, "YYYY-MM-DD", true).isValid()) {
        const Dateiso = new Moment(this.state.fields.date_of_birth, "YYYY-MM-DD").format();
        const Datekendo = new Date(Dateiso);
        let fields = {...this.state.fields};
        fields["date_of_birth"] = Datekendo;
        this.setState({
          fields
        });
      }
    }

  handleDOBChange = event => {
    let fields = { ...this.state.fields };
    fields.date_of_birth = event.target.value;
    this.setState({ fields: fields });
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
    return new Moment(date1).format();
  }

async handleSubmit(event) {
    event.preventDefault();
    
    if (this.validateForm()) {
      const formData = {};
      this.joinPhNo();

      let date_of_birth = this.getStandardDateString(this.state.fields.date_of_birth);

      Object.keys(this.state.fields).map(key => {
        if(key == "date_of_birth"){
          formData["date_of_birth"] = date_of_birth;
        }
        if(key == "name"){
          let name = this.state.fields["firstname"] + " " + this.state.fields["lastname"];
          formData["name"] = name;
        }
        else{
          formData[key] = this.state.fields[key];
        }
      });

      let helper = this.core.make("oxzion/restClient");

      let editresponse = await helper.request(
        "v1",
        "/user/" + this.state.fields.id,JSON.stringify(formData),
        "put"
      );
      if (editresponse.status == "error") {
         this.notif.current.failNotification("Update failed: "+ editresponse.message);
      }else{
        this.notif.current.successNotification("Profile has been successfully updated.");
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
        <div className="componentDiv">
       <Notification ref={this.notif} />     
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
                  readOnly={true}
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
                  readOnly
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
                    className="validate preferencesRadio"
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
                    className="validate preferencesRadio"
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
                  className ="borderStyle textareaField"
                  type="text"
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
                  className ="borderStyle textareaField"
                  type="text"
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
