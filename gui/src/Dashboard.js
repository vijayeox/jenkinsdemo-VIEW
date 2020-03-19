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
      htmlData: this.props.htmlData ? this.props.htmlData : null
    };
    this.content = this.props.content;
    this.renderedWidgets = {};
    var uuid = '';
    if (this.props.uuid) {
      uuid = this.props.uuid;
    }
    if (this.props.content) {
      var content = JSON.parse(this.props.content)
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
  async getWidgetByUuid(uuid) {
    let response = await this.helper.request(
      "v1",
      "analytics/widget/" + uuid + '?data=true',
      {},
      "get"
    );
    return response;
  }

  componentDidMount() {
    this.loader.show()
    if (this.uuid) {
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
    // if (this.props.htmlData) {
    //   if (this.props.htmlData !== prevProps.htmlData) {
    //     this.setState({
    //       htmlData: this.props.htmlData
    //     });
    //   }
    // }
  }

  updateGraph = async () => {
    if (this.state.htmlData != null) {
      let root = document;
      var widgets = root.getElementsByClassName('oxzion-widget');
      for (let widget of widgets) {
        
        var attributes = widget.attributes;
        var widgetUUId = attributes[WidgetDrillDownHelper.OXZION_WIDGET_ID_ATTRIBUTE].value;
       
        let response = await this.getWidgetByUuid(widgetUUId)
          let widgetObject = WidgetRenderer.render(widget, response.data.widget)
          if (widgetObject !== null)
            this.renderedWidgets[widgetUUId] = widgetObject
        }
    }
    this.loader.destroy()
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

    var self = this;
    this.helper.request('v1', url, null, 'get').
      then(response => {
        let element = document.getElementById(elementId);
        let widgetObject = WidgetRenderer.render(element, response.data.widget, eventData);
        if (widgetObject) {
          self.renderedWidgets[elementId] = widgetObject;
        }
      }).
      catch(response => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Could not fetch the widget data. Please try after some time.'
        });
      });
  }

  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.state.htmlData }} />;
  }
}

export default Dashboard;
