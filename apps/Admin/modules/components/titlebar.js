import React from "react";
import { FaBars } from "react-icons/fa";
import { DropDown } from "./index.js";
import { Button } from "@progress/kendo-react-buttons";

export class TitleBar extends React.Component {
  render() {
    return (
      <div style={{ paddingTop: "12px", marginLeft: "0px" }} className="row">
        <div
          style={{ marginLeft: "16px", position: "absolute", zIndex: "101" }}
        >
          <Button
            onClick={this.props.menu}
            primary={true}
            style={{ width: "45px", height: "45px" }}
          >
            <FaBars />
          </Button>
        </div>
        <div className="col text-center" id="pageTitle">
          {this.props.title}
        </div>
        {this.props.orgSwitch ? (
          <div
            style={{
              right: "2%",
              top: "3%",
              position: "absolute",
              zIndex: "100",
              width: "200px"
            }}
          >
            {/* <DropDown
              args={this.props.args}
              mainList={"organization"}
              selectedItem={{
                id: "111",
                name: "Switch Organization"
              }}
              onDataChange={this.props.orgChange}
            /> */}
            {/* Fix this tommorow */}
          </div>
        ) : null}
      </div>
    );
  }
}
