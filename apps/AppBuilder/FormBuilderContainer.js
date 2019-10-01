
import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import {FormBuilder} from 'react-formio';

export default class FormBuilderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.proc = this.props.proc;
    this.state = {
      appInEdit: this.props.dataItem || null
    };
  }

  componentDidMount() {

  }

  render() {
    return (
        <Window onClose={this.props.cancel} draggable={false} >
          <FormBuilder form={{display: 'form'}} />
        </Window>
    );
  }
}
