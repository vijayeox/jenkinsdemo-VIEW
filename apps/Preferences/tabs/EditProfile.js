import React, { Component } from "react";
import Countries from "./Countries";
import M from "materialize-css";
// import "./Sample.css";
import Codes from "./Codes";
import ErrorBoundary from "./ErrorBoundary";
import Img1 from "./Img1.js";
import Webcam from "./Webcam.js";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    
    this.core = this.props.args;
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
     
    };

    this.getProfile().then(response => {
      this.setState({ fields: response.key });
      console.log(this.state.fields);
      this.splitPhoneNumber();
    });

    // this.onSelect = this.onSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSelect2 = this.onSelect2.bind(this);
    this.onSelect1 = this.onSelect1.bind(this);
    //this.functinback=this.functinback.bind(this);
      this.joinPhNo = this.joinPhNo.bind(this);
    //this.handleOnChange = this.handleOnChange.bind(this);
   // this.handleDateChange = this.handleDateChange.bind(this);
   // this.handleChange1 = this.handleChange1.bind(this);
  }

  
  async getProfile() {
    // call to api using wrapper
    let profile = await this.core.make("oxzion/profile").get();
    
    if (this.state.initialized < 0) {
      this.setState({ initialized: this.state.initialized + 1 });
    }
    return profile;
  }


  onSelect1(event) {
    const field = {};
    field[event.target.name] = event.target.value;
    this.setState(field);
  }


  splitPhoneNumber() {
    const phoneno = this.state.fields.phone;
    const phonenumber = phoneno.split("-");
    this.setState({
      dial_code: phonenumber[0],
      phoneno: phonenumber[1]
    });
  }

  onSelect2(event) {
    const field = {};
    field[event.target.name] = event.target.value;
    this.setState(field);
  }


  componentDidMount() {

// function ready(fn) {
//       if (
//         document.attachEvent
//           ? document.readyState === "complete"
//           : document.readyState !== "loading"
//       ) {
//         fn();
//       } else {
//         document.addEventListener("DOMContentLoaded", fn);
//       }
//     }
//     ready(function() {
//           document.getElementById("imageBox").style.display = "none";
//       document.getElementById("webcamcomponent").style.display = "none";
//     });


//     var myEl2 = document.getElementById("img1");
//     if (myEl2) {
//       myEl2.addEventListener(
//         "click",
//         function() {
//           document.getElementById("profileform").style.display = "none";
//           document.getElementById("imageBox").style.display = "";
//           document.getElementById("webcamcomponent").style.display = "none";
//           document.getElementById("modalbutton").style.display = "none";
//         },
//         false
//       );
//     }

//     var myEl3 = document.getElementById("goBack1");
//     if (myEl3) {
//       myEl3.addEventListener(
//         "click",
//         function() {
//           document.getElementById("imageBox").style.display = "none";
//           document.getElementById("profileform").style.display = "";
//           document.getElementById("modalbutton").style.display = "";
//         },
//         false
//       );
//     }

//     var myEl4 = document.getElementById("webcam");
//     if (myEl4) {
//       myEl4.addEventListener(
//         "click",
//         function() {
//           document.getElementById("profileform").style.display = "none";
//           document.getElementById("webcamcomponent").style.display = "";
//           document.getElementById("imageBox").style.display = "none";
//           document.getElementById("modalbutton").style.display = "none";
//         },
//         false
//       );
//     }

//     var myEl5 = document.getElementById("goBack2");
//     if (myEl5) {
//       myEl5.addEventListener(
//         "click",
//         function() {
//           document.getElementById("webcamcomponent").style.display = "none";
//           document.getElementById("profileform").style.display = "";
//           document.getElementById("modalbutton").style.display = "";
//         },
//         false
//       );
//     }

//     var modalelems = document.querySelectorAll(".modal");
//     var instances = M.Modal.init(modalelems, { inDuration: 250 });

//     var tooltipElems = document.querySelectorAll(".tooltipped");
//     var instances1 = M.Tooltip.init(tooltipElems, { position: 'left' });


    let elems = document.querySelectorAll(".datepicker");
    M.Datepicker.init(elems, {
      format: "dd-mm-yyyy",
      showClearBtn: true,
      yearRange: 100
    });
     this.dob = M.Datepicker.getInstance(elems[0]);
     this.doj = M.Datepicker.getInstance(elems[1]);
    
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
//    this.validateForm();
  }

  joinPhNo() {
    const phoneno1 = this.state.dial_code + "-" + this.state.phoneno;
    this.state.fields.phone = phoneno1;
    console.log(this.state.fields.phone);
  }

  getStandardDateString(date1){
    if(!date1.date){
      return this.state.fields.dob;
    }      
    return (date1.date.getFullYear() + "-" + (date1.date.getMonth() + 1) + "-" + date1.date.getDate());
 }


 getStandardDateString1(date1){
  if(!date1.date){
    return this.state.fields.doj;
  }      
  return (date1.date.getFullYear() + "-" + (date1.date.getMonth() + 1) + "-" + date1.date.getDate());
}

  handleSubmit(event) {
    event.preventDefault();
    
    if (this.validateForm()) {
      const formData = {};
      this.joinPhNo();

      formData.dob = this.getStandardDateString(this.dob);
      formData.doj= this.getStandardDateString1(this.doj);
      
      this.state.fields.dob=formData.dob;
      this.state.fields.doj=formData.doj;
      Object.keys(this.state.fields).map(key => {
        formData[key] = this.state.fields[key];
      });
    
      console.log(formData);

      let helper = this.core.make("oxzion/restClient");

      let editresponse = helper.request(
        "v1",
        "/user/" + this.state.fields.id,JSON.stringify(formData),
        "put"
      );
      console.log("done");
      if (editresponse.status == "error") {
        alert(editresponse.message);
      }else{
        alert("Successfully Updated");
        this.props.action();

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

    // if (!fields["phoneno"]) {
    //   formIsValid = false;
    //   errors["phoneno"] = "*Please enter your mobile no.";
    // }

    // if (typeof fields["phoneno"] !== "undefined") {
    //   if (!fields["phoneno"].match(/^[0-9]{10}$/)) {
    //     formIsValid = false;
    //     errors["phoneno"] = "*Please enter valid mobile no.";
    //   }
    // }
    
    // if(!this.state.fields.doj) {
    //   formIsValid = false;
    //   errors["dob"] = "*Please enter your Date of Birth";
    // }
    // if(!this.doj) {
    //   formIsValid = false;
    //   errors["doj"] = "*Please enter your Date of Joining";
    // }

    // if(this.doj.date < this.dob.date){
    //    formIsValid = false;
    //    alert("*Date of Joining cannot be earlier than Date of Birth");
    //  }

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

  // functionreferesh(){
  //   this.props.action()
  // }


  init() {}
  render() {
    const self = this;
    window.setTimeout(function() {
      if (self.state.initialized === 0) {
        var selectElems = document.querySelectorAll("select");
        var instances = M.FormSelect.init(selectElems, {
          classes: "createSelect"
        });

        self.setState({ initialized: 1 });
      }
    }, 0);

    // <button className="waves-effect waves-light btn" id="goBack">
          //   Back
          // </button>

    return (
      <ErrorBoundary>
        <div>

        <div></div>
          
          <form onSubmit={this.handleSubmit}>
            <div className="row" style={{marginTop:"20px"}}>
              <div className="col s6">
                <label style={{ fontSize: "15px"}}>First Name*</label>

                <input
                  type="text"
                  name="firstname"
                  ref="firstname"
                  pattern={"[A-Za-z]+"}
                  value={this.state.fields.firstname}
                  onChange={this.handleChange}
                  required
                  
                />

                <div className="errorMsg">{this.state.errors.firstname}</div>
              </div>

              <div className="col s6" margin-right="200px">
                <label style={{ fontSize: "15px"}}>Last Name*</label>

                <input
                  type="text"
                  name="lastname"
                  ref="lastname"
                  value={this.state.fields.lastname}
                  onChange={this.handleChange}
                  
                />
                <div className="errorMsg">{this.state.errors.lastname}</div>
              </div>
            </div>

            <div className="row">
              <div className="col s12">
                <label style={{ fontSize: "15px" }}>Email *</label>

                <input
                  name="email"
                  type="text"
                  value={this.state.fields.email}
                  onChange={this.handleChange}
                  ref="email"
                />
                <div className="errorMsg">{this.state.errors.email}</div>
              </div>
            </div>

            <div className="row">
              <div className="col s12">
                <label style={{ fontSize: "15px" }}>Date of Birth *</label>
                <input
                  className="datepicker"
                  ref="date_of_birth"
                  // readOnly={true}
                  name="date_of_birth"
                  // value={this.state.fields.date_of_birth}
                 defaultValue={this.state.fields.date_of_birth}
                onChange={this.handleDateChange}
                />
                <div className="errorMsg">{this.state.errors.date_of_birth}</div>
             </div>
            </div>

            <div className="row">
              <div className="col s12">
                <label style={{ fontSize: "15px" }}>Country *</label>
                <select
                  value={this.state.fields.country}
                  onChange={this.handleChange}
                  ref="country"
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

          
            <div className="row">
              <label style={{ fontSize: "15px" }} className="contact">
                {" "}
                Contact*
              </label>
              <br />

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
                  value={this.state.phoneno}
                  onChange={this.onSelect2}
                />
              </div>
            </div>
            <label type="hidden" id="joint" ref="phone" name="phone" />

            <div className="row">
              <div className="col s12">
                <label style={{ fontSize: "15px" }}>Address *</label>
                <textarea
                  className="materialize-textarea"
                  data-length="200"
                  ref="address"
                  name="address"
                  value={this.state.fields.address}
                  onChange={this.handleChange}
                />
                <div className="errorMsg">{this.state.errors.address}</div>
              </div>
            </div>

            <div className="row">
              <div className="col s12">
                <label style={{ fontSize: "15px" }}>Date of Joining *</label>
                <input
                  className="datepicker"
                  ref="date_of_join"
                  readOnly={true}
                  name="date_of_join"

                  defaultValue={this.state.fields.date_of_join}
                  onChange={this.handleDateChange}
                />
                <div className="errorMsg">{this.state.errors.date_of_join}</div>

              </div>
            </div>

            <div className="row">
              <div className="col s12">
                <label style={{ fontSize: "15px" }}>Website</label>
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

            <div className="row">
              <div className="col s12">
                <label style={{ fontSize: "15px" }}>Sex *</label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    onChange={this.handleChange}
                    ref="gender"
                    checked={this.state.fields.gender == "Male"}
                  />
                  <span className="m-2">Male</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    onChange={this.handleChange}
                    ref="gender"
                    checked={this.state.fields.gender == "Female"}
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col s12">
                <label style={{ fontSize: "15px" }}>About Me</label>
                <textarea
                  id="textarea1"
                  className="materialize-textarea"
                  data-length="200"
                  ref="about"
                  name="about"
                  value={this.state.fields.about}
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col s12">
                <label style={{ fontSize: "15px" }}>Interest *</label>
                <input
                  id="interest"
                  type="text"
                  className="validate"
                  // required
                  ref="interest"
                  name="interest"
                  value={this.state.fields.interest}
                  onChange={this.handleChange}
                />
                <div className="errorMsg">{this.state.errors.interest}</div>
              </div>
            </div>
            <div className="row">
              <div className="col s12 input-field">
                <button className="btn waves-effect waves-light" type="submit" onClick={this.functionreferesh}>
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