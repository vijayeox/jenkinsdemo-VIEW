import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@progress/kendo-react-buttons";

export class TitleBar extends React.Component {
    render() {
        return (
            <div style={{ paddingTop: "12px", marginLeft:"0px" }} className="row">
                <div style={{ marginLeft: "16px", position:"absolute", zIndex:"100" }}>
                    <Button
                        className="goBack"
                        primary={true}
                        style={{ width: "45px", height: "45px" }}
                    >
                        <FaArrowLeft/>
                    </Button>
                </div>
                <div className="col text-center" id="pageTitle">
                    {this.props.title}
                </div>
            </div>)
    }
}