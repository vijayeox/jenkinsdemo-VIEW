import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  GridCell,
  GridColumn,
  GridDetailRow,
  GridNoRecords
} from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import $ from "jquery";

import DataLoader from "./components/Grid/DataLoader";
import DataOperation from "./components/Grid/DataOperation";

import "./components/Grid/customStyles.scss";
import "@progress/kendo-theme-default/dist/all.css";

export default class OX_Grid extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.rawDataPresent = typeof this.props.data == "object" ? true : false;
    this.state = {
      gridData: this.rawDataPresent
        ? this.props.data
        : { data: [], total: "0" },
      api: this.rawDataPresent ? undefined : this.props.data,
      dataState: this.props.gridDefaultFilters
        ? this.props.gridDefaultFilters
        : {}
    };
  }

  componentDidMount() {
    $(document).ready(function() {
      $(".k-textbox").attr("placeholder", "Search");
    });
  }

  dataStateChange = e => {
    this.setState({
      ...this.state,
      dataState: e.data
    });
  };

  dataRecieved = data => {
    this.setState({
      gridData: data
    });
  };

  createColumns = () => {
    let table = [];
    this.props.checkBoxSelection
      ? table.push(
          <GridColumn
            field="selected"
            filterable={false}
            // headerSelectionValue={
            //   this.state.gridData.findIndex(
            //     dataItem => dataItem.selected === false
            //   ) === -1
            // }
            key={Math.random() * 20}
            locked={true}
            reorderable={false}
            orderIndex={0}
            width="50px"
          />
        )
      : null;
    this.props.columnConfig.map((dataItem, i) => {
      table.push(
        <GridColumn
          cell={
            dataItem.cell
              ? item => (
                  <CustomCell
                    cellTemplate={dataItem.cell}
                    dataItem={item.dataItem}
                  />
                )
              : undefined
          }
          children={dataItem.children ? dataItem.children : undefined}
          className={dataItem.className ? dataItem.className : undefined}
          field={dataItem.field ? dataItem.field : undefined}
          filter={dataItem.filter ? dataItem.filter : "text"}
          filterable={dataItem.filterable ? dataItem.filterable : undefined}
          filterCell={
            dataItem.filterCell
              ? item => (
                  <CustomCell
                    cellTemplate={dataItem.filterCell}
                    dataItem={item.dataItem}
                  />
                )
              : undefined
          }
          groupable={dataItem.groupable ? dataItem.groupable : undefined}
          headerClassName={
            dataItem.headerClassName ? dataItem.headerClassName : undefined
          }
          headerCell={dataItem.headerCell ? dataItem.headerCell : undefined}
          key={i}
          locked={dataItem.locked ? dataItem.locked : undefined}
          minResizableWidth={
            dataItem.minResizableWidth ? dataItem.minResizableWidth : undefined
          }
          orderIndex={dataItem.orderIndex ? dataItem.orderIndex : undefined}
          reorderable={dataItem.reorderable ? dataItem.reorderable : undefined}
          resizable={dataItem.resizable ? dataItem.resizable : undefined}
          width={dataItem.width ? dataItem.width : undefined}
          title={dataItem.title ? dataItem.title : undefined}
        />
      );
    });
    return table;
  };

  expandChange = event => {
    event.dataItem.expanded = !event.dataItem.expanded;
    this.forceUpdate();
  };

  headerSelectionChange = event => {
    const checked = event.syntheticEvent.target.checked;
    this.state.gridData.forEach(item => (item.selected = checked));
    this.forceUpdate();
  };

  noRecordsJSX() {
    return (
      <GridNoRecords>
        {this.props.gridNoRecords ? (
          this.props.gridNoRecords
        ) : (
          <div className="grid-no-records">
            <ul className="list-group" style={{ listStyle: "disc" }}>
              <div
                href="#"
                className="list-group-item list-group-item-action bg-warning"
                style={{
                  display: "flex",
                  width: "110%",
                  alignItems: "center"
                }}
              >
                <div style={{ marginLeft: "10px" }}>
                  <i className="fas fa-info-circle"></i>
                </div>
                <div
                  style={{ fontSize: "medium", paddingLeft: "30px" }}
                  className="noRecords"
                >
                  No Records Available
                </div>
              </div>
            </ul>
          </div>
        )}
      </GridNoRecords>
    );
  }

  selectionChange = event => {
    event.dataItem.selected = !event.dataItem.selected;
    this.forceUpdate();
    var selectedItems = [];
    this.state.gridData.data.map(dataItem => {
      dataItem.selected ? selectedItems.push(dataItem) : null;
    });
    this.props.checkBoxSelection(selectedItems);
  };

  render() {
    return (
      <div style={{ height: "inherit" }} className="GridCustomStyle">
        {this.rawDataPresent ? (
          <DataOperation
            gridData={this.props.data}
            total={this.props.data.length}
            dataState={this.state.dataState}
            onDataRecieved={this.dataRecieved}
          />
        ) : (
          <DataLoader
            ref={this.child}
            args={this.props.osjsCore}
            url={this.state.api}
            dataState={this.state.dataState}
            onDataRecieved={this.dataRecieved}
          />
        )}
        <Grid
          data={
            this.state.gridData.data
              ? this.state.gridData
              : { data: [], total: "0" }
          }
          detail={
            this.props.rowTemplate
              ? dataItem => (
                  <DetailComponent
                    rowTemplate={this.props.rowTemplate}
                    dataItem={dataItem.dataItem}
                  />
                )
              : undefined
          }
          filterable={this.props.filterable}
          style={this.props.gridStyles}
          pageable={this.props.pageable}
          resizable={this.props.resizable}
          reorderable={this.props.reorderable}
          sortable={this.props.sortable}
          onDataStateChange={this.dataStateChange}
          onExpandChange={this.expandChange}
          onHeaderSelectionChange={this.headerSelectionChange}
          onSelectionChange={this.selectionChange}
          onRowClick={e => {
            this.props.onRowClick ? this.props.onRowClick(e) : null;
          }}
          selectedField="selected"
          expandField="expanded"
          {...this.state.dataState}
        >
          {this.createColumns()}
          {/* {this.noRecordsJSX()} */}
        </Grid>
      </div>
    );
  }
}

