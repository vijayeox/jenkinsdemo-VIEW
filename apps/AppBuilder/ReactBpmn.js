import React from 'react';
import { Window } from "@progress/kendo-react-dialogs";
import BpmnModeler from './bpmn/bpmn-js/lib/Modeler';
import propertiesPanelModule from './bpmn/bpmn-js-properties-panel';
import propertiesProviderModule from './bpmn/bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from './bpmn/camunda-bpmn-moddle/resources/camunda';
import diagramXML from './newDiagram.bpmn';


export default class ReactBpmn extends React.Component {

  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.proc = this.props.proc;
    this.state = { };
    this.containerRef = React.createRef();
    this.bpmnModeler = Object();
  }

  createNewDiagram() {
    this.openDiagram(diagramXML);
  }

  openDiagram(xml) {
    this.bpmnModeler.importXML(xml, function(err) {
      if (err) {
        // this.container.find('.error pre').text(err.message);
        console.error(err);
      }
    });
  }
  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };
  async pushFile(event) {
    var files = this.firstUpload.cachedFileArray[0];
    let helper = this.core.make("oxzion/restClient");
    let ancFile = await helper.request(
      "v1",
      "/attachment", {
        type: "APP",
        files: files
      },
      "filepost"
      );
    return ancFile;
  }
  submitData = event => {
    if (this.props.formAction == "edit") {
      this.pushFile().then(response => {
        console.log(response);
        });
    } else {
      this.pushFile().then(response => {
        console.log(response);
      });
      }
      this.props.save();
    };

  componentDidMount() {
    this.bpmnModeler = new BpmnModeler({
      container: '#bpmn-modeler',
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });
    this.createNewDiagram();
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <Window onClose={this.props.cancel} draggable={false} >
      <div className="content with-diagram" id="reactComponent">
      <div className="message error">
      <div className="note">
      <p>Ooops, we could not display the BPMN 2.0 diagram.</p>
      <div className="details">
      <span>Import Error Details</span>
      <pre></pre>
      </div>
      </div>
      </div>
      <div id="bpmn-canvas">
      <div id="bpmn-modeler" ref={ this.containerRef }></div>
      <div className="properties-panel-parent" id="js-properties-panel"></div>
      </div>
      <ul className="buttons">
      <li>
      Download
      </li>
      <li>
      <button id="save" onClick={this.props.cancel} title="Save Workflow">
      Save
      </button>
      </li>
      <li>
      <button id="cancel" onClick={this.props.cancel} title="Cancel">
        Cancel
      </button>
      </li>
      </ul>
      </div>
      </Window>
      );
  }
}
