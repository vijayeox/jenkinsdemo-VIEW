import React, { Component } from 'react';
import WidgetRenderer from './WidgetRenderer';
import WidgetDrillDownHelper from './WidgetDrillDownHelper';
import Swal from 'sweetalert2';
import './WidgetStyles.css'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;

    this.state = {
      htmlData: this.props.htmlData ? this.props.htmlData : null,
      dashboardFilter: this.props.dashboardFilter,
      widgetCounter: 0
    };
    this.content = this.props.content;
    this.renderedWidgets = {};
    var uuid = '';
    if (this.props.uuid) {
      uuid = this.props.uuid;
    }
    if (this.props.content) {
      var content = this.props.content
      if (content && content.uuid) {
        uuid = content.uuid;
      }
    }
    this.uuid = uuid;
    this.dashboardDivId = "dashboard_" + this.uuid;
    this.loader = this.core.make("oxzion/splash");
    this.helper = this.core.make("oxzion/restClient");
    this.props.proc.on("destroy", () => {
      this.removeScriptsFromDom();
    });
  }

  async getDashboardHtmlDataByUuid(uuid) {
    let response = await this.helper.request(
      "v1",
      "analytics/dashboard/" + uuid,
      {},
      "get"
    );
    return response;
  }
  async getWidgetByUuid(uuid, filterParams) {

    let filterParameter = (filterParams && filterParams != []) ? ("&filter=" + JSON.stringify(filterParams)) : ''
    let response = await this.helper.request(
      "v1",
      "analytics/widget/" + uuid + '?data=true' + filterParameter,
      {},
      "get"
    );


    return response;
  }

  appendToDashboardContainer(htmlData){
    let container="<div id='dasboard-viewer-content' class='dasboard-viewer-content'>"+htmlData+"</div>"
    return container
  }

  componentDidMount() {
    if (this.uuid) {
      let thiz = this;
      this.getDashboardHtmlDataByUuid(this.uuid).then(response => {
        if (response.status == "success") {
          this.setState({
            htmlData: response.data.dashboard.content ? response.data.dashboard.content : null
          });
          this.updateGraph();
        } else {
          this.setState({
            htmlData: `<p>No Data</p>`
          });
        }
      }).
        catch(function (response) {
          console.error('Could not load widget.');
          console.error(response);
          Swal.fire({
            type: 'error',
            title: 'Oops ...',
            text: 'Could not load widget. Please try after some time.'
          });
        });
    } else if (this.state.htmlData != null) {
      this.updateGraph();
    }
    window.addEventListener('message', this.widgetDrillDownMessageHandler, false);
  }

  componentWillUnmount() {
    for (let elementId in this.renderedWidgets) {
      let widget = this.renderedWidgets[elementId];
      if (widget) {
        if (widget.dispose) {
          widget.dispose();
        }
        delete this.renderedWidgets[elementId];
      }
    }
    window.removeEventListener('message', this.widgetDrillDownMessageHandler, false);
  }