class CustomCell extends GridCell {
  render() {
    var cellTemplate = this.props.cellTemplate(this.props.dataItem);
    var useEvenSpace = true;
    //   cellTemplate[0].type == "button" || cellTemplate[0].props.children
    //     ? cellTemplate[0].props.children.type == "button"
    //     : false
    //     ? true
    //     : false;
    return (
      <td
        style={
          useEvenSpace
            ? {
                display: "flex",
                justifyContent: "space-evenly"
              }
            : null
        }
      >
        {cellTemplate}
      </td>
    );
  }
}

class DetailComponent extends GridDetailRow {
  render() {
    const dataItem = this.props.dataItem;
    return <React.Fragment>{this.props.rowTemplate(dataItem)}</React.Fragment>;
  }
}

OX_Grid.defaultProps = {
  data: []
};

OX_Grid.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  checkBoxSelection: PropTypes.func,
  columnConfig: PropTypes.array.isRequired,
  gridDefaultFilters: PropTypes.object,
  gridToolbar: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  gridNoRecords: PropTypes.element,
  gridStyles: PropTypes.object,
  groupable: PropTypes.bool,
  onRowClick: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  osjsCore: PropTypes.object,
  pageable: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  resizable: PropTypes.bool,
  reorderable: PropTypes.bool,
  rowTemplate: PropTypes.func,
  sortable: PropTypes.bool
};

// Send selected value as true in data array to enable selected field css background
// (Wont be applied for customRenderedCells)
// Example:  {
//   name: "prajwal",
//   address: "test",
//   selected: true
// }
//
// Send gridDefaultFilters in the following format
// {
//   "filter":{
//   "logic":"and",
//   "filters":[
//   {
//   "field":"workflow_name",
//   "operator":"contains",
//   "value":"ipl"
//   }
//   ]
//   },
//   "sort":[
//   {
//   "field":"workflow_name",
//   "dir":"desc"
//   }
//   ],
//   "skip":0,
//   "take":50
// }