import React from "react";
import {
    BrowserRouter as Router,
    Link,
    Route // for later
  } from 'react-router-dom';
import Activity from "./activity";
import Inbox from "./inbox";
import Outbox from "./outbox";
import Dashboard from "./dashboard";
import PendingPositions from "./pendingposts";

class Template extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
      }

    render() {
      return (
        <Router>
          <div style={{width: '100%', height: '100%', overflow: 'auto'}}>
            <ul>
              <li><Link to={{ pathname: "/", search: "app=SampleTemplate&r=dashboard" }}>Dashboard</Link></li>
              <li><Link to={{ pathname: "/", search: "app=SampleTemplate&r=inbox" }}>Inbox</Link></li>
              <li><Link to={{ pathname: "/", search: "app=SampleTemplate&r=outbox" }}>Outbox</Link></li>
              <li><Link to={{ pathname: "/", search: "app=SampleTemplate&r=newposition" }}>New Position</Link></li>
              <li><Link to={{ pathname: "/", search: "app=SampleTemplate&r=pendingpositions" }}>Pending Positions</Link></li>
            </ul>
  
            <hr />
  
            <Route   render={({ location }) => {
              let params = new URLSearchParams(location.search);
              console.log(params);
              if(params.get("r") == 'inbox')  
                {return <Inbox/>;}
              if(params.get("r") == 'outbox'){
                return <Outbox/>;
                }
              if(params.get("r") == 'dashboard')  
                {return <Dashboard/>;}
             if(params.get("r") == 'pendingpositions')  
                {return <PendingPositions/>;}
                if(params.get("r") == 'newposition')  
                {return <NewPosition/>;}
              if(params.get("r") == 'activity'){
                  console.log("Activity");
                  console.log(this.core);
                return <Activity args={this.core}/>;
               }
            }}
            //  exact path='/?app=SampleTemplate&r=inbox' component={Inbox} 
             />
            {/* <Route path='/outbox' component={Outbox} /> */}
          </div>
        </Router>
      )
    }
  }

  export default Template;