import React from "react";
import OX_Grid from "../../OX_Grid";
import "./Styles/PageComponentStyles.scss";

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.config = this.props.config ;
        this.core = this.props.core;
        this.appId = this.props.appId;
        this.filterable = false;
        this.reorderable = true;
        this.resizable = true;
        this.sortable = true;
        this.search = {
            value:''
        };
        this.api = "app/" + this.appId + "/file/search";
        this.pageable = {buttonCount: 3,pageSizes: [10,20,50]};
        this.state = {
            content: this.props.content,
            query: '',
            columnConfig: this.props.columnConfig,
            filterColumns: this.props.filterColumns,
            filter: []
        };
        var itemContent = this.props.content;
        var columnConfig = itemContent.columnConfig;
        for (var i = columnConfig.length - 1; i >= 0; i--) {
            for (var j = this.state.filterColumns.length - 1; j >= 0; j--) {
                if(columnConfig[i].field==this.state.filterColumns[j]){
                    columnConfig[i].filterable = false;
                }
            }
        }
        if (itemContent.actions) {
            if (columnConfig[columnConfig.length - 1].title == "Actions") {
              null;
          } else {
              columnConfig.push({
                title: "Actions",
                cell: e => this.renderButtons(e, itemContent.actions),
                filterCell: e => this.renderEmpty()
            });
          }
      }
      this.setState({columnConfig:columnConfig});
    }
    replaceParams(route, params) {
        if (!params) {
            return route;
        }
        var regex = /\{\{.*?\}\}/g;
        let m;
        while ((m = regex.exec(route)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach((match, groupIndex) => {
                route = route.replace(match, params[match.replace(/\{\{|\}\}/g, "")]);
            });
        }
        return route;
    }
    handleInputChange = () => {
        var filters = [];
        if(this.state.filterColumns){
            for (var i = this.state.filterColumns.length - 1; i >= 0; i--) {
                filters.push({field:this.state.filterColumns[i],operator:"contains",value:this.search.value});
            }
        }
        var filter = {
            logic: "or",
            filters: filters
        }
        this.setState({filter: {filter: filter}});
        this.setState({query: this.search.value});
    }

    componentDidUpdate(prevProps) {
        if (this.props.content !== prevProps.content) {
            this.setState({ content: this.props.content });
        }
    }

    render() {
        return (
            <div>
            <input
            className="searchInput"
            placeholder="Search for..."
            ref={input => this.search = input}
            onChange={this.handleInputChange} />
            {
                this.search.value?
                <div className="row">
                <div className="col-md-12">
                Search Results for "{this.search.value}"
                </div>
                </div> : null
            }
            {this.search.value != ''?
            <div className="row">
            <div className="col-md-12">
            <OX_Grid
              osjsCore={this.core}
              gridDefaultFilters={this.state.filter.length!=0?this.state.filter:null}
              filterable={this.filterable}
              data={this.api}
              reorderable={this.reorderable}
              resizable={this.resizable}
              pageable={this.pageable}
              sortable={this.sortable}
              columnConfig={this.state.columnConfig}
            />
            </div>
            </div>
        :null}
            </div>
            );
    }
}
export default SearchPage;