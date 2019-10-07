import React from 'react';
import ReactDOM from 'react-dom';

class AggregateValue extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.widget;
    }

    componentDidMount() {
        window.postDataRequest(`analytics/widget/${this.state.uuid}?data=true`).
            then(function(responseData) {
                var previewElement = document.querySelector('span#widgetPreview');
                previewElement.innerHTML = responseData.widget.data;
            });
    }

    render() {
        return (
            <>
                <div className="form-group col">
                    <label>Value properties</label>
                    <div className="form-control">
                        <div className="form-row">
                        </div>
                    </div>
                </div>
                <div className="form-group col">
                    <label>Preview</label>
                    <table>
                        <tbody>
                            <tr>
                                <td align="center" valign="middle"><span id="widgetPreview">[Loading...]</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

export default AggregateValue;

