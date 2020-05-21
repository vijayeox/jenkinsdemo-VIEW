import {
  React,
  ReactDOM,
  Notification,
  CountryCodes,
  AvatarImageCropper,
  ReactBootstrap,
  Webcam,
  KendoReactDateInputs,
  KendoReactEditor,
  PhoneInput,
  DropDown,
  countryStateList
} from "oxziongui";
import Moment from "moment";
import Countries from "../public/js/countries";
import states from "../public/js/states";
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
} = KendoReactEditor.EditorTools;

class EditProfile extends React.Component {
  constructor(props) {
    super(props);

    this.core = this.props.args;
    this.userprofile = this.core.make("oxzion/profile").get();
    let countryList = countryStateList.map((item) => item.country);
    console.log(this.userprofile);
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

    this.state = {
      errors: {},
      dateformat: this.userprofile.key.preferences["dateformat"],
      fields: this.userprofile.key,
      showImageDiv: 1,
      imageData: null,
      icon: this.userprofile.key.icon + "?" + new Date(),
      countryList: countryList,
      selectedCountryID: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.notif = React.createRef();
    this.submitProfilePic = this.submitProfilePic.bind(this);

    CountryCodes.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );
  }

  componentWillMount() {
    this.state.dateformat = this.state.dateformat.replace(/m/g, "M");
    if (Moment(this.state.fields.date_of_birth, "YYYY-MM-DD", true).isValid()) {
      const Dateiso = new Moment(
        this.state.fields.date_of_birth,
        "YYYY-MM-DD"
      ).format();
      const Datekendo = new Date(Dateiso);
      let fields = this.state.fields;
      fields["date_of_birth"] = Datekendo;

      this.setState({
        fields
      });
    }
    if (
      this.state.fields.country == "" ||
      this.state.fields.country == undefined ||
      this.state.fields.country == null
    ) {
      let fields = this.state.fields;
      // fields["country"] = "United States of America";
      this.setState({
        fields
      });
    } else {
      //setting state dropdown
      Countries.map((country, key) => {
        let countryname = country.name;
        let countryid = "";
        if (this.state.fields.country === countryname) {
          countryid = "" + country.id;
          this.setState({ selectedCountryID: countryid });
        }
      });
    }
  }

  handleDOBChange = (event) => {
    let fields = this.state.fields;
    fields.date_of_birth = event.target.value;
    this.setState({ fields: fields });
  };

