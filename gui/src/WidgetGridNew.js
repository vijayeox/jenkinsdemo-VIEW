
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { filterBy, orderBy, process } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-react-intl'
import { ExcelExport } from '@progress/kendo-react-excel-export';
import WidgetDrillDownHelper from './WidgetDrillDownHelper';
import { WidgetGridLoader } from './WidgetGridLoader.js';


export default class WidgetGridNew extends React.Component {
    constructor(props) {
        super(props);
        this.core = props.core;
        this.excelExporter = null;
        this.allData = props.data ? props.data : [];
        // this.filteredData = null;
        this.filterParams = props.filterParams
        this.uuid = props.uuid
        let configuration = props.configuration;
        this.isDrillDownTable = props.isDrillDownTable;
        this.resizable = configuration ? (configuration.resizable ? configuration.resizable : false) : false;
        this.filterable = configuration ? (configuration.filterable ? configuration.filterable : false) : false;
        this.groupable = configuration ? (configuration.groupable ? configuration.groupable : false) : false;
        this.reorderable = configuration ? (configuration.reorderable ? configuration.reorderable : false) : false;
        this.height = configuration ? (configuration.height ? configuration.height : '100%') : '100%';
        this.width = configuration ? (configuration.width ? configuration.width : '100%') : '100%';
        this.columnConfig = configuration ? (configuration.column ? configuration.column : []) : [];
        this.sortable = configuration ? (configuration.sort ? true : false) : false;
        this.pagerConfig = configuration ? (configuration.pageable ? { pageable: configuration.pageable } : {}) : {};
        this.pageSize = configuration ? (configuration.pageSize ? configuration.pageSize : 10) : 10;
        let oxzionMeta = configuration ? (configuration['oxzion-meta'] ? configuration['oxzion-meta'] : null) : null;
        this.exportToExcel = oxzionMeta ? (oxzionMeta['exportToExcel'] ? oxzionMeta['exportToExcel'] : false) : false;
        this.total_count = props.total_count
        // data can be assigned as allData since the first call needs to be assigned here.
        this.state = {
            displayedData: { data: this.allData, total: this.total_count },
            dataState: { take: this.pageSize, skip: 0 }
        };

    }

    dataStateChange = (e) => {
        console.log(e);
        this.setState({
            ...this.state,
            dataState: e.dataState
        }, () => {
            console.log(this.state.dataState);
        });
    }

    dataRecieved = (displayedData) => {
        this.setState({
            ...this.state,
            displayedData: displayedData
        });
    }

    saveAsExcel = () => {
        let filterData;
        filterData = (Object.keys(this.state.exportFilterData).length > 0) ? this.state.exportFilterData : this.allData
        this.excelExporter.save(filterData);
    }

    parseData = () => {
        let fieldDataTypeMap = new Map();
        for (const config of this.columnConfig) {
            if (config['dataType']) {
                fieldDataTypeMap.set(config['field'], config['dataType']);
            }
        }
        for (let dataItem of this.allData) {
            for (let [field, dataType] of fieldDataTypeMap) {
                switch (dataType) {
                    case 'date':
                        dataItem[field] = new Date(dataItem[field]);
                        break;
                    default:
                        throw `Column data type ${dataType} is not parsed. Add parser to parse it.`;
                }
            }
        }
    }

    componentDidMount() {
        this.parseData();
        // this.setState({displayedData: { data: [], total: 10000 },
        //     dataState: { take: 10, skip: 0 }})
    }
    render() {
        let thiz = this;
        function getColumns() {
            let columns = []
            for (const config of thiz.columnConfig) {
                if (config['footerAggregate']) {
                    if(config['type'] == null){
                        columns.push(<Column field={config['field']} title={config['title']} key={config['field']}/>);
                    }
                    else{
                        columns.push(<Column field={config['field']} title={config['title']} filter={config ? config['type'] : "numeric"} key={config['field']} />);
                    }
                    
                } else {
                    if(config['type'] == null){
                        columns.push(<Column field={config['field']} title={config['title']} key={config['field']}/>);
                    }
                    else{
                        columns.push(<Column field={config['field']} title={config['title']} filter={config ? config['type'] : "numeric"}  key={config['field']}/>);
                    }
                }
            }

            return columns;
        }

        let gridTag = <Grid
            style={{ height: this.height, width: this.width }}
            filterable={true}
            sortable={true}     
            pageable={true} 
            {...this.state.dataState}
            {...this.state.displayedData}
            onDataStateChange={this.dataStateChange}
        >
            {/* comment all the columns for testing with our api  */}
            {/* <GridColumn field="ProductID" filter="numeric" title="Id" />
            <GridColumn field="ProductName" title="Name" />
            <GridColumn field="UnitPrice" filter="numeric" format="{0:c}" title="Price" />
            <GridColumn field="UnitsInStock" filter="numeric" title="In stock" /> */}
            {getColumns()}
        </Grid>;

        let gridLoader = <WidgetGridLoader
            dataState={this.state.dataState}
            onDataRecieved={this.dataRecieved}
            uuid={this.uuid}
            filterParams={this.filterParams}
            core={this.core}
        />;

        return (
            <>
            {gridTag}
            {gridLoader}
                {/* {this.isDrillDownTable &&
                    <div className="oxzion-widget-drilldown-table-icon" style={hasBackButton ? { right: "5%" } : { right: "7px" }} title="Drilldown Table">
                        <i className="fas fa-angle-double-down fa-lg"></i>
                    </div>
                }
                {this.exportToExcel &&
                    <>
                        <div
                            className="oxzion-widget-drilldown-excel-icon"
                            style={hasBackButton ? { right: "5%" } : { right: "10px" }}
                            onClick={this.saveAsExcel}>
                            <i className="fa fa-file-excel fa-lg"></i>
                        </div>
                        <ExcelExport
                            data={this.state.exportFilterData}
                            ref={exporter => this.excelExporter = exporter}
                            filterable
                        >
                            {gridTag}
                            {gridLoader}
                        </ExcelExport>
                    </>
                }
                {!this.exportToExcel && gridTag} */}
            </>
        );
    }
}

