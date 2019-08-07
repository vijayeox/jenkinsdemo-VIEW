import React from "react";
import ReactDOM from "react-dom";
import GridTemplate from "./GridTemplate.js";
import Approve from "./approve.js";
import ScheduleInterview from "./scheduleInterview.js";
import inboxList from "./data/inboxlist.json";
// import ConsultantView from "./requestInfo.js";
import RequestInfo from "./requestInfo.js";
import CandidateListInbox from "./data/TestcandidateListForConsultant.json";
import InterviewScreen from "./interviewScreen.js";
import Shortlist from "./shortlist.js";
import MakeOffer from "./makeOffer.js";
import CandidateInfo from "./candidateInfo.js";
import CandidateInfoReadonly from "./candidatesReadonly.js";
import AcceptOffer from "./acceptoffer.js";
import JoiningStatus from "./joiningStatusOfCandidate.js";

class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.config = this.props.args;
        this.core = this.props.core;
        console.log(this.core);
        console.log(this.config);
        this.state = {
            showForm: false,
            show:false,
            addCandidate:true,
            candidateListExists:true
        }
    }
    
    edit = dataItem => {
        console.log(dataItem.activity);
        this.setState({ showForm: true });
        if(dataItem.activity === 'Shortlist'){
            ReactDOM.render(
                <Shortlist args={this.core} />,
                document.getElementById("approve")
                )
            }
        
        if(dataItem.activity === 'Approve'){
            ReactDOM.render(
                <Approve args={this.core} />,
                document.getElementById("approve")
                )
            }
            
            if(dataItem.activity === 'Interview'){
                ReactDOM.render(
                    <InterviewScreen args={this.core} />,
                    document.getElementById("approve")
                    )
                }

                if(dataItem.activity === 'Make Offer'){
                    ReactDOM.render(
                        <MakeOffer args={this.core} />,
                        document.getElementById("approve")
                        )

                        ReactDOM.render(
                            <CandidateInfoReadonly args={this.core} />,
                            document.getElementById("approvals")
                            )
    
                    }

                    if(dataItem.activity === 'Accept Offer'){
                        ReactDOM.render(
                            <AcceptOffer args={this.core} />,
                            document.getElementById("approve")
                            )
    
                            ReactDOM.render(
                                <CandidateInfoReadonly args={this.core} />,
                                document.getElementById("approvals")
                                )
        
                        }

                        if(dataItem.activity === 'Awaiting Join'){
                            ReactDOM.render(
                                <JoiningStatus args={this.core} />,
                                document.getElementById("approve")
                                )
        
                                ReactDOM.render(
                                    <CandidateInfoReadonly args={this.core} />,
                                    document.getElementById("approvals")
                                    )
            
                            }
            };

            editcandidate = dataItem => {
                this.setState({ showForm: true });
                if(dataItem.title === 'Developer'){
                    ReactDOM.render(
                        <RequestInfo args={this.state.show} include={this.state.addCandidate} candidateListExists={this.state.candidateListExists}/>,
                        document.getElementById("consInbox")
                        )
                    }
                    };
            
            render() {
                return (
                    <div>
                   {/* EMPLOYEE INBOX VIEW*/}
                     
                     <div id="approvals" style={{ height: "inherit" }} />
                     <div id="approve" style={{ height: "inherit" }} />
                    {!this.state.showForm && <div>   
                        <div>{this.config}</div>
                        <GridTemplate
                        // gridData={inboxList}
                        args={this.core}
                        permission={1}
                        config={{
                            showToolBar:false,
                            title: "Inbox",
                            api: "app/22/assignments",
                            column:[                
                                {
                                  title: "Process",
                                  field: "name "
                                },
                                {
                                  title: "Activity",
                                  field: "process_ids"
                                },
                                {
                                  title: "Created By",
                                  field: "created_by"
                                },
                                {
                                    title: "Created On",
                                    field: "date_created"
                                  }
                              ]
                        }}
                        manageGrid={{
                            add: this.insert,
                            edit: this.edit,
                            remove: this.remove,
                            addUsers: this.addGroupUsers
                        }}
                        onRowClick={e => {
                            this.props.manageGrid.edit(e.dataItem);
                        }}
                        />
                        </div>}

                        {/* Consultant INBOX */}
                        {/* <div id="consInbox" style={{ height: "inherit" }} />
                        {!this.state.showForm && <div>
                        <GridTemplate
                        gridData={CandidateListInbox}
                        rawData={true}
                        args={this.core}
                        permission={1}
                        config={{
                            showToolBar:false,
                            title: "Consultant's Inbox",
                            column: ["title", "position", "date"]
                        }}
                        manageGrid={{
                            add: this.insert,
                            edit: this.editcandidate,
                            remove: this.remove,
                            addUsers: this.addGroupUsers
                        }}
                        onRowClick={e => {
                            this.props.manageGrid.editcandidate(e.dataItem);
                        }}
                        />
                        </div>} */}
                        {/* <RequestInfo args={this.state.show}/>  */}

                        </div>
                        );
                        
                    }
                }
                
export default Inbox;