import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from './barChart';
import PieChart from './pieChart';
import LineChart from './lineChart';
import AggregateValue from './aggregateValue';
import './globalFunctions';
import Swal from "sweetalert2";
import '../../../../../gui/src/public/css/sweetalert.css';
import './widgetEditorApp.scss';

class WidgetEditorApp extends React.Component {
    constructor(props) {
        super(props);
        this.widgetList = [];

        let editor = props.editor;
        let widgetConfiguration = editor.plugins.oxzion.getWidgetConfiguration(editor);
        this.state = {
            widget: {
                align: widgetConfiguration ? widgetConfiguration.align : null,
                uuid: widgetConfiguration ? widgetConfiguration.id : null,
                type: null
            },
            readOnly:true,
            disableWidgetSelection: widgetConfiguration ? (widgetConfiguration.id ? true : false) : false
        };
    }

    makeReadOnly = (flag) => {
        this.setState({
            readOnly:flag
        });
        this.refs.widget.makeReadOnly(flag);
    }

    loadWidget = (uuid) => {
        let thiz = this;
        window.postDataRequest(`analytics/widget/${uuid}?data=true`).
            then(function(responseData) {
                let widget = responseData.widget;
                thiz.setState((state) => {
                    for (let property in widget) {
                        state.widget[property] = widget[property];
                    }
                    state.widget.align = null;
                    return state;
                });
                thiz.makeReadOnly(true);
            }).
            catch(function(responseData) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops ...',
                    text: 'Could not load widget. Please try after some time.'
                });
            });
    }

    widgetSelectionChanged = (e) => {
        let widgetId = e.target.value;
        if (widgetId === this.state.widget.uuid) {
            return;
        }
        this.loadWidget(widgetId);
    }

    copyWidget = (e) => {
        this.makeReadOnly(false);
    }

    //Set the react app instance on the window so that the window can call this app to get its state before the window closes.
    componentDidMount() {
        window.widgetEditorApp = this;

        let thiz = this;
        window.postDataRequest('analytics/widget').
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

        if (thiz.state.widget.uuid) {
            thiz.loadWidget(thiz.state.widget.uuid);
        }
    }

    getWidgetStateForCkEditorPlugin() {
        let widget = this.state.widget;
        return {
            align: widget.align,
            type: widget.type === 'aggregate' ? 'inline' : 'block',
            id: widget.uuid
        };
    }

    updateState = (name, value) => {
        this.setState({
            [name]:value
        });
    }

    validateUserInput() {
        return true;
    }

    render() {
        let htmlWidgetOptions = this.widgetList.map((widget, index) => {
                return (
                    <option key={widget.uuid} value={widget.uuid}>{widget.name}</option>
                )
            });

        return (
            <form className="widget-editor-form">
                <div className="form-group row">
                    <div className="col-1 right-align">
                        <label htmlFor="selectWidget" className="right-align col-form-label form-control-sm">Widget</label>
                    </div>
                    <div className="col-4">
                        <select id="selectWidget" name="selectWidget" className="form-control form-control-sm" placeholder="Select widget" 
                            value={this.state.widget.uuid ? this.state.widget.uuid : ''} onChange={this.widgetSelectionChanged} 
                            disabled={this.state.disableWidgetSelection}>
                            <option key="" value="">-Select widget-</option>
                            {htmlWidgetOptions}
                        </select>
                    </div>
                    <div className="col-1">
                        {this.state.widget.uuid && (this.state.widget.type !== 'inline') && 
                        <button type="button" className="btn btn-primary add-series-button" title="Copy widget" onClick={this.copyWidget}>
                            <span className="fa fa-copy" aria-hidden="true"></span>
                        </button>
                        }
                    </div>
                    <div className="col-2 right-align">
                    {!this.state.readOnly && this.state.widget.uuid && 
                            <label htmlFor="widgetName" className="right-align col-form-label form-control-sm">Widget Name</label>
                    }
                    </div>
                    <div className="col-4">
                    {!this.state.readOnly && this.state.widget.uuid && 
                        <input type="text" id="widgetName" name="widgetName" className="form-control form-control-sm" 
                            onChange={this.inputChanged} value={this.state.widgetName}/>
                    }
                    </div>
                </div>
                <div className="row">
                    {(this.state.widget.type === 'barChart') && 
                        <BarChart ref="widget" widget={this.state.widget} updateParentState={this.updateState}/>
                    }
                    {(this.state.widget.type === 'lineChart') && 
                        <LineChart ref="widget" widget={this.state.widget} updateParentState={this.updateState}/>
                    }
                    {(this.state.widget.type === 'pieChart') && 
                        <PieChart ref="widget" widget={this.state.widget} updateParentState={this.updateState}/>
                    }
                    {(this.state.widget.type === 'inline') && 
                        <AggregateValue ref="widget" widget={this.state.widget} updateParentState={this.updateState}/>
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

