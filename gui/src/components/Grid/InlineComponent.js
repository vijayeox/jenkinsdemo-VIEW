import React from "react";
import { GridCell } from "@progress/kendo-react-grid";

export default function InlineComponent(inlineActions, edit, cancel) {
  return class extends GridCell {
    render() {
      const { dataItem } = this.props;
      const inEdit = dataItem["inEdit"] ? dataItem["inEdit"] : false;
      if (dataItem.aggregates) {
        return inlineActions.addButton
          ? inlineActions.addButton(dataItem)
          : null;
      } else {
        if(inlineActions){
          return inEdit ? (
            <div className="gridActions">
              <td className="k-command-cell">
                <button
                  className="k-button k-grid-save-command"
                  style={{ backgroundColor: "#009900" }}
                  onClick={() => inlineActions.update(dataItem)}
                >
                  <i
                    className="fa fa-check"
                    style={{ fontSize: "15px", color: "#FFFFFF" }}
                  ></i>
                </button>
                <button
                  className="k-button k-grid-cancel-command"
                  style={{ backgroundColor: "rgb(361, 61, 69)" }}
                  onClick={() => cancel(dataItem)}
                >
                  <i
                    className="fa fa-times"
                    style={{ fontSize: "15px", color: "#FFFFFF" }}
                  ></i>
                </button>
              </td>
            </div>
          ) : (
            <div className="gridActions">
              <td className="k-command-cell">
                {inlineActions.update ? (
                  <button
                    className="btn manage-btn k-button k-primary"
                    onClick={() => edit(dataItem)}
                  >
                    <i className="fa fa-pencil manageIcons"></i>
                  </button>
                ) : null}
                {inlineActions.remove ? (
                  <button
                    className="btn manage-btn k-button k-primary"
                    onClick={() => inlineActions.remove(dataItem)}
                  >
                    <i
                      className="fa fa-trash"
                      style={{ fontSize: "15px", color: "#FFFFFF" }}
                    ></i>
                  </button>
                ) : null}
              </td>
            </div>
          );
        } else {
          return null;
        }
      }
    }
  };
}
