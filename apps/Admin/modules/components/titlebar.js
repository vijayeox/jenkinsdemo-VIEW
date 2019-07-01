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
              top: "1.5%",
              position: "absolute",
              zIndex: "100",
              width: "200px"
            }}
          >
            <label
              style={{
                marginBottom: "3px"
              }}
            >
              Switch Organization
            </label>
            <DropDown
              args={this.props.args}
              mainList={"organization"}
              placeholder="Switch Organization"
              // selectedItem={this.state.groupInEdit.org_id}
              onDataChange={e => console.log(e.target)}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
