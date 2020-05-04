import React from "react";
import { Upload } from "@progress/kendo-react-upload";
import Notification  from "./Notification";

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      media_type: this.props.media_type || "image",
      render_media_type: this.props.media_type || "image",
      selectedFile: [],
      filePreviews: undefined,
      filePreviewSourceURL: []
    };
    this.notif = React.createRef();
    this.fileSelectedEvent = this.fileSelectedEvent.bind(this);
  }

  componentDidMount() {
    if (this.props.media_URL) {
      this.setState({
        filePreviewSourceURL: this.props.media_URL
      });
    } else {
      this.setState({
        filePreviewSourceURL: "https://i.ibb.co/Z1Y3tBY/download.png"
      });
    }
  }

  fileSelectedEvent = e => {
    if (e.affectedFiles[0].validationErrors) {
      this.notif.current.notify(
        "Invalid File",
        "Please check the selected file",
        "warning"
      )
    } else {
      e.affectedFiles
        .filter(file => !file.validationErrors)
        .forEach(file => {
          const reader = new FileReader();
          reader.onloadend = ev => {
            this.setState({
              filePreviews: {
                [file.uid]: ev.target.result
              }
            });
          };

          reader.readAsDataURL(file.getRawFile());
        });

      this.setState({
        selectedFile: e.affectedFiles
      });
      var fileType = e.affectedFiles[0].extension.includes("mp4")
        ? "video"
        : "image";
      this.props.media_typeChange
        ? this.props.media_typeChange(fileType)
        : null;
    }
  };

  clearImage = () => {
    this.setState({
      selectedFile: [],
      filePreviews: undefined
    });
  };

  render() {
    return (
      <div className="form-group border-box fileUploaderComponent">
        <Notification ref={this.notif} />
        <label className={this.props.required ? "required-label" : ""}>
          {this.props.title}
        </label>
        <div className="form-row">
          <div className="col-6">
            {this.state.filePreviews ? (
              <div className={"img-preview"}>
                {Object.keys(this.state.filePreviews).map(fileKey =>
                  this.state.filePreviews[fileKey].includes("video") ? (
                    <video
                      src={this.state.filePreviews[fileKey]}
                      alt={"image preview"}
                      key={fileKey}
                      controls
                      id="video"
                      autoPlay={true}
                      muted={true}
                    />
                  ) : (
                    <img
                      src={this.state.filePreviews[fileKey]}
                      alt={"image preview"}
                      key={fileKey}
                    />
                  )
                )}
              </div>
            ) : (
              <div className={"img-preview static-url"}>
                {this.state.render_media_type == "image" ? (
                  <img
                    src={this.state.filePreviewSourceURL +"?" + new Date()}
                  />
                ) : (
                  <video
                    src={this.state.filePreviewSourceURL +"?" + new Date()}
                    alt={"image preview"}
                    controls
                    id="video"
                    autoPlay={true}
                    muted={true}
                  />
                )}
              </div>
            )}
          </div>
          <div
            className="col-6"
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
                alignItems: "center",
                width: "inherit"
              }}
            >
              <Upload
                accept={
                  this.props.acceptFileTypes
                    ? this.props.acceptFileTypes
                    : undefined
                }
                restrictions={{
                  allowedExtensions: this.props.enableVideo
                    ? [".jpg", ".jpeg", ".png", "gif", ".mp4"]
                    : [".jpg", ".jpeg", ".png", "gif"],
                  maxFileSize: 8088608
                }}
                defaultFiles={[]}
                onAdd={this.fileSelectedEvent}
                onRemove={this.clearImage}
                multiple={false}
                autoUpload={false}
              />
              <ul>
                <li className="pt-3 pr-4">Image Formats supported: JPG, PNG, GIF</li>
                {this.props.enableVideo ? (
                  <li className="pt-3 pr-4">Video Format supported: MP4</li>
                ) : null}
                <li className="pt-3 pr-4">
                  Max file size allowed less than: 8 MB
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FileUploader;
