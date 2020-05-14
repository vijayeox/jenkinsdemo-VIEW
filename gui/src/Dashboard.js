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
      dashboardFilter: this.props.dashboardFilter
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
          this.loader.destroy()
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
          thiz.loader.destroy();
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
              filterParams.push("AND")

              //prepare endDate array
              filterarray = []
              filterarray.push(filter["field"])
              filterarray.push("<=")
              filterarray.push(endDate)
            }
          } else {
            //single date passed
            filterarray.push(filter["field"])
            filterarray.push(filter["operator"])
            filterarray.push(startDate)
          }
        } else {
          filterarray.push(filter["field"])
          filterarray.push(filter["operator"])
          filterarray.push(filter["value"]["selected"])
        }
        if (index > 0) {
          //adding And to the filter array when multiple paramters are passed
          filterParams.push("AND")
        }
        filterParams.push(filterarray)
      })
      filterParams && filterParams.length != 0 ?
        this.updateGraph(filterParams)
        :
        this.updateGraph()

    }
  }

  updateGraph = async (filterParams) => {
    if (null === this.state.htmlData) {
      return;
    }
    let root = document;
    var widgets = root.getElementsByClassName('oxzion-widget');
    let thiz = this;
    this.loader.show();
    let errorFound = false;
    let widgetCounter = 0 //keeps count of widget rendered asynchronously
    //dispose and render if already exist
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
      this.loader.destroy()
    }
    else{
      for (let widget of widgets) {
        var attributes = widget.attributes;
        //dispose 
  
        var widgetUUId = attributes[WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE].value;
        this.getWidgetByUuid(widgetUUId, filterParams)
        .then(response=>{
          response.data.widget && console.timeEnd("analytics/widget/"+response.data.widget.uuid+"?data=true")
          widgetCounter++
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
          if(widgetCounter==widgets.length){
            this.loader.destroy();
          }
        })
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
    this.helper.request('v1', url, null, 'get').
      then(response => {
        let element = document.getElementById(elementId);
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
        this.loader.destroy()
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
    return <div dangerouslySetInnerHTML={{ __html: this.state.htmlData }} />;
  }
}

export default Dashboard;
