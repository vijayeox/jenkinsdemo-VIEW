import React from "react";
import {Form} from "react-formio";
import 'bootstrap/dist/js/bootstrap.js';

const formdata =  {
	"components": [{
			"autofocus": false,
			"input": true,
			"tableView": true,
			"inputType": "text",
			"inputMask": "",
			"label": "Title",
			"key": "title",
			"placeholder": "Enter the Title",
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
				"required": true,
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
			"$$hashKey": "object:5663",
			"labelPosition": "top",
			"inputFormat": "plain",
			"tags": [],
			"properties": {},
			"tooltip": "Title",
			"isNew": false
		},
		{
			"autofocus": false,
			"input": true,
			"tableView": true,
			"label": "Responsibility",
			"key": "responsibility",
			"placeholder": "Enter the Responsibilities required",
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
				"required": true,
				"minLength": "",
				"maxLength": "",
				"pattern": "",
				"custom": ""
			},
			"type": "textarea",
			"labelPosition": "top",
			"inputFormat": "plain",
			"tags": [],
			"conditional": {
				"show": "",
				"when": null,
				"eq": ""
			},
			"properties": {},
			"tooltip": "Responsibility",
			"$$hashKey": "object:10383",
			"isNew": false
		},
		{
			"clearOnHide": false,
			"label": "Columns",
			"input": false,
			"tableView": false,
			"key": "columns",
			"columns": [{
					"components": [{
						"autofocus": false,
						"input": true,
						"tableView": true,
						"label": "Designation",
						"key": "designation",
						"placeholder": "",
						"data": {
							"values": [{
									"value": "softwareDeveloper",
									"label": "Software Developer",
									"$$hashKey": "object:7071"
								},
								{
									"value": "androidDeveloper",
									"label": "Android Developer",
									"$$hashKey": "object:7072"
								},
								{
									"value": "dataAnalyst",
									"label": "Data analyst",
									"$$hashKey": "object:7073"
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
							"required": true
						},
						"type": "select",
						"labelPosition": "top",
						"tags": [],
						"conditional": {
							"show": "",
							"when": null,
							"eq": ""
						},
						"properties": {},
						"$$hashKey": "object:7058"
					}],
					"width": 6,
					"offset": 0,
					"push": 0,
					"pull": 0,
					"$$hashKey": "object:6795"
				},
				{
					"components": [{
						"autofocus": false,
						"input": true,
						"tableView": true,
						"label": "Years of experience",
						"key": "yearsofexperience",
						"placeholder": "",
						"data": {
							"values": [{
									"value": "0",
									"label": "0",
									"$$hashKey": "object:7197"
								},
								{
									"value": "1",
									"label": "1",
									"$$hashKey": "object:7198"
								},
								{
									"value": "2",
									"label": "2",
									"$$hashKey": "object:7199"
								},
								{
									"value": "3",
									"label": "3",
									"$$hashKey": "object:7200"
								},
								{
									"value": "4",
									"label": "4",
									"$$hashKey": "object:7201"
								},
								{
									"value": "5",
									"label": "5",
									"$$hashKey": "object:7202"
								},
								{
									"value": "6",
									"label": "6",
									"$$hashKey": "object:7203"
								},
								{
									"value": "7",
									"label": "7",
									"$$hashKey": "object:7204"
								},
								{
									"value": "8",
									"label": "8",
									"$$hashKey": "object:7205"
								},
								{
									"value": "9",
									"label": "9",
									"$$hashKey": "object:7206"
								},
								{
									"value": "10",
									"label": "10",
									"$$hashKey": "object:7207"
								},
								{
									"value": "11",
									"label": "11",
									"$$hashKey": "object:7208"
								},
								{
									"value": "12",
									"label": "12",
									"$$hashKey": "object:7209"
								},
								{
									"value": "13",
									"label": "13",
									"$$hashKey": "object:7210"
								},
								{
									"value": "14",
									"label": "14",
									"$$hashKey": "object:7211"
								},
								{
									"value": "15",
									"label": "15",
									"$$hashKey": "object:7212"
								},
								{
									"value": "16",
									"label": "16",
									"$$hashKey": "object:7213"
								},
								{
									"value": "17",
									"label": "17",
									"$$hashKey": "object:7214"
								},
								{
									"value": "18",
									"label": "18",
									"$$hashKey": "object:7215"
								},
								{
									"value": "19",
									"label": "19",
									"$$hashKey": "object:7216"
								},
								{
									"value": "20",
									"label": "20",
									"$$hashKey": "object:7217"
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
							"required": true
						},
						"type": "select",
						"labelPosition": "top",
						"tags": [],
						"conditional": {
							"show": "",
							"when": null,
							"eq": ""
						},
						"properties": {},
						"$$hashKey": "object:7181"
					}],
					"width": 6,
					"offset": 0,
					"push": 0,
					"pull": 0,
					"$$hashKey": "object:6796"
				}
			],
			"type": "columns",
			"$$hashKey": "object:6789",
			"hideLabel": true,
			"tags": [],
			"conditional": {
				"show": "",
				"when": null,
				"eq": ""
			},
			"properties": {}
		},
		{
			"clearOnHide": false,
			"label": "Columns",
			"input": false,
			"tableView": false,
			"key": "columns2",
			"columns": [{
					"components": [{
						"autofocus": false,
						"input": true,
						"tableView": true,
						"label": "Min Education Qualification",
						"key": "minEducationQualification",
						"placeholder": "",
						"data": {
							"values": [{
									"value": "bcom",
									"label": "Bcom",
									"$$hashKey": "object:7637"
								},
								{
									"value": "beBTech",
									"label": "BE/B.Tech",
									"$$hashKey": "object:7638"
								},
								{
									"value": "mca",
									"label": "MCA",
									"$$hashKey": "object:7639"
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
							"required": true
						},
						"type": "select",
						"labelPosition": "top",
						"tags": [],
						"conditional": {
							"show": "",
							"when": null,
							"eq": ""
						},
						"properties": {},
						"$$hashKey": "object:7624"
					}],
					"width": 6,
					"offset": 0,
					"push": 0,
					"pull": 0,
					"$$hashKey": "object:7349"
				},
				{
					"components": [{
						"autofocus": false,
						"input": true,
						"tableView": true,
						"label": "Shift",
						"key": "shift",
						"placeholder": "",
						"data": {
							"values": [{
									"value": "day",
									"label": "Day",
									" $$hashKey": "object:7770"
								},
								{
									"value": "night",
									"label": "Night",
									" $$hashKey": "object:7771"
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
							"required": true
						},
						"type": "select",
						"labelPosition": "top",
						"tags": [],
						"conditional": {
							"show": "",
							"when": null,
							"eq": ""
						},
						"properties": {},
						"$$hashKey": "object:7754"
					}],
					"width": 6,
					"offset": 0,
					"push": 0,
					"pull": 0,
					"$$hashKey": "object:7350"
				}
			],
			"type": "columns",
			"$$hashKey": "object:7343",
			"hideLabel": true,
			"tags": [],
			"conditional": {
				"show": "",
				"when": null,
				"eq": ""
			},
			"properties": {}
		},
		{
			"input": true,
			"tableView": true,
			"label": "Reason for hiring",
			"key": "message",
			"placeholder": "",
			"prefix": "",
			"suffix": "",
			"rows": 3,
			"multiple": false,
			"defaultValue": "",
			"protected": false,
			"persistent": true,
			"validate": {
				"required": true,
				"minLength": "",
				"maxLength": "",
				"pattern": "",
				"custom": ""
			},
			"type": "textarea",
			"conditional": {
				"show": "",
				"when": null,
				"eq": ""
			},
			"autofocus": false,
			"hidden": false,
			"wysiwyg": false,
			"clearOnHide": true,
			"spellcheck": true,
			"labelPosition": "top",
			"inputFormat": "plain",
			"tags": [],
			"properties": {},
			"$$hashKey": "object:10016"
		},
		{
			"autofocus": false,
			"input": true,
			"tableView": true,
			"label": "Other Skills",
			"key": "otherSkills",
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
				"required": true,
				"minLength": "",
				"maxLength": "",
				"pattern": "",
				"custom": ""
			},
			"type": "textarea",
			"$$hashKey": "object:6352",
			"labelPosition": "top",
			"inputFormat": "plain",
			"tags": [],
			"conditional": {
				"show": "",
				"when": null,
				"eq": ""
			},
			"properties": {},
			"isNew": false
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

class Activity extends React.Component {
  constructor(props) {
    super(props);
	this.core = this.props.args;
	console.log("Actvity file");
	console.log(this.core);
    this.state = {
      orgToBeEdited: []
	};
	this.submit = this.submit.bind(this);
  }

  async submit(e)  {
	console.log(e);
	console.log(e.data);
	let form_data = e.data;
	let helper = this.core.make("oxzion/restClient");
    let addformdata = await helper.request(
      "v1",
      "/workflow/" + 1,
      
        form_data
      ,
      "post"
    );
    return addformdata;
  };  

  render() {
    return (		
      <Form form={formdata} onSubmit={this.submit} />
      );
     
    }
  }
  
  export default Activity;