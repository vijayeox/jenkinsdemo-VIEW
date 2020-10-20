import React from "react";
import OX_Grid from "../../OX_Grid";
import "./Styles/PageComponentStyles.scss";

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.config = this.props.config;
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.search = {
      value: "",
    };
    this.api = this.props.entity
      ? "app/" + this.appId + "/file/search/entity/" + this.props.entity
      : "app/" + this.appId + "/file/search/status/Completed";

    this.state = {
      content: this.props.content,
      query: "",
      columnConfig: this.props.columnConfig.map((i, index) => {
        return {
          ...i,
          filterable: i.filterCell
            ? undefined
            : !this.props.filterColumns.includes(i.field),
          multiFieldFilter: index == 0 ? this.props.filterColumns : false,
        };
      }),
      filterColumns: this.props.filterColumns,
      filter: [],
    };
    this.oxGrid = React.createRef();
  }

  handleInputChange = () => {
    let defaultFiltersOfFilter = [];
    try {
      defaultFiltersOfFilter = this.props.defaultFilters.filter.filters;
    } catch (e) {}

    var filter = {
      logic: "and",
      filters: [
        {
          field: this.state.filterColumns[0],
          operator: this.props.filterOperator
            ? this.props.filterOperator
            : "contains",
          value: this.search.value,
        },
        ...defaultFiltersOfFilter,
      ],
    };
    this.setState({
      filter: {
        filter: filter,
        sort: this.props.defaultFilters.sort
          ? this.props.defaultFilters.sort
          : [],
      },
      query: this.search.value,
    });
  };

  render() {
    return (
      <div className="searchResults">
        <div className="searchPageDiv">
          <div className="searchBar">
            <i class="fad fa-search"></i>
            <input
              className="searchInput"
              placeholder={
                this.props.placeholder
                  ? this.props.placeholder
                  : "Search for..."
              }
              ref={(input) => (this.search = input)}
              onChange={this.handleInputChange}
            />
            <i
              class="fad fa-backspace"
              onClick={() => {
                this.search.value = "";
                this.setState({ query: "" }, () => this.search.focus());
              }}
            ></i>
          </div>
          <div className="seperator"></div>
        </div>
        {this.search.value ? (
          <div className="row searchText">
            <div className="col-md-12">
              Search Results for "{this.search.value}"
            </div>
          </div>
        ) : null}
        {this.search.value != "" ? (
          <div className="row">
            <div className="col-md-12">
              <OX_Grid
                ref={this.oxGrid}
                osjsCore={this.core}
                gridDefaultFilters={
                  this.state.filter.length != 0 ? this.state.filter : undefined
                }
                filterable={
                  typeof this.props.filterable != "undefined"
                    ? this.props.filterable
                    : true
                }
                data={this.api}
                reorderable={true}
                resizable={true}
                pageable={{ buttonCount: 3, pageSizes: [10, 20, 50] }}
                sortable={true}
                columnConfig={this.state.columnConfig}
                passColumnConfig={this.props.passColumnConfig}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default SearchPage;

SearchPage.defaultProps = {
  defaultFilters: {},
};
