import React from "react";
import ReactDOM from "react-dom";
import Activity from "./activity.js";
// import MultileSelect from "./multileselect.js";
import ConsultantInfo from "./consultantinfo.js";
import ScheduleInterview from "./scheduleInterview.js";
import Sourcing from "./sourcing.js";
import GridTemplate from "./GridTemplate.js";
import consultantList from "./data/consultantList.json";
import RequestInfo from "./requestInfo.js";
import {
    MultiSelectComponent,
    CheckBoxSelection,
    Inject
} from "@syncfusion/ej2-react-dropdowns";

class Consultants extends React.Component {
    
    constructor(props) {
        super(props);
        this.config = this.props.args;
        this.core = this.props.config;
        this.state = {
            showForm: false,
            userList: [],
      selectedUsers: []
        }
        this.renderForm = this.renderForm.bind(this);
        this.checkFields = { text: "userName", value: "userid" };
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
                this.setState({ showForm: true });
                this.setState({ showForms: false });
                ReactDOM.render(
                    <ConsultantInfo args={this.core} />,
                    document.getElementById("consultant")
                    )
                };
                
                render() {
                    console.log(this.state.showForm);
                    return (  
                        <div>
                        {/* EMPLOYEE PENDING VIEW */}
                        <div id="consultantlist" style={{ height: "inherit" }} />
                        {!this.state.showForm && <div>
                            {/* <button onClick={this.renderForm}> Add </button>  */}
                            <div>{this.config}</div>
                            <GridTemplate
                            gridData={consultantList}
                            rawData={true}
                            args={this.core}
                            config={{
                                showToolBar:false,
                                title: "Consultant List View",
                                column: ["slNo", "consultantName", "date"]
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
                            {/* <MultiSelectComponent
                            id="checkbox"
                            dataSource={this.state.userList}
                            value={this.state.selectedUsers}
                            filtering={this.filterData.bind(this)}
                            allowFiltering={true}
                            change={this.captureSelectedUsers}
                            fields={this.checkFields}
                            mode="CheckBox"
                            placeholder="Click to add Users"
                            showDropDownIcon={true}
                            filterBarPlaceholder="Search Users"
                            popupHeight="350px"
                            >
                            <Inject services={[CheckBoxSelection]} />
                            </MultiSelectComponent> */}
                            <button onClick={this.renderForm}>Add Consultant</button> 
                            </div>}
                            
                            </div>
                            );
                        }
                    }
                    
                    export default Consultants;