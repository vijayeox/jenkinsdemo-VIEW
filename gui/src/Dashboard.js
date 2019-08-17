import React from "react";
import osjs from "osjs";
let helper = osjs.make("oxzion/restClient");
var scripts = [
  "https://www.amcharts.com/lib/4/core.js",
  "https://www.amcharts.com/lib/4/charts.js",
  "https://www.amcharts.com/lib/4/themes/animated.js",
  "https://www.amcharts.com/lib/4/themes/kelly.js"
];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      htmlData: this.props.htmlData ? this.props.htmlData : null
    };
    this.loader = this.core.make("oxzion/splash");
    this.props.proc.on("destroy", () => {
      this.removeScriptsFromDom();
    });
  }

  async GetDashboardHtmlDataByUUID(uuid) {
    let response = await helper.request(
      "v1",
      "analytics/dashboard/" + uuid,
      {},
      "get"
    );
    return response;
  }

  componentWillMount() {
    scripts.forEach((sc, index) => {
      const script = document.createElement("script");
      script.src = sc;
      script.className = "chartScripts";
      script.async = true;
      document.body.appendChild(script);
    });

    if (this.props.uuid) {
      this.loader.show();
      this.GetDashboardHtmlDataByUUID(this.props.uuid).then(response => {
        this.loader.destroy();
        if (response.status == "success") {
          this.setState({
            htmlData: response.data.content ? response.data.content : null
          }).then(() => {
            this.callUpdateGraph();
          });
        } else {
          this.setState({
            htmlData: `<p>No Data</p>`
          });
        }
      });
    } else if (this.state.htmlData != null) {
      this.callUpdateGraph();
    }
  }

  removeScriptsFromDom() {
    function removeElement(element) {
      while (element.length > 0) {
        element[0].parentNode.removeChild(element[0]);
      }
    }
    removeElement(document.getElementsByClassName("chartScripts"));
  }

  componentDidUpdate(prevProps) {
    if (this.props.htmlData) {
      if (this.props.htmlData !== prevProps.htmlData) {
        this.setState({
          htmlData: this.props.htmlData
        });
      }
    }
  }

  callUpdateGraph = () => {
    var self = this;
    if (this.state.htmlData != null) {
      setTimeout(function() {
        // root = parent document or iframe document
        var root = document;
        //   var iframeElement = document.querySelector('iframe');
        //   var iframeWindow = iframeElement.contentWindow;
        // var iframeDocument = iframeWindow.contentDocument? iframeWindow.contentDocument: iframeWindow.contentWindow.document;
        //   var root = iframeWindow.document;
        self.updateGraph(root);
      }, 10000);
    }
  };

  panelData = widget => {
    //Ajax call to get the value
    // widget.attributes.uuid.value;
    widget.innerHTML = "50000";
  };

  pieChart = widget => {
    //Ajax call to get pieChart data
    // widget.attributes.uuid.value;
    if (am4charts && am4themes_animated && am4themes_kelly) {
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_kelly);
      widget.children.forEach(element => {
        if (element.className == "oxzion-widget-content") {
          var chart1 = am4core.create(element, am4charts.PieChart);
          var series1 = chart1.series.push(new am4charts.PieSeries());
          series1.dataFields.value = "economy";
          series1.dataFields.category = "country";
          chart1.data = [
            { country: "USA", economy: 21.5 },
            { country: "China", economy: 14.2 },
            { country: "Japan", economy: 5.2 },
            { country: "Germany", economy: 4.2 },
            { country: "UK", economy: 2.9 },
            { country: "India", economy: 2.9 }
          ];
        }
      });
    }
  };

  barChart = widget => {
    //Ajax call to get pieChart data
    // widget.attributes.uuid.value;

    if (am4charts && am4themes_animated && am4themes_kelly) {
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_kelly);

      widget.children.forEach(element => {
        if (element.className == "oxzion-widget-content") {
          var chart2 = am4core.create(element, am4charts.XYChart);
          var categoryAxis = chart2.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "country";
          categoryAxis.title.text = "Country";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 20;
          var valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());
          valueAxis.title.text = "Economy (Trillion $)";
          var series2 = chart2.series.push(new am4charts.ColumnSeries());
          series2.dataFields.valueY = "economy";
          series2.dataFields.categoryX = "country";
          series2.name = "Economy";
          series2.tooltipText = "{name}: [bold]{valueY}[/]";

          var series3 = chart2.series.push(new am4charts.ColumnSeries());
          series3.dataFields.valueY = "economy1";
          series3.dataFields.categoryX = "country";
          series3.name = "Economy 1";
          series3.tooltipText = "{name}: [bold]{valueY}[/]";
          series3.stacked = true;

          chart2.data = [
            { country: "USA", economy: 21.5 },
            { country: "China", economy: 14.2 },
            { country: "Japan", economy: 5.2 },
            { country: "Germany", economy: 4.2 },
            { country: "UK", economy: 2.9 },
            { country: "India", economy: 2.9 }
          ];
          chart2.cursor = new am4charts.XYCursor();
        }
      });
    }
  };

  updateGraph = root => {
    //please check Dashboard app >> sampleData.js
    console.log("called");
    var widgets = root.getElementsByClassName("oxzion-widget");
    widgets.forEach(widget => {
      switch (widget.attributes.type.value) {
        case "panel":
          this.panelData(widget);
          break;
        case "pieChart":
          this.pieChart(widget);
          break;
        case "barChart":
          this.barChart(widget);
          break;
      }
    });
  };

  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.state.htmlData }} />;
  }
}

export default Dashboard;
