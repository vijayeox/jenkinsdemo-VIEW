
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { filterBy } from '@progress/kendo-data-query';
import { orderBy } from '@progress/kendo-data-query';
import { process } from '@progress/kendo-data-query';

export default class WidgetGrid extends React.Component {
    constructor(props) {
        super(props);
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
        this.sortConfig = configuration ? (configuration.sort ? {sortable:configuration.sort} : {}) : {};
        this.pageConfig = configuration ? (configuration.page ? {pageable:configuration.page} : {}) : {};

        this.state = {
            filter : null,
            pagination : {
                skip: 0, 
                take: 10
            },
            sort: null,
            group: null,
            displayedData:[]
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

    prepareData = (refilter) => {
        if (!this.filteredData || refilter) {
            let filter = this.state.filter;
            this.filteredData = filter ? filterBy(this.allData, filter) : this.allData;
        }
        let pagination = this.state.pagination;
        let displayedData = process(this.filteredData, {
            take:pagination.take,
            skip:pagination.skip,
            group:this.state.group
        });
        this.setState({
            displayedData : displayedData
        });
    }

    getFilteredRowCount = () => {
        return this.filteredData ? this.filteredData.length : 0;
    }

    componentDidMount() {
        this.prepareData(true);
    }

    gridPageChanged = (e) => {
        let pagination = {
            skip: e.page.skip,
            take: e.page.take
        }
        this.setState({
            pagination:pagination
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
            group:e.group
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
            thiz.columnConfig.map((cc, index) => {
                columns.push(<GridColumn key={index} {...cc} />);
            });
            return columns;
        }

        return (
            <Grid 
                style={{ height:this.height, width:this.width }} 
                data={this.state.displayedData} 
                resizable={this.resizable} 
                reorderable={this.reorderable} 

                filterable={this.filterable} 
                filter={this.state.filter} 
                onFilterChange={this.gridFilterChanged} 

                {...this.pageConfig} //Sets "pageable" property
                total={this.getFilteredRowCount()} 
                skip={this.state.pagination.skip} 
                take={this.state.pagination.take} 
                onPageChange={this.gridPageChanged} 

                sort={this.state.sort} 
                {...this.sortConfig} //Sets "sortable" property
                onSortChange={this.gridSortChanged} 

                groupable={this.groupable} 
                group={this.state.group} 
                onGroupChange={this.gridGroupChanged} 
                onExpandChange={this.gridGroupExpansionChanged} 
                onDataStateChange={this.gridDataStageChanged} 
                expandField='expanded' 
            >
                { getColumns() }
            </Grid>
        );
    }
}

