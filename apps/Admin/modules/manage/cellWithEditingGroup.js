import React from "react";
import {
  GridCell
} from "@progress/kendo-react-grid";
import { FaPencilAlt, FaUserPlus, FaTrashAlt } from "react-icons/fa";

export default function CellWithEditing(edit, remove, addGroupUsers) {
  return class extends GridCell {
    constructor(props) {
      super(props);
      this.core = this.props.args;
    }
    render() {
      return (
        <td>
          <abbr title="Edit Group Details">
            <button className=" k-button k-grid-edit-command"
              onClick={() => {
                edit(this.props.dataItem);
              }}
            >
              <FaPencilAlt className="manageIcons" />
            </button></abbr>
          &nbsp;
                    <abbr title="Add Users to Group">
            <button className="k-button"
              onClick={() => {
                addGroupUsers(this.props.dataItem);
              }}
            >
              <FaUserPlus className="manageIcons" />
            </button></abbr>
          &nbsp;
                    <abbr title="Delete Group">
            <button className="k-button k-grid-remove-command"
              onClick={() => {
                confirm("Confirm deleting: " + this.props.dataItem.name) &&
                  remove(this.props.dataItem);
              }}
            >
              <FaTrashAlt className="manageIcons" />
            </button></abbr>
        </td>
      );
    }
  };
}