preparefilter(filter1,filter2){
  var filter=[]
  filter.push(filter1)
  filter.push("AND")
  filter.push(filter2)
  return filter
}

  componentDidUpdate(prevProps) {
    //update component when filter is changed
    if (prevProps.dashboardFilter != this.props.dashboardFilter) {
      let filterParams = []
      this.props.dashboardFilter.map((filter, index) => {
        let filterarray = []
        if (filter["dataType"] == "date") {
          var startDate = filter["startDate"]
          var endDate = null
          if (filter["startDate"] && filter["endDate"]) {
            //convert startDate object to string
            if (typeof startDate !== "string") {
              startDate = filter["startDate"]
              startDate = startDate.getFullYear() + "-" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + startDate.getDate()).slice(-2))
            }
            //date range received
            if (filter["operator"] == "gte&&lte") {
              endDate = filter["endDate"]
              if (typeof endDate !== "string") {
                endDate = endDate.getFullYear() + "-" + (("0" + (endDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + endDate.getDate()).slice(-2))
              }
              //prepare startDate array
              filterarray.push(filter["field"])
              filterarray.push(">=")
              filterarray.push(startDate)
              filterParams.push(filterarray)
              

              //prepare endDate array
              filterarray = []
              filterarray.push(filter["field"])
              filterarray.push("<=")
              filterarray.push(endDate)
              filterParams.push(filterarray)
            }
          } else {
            //single date passed
            filterarray.push(filter["field"])
            filterarray.push(filter["operator"])
            filterarray.push(startDate)
            filterParams.push(filterarray)
          }
        } else {
          filterarray.push(filter["field"])
          filterarray.push(filter["operator"])
          filterarray.push(filter["value"]["selected"])
          filterParams.push(filterarray)
        }
      })
      let preapredFilter
      if(filterParams && filterParams.length>1){
        preapredFilter=filterParams[0]
        for(let i=1;i<filterParams.length;i++){
          preapredFilter=this.preparefilter(preapredFilter,filterParams[i])
          
        }
      }

      if(filterParams && filterParams.length != 0)
        {
          if(filterParams.length>1)
            this.updateGraph(preapredFilter)
          else
            this.updateGraph(filterParams)
        }     
       else{
         this.updateGraph()
       }
    }
  }

  updateGraph = async (filterParams) => {
    console.log(filterParams);
    if (null === this.state.htmlData) {
      return;
    }
    let root = document;
    var widgets = root.getElementsByClassName('oxzion-widget');
    let thiz = this;
    // this.loader.show();
    let errorFound = false;
    for (let elementId in this.renderedWidgets) {
      let widget = this.renderedWidgets[elementId];
      if (widget) {
        if (widget.dispose) {
          widget.dispose();
        }
        delete this.renderedWidgets[elementId];
      }
    }
    
    if(widgets.length==0){
      this.loader.destroy();
    }
    else{
      for (let widget of widgets) {
        var attributes = widget.attributes;
        //dispose 
        var that = this;
        var widgetUUId = attributes[WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE].value;
        this.getWidgetByUuid(widgetUUId, filterParams)
        .then(response=>{
          if(response.status =="success"){
            response.data.widget && console.timeEnd("analytics/widget/"+response.data.widget.uuid+"?data=true")
            that.setState({ widgetCounter: that.state.widgetCounter+1});
            if ('error' === response.status) {
              console.error('Could not load widget.');
              console.error(response);
              errorFound = true;
            }
            else {
            //dispose if widget exists
            let widgetObject = WidgetRenderer.render(widget, response.data.widget);
            if (widgetObject) {
              this.renderedWidgets[widgetUUId] = widgetObject;
            }
          }
          if(that.state.widgetCounter>=widgets.length){
            this.loader.destroy();
          }
          } else {
            that.setState({ widgetCounter: that.state.widgetCounter+1});
            if(this.state.widgetCounter>=widgets.length){
              that.loader.destroy();
            }
          }
        });
      }
    }
    if (errorFound) {
      Swal.fire({
        type: 'error',
        title: 'Oops ...',
        text: 'Could not load one or more widget(s). Please try after some time.'
      });
      return;
    }
  };

  widgetDrillDownMessageHandler = (event) => {
    let eventData = event.data;
    let action = eventData[WidgetDrillDownHelper.MSG_PROP_ACTION];
    if ((action !== WidgetDrillDownHelper.ACTION_DRILL_DOWN) && (action !== WidgetDrillDownHelper.ACTION_ROLL_UP)) {
      return;
    }
    let target = eventData[WidgetDrillDownHelper.MSG_PROP_TARGET];
    if (target && (target !== 'widget')) {
      return;
    }

    var thiz = this;
    function cleanup(elementId) {
      let widget = thiz.renderedWidgets[elementId];
      if (widget) {
        if (widget.dispose) {
          widget.dispose();
        }
        delete thiz.renderedWidgets[elementId];
      }
    }

    let elementId = eventData[WidgetDrillDownHelper.MSG_PROP_ELEMENT_ID];
    let widgetId = eventData[WidgetDrillDownHelper.MSG_PROP_WIDGET_ID];
    cleanup(elementId);

    let nextWidgetId = eventData[WidgetDrillDownHelper.MSG_PROP_NEXT_WIDGET_ID];
    if (nextWidgetId) {
      widgetId = nextWidgetId;
    }

    let url = `analytics/widget/${widgetId}?data=true`;
    let filter = eventData[WidgetDrillDownHelper.MSG_PROP_FILTER];
    if (filter && ('' !== filter)) {
      url = url + '&filter=' + encodeURIComponent(filter);
    }
    //starting spinner 
    if (eventData.elementId) {
      var widgetDiv = document.getElementById(eventData.elementId);
      this.loader.show(widgetDiv);
    }
    var self = this;
    let element = document.getElementById(elementId);
    this.helper.request('v1', url, null, 'get').
      then(response => {
        let widgetObject = WidgetRenderer.render(element, response.data.widget, eventData);
        if (widgetObject) {
          self.renderedWidgets[elementId] = widgetObject;
        }
        if (eventData.elementId) {
          var widgetDiv = document.getElementById(eventData.elementId);
        }
        this.loader.destroy(element)
      }).
      catch(response => {
        this.loader.destroy(element)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Could not fetch the widget data. Please try after some time.'
        });
        if (eventData.elementId) {
          var widgetDiv = document.getElementById(eventData.elementId);
        }
      });
  }

  render() {
      return  <div id={this.dashboardDivId} dangerouslySetInnerHTML={{ __html: this.appendToDashboardContainer(this.state.htmlData?this.state.htmlData:'') }} />;
  }
}

export default Dashboard;
