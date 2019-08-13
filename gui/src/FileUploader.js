import React from "react";
import FileUploadWithPreview from "file-upload-with-preview";
import "file-upload-with-preview/dist/file-upload-with-preview.min.css";
import { Notification } from "../index";

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      media_type: this.props.media_type || "image",
      render_media_type: this.props.media_type || "image",
      selectedFile: []
    };
    this.notif = React.createRef();
    this.clearImage = this.clearImage.bind(this);

    this.fileSelectedEvent = this.fileSelectedEvent.bind(this);
    window.addEventListener(
      "fileUploadWithPreview:imagesAdded",
      e => {
        this.fileSelectedEvent(e);
      },
      false
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.media_type !== prevProps.media_type) {
      this.setState({
        media_type: this.props.media_type
      });
    }
  }

  componentDidMount() {
    if (this.props.media_URL == undefined) {
      this.firstUpload = new FileUploadWithPreview(this.props.uploadID);
    } else {
      this.firstUpload = new FileUploadWithPreview(this.props.uploadID, {
        images: {
          baseImage: this.props.media_URL + "?" + new Date()
        }
      });
    }
  }

  fileSelectedEvent = e => {
    let that = this;

    if (!e.detail.cachedFileArray[0].type.includes(that.props.media_type)) {
      that.notif.current.customWarningNotification(
        "Invalid File",
        "Please choose a " +
          that.props.media_type +
          " file or change the media type."
      );
      setTimeout(function() {
        that.clearImage();
      }, 100);
    } else {
      that.setState({
        selectedFile: e.detail.cachedFileArray
      });
      // if (e.detail.cachedFileArray[0].type.includes("video")) {
      //   that.setState({
      //     render_media_type: "video"
      //   });
      // } else {
      //   that.setState({
      //     render_media_type: "image"
      //   });
      // }
    }
  };

  clearImage = () => {
    this.firstUpload.clearPreviewPanel();
    this.firstUpload = new FileUploadWithPreview(this.props.uploadID, {
      images: {
        baseImage: "https://i.ibb.co/Z1Y3tBY/download.png"
      }
    });
    this.setState({
      selectedFile: []
    });
  };

  render() {
    return (
      <div className="form-group border-box">
        <Notification ref={this.notif} />
        <label className={this.props.required ? "required-label" : ""}>
          {this.props.title}
        </label>
        <div
          className="form-row custom-file-container"
          data-upload-id={this.props.uploadID}
        >
          <div
            className="col"
            style={{
              display:
                this.state.render_media_type == "image" ||
                this.state.render_media_type == undefined
                  ? null
                  : "none"
            }}
          >
            <div className="custom-file-container__image-preview" />
          </div>
          {(this.state.selectedFile[0] || this.props.media_URL) &&
          this.state.render_media_type == "video" ? (
            <div className="col custom-file-container__image-preview">
              <video
                controls
                id="video"
                autoPlay={true}
                muted={true}
                src={
                  this.state.selectedFile[0]
                    ? URL.createObjectURL(this.state.selectedFile[0])
                    : this.props.media_URL
                }
                style={{
                  height: "inherit",
                  maxWidth: "inherit",
                  display: "flex",
                  margin: "auto"
                }}
              />
            </div>
          ) : null}
          <div
            className="col"
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <label className="custom-file-container__custom-file">
                <input
                  type="file"
                  className="custom-file-container__custom-file__custom-file-input"
                  id="customFile"
                  accept={this.state.media_type + "/*"}
                  aria-label="Choose File"
                />
                <span className="custom-file-container__custom-file__custom-file-control" />
              </label>
              <ul>
                {this.state.media_type == "video" ? (
                  <li className="pt-3 pr-4">Video Format supported: MP4</li>
                ) : null}

                <li className="pt-3 pr-4">Max file size allowed: 20 MB</li>
              </ul>
              <label className="pt-3">
                <div
                  className="lead"
                  onClick={this.clearImage}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "auto"
                  }}
                >
                  {this.state.media_type == "image" ? (
                    <div className="fileClearText">Clear Selected Image</div>
                  ) : (
                    <div className="fileClearText">Clear Selected Video</div>
                  )}
                  <a
                    href="javascript:void(0)"
                    className="pl-4 custom-file-container__image-clear"
                    title="Clear Image"
                    style={{ outline: "none" }}
                  >
                    <img
                      style={{ width: "50px" }}
                      src="https://img.icons8.com/color/64/000000/cancel.png"
                      onClick={() => {
                        this.setState({
                          selectedFile: []
                        });
                      }}
                    />
                  </a>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FileUploader;
