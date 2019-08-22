import React from "react";
import ReactDOM from "react-dom";

class AggregateValue extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
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
                                    <td align="center" valign="middle">300,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
        );
    }
}
export default AggregateValue;