  handleChange = (e) => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
    if (e.target.name === "country") {
      const selectedIndex = e.target.options.selectedIndex;
      const countryid = e.target.options[selectedIndex].getAttribute(
        "data-countryid"
      );
      this.setState({ selectedCountryID: countryid });
    }
  };

  handlePhoneChange = (phone) => {
    let fields = this.state.fields;
    fields["phone"] = phone;
    this.setState({
      fields
    });
  };

  handleChangeAboutField = (value) => {
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

      let date_of_birth = new Moment(this.state.fields.date_of_birth).format(
        "YYYY-MM-DD"
      );

      Object.keys(this.state.fields).map((key) => {
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

      let helper = this.core.make("oxzion/restClient");

      let editresponse = await helper.request(
        "v1",
        "/user/me/save",
        JSON.stringify(formData),
        "post"
      );
      if (editresponse.status == "error") {
        this.notif.current.notify(
          "Error",
          "Update failed: " + editresponse.message,
          "danger"
        );
      } else {
        this.notif.current.notify(
          "Success",
          "Profile has been successfully updated.",
          "success"
        );
        this.core.make("oxzion/profile").update();
      }
    } else {
      this.notif.current.notify(
        "Error",
        "Please fill all the mandatory fields. ",
        "danger"
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
    if (!fields["phone"]) {
      formIsValid = false;
      errors["phone"] = "*Please enter Phone Number";
    }

    if (!fields["address1"]) {
      formIsValid = false;
      errors["address1"] = "*Please enter your address";
    }

    if (!fields["state"]) {
      formIsValid = false;
      errors["state"] = "*Please select your state";
    }

    if (!fields["interest"]) {
      formIsValid = false;
      errors["interest"] = "*Please enter your interest";
    }
    if (!fields["country"]) {
      formIsValid = false;
      errors["country"] = "*Please select your country";
    }

    if (!fields["city"]) {
      formIsValid = false;
      errors["city"] = "*Please enter your city";
    }
    if (!fields["zip"]) {
      formIsValid = false;
      errors["zip"] = "*Please enter your zip";
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
      this.notif.current.notify(
        "Error",
        "Update failed: " + uploadresponse.message,
        "danger"
      );
    } else {
      this.setState({
        icon: imageData
      });
      this.core.make("oxzion/profile").update();
      this.notif.current.notify(
        "Success",
        "Profile picture updated successfully.",
        "success"
      );
    }
  }

    apply = (file) => {
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (reader) => {
        var base64Data = reader.target.result;
        this.submitProfilePic(base64Data);
        this.setState({
          showImageDiv: 1
        });
      };
    }
  };

  setRef = (webcam) => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageData: imageSrc
    });
  };

    prepareStateData = () => {
    if (this.state.fields.country) {
      let obj = countryStateList.find(
        (o) => o.country === this.state.fields.country
      );
      if (obj) {
        return obj.states;
      }
    } else {
      return [];
    }
    return [];
  };
    valueChange = (field, event) => {
    if (field == "country") {
      let fields = { ...this.state.fields };
      fields[field] = event.target.value;
      fields["state"] = "";
      this.setState({ fields: fields });
    } else {
      let fields = { ...this.state.fields };
      fields[field] = event.target.value;
      this.setState({ fields: fields });
    }
  };

  chooseWebCamData = () => {
    if (this.state.showImageDiv == 3) {
      if (this.state.imageData == null) {
        const videoConstraints = {
          width: 200,
          height: 200,
          facingMode: "user"
        };
        return (
          <div className="chooseWebcamDiv">
            <Webcam
              audio={false}
              height={200}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              width={200}
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
          <div className="displayImage">
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
        </div>
      );
    }
  };

  render() {
    return (
      <div className="prefrencesMainDiv">
        {this.profileImageData()}
        {this.chooseImageData()}
        {this.chooseWebCamData()}
        <ReactBootstrap.Form className="edit-profile-form preferenceForm">
          <div className="componentDiv">
            <Notification ref={this.notif} />
            <div className="formmargin">
              <ReactBootstrap.Row>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label className="mandatory">
                      First Name
                    </ReactBootstrap.Form.Label>
                    <ReactBootstrap.Form.Control
                      type="text"
                      placeholder="First Name"
                      name="firstname"
                      value={
                        this.state.fields.firstname
                          ? this.state.fields.firstname
                          : ""
                      }
                      onChange={this.handleChange}
                      required
                    />
                    <ReactBootstrap.Form.Text className="text-muted errorMsg">
                      {this.state.errors["firstname"]}
                    </ReactBootstrap.Form.Text>
                  </ReactBootstrap.Form.Group>
                </div>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label className="mandatory">
                      Last Name
                    </ReactBootstrap.Form.Label>
                    <ReactBootstrap.Form.Control
                      type="text"
                      placeholder="Last Name"
                      name="lastname"
                      value={
                        this.state.fields.lastname
                          ? this.state.fields.lastname
                          : ""
                      }
                      onChange={this.handleChange}
                      required
                    />
                  </ReactBootstrap.Form.Group>
                  <ReactBootstrap.Form.Text className="text-muted errorMsg">
                    {this.state.errors["lastname"]}
                  </ReactBootstrap.Form.Text>
                </div>
              </ReactBootstrap.Row>
              <ReactBootstrap.Form.Group>
                <ReactBootstrap.Form.Label className="mandatory">
                  Email
                </ReactBootstrap.Form.Label>
                <ReactBootstrap.Form.Control
                  type="email"
                  placeholder="Email"
                  name="Email"
                  disabled
                  value={this.state.fields.email ? this.state.fields.email : ""}
                  onChange={this.handleChange}
                />
              </ReactBootstrap.Form.Group>
              <ReactBootstrap.Row>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label className="mandatory">
                      Gender
                    </ReactBootstrap.Form.Label>
                    <ReactBootstrap.Row>
                      <br />
                    </ReactBootstrap.Row>
                    <ReactBootstrap.Row>
                      <div className="col-md-6">
                        <ReactBootstrap.Form.Check
                          type="radio"
                          name="gender"
                          label="Male"
                          value="Male"
                          onChange={this.handleChange}
                          checked={this.state.fields.gender == "Male"}
                          className="validate"
                        />
                      </div>
                      <div className="col-md-6">
                        <ReactBootstrap.Form.Check
                          type="radio"
                          name="gender"
                          label="Female"
                          value="Female"
                          onChange={this.handleChange}
                          checked={this.state.fields.gender == "Female"}
                          className="validate"
                        />
                      </div>
                    </ReactBootstrap.Row>
                    <ReactBootstrap.Form.Text className="text-muted errorMsg">
                      {this.state.errors["gender"]}
                    </ReactBootstrap.Form.Text>
                  </ReactBootstrap.Form.Group>
                </div>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label
                      className="mandatory"
                      id="rowdob"
                    >
                      Date of Birth
                    </ReactBootstrap.Form.Label>
                    <KendoReactDateInputs.DatePicker
                      format={this.state.dateformat}
                      name="date_of_birth"
                      value={
                        this.state.fields.date_of_birth
                          ? this.state.fields.date_of_birth
                          : ""
                      }
                      onChange={this.handleDOBChange}
                      readOnly
                    />
                    <ReactBootstrap.Form.Text className="text-muted errorMsg">
                      {this.state.errors["date_of_birth"]}
                    </ReactBootstrap.Form.Text>
                  </ReactBootstrap.Form.Group>
                </div>
              </ReactBootstrap.Row>
              <ReactBootstrap.Row>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label className="mandatory">
                      Address 1
                    </ReactBootstrap.Form.Label>
                    <ReactBootstrap.Form.Control
                      type="text"
                      name="address1"
                      value={
                        this.state.fields.address1
                          ? this.state.fields.address1
                          : ""
                      }
                      onChange={this.handleChange}
                      required
                    />
                    <ReactBootstrap.Form.Text className="text-muted errorMsg">
                      {this.state.errors["address1"]}
                    </ReactBootstrap.Form.Text>
                  </ReactBootstrap.Form.Group>
                </div>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label>
                      Address 2
                    </ReactBootstrap.Form.Label>
                    <ReactBootstrap.Form.Control
                      type="text"
                      name="address2"
                      value={
                        this.state.fields.address2
                          ? this.state.fields.address2
                          : ""
                      }
                      onChange={this.handleChange}
                      required
                    />
                  </ReactBootstrap.Form.Group>
                </div>
              </ReactBootstrap.Row>
              <div className="form-group">
              <div className="form-row">
                <div className="col-sm-6">
                  <label className="required-label">Country</label>
                  <div>
                    <DropDown
                      args={this.core}
                      rawData={this.state.countryList}
                      selectedItem={this.state.fields.country ? this.state.fields.country : ""}
                      preFetch={true}
                      onDataChange={(e) => this.valueChange("country", e)}
                      required={true}
                      validationMessage={
                        "Please select a country from the list."
                      }
                      disableItem={this.props.diableField}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <label className="required-label">State</label>
                  <div>
                    <DropDown
                      args={this.core}
                      rawData={this.prepareStateData()}
                      selectedItem={this.state.fields.state ? this.state.fields.state : ""}
                      preFetch={true}
                      onDataChange={(e) => this.valueChange("state", e)}
                      required={true}
                      validationMessage={"Please select a state from the list."}
                      disableItem={this.props.diableField}
                    />
                  </div>
                </div>
              </div>
            </div>
              <ReactBootstrap.Row>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label className="mandatory">
                      City
                    </ReactBootstrap.Form.Label>
                    <ReactBootstrap.Form.Control
                      type="text"
                      name="city"
                      value={
                        this.state.fields.city ? this.state.fields.city : ""
                      }
                      onChange={this.handleChange}
                    />
                    <ReactBootstrap.Form.Text className="text-muted errorMsg">
                      {this.state.errors["city"]}
                    </ReactBootstrap.Form.Text>
                  </ReactBootstrap.Form.Group>
                </div>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label className="mandatory">
                      Postal Code
                    </ReactBootstrap.Form.Label>
                    <ReactBootstrap.Form.Control
                      type="text"
                      name="zip"
                      value={
                        this.state.fields.zip ? this.state.fields.zip : null
                      }
                      onChange={this.handleChange}
                    />
                    <ReactBootstrap.Form.Text className="text-muted errorMsg">
                      {this.state.errors["zip"]}
                    </ReactBootstrap.Form.Text>
                  </ReactBootstrap.Form.Group>
                </div>
              </ReactBootstrap.Row>

              <ReactBootstrap.Row>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label className="mandatory">
                      Contact Number
                    </ReactBootstrap.Form.Label>
                    <PhoneInput
                      international={false}
                      country="US"
                      name="phone"
                      placeholder="Enter phone number"
                      maxLength="15"
                      countryOptions={["US", "IN", "CA", "|", "..."]}
                      value={
                        this.state.fields.phone ? this.state.fields.phone : ""
                      }
                      onChange={(phone) => this.handlePhoneChange(phone)}
                    />
                    <ReactBootstrap.Form.Text className="text-muted errorMsg">
                      {this.state.errors["phone"]}
                    </ReactBootstrap.Form.Text>
                  </ReactBootstrap.Form.Group>
                </div>
                <div className="col-md-6">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label>
                      Website
                    </ReactBootstrap.Form.Label>
                    <ReactBootstrap.Form.Control
                      type="text"
                      name="website"
                      value={
                        this.state.fields.website
                          ? this.state.fields.website
                          : ""
                      }
                      onChange={this.handleChange}
                    />
                  </ReactBootstrap.Form.Group>
                </div>
              </ReactBootstrap.Row>

              <ReactBootstrap.Row>
                <div className="col-md-12">
                  <ReactBootstrap.Form.Group>
                    <ReactBootstrap.Form.Label className="mandatory">
                      Interest
                    </ReactBootstrap.Form.Label>
                    <ReactBootstrap.Form.Control
                      type="text"
                      name="interest"
                      value={
                        this.state.fields.interest
                          ? this.state.fields.interest
                          : ""
                      }
                      onChange={this.handleChange}
                    />
                    <ReactBootstrap.Form.Text className="text-muted errorMsg">
                      {this.state.errors["interest"]}
                    </ReactBootstrap.Form.Text>
                  </ReactBootstrap.Form.Group>
                </div>
              </ReactBootstrap.Row>
              <ReactBootstrap.Form.Group>
                <ReactBootstrap.Form.Label>About Me</ReactBootstrap.Form.Label>
                <KendoReactEditor.Editor
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
                  onExecute={(event) =>
                    this.handleChangeAboutField(
                      event.target._contentElement.innerHTML
                    )
                  }
                />
              </ReactBootstrap.Form.Group>
              <ReactBootstrap.Button
                type="button"
                className="pull-right preferenceForm-btn"
                onClick={this.handleSubmit}
              >
                Save
              </ReactBootstrap.Button>
            </div>
          </div>
        </ReactBootstrap.Form>
      </div>
    );
  }
}

export default EditProfile;