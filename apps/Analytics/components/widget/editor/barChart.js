import React from "react";
import ReactDOM from "react-dom";

class BarChart extends React.Component {
    constructor(props) {
        super(props);
    }

    static getChartTemplate() {
        return {
            "series":[{
                "type":"ColumnSeries",
                "name":"Sales",
                "dataFields": {
                    "valueY":"sales",
                    "categoryX":"person"
                },
                "tooltipText":"{name}:[bold]{categoryX} - {valueY}[/]"
            }],
            "xAxes":[{
                "type":"CategoryAxis",
                "dataFields":{
                    "category":"person"
                },
                "title":{
                    "text":"Person"
                },
                "renderer":{
                    "grid": {
                        "template": {
                            "location":0
                        }
                    },
                    "minGridDistance":1
                }
            }],
            "yAxes": [{
                "type":"ValueAxis",
                "title":{
                    "text":"Sales (Million $)"
                }
            }],
            "cursor": {
                "type":"XYCursor"
            }
        };
    }

    componentDidMount() {
        var barChart = am4core.createFromConfig(BarChart.getChartTemplate(), document.querySelector('div#chartPreview'), am4charts.XYChart);
        barChart.data = [
            {"person": "Bharat", "sales": 4.2},
            {"person": "Harsha", "sales": 5.2},
            {"person": "Mehul", "sales": 15.2},
            {"person": "Rajesh", "sales": 2.9},
            {"person": "Ravi", "sales": 2.9},
            {"person": "Yuvraj", "sales": 14.2}
        ];
    }

    render() {
        return (
                <>
                    <div className="form-group col">
                        <label>Bar chart properties</label>
                        <div className="form-control">
                            <div className="form-row">
                                <div className="form-group col">
                                    
                                </div>
                                <div className="form-group col">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group col">
                        <label>Preview</label>
                        <div id="chartPreview" className="form-control" style={{height:'300px'}}>
                        </div>
                    </div>
                </>
        );
    }
}
export default BarChart;

