import React from "react";
export class SaveCancel extends React.Component {
  render() {
    return (
      <div className="row pt-2 saveCancelArea">
        <div className="col-12 text-center">
          <button
            type="submit"
            className="btn btn-success col-sm-2 mr-3"
            form={this.props.form}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-danger col-sm-2 ml-3"
            onClick={this.props.cancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}