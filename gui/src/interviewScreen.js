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
    "$$hashKey": "object:1201",
    "labelPosition": "top",
    "inputFormat": "plain",
    "tags": [
    ],
    "properties": {
    },
    "disabled": true
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
    "$$hashKey": "object:4245",
    "disabled": true
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
    "$$hashKey": "object:1584",
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
    "disabled": true
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
    "labelPosition": "top",
    "tags": [
    ],
    "conditional": {
    "show": "",
    "when": null,
    "eq": ""
    },
    "properties": {
    },
    "storage": "url",
    "$$hashKey": "object:2211",
    "disabled": true
    },
     {
    "autofocus": false,
    "input": true,
    "tableView": true,
    "label": "Interview Date",
    "key": "interviewDate",
    "placeholder": "",
    "format": "yyyy-MM-dd hh:mm a",
    "enableDate": true,
    "enableTime": true,
    "defaultDate": "",
    "datepickerMode": "day",
    "datePicker": {
    "showWeeks": true,
    "startingDay": 0,
    "initDate": "",
    "minMode": "day",
    "maxMode": "year",
    "yearRows": 4,
    "yearColumns": 5,
    "minDate": null,
    "maxDate": null,
    "datepickerMode": "day"
    },
    "timePicker": {
    "hourStep": 1,
    "minuteStep": 1,
    "showMeridian": true,
    "readonlyInput": false,
    "mousewheel": true,
    "arrowkeys": true
    },
    "protected": false,
    "persistent": true,
    "hidden": false,
    "clearOnHide": true,
    "validate": {
    "required": false,
    "custom": ""
    },
    "type": "datetime",
    "$$hashKey": "object:4406",
    "labelPosition": "top",
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
    "label": "Feedback",
    "key": "feedback",
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
    "$$hashKey": "object:5199",
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
                "label": 'Sl.No',
                "key": 'slno',
                "type": 'textfield',
                "input": true
              },
              {
                "label": 'Interviewer',
                "key": 'interviewer',
                "type": 'textfield',
                "input": true
              },
              {
                "label": 'Date',
                "key": 'date',
                "type": 'datetime',
                "input": true,
                "format": 'yyyy-MM-dd hh:mm a',
                "enableDate": true,
                "enableTime": true,
                "defaultDate": '',
                "datepickerMode": 'day',
                "datePicker": {
                  "showWeeks": true,
                  "startingDay": 0,
                  "initDate": '',
                  "minMode": 'day',
                  "maxMode": 'year',
                  "yearRows": 4,
                  "yearColumns": 5,
                  "datepickerMode": 'day'
                },
                "timePicker": {
                  "hourStep": 1,
                  "minuteStep": 1,
                  "showMeridian": true,
                  "readonlyInput": false,
                  "mousewheel": true,
                  "arrowkeys": true
                },
                "conditional": {
                  "eq": "true",
                  "when": "dependant",
                  "show": "true"
                }
              },
              {
                "label": 'Feedback',
                "key": 'feedback',
                "type": 'textarea',
                "input": true
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

class InterviewScreen extends React.Component {
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
  
  export default InterviewScreen;