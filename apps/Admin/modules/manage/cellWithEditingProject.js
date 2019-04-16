import React from "react";
import {
    GridCell
} from "@progress/kendo-react-grid";
import { FaPencilAlt, FaUserPlus, FaTrashAlt } from "react-icons/fa";

export default function CellWithEditing(edit, remove, addProjectUsers) {
    return class extends GridCell {
        constructor(props) {
            super(props);
            this.core = this.props.args;
        }
        render() {
            return (
                <td>
                    <abbr title="Edit Project Details">
                        <button className=" k-button k-grid-edit-command"
                            onClick={() => {
                                edit(this.props.dataItem);
                            }}
                        >
                            <FaPencilAlt className="manageIcons" />
                        </button></abbr>
                    &nbsp;
                    <abbr title="Add Users to Project">
                        <button className="k-button"
                            onClick={() => {
                                addProjectUsers(this.props.dataItem);
                            }}
                        >
                            <FaUserPlus className="manageIcons" />
                        </button></abbr>
                    &nbsp;
                    <abbr title="Delete Project">
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