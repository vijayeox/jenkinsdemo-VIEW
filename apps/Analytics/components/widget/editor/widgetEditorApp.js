import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from './barChart';
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
                type: widgetConfiguration ? widgetConfiguration.type : null,
                id: widgetConfiguration ? widgetConfiguration.id : null,
                readOnly: true
            }
        };
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
                        state.widget.readOnly = true;
                    }
                    return state.widget;
                });
            }).
            catch(function(responseData) {
            });
    }

    copyWidget = (e) => {
        this.setState((state, props) => {
            this.state.widget.readOnly = false;
            return this.state.widget;
        },
        () => {
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
        let widget = this.state.widget;
        return {
            align: widget.align,
            type: widget.type === 'aggregate' ? 'inline' : 'block',
            id: widget.id
        };
    }

    updateState = (name, value) => {
console.log(value);
//        this.setState({
//            [name]:value
//        });
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
                            value={this.state.widget.id ? this.state.widget.id : ''} onChange={this.widgetSelectionChanged}>
                            <option key="" value="">-Select widget-</option>
                            {htmlWidgetOptions}
                        </select>
                    </div>
                    <div className="col-1">
                        {this.state.widget.id && (this.state.widget.type !== 'inline') && 
                        <button type="button" className="btn btn-primary add-series-button" title="Copy widget" onClick={this.copyWidget}>
                            <span className="fa fa-copy" aria-hidden="true"></span>
                        </button>
                        }
                    </div>
                    <div className="col-2 right-align">
                    {!this.state.widget.readOnly && this.state.widget.id && 
                            <label htmlFor="widgetName" className="right-align col-form-label form-control-sm">Widget Name</label>
                    }
                    </div>
                    <div className="col-4">
                    {!this.state.widget.readOnly && this.state.widget.id && 
                        <input type="text" id="widgetName" name="widgetName" className="form-control form-control-sm" 
                            onChange={this.inputChanged} value="Widget name"/>
                    }
                    </div>
                </div>
                <div className="row">
                    {(this.state.widget.type === 'block') && 
                        <BarChart widget={this.state.widget} updateParentState={this.updateState}/>
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

