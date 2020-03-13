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
    if (this.uuid) {
      this.loader.show();
      this.getDashboardHtmlDataByUuid(this.uuid).then(response => {
        this.loader.destroy();
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

  updateGraph = () => {
    if (this.state.htmlData != null) {
      let root = document;
      var widgets = root.getElementsByClassName("oxzion-widget");
      for (let widget of widgets) {
        var attributes = widget.attributes;
        var widgetUUId = attributes['data-oxzion-widget-id'].value;
        this.getWidgetByUuid(widgetUUId)
          .then(response => {
            let widgetObject = WidgetRenderer.render(widget, response.data.widget)
            if (widgetObject !== null)
              this.renderedWidgets[widgetUUId] = widgetObject
          })
      }
    }
  };

    widgetDrillDownMessageHandler = (event) => {
        let data = event.data;
        let action = data['action'];
        if ((action !== 'oxzion-widget-drillDown') && (action !== 'oxzion-widget-rollUp')) {
            return;
        }

        var thiz = this;
        function cleanup(elementId) {
            let widget = thiz.renderedWidgets[elementId];
            if (widget) {
                if (widget.dispose) {
                    widget.dispose();
                }
                delete thiz.renderedCharts[elementId];
            }
        }

        let elementId = data['elementId'];
        let widgetId = data['widgetId'];
        cleanup(elementId);

        let newWidgetId = data['newWidgetId'];
        if (newWidgetId) {
            widgetId = newWidgetId;
        }

        let url = `analytics/widget/${widgetId}?data=true`;
        let filter = data['filter'];
        if (filter && ('' !== filter)) {
            url = url + '&filter=' + encodeURIComponent(filter);
        }
        var self = this;
        this.helper.request('v1', url, null, 'get').
        then(response => {
            let element = document.getElementById(elementId);
            let widgetObject = WidgetRenderer.render(element, response.data.widget)
            if (widgetObject) {
                self.renderedWidgets[widgetId] = widgetObject;
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
