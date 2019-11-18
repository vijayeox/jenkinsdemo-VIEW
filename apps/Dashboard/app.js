import React from "react";
import { Dashboard1 } from "@oxzion/gui";
import { htmlData } from "./sampleData";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  render() {
    return (
      <Dashboard1
        htmlData={htmlData}
        args={this.props.args}
        proc={this.props.proc}
      />
      // <Dashboard uuid={1} args={this.props.args}/>
    );
  }
}

export default App;
