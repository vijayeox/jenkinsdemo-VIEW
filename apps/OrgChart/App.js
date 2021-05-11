import './index.scss';
import React, { Component } from 'react';
import OrgChart from '@unicef/react-org-chart'

class App extends Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.userProfile = this.core.make("oxzion/profile").get();
        this.userProfile = this.userProfile.key;
        this.loader = this.core.make("oxzion/splash");
        this.helper = this.core.make("oxzion/restClient");
        this.state = {
          tree: {},
          downloadingChart: false,
          config: {},
          highlightPostNumbers: [1],
          dataReady: false
        }
      }
      componentDidMount(){
        this.getOrgOwner();
      }
    
      getChild = id => {
        return 
      }
      async getByManager(id){
        return await this.helper.request("v1","/account/subordinate/"+id ,{},"post");
      }
      getSubOrdinates = async (managerId) => {
        var subOrdinates = [];
        this.loader.show();
        var subOrdinatesResponse = await this.getByManager(managerId);
        for (let i = 0; i < subOrdinatesResponse['data'].length; i++) {
          let person = {};
          var personObject = subOrdinatesResponse['data'][i];
          person.id = personObject.uuid;
          person.avatar = personObject.icon;
          person.department = '';
          person.name = personObject.name;
          person.title = personObject.title;
          person.totalReports = 0;
          person.hasImage = true;
          var hasChildren = false;
          if(personObject.childCount > 0){
            hasChildren = true;
          }
          subOrdinates.push({id:personObject.uuid,person: person,hasParent:true,hasChild: hasChildren});
        }
        this.loader.destroy();
        return subOrdinates;
      }
      async getOrgOwner() {
        this.loader.show();
        let owner = await this.helper.request("v1","/account/subordinate" ,{},"post");
        let person = {};
        person.id = owner.data.uuid;
        person.avatar = owner.data.icon;
        person.department = '';
        person.name = owner.data.name;
        person.title = owner.data.title;
        person.totalReports = 0;
        person.hasImage = true;
        var hasChildren = false;
        if(owner.data.childCount > 0){
          hasChildren = true;
        }
        let treeChart = {id:owner.data.uuid,person: person,children: [],hasChild: hasChildren,hasParent: false};
        this.setState({tree : treeChart});
        this.loader.destroy();
        this.setState({dataReady : true});
        return treeChart;
      }
    
      handleDownload = () => {
        this.setState({ downloadingChart: false })
      }
    
      handleOnChangeConfig = config => {
        this.setState({ config: config })
      }
    
      handleLoadConfig = () => {
        const { config } = this.state
        return config
      }
    
      render() {
        const { tree, downloadingChart } = this.state
    
        //For downloading org chart as image or pdf based on id
        const downloadImageId = 'download-image'
        const downloadPdfId = 'download-pdf'
    
        return (
              <div id="root">
                <div className="zoom-buttons">
                  <button
                    className="btn btn-outline-primary zoom-button"
                    id="zoom-in"
                  > +
                  </button>
                  <button
                    className="btn btn-outline-primary zoom-button"
                    id="zoom-out"
                  >
                    -
                  </button>
                </div>
                <div className="download-buttons">
                  <button className="btn btn-outline-primary" id="download-image">
                    Download as image
                  </button>
                  <button className="btn btn-outline-primary" id="download-pdf">
                    Download as PDF
                  </button>
                  {downloadingChart && <div>Downloading chart</div>}
                </div>
                {this.state.dataReady?
                <OrgChart
                  tree={tree}
                  downloadImageId={downloadImageId}
                  downloadPdfId={downloadPdfId}
                  onConfigChange={config => {
                    this.handleOnChangeConfig(config)
                  }}
                  loadConfig={d => {
                    let configuration = this.handleLoadConfig(d)
                    if (configuration) {
                      return configuration
                    }
                  }}
                  downlowdedOrgChart={d => {
                    this.handleDownload()
                  }}
                  loadChildren={d => { 
                    console.log(d.id)
                    return this.getSubOrdinates(d.id)
                  }}
                />:null}
              </div>
        )
      }
    }

export default App;