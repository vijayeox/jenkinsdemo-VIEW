import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from './barChart';
import AggregateValue from './aggregateValue';
import './globalFunctions';
import Swal from "sweetalert2";
import '../../../../../gui/src/public/css/sweetalert.css';

class WidgetEditorApp extends React.Component {
    constructor(props) {
        super(props);
        this.widgetList = [];

        let editor = props.editor;
        let widgetConfiguration = editor.plugins.oxzion.getWidgetConfiguration(editor);
        this.state = {
            widget: {
                align: widgetConfiguration ? widgetConfiguration.align : null,
                type: widgetConfiguration ? widgetConfiguration.type : null,
                id: widgetConfiguration ? widgetConfiguration.id : null
            }
        };
    }

    alignmentChanged = (e) => {
        let align = e.target.value;
        this.setState((state) => {
            state.widget.align = align;
            return state.widget;
        });
    }

    widgetSelectionChanged = (e) => {
        let widgetId = e.target.value;
        if (widgetId === this.state.widget.id) {
            return;
        }

        let thiz = this;
        window.postDataRequest('analytics/widget/' + widgetId, {}).
            then(function(responseData) {
                let widget = responseData.widget;
                thiz.setState((state) => {
                    state.widget.id = widget.uuid;
                    if (state.widget.type != widget.type) {
                        state.widget.type = widget.type;
                        state.widget.align = null;
                    }
                    return state.widget;
                });
            }).
            catch(function(responseData) {
            });
    }

    //Set the react app instance on the window so that the window can call this app to get its state before the window closes.
    componentDidMount() {
        window.widgetEditorApp = this;

        let thiz = this;
        window.postDataRequest('analytics/widget', {}).
            then(function(response) {
                thiz.widgetList = response.data;
                thiz.forceUpdate();
            }).
            catch(function(response) {
                Swal.fire({
                    type: 'error',
                    title: 'Widgets not found',
                    text: 'Please configure few widget(s) and try again.'
                });
            });
    }

    getWidgetState() {
        return this.state.widget;
    }

    validateUserInput() {
        return true;
    }

    render() {
        let htmlWidgetOptions = this.widgetList.map((widget, index) => {
                return (
                    <option key={widget.uuid} value={widget.uuid}>{widget.name}</option>
                )
            }, this);

        return (
            <form>
                <div className="row">
                    <div className="form-group col">
                        <label>Widget</label>
                        <select className="form-control custom-select" placeholder="Select widget" value={this.state.widget.id ? this.state.widget.id : ''} onChange={this.widgetSelectionChanged}>
                            <option key="" value="">-Select widget-</option>
                            {htmlWidgetOptions}
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
                        <BarChart widgetId={this.state.widget.id}/>
                    }
                    {(this.state.widget.type === 'inline') && 
                        <AggregateValue widgetId={this.state.widget.id}/>
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

