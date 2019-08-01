import React from "react";
import ReactDOM from "react-dom";
import GridTemplate from "./GridTemplate.js";
import CandidateInfo from "./candidateInfo.js";

const inboxdata = {
    "workflowname":"Insurance Policy",
    "activityname": "Verify",
    "submittedby":"bharatg",
    "createddate": "2019-05-02"
  };

class Sourcing extends React.Component {
    constructor(props) {
        super(props);
        this.config = this.props.args;
        this.core = this.props.config;
        this.state = {
            showForm: false
          }
        this.renderForm = this.renderForm.bind(this);
    }

renderForm = () => {
    this.setState({ showForm: true });
    ReactDOM.render(
        <CandidateInfo args={this.core} />,
        document.getElementById("activity")
      )
      };

    render() {
        console.log(this.core);
        // const { show } = this.state;
        return (
        <div>
            <div id="activity" style={{ height: "inherit" }} />
            {!this.state.showForm && <div>
            <div>{this.config}</div>
             <button onClick={this.renderForm}> Add Candidate </button>
            <GridTemplate
            args={this.core}
            config={{
                showToolBar:false,
                title: "Sourcing",
                column: ["sl.No", "Candidate Name", "Activity","Assignee","Created On"]
              }}

            manageGrid={{
                add: this.insert,
                edit: this.edit,
                remove: this.remove,
                addUsers: this.addGroupUsers
              }}
        />
        </div>}
        </div>
        );
    }
}

export default Sourcing;