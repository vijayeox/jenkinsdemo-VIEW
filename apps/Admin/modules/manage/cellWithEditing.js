import React from "react";
import { GridCell } from "@progress/kendo-react-grid";
import { FaPencilAlt, FaUserPlus, FaTrashAlt } from "react-icons/fa";


export default function CellWithEditing(edit, remove, perm) {
  return class extends GridCell {
    constructor(props) {
      super(props);
      this.core = this.props.args;
    }
     deleteButton() {
            if (perm == 15) {
                return (
                    <abbr title="Delete">
                        <button className="k-button k-grid-remove-command"
                            onClick={() => {
                                confirm("Confirm deleting: " + this.props.dataItem.name) &&
                                    remove(this.props.dataItem);
                            }}
                        >
                            <FaTrashAlt className="manageIcons" />
                        </button></abbr>)
            }
        }
        render() {
            return (
                <td>
                    <center>
                        <abbr title="Edit">
                            <button className=" k-button k-grid-edit-command"
                                onClick={() => {
                                    edit(this.props.dataItem);
                                }}
                            >
                                <FaPencilAlt className="manageIcons" />
                            </button>
                        </abbr>
                        &nbsp; &nbsp;
                    {this.deleteButton()}
                    </center>
                </td>
            )
        }
  };
}
