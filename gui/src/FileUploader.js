import React from "react";
import FileUploadWithPreview from "file-upload-with-preview";
import "file-upload-with-preview/dist/file-upload-with-preview.min.css";

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.clearImage = this.clearImage.bind(this);
  }

  componentDidMount() {
    if (this.props.media == undefined) {
      this.firstUpload = new FileUploadWithPreview(this.props.uploadID);
    } else {
      if (this.props.uploadID == "organizationLogo") {
        this.firstUpload = new FileUploadWithPreview(this.props.uploadID, {
          images: {
            baseImage: this.props.media
          }
        });
      } else {
        this.firstUpload = new FileUploadWithPreview(this.props.uploadID, {
          images: {
            baseImage: this.props.url + "resource/" + this.props.media
          }
        });
      }
    }
  }

  clearImage = () => {
    this.firstUpload = new FileUploadWithPreview(this.props.uploadID, {
      images: {
        baseImage: "https://i.ibb.co/Z1Y3tBY/download.png"
      }
    });
  };

  render() {
    return (
      <div className="form-group border-box">
        <label className={this.props.required ? "required-label" : ""}>
          {this.props.title}
        </label>
        <div
          className="form-row custom-file-container"
          data-upload-id={this.props.uploadID}
        >
          <div className="col">
            <div className="custom-file-container__image-preview" />
          </div>
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
                  accept="image/*"
                  aria-label="Choose File"
                />
                <span className="custom-file-container__custom-file__custom-file-control" />
              </label>
              <label className="pt-4">
                <p className="lead" onClick={this.clearImage}>
                  Clear Selected Image
                  <a
                    href="javascript:void(0)"
                    className="pl-5 custom-file-container__image-clear"
                    title="Clear Image"
                    style={{ outline: "none" }}
                  >
                    <img
                      style={{ width: "50px" }}
                      src="https://img.icons8.com/color/64/000000/cancel.png"
                    />
                  </a>
                </p>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FileUploader;
