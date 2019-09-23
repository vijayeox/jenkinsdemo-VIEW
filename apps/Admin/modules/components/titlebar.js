import React from "react";
import { DropDown } from "./index.js";
import { Button } from "@progress/kendo-react-buttons";

export class TitleBar extends React.Component {
  render() {
    return (
      <div style={{ paddingTop: "12px", marginLeft: "0px" }}>
        <div
          style={{ marginLeft: "15px", position: "absolute", zIndex: "101" }}
        >
          <Button
            onClick={this.props.menu}
            primary={true}
            style={{ width: "45px", height: "45px" }}
          >
            <i className="fas fa-bars"></i>
          </Button>
        </div>
        <div className="col text-center" id="pageTitle">
          {this.props.title}
        </div>
        {this.props.orgSwitch ? (
          <div
            style={{
              right: "15px",
              top: "15px",
              position: "absolute",
              zIndex: "100",
              width: "200px"
            }}
          >
            <DropDown
              args={this.props.args}
              mainList={"organization"}
              selectedItem={{
                id: "111",
                name: "Switch Organization"
              }}
              preFetch={true}
              onDataChange={this.props.orgChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
