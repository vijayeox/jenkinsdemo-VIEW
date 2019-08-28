import React from 'react';
import ReactDOM from 'react-dom';

class AggregateValue extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.postDataRequest('analytics/widget/' + this.props.widgetId, {}).
            then(function(responseData) {
                var previewElement = document.querySelector('span#widgetPreview');
                previewElement.innerHTML = responseData.data;
            }).
            catch(function(responseData) {
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
                                    <td align="center" valign="middle"><span id="widgetPreview">300,000</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
        );
    }
}

export default AggregateValue;

