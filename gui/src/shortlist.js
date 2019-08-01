import React from "react";
import ReactDOM from "react-dom";
import {Form} from "react-formio";
import 'bootstrap/dist/js/bootstrap.js';
import ScheduleInterview from "./scheduleInterview.js";

const formdata =  {
    "components": [
     {
    "autofocus": false,
    "input": true,
    "tableView": true,
    "inputType": "text",
    "inputMask": "",
    "label": "Candidate Name",
    "key": "candidateName",
    "placeholder": "",
    "prefix": "",
    "suffix": "",
    "multiple": false,
    "defaultValue": "",
    "protected": false,
    "unique": false,
    "persistent": true,
    "hidden": false,
    "clearOnHide": true,
    "spellcheck": true,
    "validate": {
    "required": false,
    "minLength": "",
    "maxLength": "",
    "pattern": "",
    "custom": "",
    "customPrivate": false
    },
    "conditional": {
    "show": "",
    "when": null,
    "eq": ""
    },
    "type": "textfield",
    "$$hashKey": "object:2257",
    "labelPosition": "top",
    "inputFormat": "plain",
    "tags": [
    ],
    "properties": {
    },
    "disabled" :true
    },
     {
    "autofocus": false,
    "input": true,
    "tableView": true,
    "inputType": "tel",
    "inputMask": "(999) 999-9999",
    "label": "Contact No",
    "key": "contactNo",
    "placeholder": "",
    "prefix": "",
    "suffix": "",
    "multiple": false,
    "protected": false,
    "unique": false,
    "persistent": true,
    "hidden": false,
    "defaultValue": "",
    "clearOnHide": true,
    "validate": {
    "required": false
    },
    "type": "phoneNumber",
    "$$hashKey": "object:2767",
    "labelPosition": "top",
    "inputFormat": "plain",
    "tags": [
    ],
    "conditional": {
    "show": "",
    "when": null,
    "eq": ""
    },
    "properties": {
    },
    "disabled" :true
    },
     {
    "autofocus": false,
    "input": true,
    "tableView": true,
    "inputType": "email",
    "label": "Email",
    "key": "email",
    "placeholder": "",
    "prefix": "",
    "suffix": "",
    "defaultValue": "",
    "protected": false,
    "unique": false,
    "persistent": true,
    "hidden": false,
    "clearOnHide": true,
    "kickbox": {
    "enabled": false
    },
    "type": "email",
    "$$hashKey": "object:2916",
    "labelPosition": "top",
    "inputFormat": "plain",
    "tags": [
    ],
    "conditional": {
    "show": "",
    "when": null,
    "eq": ""
    },
    "properties": {
    },
    "disabled" :true
    },
     {
    "autofocus": false,
    "input": true,
    "tableView": true,
    "label": "Profile Picture",
    "key": "profilePicture",
    "image": true,
    "imageSize": "200",
    "placeholder": "",
    "multiple": false,
    "defaultValue": "",
    "protected": false,
    "persistent": true,
    "hidden": false,
    "clearOnHide": true,
    "filePattern": "*",
    "fileMinSize": "0KB",
    "fileMaxSize": "1GB",
    "type": "file",
    "labelPosition": "left-right",
    "tags": [
    ],
    "conditional": {
    "show": "",
    "when": null,
    "eq": ""
    },
    "properties": {
    },
    "disabled" :true,
    "labelWidth": 20,
    "labelMargin": 5,
    "$$hashKey": "object:3982"
    },
    {
      "autofocus": false,
      "input": true,
      "tableView": true,
      "inputType": "radio",
      "label": "Radio",
      "key": "radio",
      "values": [
       {
      "value": "approve",
      "label": "Approve",
      "shortcut": ""
      },
       {
      "value": "reject",
      "label": "Reject",
      "shortcut": ""
      }
      ],
      "defaultValue": "",
      "protected": false,
      "fieldSet": false,
      "persistent": true,
      "hidden": false,
      "clearOnHide": true,
      "validate": {
      "required": false,
      "custom": "",
      "customPrivate": false
      },
      "type": "radio",
      "$$hashKey": "object:4550",
      "labelPosition": "top",
      "optionsLabelPosition": "right",
      "tags": [
      ],
      "conditional": {
      "show": "",
      "when": null,
      "eq": ""
      },
      "properties": {
      },
      "labelWidth": 30,
      "labelMargin": 3,
      "hideLabel": true,
      "inline": true
      },
       {
      "autofocus": false,
      "input": true,
      "tableView": true,
      "label": "Comments",
      "key": "comments",
      "placeholder": "",
      "prefix": "",
      "suffix": "",
      "rows": 3,
      "multiple": false,
      "defaultValue": "",
      "protected": false,
      "persistent": true,
      "hidden": false,
      "wysiwyg": false,
      "clearOnHide": true,
      "spellcheck": true,
      "validate": {
      "required": false,
      "minLength": "",
      "maxLength": "",
      "pattern": "",
      "custom": ""
      },
      "type": "textarea",
      "$$hashKey": "object:4938",
      "labelPosition": "top",
      "inputFormat": "plain",
      "tags": [
      ],
      "conditional": {
      "show": "",
      "when": null,
      "eq": ""
      },
      "properties": {
      }
      },
    {
    "type": "button",
    "theme": "primary",
    "disableOnInvalid": true,
    "action": "submit",
    "block": false,
    "rightIcon": "",
    "leftIcon": "",
    "size": "md",
    "key": "submit",
    "tableView": false,
    "label": "Submit",
    "input": true,
    "$$hashKey": "object:21",
    "autofocus": false
    }
    ],
    "display": "form",
    "page": 0
    };

class Shortlist extends React.Component {
  constructor(props) {
    super(props);
	this.core = this.props.args;
	this.state = {
    showForm: false
  }
  }

  submit = dataItem =>{
    this.setState({ showForm: true });
    if(dataItem.data.radio === "approve"){
      ReactDOM.render(
        <ScheduleInterview args={this.core} />,
        document.getElementById("shortlistapprove")
        )
    }
  };

  render() {
    return (		
      <div>
      <div id="shortlistapprove" style={{ height: "inherit" }} />
      {!this.state.showForm && <div>
      <Form form={formdata} onSubmit={this.submit} />
      </div>}
      </div>
      );
     
    }
  }
  
  export default Shortlist;