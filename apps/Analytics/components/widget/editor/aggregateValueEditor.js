import React from 'react';
import ReactDOM from 'react-dom';
import {Overlay, Tooltip} from 'react-bootstrap';

class AggregateValueEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            readOnly:true,
            data:null,
            configuration: null
        };
    }

    setWidgetData = (data) => {
        this.setState({
            data:data
        });
    }

    makeReadOnly = (flag) => {
        this.setState({
            readOnly:flag
        });
    }

    areAllFieldsValid = () => {
        return true;
    }

    render() {
        return (
            <>
                <div className="form-group col">
                    <div className="card" id="propertyBox">
                        <div className="card-header">
                            Configuration
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <div>Query</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group col">
                    <div className="card" id="previewBox">
                        <div className="card-header">
                            Preview
                        </div>
                        <div className="card-body">
                            <b>Value</b>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default AggregateValueEditor;

