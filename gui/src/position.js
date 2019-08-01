import React from "react";
import ReactDOM from "react-dom";
import GridTemplate from "./GridTemplate.js";
import Activity from "./activity";
import positionList from "./data/positionlist.json";

class NewPosition extends React.Component {
    constructor(props) {
        super(props);
        this.config = this.props.args;
        this.core = this.props.core;
        this.menu = this.props.config;
        this.state = {
            showForm: false
        }
        this.renderForm = this.renderForm.bind(this);
    }
    
    renderForm = () => {
        this.setState({ showForm: true });
        ReactDOM.render(
            <Activity args={this.core} />,
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
                    <button onClick={this.renderForm}> Add </button>
                    <GridTemplate
                    gridData={positionList}
                    rawData={true}
                    args={this.core}
                    permission={1}
                    config={{
                        showToolBar:false,
                        title: "New Position",
                        column: ["slNo", "status", "createdOn"]
                    }}
                    onRowClick={e => {
                        this.renderForm
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
            
export default NewPosition;