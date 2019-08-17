import React from "react";
import AvatarImageCropper from "react-avatar-image-cropper";
import image2base64 from "image-to-base64";
import Webcam from "react-webcam";
import { IconTypeEnum } from "../enums";

class ProfilePictureWidget extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      showImageDiv: 1,
      imageData: null,
      icon: null,
      iconType: true,
      userId: null
    };
  }

  componentWillMount() {
    this.setState({
      icon: this.props.contactDetails.icon,
      iconType:
        this.props.contactDetails.icon_type == IconTypeEnum.default ||
        this.props.contactDetails.icon_type == null
          ? true
          : false,
      userId: this.props.contactDetails.user_id
    });
  }

  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  submitProfilePic = imageData => {
    let profilePicFile = this.dataURLtoFile(imageData, "profilePic.jpeg");
    this.setState({
      icon: imageData,
      iconType: false
    }, () => {
        this.props.handleProfilePic(profilePicFile, this.state.iconType);
    });
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

  submitSelectedProfilePic= (file, imageData) => {
    this.setState({
      icon: imageData,
      iconType: false
    }, () => {
        this.props.handleProfilePic(file, this.state.iconType);
    });
  }

  apply = file => {
    if (file) {
      var newfile = new File([file], "profile.png", {type: file.type, lastModified: Date.now()});
      var base64Data;
      var src = window.URL.createObjectURL(file);
      image2base64(src)
        .then(response => {
          base64Data = "data:image/png;base64," + response;
          this.submitSelectedProfilePic(newfile, base64Data);
        })
        .catch(error => {
          console.log(error);
        });
      this.setState({
        showImageDiv: 1
      });
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

  handleUseDefaultChange = e => {
    this.setState(
      {
        iconType: !this.state.iconType
      },
      () => {
        if (this.state.iconType == true) {
          this.setState(
            {
              icon: this.props.contactDetails.icon
                ? this.props.contactDetails.icon
                : null
            },
            () => {
              this.props.handleProfilePic(this.state.icon, this.state.iconType);
            }
          );
        }
      }
    );
  };

  profileImageData = () => {
    if (this.state.showImageDiv == 1) {
      return (
        <div className="profileImageDiv">
          <img src={this.state.icon} className="rounded-circle displayImage" />
          <div className="middle">
            <div className="text">
              {!this.state.iconType || this.state.userId == null ? (
                <span>
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
                </span>
              ) : null}
              {this.state.userId != null ? (
                <p className="useDefault">
                  Use Oxzion{" "}
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={this.state.iconType}
                    onChange={this.handleUseDefaultChange}
                  />
                </p>
              ) : null}
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    return (
      <span>
        {this.profileImageData()}
        {this.chooseImageData()}
        {this.chooseWebCamData()}
      </span>
    );
  }
}

export default ProfilePictureWidget;
