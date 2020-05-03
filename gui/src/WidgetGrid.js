
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { filterBy } from '@progress/kendo-data-query';
import { orderBy } from '@progress/kendo-data-query';
import { process } from '@progress/kendo-data-query';
import { ExcelExport } from '@progress/kendo-react-excel-export';

export default class WidgetGrid extends React.Component {
    constructor(props) {
        super(props);
        this.excelExporter = null;
        this.allData = props.data ? props.data : [];
        this.filteredData = null;
        let configuration = props.configuration;
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

        this.state = {
            filter: null,
            pagination: {
                skip: 0,
                take: this.pageSize
            },
            sort: (configuration ? (configuration.sort ? configuration.sort : null) : null),
            group: null,
            displayedData: []
        };

        let beginWith = configuration ? configuration.beginWith : null;
        if (beginWith) {
            let page = beginWith.page;
            if (page) {
                this.state.pagination.skip = page.skip ? page.skip : 0;
                this.state.pagination.take = page.take ? page.size : 10;
            }
            this.state.sort = beginWith.sort ? beginWith.sort : null;
            this.state.group = beginWith.group ? beginWith.group : null;
            this.state.filter = beginWith.filter ? beginWith.filter : null;
        }
    }

    saveAsExcel = () => {
        this.excelExporter.save();
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

    prepareData = (refilter) => {
        if(this.allData){
            this.allData.map(data=>{
                //trimmimg time from date in order for date filter to work
                data.date?data.date.setHours(0,0,0,0):null
            })
        }
        if (this.state.sort) {
            this.allData = orderBy(this.allData, this.state.sort);
        }
        if (!this.filteredData || refilter) {
            let filter = this.state.filter;
            this.filteredData = filter ? filterBy(this.allData, filter) : this.allData;
        }
        let pagination = this.state.pagination;
        let displayedData = process(this.filteredData, {
            take: pagination.take,
            skip: pagination.skip,
            group: this.state.group
        });
        this.setState({
            displayedData: displayedData
        });
    }

    getFilteredRowCount = () => {
        return this.filteredData ? this.filteredData.length : 0;
    }

    componentDidMount() {
        this.parseData();
        this.prepareData(true);
    }

    gridPageChanged = (e) => {
        let pagination = {
            skip: e.page.skip,
            take: e.page.take
        }
        this.setState({
            pagination: pagination
        },
            () => {
                this.prepareData(false);
            });
    }

    gridFilterChanged = (e) => {
        this.setState({
            filter: e.filter
        },
            () => {
                this.prepareData(true);
            });
    }

    gridSortChanged = (e) => {
        this.allData = orderBy(this.allData, e.sort);
        this.setState({
            sort: e.sort
        },
            () => {
                this.prepareData(true);
            });
    }

    gridGroupChanged = (e) => {
        this.setState({
            group: e.group
        },
            () => {
                this.prepareData(false);
            });
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

    //No implementation now. Add implementation if needed later.
    gridDataStageChanged = (e) => {
        console.log('Called event handler - gridDataStageChanged. Event is:');
        console.log(e);
    }

    render() {
        let thiz = this;
        function getColumns() {
            let columns = []
            for (const config of thiz.columnConfig) {
                columns.push(<GridColumn key={config['field']} {...config} />);
            }
            return columns;
        }

        let gridTag = <Grid
            style={{ height: this.height, width: this.width }}
            data={this.state.displayedData}
            resizable={this.resizable}
            reorderable={this.reorderable}

            filterable={this.filterable}
            filter={this.state.filter}
            onFilterChange={this.gridFilterChanged}

            pageSize={this.pageSize}
            {...this.pagerConfig} //Sets grid "pageable" property
            total={this.getFilteredRowCount()}
            skip={this.state.pagination.skip}
            take={this.state.pagination.take}
            onPageChange={this.gridPageChanged}

            sortable={this.sortable}
            sort={this.state.sort}
            onSortChange={this.gridSortChanged}

            groupable={this.groupable}
            group={this.state.group}
            onGroupChange={this.gridGroupChanged}
            onExpandChange={this.gridGroupExpansionChanged}
            onDataStateChange={this.gridDataStageChanged}
            expandField='expanded'
        >
            {getColumns()}
        </Grid>;

        return (
            <>
                {this.exportToExcel &&
                    <>
                        <div style={{
                            float: "right",
                            top: "20px",
                            position: "relative",
                            zIndex: "10",
                            width: "16px",
                            cursor: "pointer"
                        }} onClick={this.saveAsExcel}><i className="fa fa-file-excel"></i></div>
                        <ExcelExport
                            data={this.allData}
                            ref={exporter => this.excelExporter = exporter}
                        >
                            {gridTag}
                        </ExcelExport>
                    </>
                }
                {!this.exportToExcel && gridTag}
            </>
        );
    }
}

