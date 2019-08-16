import React from "react";
import ReactDOM from "react-dom";
import BarChart from "./barChart";
import AggregateValue from "./aggregateValue";

class App extends React.Component {
    constructor(props) {
        super(props);
        var editor = props.editor;
        var widgetData = editor.plugins.oxzion.getWidgetData(editor);
        if (!widgetData) {
            widgetData = {
                "align":null,
                "type":null,
                "id":null
            };
        }
        this.state = {
            "widgetAlign": widgetData.align,
            "widgetType":widgetData.type,
            "widgetId":widgetData.id
        };
    }

    alignmentChanged = (e) => {
        this.setState({
            widgetAlign:e.target.value
        });
    }

    widgetSelectionChanged = (e) => {
        this.setState({
            widgetId:e.target.value
        });

        //This code is for testing/demo only. To be removed later when this data is retrieved from the server.
        var widgetTypeMap = {
            'f5b8ee95-8da2-409a-8cf0-fa5b4af10667':'inline',
            'f5b8ee95-8da2-409a-8cf1-fa5b4af10667':'block',
            'f5b8ee95-8da2-409a-8cf2-fa5b4af10667':'block',
            'f5b8ee95-8da2-409a-8cf3-fa5b4af10667':'inline',
            'f5b8ee95-8da2-409a-8cf4-fa5b4af10667':'block'
        };
        this.setState({
            widgetType:widgetTypeMap[e.target.value],
            widgetAlign:null
        });
    }

    //Set the reactApp instance on the window so that the window can call this app to get its state before the window closes.
    componentDidMount() {
        window.reactApp = this;
    }

    getState() {
        return {
            'align':this.state.widgetAlign,
            'type':this.state.widgetType,
            'id':this.state.widgetId
        }
    }

    render() {
        return (
            <form>
                <div className="row">
                    <div className="form-group col">
                        <label>Widget</label>
                        <select className="form-control custom-select" placeholder="Select widget" value={this.state.widgetId ? this.state.widgetId : ''} onChange={this.widgetSelectionChanged}>
                            <option value="">-Select widget-</option>
                            <option value="f5b8ee95-8da2-409a-8cf0-fa5b4af10667">Sales YTD</option>
                            <option value="f5b8ee95-8da2-409a-8cf1-fa5b4af10667">Sales by sales person</option>
                            <option value="f5b8ee95-8da2-409a-8cf2-fa5b4af10667">Quarterly revenue target</option>
                            <option value="f5b8ee95-8da2-409a-8cf3-fa5b4af10667">Revenue YTD</option>
                            <option value="f5b8ee95-8da2-409a-8cf4-fa5b4af10667">Product sales</option>
                        </select>
                    </div>
                    <div className="form-group col">
                        <label>Alignment</label>
                        <div className="form-control">
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">Left</label>&nbsp;&nbsp;
                                <input className="form-check-input" type="radio" id="leftAlignCheckbox" name="alignment" value="left" checked={!this.state.widgetAlign || (this.state.widgetAlign === 'left') || (this.state.widgetAlign === '')} onChange={this.alignmentChanged} disabled={this.state.widgetType != 'block'}/>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">Center</label>&nbsp;&nbsp;
                                <input className="form-check-input" type="radio" id="centerAlignCheckbox" name="alignment" value="center" checked={this.state.widgetAlign === 'center'} onChange={this.alignmentChanged} disabled={this.state.widgetType != 'block'}/>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">Right</label>&nbsp;&nbsp;
                                <input className="form-check-input" type="radio" id="rightAlignCheckbox" name="alignment" value="right" checked={this.state.widgetAlign === 'right'} onChange={this.alignmentChanged} disabled={this.state.widgetType != 'block'}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {(this.state.widgetType === 'block') && 
                        <BarChart/>
                    }
                    {(this.state.widgetType === 'inline') && 
                        <AggregateValue/>
                    }
                </div>
            </form>
        );
    }
}

export default App;

