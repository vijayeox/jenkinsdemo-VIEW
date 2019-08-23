import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from './barChart';
import AggregateValue from './aggregateValue';
import './globalFunctions';

class WidgetEditorApp extends React.Component {
    constructor(props) {
        super(props);
        var editor = props.editor;
        var widgetData = editor.plugins.oxzion.getWidgetData(editor);
        this.state = {
            widget: {
                align: widgetData ? widgetData.align : null,
                type: widgetData ? widgetData.type : null,
                id: widgetData ? widgetData.id : null
            }
        };
    }

    alignmentChanged = (e) => {
        var align = e.target.value;
        this.setState((state) => {
            state.widget.align = align;
            return state.widget;
        });
    }

    widgetSelectionChanged = (e) => {
        var widgetId = e.target.value;

        //This code is for testing/demo only. To be removed later when this data is retrieved from the server.
        var widgetTypeMap = {
            'f5b8ee95-8da2-409a-8cf0-fa5b4af10667':'inline',
            'f5b8ee95-8da2-409a-8cf1-fa5b4af10667':'block',
            'f5b8ee95-8da2-409a-8cf2-fa5b4af10667':'block',
            'f5b8ee95-8da2-409a-8cf3-fa5b4af10667':'inline',
            'f5b8ee95-8da2-409a-8cf4-fa5b4af10667':'block'
        };
        var newWidgetType = widgetTypeMap[widgetId];

        this.setState((state) => {
            state.widget.id = widgetId;
            if (state.widget.type != newWidgetType) {
                state.widget.type = newWidgetType;
                state.widget.align = null;
            }
            return state.widget;
        });
    }

    //Set the react app instance on the window so that the window can call this app to get its state before the window closes.
    componentDidMount() {
        window.widgetEditorApp = this;
    }

    getState() {
        return this.state.widget;
    }

    validateUserInput() {
        return true;
    }

    render() {
        return (
            <form>
                <div className="row">
                    <div className="form-group col">
                        <label>Widget</label>
                        <select className="form-control custom-select" placeholder="Select widget" value={this.state.widget.id ? this.state.widget.id : ''} onChange={this.widgetSelectionChanged}>
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
                                <input className="form-check-input" type="radio" id="leftAlignCheckbox" name="alignment" value="left" checked={!this.state.widget.align || (this.state.widget.align === 'left') || (this.state.widget.align === '')} onChange={this.alignmentChanged} disabled={this.state.widget.type != 'block'}/>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">Center</label>&nbsp;&nbsp;
                                <input className="form-check-input" type="radio" id="centerAlignCheckbox" name="alignment" value="center" checked={this.state.widget.align === 'center'} onChange={this.alignmentChanged} disabled={this.state.widget.type != 'block'}/>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">Right</label>&nbsp;&nbsp;
                                <input className="form-check-input" type="radio" id="rightAlignCheckbox" name="alignment" value="right" checked={this.state.widget.align === 'right'} onChange={this.alignmentChanged} disabled={this.state.widget.type != 'block'}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {(this.state.widget.type === 'block') && 
                        <BarChart/>
                    }
                    {(this.state.widget.type === 'inline') && 
                        <AggregateValue/>
                    }
                </div>
            </form>
        );
    }
}

export default WidgetEditorApp;

window.startWidgetEditorApp = function(editor) {
    ReactDOM.render(<WidgetEditorApp editor={editor}/>, document.getElementById('root'));
}

