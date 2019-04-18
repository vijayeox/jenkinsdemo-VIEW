import React from "react";
import { GridCell } from "@progress/kendo-react-grid";

export default function AdHocAppsDialog(edit,build, remove) {
  return class extends GridCell {
    constructor(props) {
      super(props);
      this.core = this.props.args;
    }
    render() {
      return (
        <td>
          <button
            className="k-primary k-button k-grid-edit-command"
            onClick={() => {
              edit(this.props.dataItem);
            }}
          >
            Edit
          </button>
          <button
            className="k-button k-button k-grid-edit-command"
            onClick={() => {
              edit(this.props.dataItem);
            }}
          >
            Build
          </button>
          &nbsp;
          <button
            className="k-button k-grid-remove-command"
            onClick={() => {
              confirm("Confirm deleting: " + this.props.dataItem.name) &&
                remove(this.props.dataItem);
            }}
          >
            Remove
          </button>
        </td>
      );
    }
  };
}
