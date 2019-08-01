import React from "react";
import ReactDOM from "react-dom";
import Activity from "./activity.js";
// import MultileSelect from "./multileselect.js";
import ConsultantInfo from "./consultantinfo.js";
import ScheduleInterview from "./scheduleInterview.js";
import Sourcing from "./sourcing.js";
import GridTemplate from "./GridTemplate.js";
import candidateList from "./data/candidateList.json";
import RequestInfo from "./requestInfo.js";
import CandidateInfoReadonly from "./candidatesReadonly.js";
import ConsultantInfoReadonly from "./consultantInfoReadonly.js";

class CandidateList extends React.Component {
    
    constructor(props) {
        super(props);
        this.config = this.props.args;
        this.core = this.props.config;
        this.state = {
            showForm: false,
            showForms:true
        }
        // this.renderForm = this.renderForm.bind(this);
    }
    
    edit = dataItem => {
        this.setState({ showForm: true });
        console.log("am here");
     
        if(dataItem.consultant === 'ABC Solutions'){
            ReactDOM.render(
                <ConsultantInfoReadonly args={this.core} />,
                document.getElementById("consultantinfo")
                )
            }

        if(dataItem.status === 'Interview'){
            ReactDOM.render(
                <ScheduleInterview args={this.core} />,
                document.getElementById("interviewstatus")
                )
            }
      
            };
            
                render() {
                    console.log(this.state.showForm);
                    return (  
                        <div>
                        {/* EMPLOYEE PENDING VIEW */}
                        {/* <div id="candidateinfo" style={{ height: "inherit" }} /> */}
                        <div id="consultantinfo" style={{ height: "inherit" }} />
                        <div id="interviewstatus" style={{ height: "inherit" }} />
                        {/* <div id="candidateList" style={{ height: "inherit" }} /> */}
                        {!this.state.showForm && <div>
                            {/* <button onClick={this.renderForm}> Add </button>  */}
                            <div>{this.config}</div>
                            <GridTemplate
                            gridData={candidateList}
                            rawData={true}
                            args={this.core}
                            config={{
                                showToolBar:false,
                                title: "CandidateList",
                                column: ["consultant", "candidate","status", "date"]
                            }}
                            onRowClick={e => {
                                this.props.manageGrid.edit(e.dataItem);
                            }}
                            manageGrid={{
                                add: this.insert,
                                edit: this.edit,
                                remove: this.remove,
                                addUsers: this.addGroupUsers
                            }}
                            />
                            {/* <MultileSelect/>
                            <button onClick={this.renderForm}>Add Consultant</button>  */}
                            </div>}
                            
                            </div>
                            );
                        }
                    }
                    
                    export default CandidateList;