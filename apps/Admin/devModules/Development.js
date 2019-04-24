import React from "react";
import ReactDOM from "react-dom";
import { Button } from '@progress/kendo-react-buttons';
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";

import App from "./baseGrid"
import "jquery/dist/jquery.js";
import $ from "jquery";

export default class DialogContainer extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.state = {
        };
        this.empty = this.empty.bind(this);
    }

    componentDidMount() {
        document.getElementById('componentsBox1')
        $(document).ready(function () {
            $("#componentsBox1").hide();
            $(".DashBG1").show();

            $(document).on("click", ".moduleBtn", function () {
                $(".DashBG1").hide(),
                    $("#componentsBox1").show();
            });

            $(document).on("click", ".goBack1", function () {
                $("#componentsBox1").hide(), $(".DashBG1").show();
                ReactDOM.render(<div></div>, document.getElementById('componentsBox1'));
            });
        });
    }

    async getOrganizationData() {
        let helper = this.core.make("oxzion/restClient");
        let OrgData = await helper.request("v1", "/organization", {}, "get");
        return OrgData;
    }

    empty = (e) => {
        if (e == "organization") {
            var column = ["id", "name", "state", "zip"]
        } else if(e=="user"){
            var column = ["id", "name", "designation", "country"]
        }
        ReactDOM.render(<App args={this.core} type={e}
            config={{ "title": e, "column": column }} />,
            document.getElementById('componentsBox1'));
    }

    render() {
        return (
            <div style={{
                backgroundImage: "url(apps/Admin/wait.jpg)",
                backgroundSize: "cover"
            }}>
                <div
                    className="DashBG1"
                >
                    <div className="row">
                        <div style={{ paddingTop: '12px' }} className="row">
                            <div className="col s3">
                                <Button className="goBack" primary={true} style={{ width: '45px', height: '45px' }}>
                                    <FaArrowLeft />
                                </Button>
                            </div>
                            <center>
                                <div className="col s6" id="pageTitle">
                                    Work In Progress
                          </div>

                            </center>
                        </div>
                        <center>
                            <div style={{ display: "inline-grid" }}>
                                <Button className="moduleBtn" onClick={() => this.empty("organization")}>Organization</Button>
                                <Button className="moduleBtn" onClick={() => this.empty("user")}>User</Button>
                            </div>
                        </center>
                    </div>
                </div>
                <div id="componentsBox1" style={{ paddingBottom: '100px', height: "37em" }}>
                </div>
            </div >




        )
    }
}