import React from "react";

class DashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return(
            <div>
                {this.props.htmlData}
            </div>
        )
    }
}

export default DashboardComponent;