import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.state = {
            gridData: undefined
        }
       
    }

    componentDidMount(){
        console.log(this.props.type);
        this.restHelper = this.core.make("oxzion/restClient");
        this.type = this.props.type;
        this.state.gridData = this.getData(this.props.type);
        this.setState({
            gridData: this.getData(this.props.type)
          })
    }

    async getData(){
        let data = await this.restHelper.request("v1", "/"+ this.props.type, {}, "get");
        return data;
    }

    render() {
        return (
            <div>
                <div style={{ paddingTop: '12px' }} className="row">
                    <div className="col s3">
                        <Button className="goBack1" primary={true} style={{ width: '45px', height: '45px' }}>
                            <FaArrowLeft />
                        </Button>
                    </div>
                    <center>
                        <div className="col s6" id="pageTitle">
                            Manage {this.props.config.title}

                        </div>
                    </center>
                </div>
                {console.log(this.state.gridData)}
                <Grid
                    style={{ height: '400px' }}
                    data={this.state.gridData}
                >
                    <Column field="id" title="ID" width="40px" />
                    <Column field="name" title="Name" width="250px" />
                    <Column field="state" title="CategoryName" />
                    <Column field="zip" title="Price" width="80px" />

                    {this.props.column}
                      
                </Grid>
            </div>
        );
    }
}
