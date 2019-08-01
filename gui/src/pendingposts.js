import React from "react";
import ReactDOM from "react-dom";
import Activity from "./activity.js";
// import CandidateInfo from "./candidateInfo.js";
// import Shortlist from "./shortlist.js";
import ScheduleInterview from "./scheduleInterview.js";
import Sourcing from "./sourcing.js";
import GridTemplate from "./GridTemplate.js";
import pendingpositionsList from "./data/pendingpositionsList.json";
import RequestInfo from "./requestInfo.js";

class PendingPositions extends React.Component {
    
    constructor(props) {
        super(props);
        this.config = this.props.args;
        this.core = this.props.config;
        this.state = {
            showForm: false,
            show:true
        }
        this.renderForm = this.renderForm.bind(this);
    }
    
    edit = dataItem => {
        this.setState({ showForm: true });
        console.log(dataItem);
        if(dataItem.activity === 'Sourcing'){
            ReactDOM.render(
                <Sourcing args={this.core} />,
                document.getElementById("pendingposts")
                )
            }
            if(dataItem.activity === 'Interview'){
                ReactDOM.render(
                    <ScheduleInterview args={this.core} />,
                    document.getElementById("pendingposts")
                    )
                }
            };
            
            renderForm = () => {
                console.log("renderform");
                this.setState({ showForm: true });
                ReactDOM.render(
                    <Sourcing args={this.core} />,
                    document.getElementById("activity")
                    )
                };
                
                render() {
                    console.log(this.state.showForm);
                    return (  
                        <div>
                            {/* EMPLOYEE PENDING VIEW */}
                        <div id="pendingposts" style={{ height: "inherit" }} />
                        {!this.state.showForm && <div>
                            <button onClick={this.renderForm}> Add </button>
                             <div>{this.config}</div>
                            <GridTemplate
                            gridData={pendingpositionsList}
                            rawData={true}
                            args={this.core}
                            config={{
                                showToolBar:false,
                                title: "Pending Positions",
                                column: ["slNo", "activity", "createdBy", "createdOn"]
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
                            </div>}
                            
                          {/*   HR INBOX */}
                        {/* <RequestInfo args={this.state.show}/> */}
                            </div>
                            );
                        }
                    }
                    
                    export default PendingPositions;