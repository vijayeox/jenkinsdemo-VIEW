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
      "label": "Date Time",
      "key": "dateTime",
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
      "$$hashKey": "object:273",
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
        "label": "Interviewer",
        "key": "select",
        "placeholder": "",
        "data": {
        "values": [
        {
        "value": "rakshith",
        "label": "Rakshith",
        "$$hashKey": "object:798"
        },
        {
        "value": "bharat",
        "label": "Bharat",
        "$$hashKey": "object:826"
        },
         {
        "value": "swathi",
        "label": "Swathi",
       "$$hashKey": "object:946"
        },
         {
        "value": "chaitra",
        "label": "Chaitra",
        "$$hashKey": "object:951"
        }
        ],
        "json": "",
        "url": "",
        "resource": "",
        "custom": ""
        },
        "dataSrc": "values",
        "valueProperty": "",
        "defaultValue": "",
        "refreshOn": "",
        "filter": "",
        "authenticate": false,
        "template": "<span>{{ item.label }}</span>",
        "multiple": false,
        "protected": false,
        "unique": false,
        "persistent": true,
        "hidden": false,
        "clearOnHide": true,
        "validate": {
        "required": false
        },
        "type": "select",
        "$$hashKey": "object:697",
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
        }
   ,
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

class ScheduleInterview extends React.Component {
  constructor(props) {
    super(props);
	this.core = this.props.args;
	console.log("Approve file");
	console.log(this.core);
  }

  render() {
    return (	
      <div><br/><b>Candidate Information</b><br/><br/>
      <Form form={formdata} onSubmit={this.submit} />
      </div>
      );
     
    }
  }
  
  export default ScheduleInterview;