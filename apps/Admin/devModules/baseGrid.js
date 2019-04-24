import React from 'react';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import DataLoader from "./DataLoader";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.state = {
            dataState: { take: 10, skip: 0 },
            gridData: undefined,
        }
    }

    dataRecieved = (data) => {
        this.setState({
            gridData: data,
        });
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    createColumns() {
        let table = [];
        for (var i = 0; i < this.props.config.column.length; i++) {
            if (this.props.config.column[i] == "id") {
                table.push(<GridColumn field={this.props.config.column[i]} key={i} width="70px" title="ID" />)
            } else {
                table.push(<GridColumn field={this.props.config.column[i]} key={i} title={this.capitalizeFirstLetter(this.props.config.column[i])} />)
            }
        }
        return table
    }

    render() {
        return (
            <div>
                <DataLoader
                    args={this.core}
                    url={this.props.type}
                    dataState={this.state.dataState}
                    onDataRecieved={this.dataRecieved}
                />
                <div style={{ paddingTop: '12px' }} className="row">
                    <div className="col s3">
                        <Button className="goBack1" primary={true} style={{ width: '45px', height: '45px' }}>
                            <FaArrowLeft />
                        </Button>
                    </div>
                    <center>
                        <div className="col s6" id="pageTitle">
                            Manage {this.capitalizeFirstLetter(this.props.config.title)}
                        </div>
                    </center>

                </div>
                {console.log(this.state.gridData)};
                <Grid data={this.state.gridData}>
                    <GridToolbar>
                        <div>
                            <div style={{ fontSize: "20px" }}>{this.capitalizeFirstLetter(this.props.config.title) + "'s"} List</div>
                        </div>
                    </GridToolbar>
                    {this.createColumns()}
                </Grid>
            </div>
        );
    }
}
