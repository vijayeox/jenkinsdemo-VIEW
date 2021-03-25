
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { filterBy, orderBy, process } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-react-intl'
import { ExcelExport } from '@progress/kendo-react-excel-export';
import WidgetDrillDownHelper from './WidgetDrillDownHelper';
import { WidgetGridLoader } from './WidgetGridLoader.js';


export default class WidgetGridNew extends React.Component {
    constructor(props) {
        super(props);
        this.excelExporter = null;
        this.allData = props.data ? props.data : [];
        this.filteredData = null;
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
        // data can be assigned as allData since the first call needs to be assigned here.
        this.state = {
            displayedData: { data: [], total: 0 },
            dataState: { take: 10, skip: 0 }
        };

    }

    dataStateChange = (e) => {
        this.setState({
            ...this.state,
            dataState: e.dataState
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
    }

    gridGroupChanged = (e) => {
        this.setState({
            group: e.group
        }, () => {
            this.prepareData(false);
        });
    }

    drillDownClick = (evt) => {
        WidgetDrillDownHelper.drillDownClicked(WidgetDrillDownHelper.findWidgetElement(evt.nativeEvent ? evt.nativeEvent.target : evt.target), evt.dataItem)
        ReactDOM.unmountComponentAtNode(this.props.canvasElement)

    }
    
    gridGroupExpansionChanged = (e) => {
        e.dataItem[e.target.props.expandField] = e.value;
        //Force state change with modified e.dataItem in this.state.displayedData. This state 
        //change forces Kendo grid to repaint itself with expanded/collapsed grouped row item.
        this.setState((state) => {
            state.displayedData = this.state.displayedData;
            return state;
        });
    }

    hasBackButton() {
        if (this.props.canvasElement && this.props.canvasElement.parentElement) {
            let backbutton = this.props.canvasElement.parentElement.getElementsByClassName('oxzion-widget-roll-up-button')
            if (backbutton.length > 0)
                return true
            else
                return false
        }
        else {
            return false
        }

    }
    cellRender(tdElement, cellProps, thiz) {
        if (cellProps.rowType === 'groupFooter') {
            let element = null
            if (thiz.props.configuration["groupable"] && thiz.props.configuration["groupable"] != false && thiz.props.configuration["groupable"]["aggregate"]) {
                let aggregateColumns = thiz.props.configuration["groupable"]["aggregate"]
                let sum = 0
                let kendo_service = new IntlService()
                let formattedSum = sum
                aggregateColumns.forEach(column => {
                    if (cellProps.field == column.field) {
                        cellProps.dataItem.items.forEach(item => {
                            if (typeof (item[column.field]) == "number") {
                                sum += item[column.field]
                            }
                        })
                        formattedSum = sum
                        if (column.format) {
                            formattedSum = kendo_service.toString(sum, column.format)
                        }
                        element = <td>{formattedSum}</td>

                    }
                })
                if (element != null) {
                    return <td>{formattedSum}</td>
                }
            }
        }
        return tdElement;
    }

    Aggregate = (props, configuration) => {
        let total = 0
        if (this.state.displayedData.data) {
            total = this.state.displayedData.data.reduce((acc, current) => acc + (typeof (current[props.field]) == "number" ? current[props.field] : 0), 0)
        }
        if (!Number.isNaN(total)) {
            let formattedSum = total
            if (configuration.format) {
                let kendo_service = new IntlService()
                formattedSum = kendo_service.toString(total, configuration.format)
            }
            return (

                <td colSpan={props.colSpan} style={configuration.style}>
                    {configuration.value}{formattedSum}
                </td>
            );
        } return <td></td>
    }

    render() {
        let thiz = this;
        let hasBackButton = this.hasBackButton()

        async function getColumns() {
            let columns = []
            for (const config of thiz.columnConfig) {
                if (config['footerAggregate']) {
                    columns.push(<GridColumn key={config['field']} {...config} footerCell={(props) => thiz.Aggregate(props, config['footerAggregate'])} />);
                }
                else {
                    columns.push(<GridColumn key={config['field']} {...config} />);
                }
            }
            return columns;
        }

        let gridTag = <Grid
        style={{ height: this.height, width: this.width }}
        filterable={true}
        sortable={true}     // change it to this.sortable after testing 
        pageable={true}     // change it to this.pagable after testing 
        //pageSize={this.pageSize} 
        {...this.state.dataState}
        {...this.state.displayedData}
        onDataStateChange={this.dataStateChange}
        //className={this.isDrillDownTable ? "drillDownStyle" : ""}
        //onGroupChange={this.gridGroupChanged}
        //onRowClick={this.drillDownClick}
        //groupable={this.groupable}
        //group={this.state.group}
        //onGroupChange={this.gridGroupChanged}
        //onExpandChange={this.gridGroupExpansionChanged}
        //resizable={this.resizable}
        //expandField='expanded'
        //reorderable={this.reorderable}
        //cellRender={(tdelement, cellProps) => this.cellRender(tdelement, cellProps, this)}        // Need to change the function cell render for summation of all values and other functionalities. 
    >
        {/* comment all the columns for testing with our api  */}
                    <GridColumn field="ProductID" filter="numeric" title="Id" />
                    <GridColumn field="ProductName" title="Name" />
                    <GridColumn field="UnitPrice" filter="numeric" format="{0:c}" title="Price" />
                    <GridColumn field="UnitsInStock" filter="numeric" title="In stock" />
                    {/* {await getColumns()}        to be uncommented after testing */}
    </Grid>;

   let gridLoader =  <WidgetGridLoader
        dataState={this.state.dataState}
        onDataRecieved={this.dataRecieved}
    />;
        
    return (
        <>
            {this.isDrillDownTable &&
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
            {!this.exportToExcel && gridTag}
        </>
    );
    }
}

