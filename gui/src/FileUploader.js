import React from "react";
import FileUploadWithPreview from "file-upload-with-preview";

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.firstUpload = new FileUploadWithPreview(this.props.uploadID);
  }

  render() {
    return (
      
        <div className="form-group border-box">
        <label>{this.props.title}</label>
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
                alignItems:"center"
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
                <p className="lead">
                  Clear Selected Image
                  <a
                    href="javascript:void(0)"
                    className="pl-5 custom-file-container__image-clear"
                    title="Clear Image"
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
