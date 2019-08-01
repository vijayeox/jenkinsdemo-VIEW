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
    "value": "accepted",
    "label": "Accepted",
    "shortcut": ""
    },
     {
    "value": "rejected",
    "label": "Rejected",
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
    "$$hashKey": "object:2496",
    "inline": true,
    "hideLabel": true,
    "isNew": false
    },
     {
    "autofocus": false,
    "input": true,
    "tableView": true,
    "label": "Expected date of Joining",
    "key": "expecteddateofJoining",
    "fields": {
    "day": {
    "type": "number",
    "placeholder": "",
    "required": false
    },
    "month": {
    "type": "select",
    "placeholder": "",
    "required": false
    },
    "year": {
    "type": "number",
    "placeholder": "",
    "required": false
    }
    },
    "dayFirst": false,
    "protected": false,
    "persistent": true,
    "hidden": false,
    "clearOnHide": true,
    "validate": {
    "custom": ""
    },
    "type": "day",
    "$$hashKey": "object:1578",
    "labelPosition": "top",
    "inputsLabelPosition": "top",
    "tags": [
    ],
    "conditional": {
    "show": "true",
    "when": "radio",
    "eq": "accepted"
    },
    "properties": {
    }
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
    };

class AcceptOffer extends React.Component {
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
  
  export default AcceptOffer;