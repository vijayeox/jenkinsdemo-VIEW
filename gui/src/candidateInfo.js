import React from "react";
import {Form} from "react-formio";
import 'bootstrap/dist/js/bootstrap.js';

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
    }
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
    }
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
    }
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
    "labelWidth": 20,
    "labelMargin": 5,
    "$$hashKey": "object:3982"
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

class CandidateInfo extends React.Component {
  constructor(props) {
    super(props);
	this.core = this.props.args;
	console.log("Approve file");
	console.log(this.core);
  }

  render() {
    return (		
      <Form form={formdata} onSubmit={this.submit} />
      );
     
    }
  }
  
  export default CandidateInfo;