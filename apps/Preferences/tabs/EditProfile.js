import React, { Component } from "react";
import Codes from "./Codes";
import Moment from "moment";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Notification from "../components/Notification";
import AvatarImageCropper from "react-avatar-image-cropper";
import image2base64 from "image-to-base64";
import Webcam from "react-webcam";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
const {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  Link,
  Unlink
} = EditorTools;

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.core = this.props.args;
    this.userprofile = this.core.make("oxzion/profile").get();
    if (
      this.userprofile.key.preferences != undefined ||
      this.userprofile.key.preferences != null
    ) {
      this.userprofile.key.preferences["dateformat"] =
        this.userprofile.key.preferences["dateformat"] &&
        this.userprofile.key.preferences["dateformat"] != ""
          ? this.userprofile.key.preferences["dateformat"]
          : "dd-MM-yyyy";
    } else {
      this.userprofile.key.preferences = { dateformat: "dd-MM-yyyy" };
    }

    this.dob = null;
    this.doj = null;
    this.state = {
      DOBInEdit: undefined,
      phoneno: "",
      heightSet: 0,
      selectedCountry: [],
      country: "India",
      dial_code: "+91",
      errors: {},
      initialized: -1,
      phonenumber: {},
      dateformat: this.userprofile.key.preferences["dateformat"],
      fields: this.userprofile.key,
      showImageDiv: 1,
      imageData: null,
      icon: this.userprofile.key.icon + "?" + new Date()
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.notif = React.createRef();
    this.submitProfilePic = this.submitProfilePic.bind(this);

    Codes.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  }

  onSelect1 = event => {
    const field = {};
    field[event.target.name] = event.target.value;
    this.setState(field);
  };

  splitPhoneNumber() {
    if (this.state.fields.phone == (null || undefined)) {
      return;
    } else if (this.state.fields.phone) {
      const phoneno = this.state.fields.phone;
      const phone1 = phoneno.indexOf("-");
      this.setState({
        dial_code: phoneno.substring(0, phone1),
        phoneno: phoneno.substring(phone1 + 1)
      });
    }
  }

  onSelect2 = event => {
    const field = {};
    field[event.target.name] = event.target.value;
    this.setState(field);
  };

  componentWillMount() {
    this.state.dateformat = this.state.dateformat.replace(/m/g, "M");
    this.splitPhoneNumber();
    if (Moment(this.state.fields.date_of_birth, "YYYY-MM-DD", true).isValid()) {
      const Dateiso = new Moment(
        this.state.fields.date_of_birth,
        "YYYY-MM-DD"
      ).format();
      const Datekendo = new Date(Dateiso);
      let fields = { ...this.state.fields };
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

  handleChange = e => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  };

  handleChangeAboutField = value => {
    console.log(value);
    let fields = this.state.fields;
    fields["about"] = value;
    this.setState({
      fields
    });
  };

  async handleSubmit(event) {
    event.preventDefault();

    if (this.validateForm()) {
      const formData = {};

      let fields = { ...this.state.fields };
      fields.phone = this.state.dial_code + "-" + this.state.phoneno;
      this.setState({
        fields: fields
      });

      let date_of_birth = new Moment(this.state.fields.date_of_birth).format(
        "YYYY-MM-DD"
      );

      Object.keys(this.state.fields).map(key => {
        if (key == "date_of_birth") {
          formData.date_of_birth = date_of_birth;
        } else if (key == "name") {
          let name =
            this.state.fields["firstname"] +
            " " +
            this.state.fields["lastname"];
          formData["name"] = name;
        } else {
          formData[key] = this.state.fields[key];
        }
      });

      console.log(formData);
      let helper = this.core.make("oxzion/restClient");

      let editresponse = await helper.request(
        "v1",
        "/user/me/save",
        JSON.stringify(formData),
        "post"
      );
      if (editresponse.status == "error") {
        this.notif.current.failNotification(
          "Update failed: " + editresponse.message
        );
      } else {
        this.notif.current.successNotification(
          "Profile has been successfully updated."
        );
        this.core.make("oxzion/profile").update();
      }
    } else {
      this.notif.current.failNotification(
        "Please fill all the mandatory fields."
      );
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["firstname"]) {
      formIsValid = false;
      errors["firstname"] = "*Please enter First Name";
    }

    if (!fields["lastname"]) {
      formIsValid = false;
      errors["lastname"] = "*Please enter Last Name";
    }

    if (!fields["date_of_birth"]) {
      formIsValid = false;
      errors["date_of_birth"] = "*Please enter Date Of Birth";
    }

    if (!fields["gender"]) {
      formIsValid = false;
      errors["gender"] = "*Please select Gender";
    }
    if (!this.state.phoneno) {
      formIsValid = false;
      errors["phoneno"] = "*Please enter Phone Number";
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

  async submitProfilePic(imageData) {
    const formData = {};
    formData["file"] = imageData;
    let helper = this.core.make("oxzion/restClient");
    let uploadresponse = await helper.request(
      "v1",
      "/user/profile",
      formData,
      "post"
    );
    if (uploadresponse.status == "error") {
      this.notif.current.failNotification(
        "Update failed: " + uploadresponse.message
      );
    } else {
      this.setState({
        icon: imageData
      });
      this.core.make("oxzion/profile").update();
      this.notif.current.successNotification(
        "Profile picture updated successfully."
      );
    }
  }

  apply = file => {
    if (file) {
      var src = window.URL.createObjectURL(file);
      image2base64(src)
        .then(response => {
          var base64Data = "data:image/jpeg;base64," + response;
          this.submitProfilePic(base64Data);
        })
        .catch(error => {
          console.log(error);
        });
      this.setState({
        showImageDiv: 1
      });
    }
  };

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageData: imageSrc
    });
  };

  chooseWebCamData = () => {
    if (this.state.showImageDiv == 3) {
      if (this.state.imageData == null) {
        const videoConstraints = {
          width: 150,
          height: 150,
          facingMode: "user"
        };
        return (
          <div className="chooseWebcamDiv">
            <Webcam
              audio={false}
              height={150}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              width={150}
              videoConstraints={videoConstraints}
              className="webCam"
              imageSmoothing={true}
            />
            <div>
              <p className="btn-sm btn-success imgBtn1" onClick={this.capture}>
                Capture
              </p>
              <p
                className="btn-sm btn-danger imgBtn1"
                onClick={() => {
                  this.setState({ showImageDiv: 1 });
                }}
              >
                Cancel
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="chooseWebcamDiv">
            <img src={this.state.imageData} className="webCamImage" />
            <p
              className="btn-sm btn-success imgBtn2"
              onClick={() => {
                this.submitProfilePic(this.state.imageData);
                this.setState({ showImageDiv: 1, imageData: null });
              }}
            >
              Apply
            </p>
            <p
              className="btn-sm btn-danger imgBtn2"
              onClick={() => {
                this.setState({ imageData: null });
              }}
            >
              Retake
            </p>
          </div>
        );
      }
    }
  };

  chooseImageData = () => {
    if (this.state.showImageDiv == 2) {
      return (
        <div className="chooseImageDiv">
          <AvatarImageCropper apply={this.apply} isBack={true} />
          <p
            className="btn-sm btn-danger imgBtn"
            onClick={() => {
              this.setState({ showImageDiv: 1 });
            }}
          >
            Cancel
          </p>
        </div>
      );
    }
  };

  profileImageData = () => {
    let displayImage, middle;
    if (this.state.icon == null || this.state.icon == "") {
      displayImage = {
        opacity: 0.5
      };
      middle = {
        opacity: 1
      };
    }
    if (this.state.showImageDiv == 1) {
      return (
        <div className="profileImageDiv">
          <img
            src={this.state.icon}
            className="rounded-circle displayImage"
            style={displayImage}
          />
          <div className="middle" style={middle}>
            <div className="text">
              <p
                className="btn-sm btn-success imgBtn"
                onClick={() => {
                  this.setState({ showImageDiv: 2 });
                }}
              >
                Choose Image <i className="fa fa-image" />
              </p>
              <p
                className="btn-sm btn-success imgBtn"
                onClick={() => {
                  this.setState({ showImageDiv: 3 });
                }}
              >
                Take Picture <i className="fa fa-camera" />
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="componentDiv">
        <Notification ref={this.notif} />
        <div className="formmargin">
          <div className="row">
            <div className="col-md-6 firstLastNameDiv">
              <div className="col-md-12">
                <label className="firstNameLabel mandatory">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  ref="firstname"
                  id="firstname"
                  pattern={"[A-Za-z ]+"}
                  value={
                    this.state.fields.firstname
                      ? this.state.fields.firstname
                      : ""
                  }
                  onChange={this.handleChange}
                  required
                  className="validate"
                />
                <div className="errorMsg">{this.state.errors["firstname"]}</div>
              </div>
              <div className="col-md-12">
                <label className="firstNameLabel mandatory">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  ref="lastname"
                  id="lastname"
                  pattern={"[A-Za-z ]+"}
                  value={
                    this.state.fields.lastname ? this.state.fields.lastname : ""
                  }
                  onChange={this.handleChange}
                  required
                  className="validate"
                />
                <div className="errorMsg">{this.state.errors["lastname"]}</div>
              </div>
            </div>
            <div className="col-md-6 profileImage">
              {this.profileImageData()}
              {this.chooseImageData()}
              {this.chooseWebCamData()}
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 input-field">
              <label className="mandatory" htmlFor="email">
                Email
              </label>
              <input
                name="email"
                type="text"
                value={this.state.fields.email ? this.state.fields.email : ""}
                ref="email"
                id="email"
                readOnly={true}
              />
            </div>
          </div>

          <div className="row marginstyle">
            <div className="col input-field marginbottom">
              <label className="mandatory" id="rowdob">
                Date of Birth
              </label>
              <div>
                <DatePicker
                  format={this.state.dateformat}
                  name="date_of_birth"
                  id="date_of_birth"
                  ref="date_of_birth"
                  value={
                    this.state.fields.date_of_birth
                      ? this.state.fields.date_of_birth
                      : ""
                  }
                  onChange={this.handleDOBChange}
                  readOnly
                />
              </div>

              <div className="errorMsg">
                {this.state.errors["date_of_birth"]}
              </div>
            </div>

            <div className="col input-field">
              <label id="name" className="active" style={{ fontSize: "16px" }}>
                Gender
              </label>
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
                  <div className="errorMsg">{this.state.errors["gender"]}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mandatory" style={{ fontSize: "17px" }}>
              Contact Number
            </div>
            <div className="row">
              <div className="col-md-5">
                <select
                  className="dropdownstyle"
                  value={this.state.dial_code ? this.state.dial_code : ""}
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
                  value={this.state.phoneno ? this.state.phoneno : ""}
                  onChange={this.onSelect2}
                />
                <div className="errorMsg">{this.state.errors["phoneno"]}</div>
              </div>
            </div>
          </div>
          <label type="hidden" id="joint" ref="phone" name="phone" />

          <div className="row">
            <div className="col-md-12 input-field">
              <label className="mandatory" style={{ fontSize: "17px" }}>
                Address
              </label>
              <div>
                <textarea
                  rows="3"
                  className="textareaField"
                  type="text"
                  ref="address"
                  name="address"
                  value={
                    this.state.fields.address ? this.state.fields.address : ""
                  }
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="errorMsg">{this.state.errors["address"]}</div>
            </div>
          </div>

          <div className="row">
            <label className="country mandatory" style={{ marginTop: "" }}>
              Country
            </label>

            <div className="col-md-12">
              <select
                value={
                  this.state.fields.country ? this.state.fields.country : ""
                }
                onChange={this.handleChange}
                ref="country"
                id="country"
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
                value={
                  this.state.fields.website ? this.state.fields.website : ""
                }
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="row about">
            <div className="col-md-12 input-field">
              <label>About Me</label>
              <div>
                <Editor
                  style={{ height: "20vh", overflow: "auto" }}
                  name="about"
                  tools={[
                    [Bold, Italic, Underline],
                    [Undo, Redo],
                    [Link, Unlink],
                    [AlignLeft, AlignCenter, AlignRight],
                    [OrderedList, UnorderedList, Indent, Outdent]
                  ]}
                  contentStyle={{ height: 320 }}
                  defaultContent={
                    this.state.fields.about ? this.state.fields.about : ""
                  }
                  onExecute={event =>
                    this.handleChangeAboutField(
                      event.target._contentElement.innerHTML
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 input-field interest">
              <label className="mandatory" htmlFor="interest">
                Interest
              </label>

              <input
                id="interest"
                type="text"
                ref="interest"
                required
                className="validate"
                name="interest"
                value={
                  this.state.fields.interest ? this.state.fields.interest : ""
                }
                onChange={this.handleChange}
              />
              <div className="errorMsg">{this.state.errors["interest"]}</div>
            </div>
          </div>
          <div className="row">
            <div className="col s12 input-field">
              <button
                className="k-button k-primary"
                type="button"
                onClick={this.handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfile;
