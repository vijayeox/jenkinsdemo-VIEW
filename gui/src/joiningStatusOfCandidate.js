import React from "react";
import {Form} from "react-formio";
import 'bootstrap/dist/js/bootstrap.js';

const formdata = {
    "components": [
     {
     "autofocus": false,
     "input": true,
     "tableView": true,
     "inputType": "radio",
     "label": "Radio",
     "key": "radio",
    "values": [
     {
     "value": "joined",
     "label": "Joined",
     "shortcut": ""
     },
     {
     "value": "noShow",
     "label": "No show",
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
     "$$hashKey": "object:3555",
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
     "$$hashKey": "object:2070",
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
     }
;

class JoiningStatus extends React.Component {
  constructor(props) {
    super(props);
	this.core = this.props.args;
  }

  render() {
    return (		
      <Form form={formdata} onSubmit={this.submit} />
      );
     
    }
  }
  
  export default JoiningStatus;