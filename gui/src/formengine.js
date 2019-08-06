import React from "react";
import {Form} from "react-formio";
import 'bootstrap/dist/js/bootstrap.js';

class FormEngine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content
    };
    
  }
  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      this.setState({ content: this.props.content });
    }
  }

  render() {
    console.log(JSON.parse(this.state.content));
    return (  
      <div>
      <Form form={JSON.parse(this.state.content)} onSubmit={this.submit} />
      </div>
      );
      
    }
  }
  
  export default FormEngine;