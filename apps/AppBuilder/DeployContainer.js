
import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import "@progress/kendo-ui";
import 'bootstrap/dist/css/bootstrap.min.css';

export default class DeployContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.proc = this.props.proc;
    this.state = {
      appInEdit: this.props.dataItem || null
    };
  }

  componentDidMount() {
    M.AutoInit();
    M.updateTextFields();
  }



  render() {
    return (
        <Window onClose={this.props.cancel} draggable={false} >
          Deploy Page
        </Window>
    );
  }
}
