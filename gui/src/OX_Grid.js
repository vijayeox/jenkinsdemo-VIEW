import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  GridCell,
  GridColumn,
  GridDetailRow,
  GridNoRecords,
  GridToolbar
} from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import {
  ExcelExport,
  ExcelExportColumn
} from "@progress/kendo-react-excel-export";
import { Button, DropDownButton } from "@progress/kendo-react-buttons";
import $ from "jquery";
import JsxParser from "react-jsx-parser";
import moment from "moment";
import DataLoader from "./components/Grid/DataLoader";
import DataOperation from "./components/Grid/DataOperation";
import CustomFilter from "./components/Grid/CustomFilter";
import "./components/Grid/customStyles.scss";
import InlineComponent from "./components/Grid/InlineComponent";

export default class OX_Grid extends React.Component {
  constructor(props) {
    super(props);
    this.baseUrl = this.props.osjsCore
      ? this.props.osjsCore.config("wrapper.url")
      : undefined;
    this.userprofile = this.props.osjsCore
      ? this.props.osjsCore.make("oxzion/profile").get().key
      : undefined;
    this.rawDataPresent = typeof this.props.data == "object" ? true : false;
    this.state = {
      gridData: this.rawDataPresent ? this.props.data : { data: [], total: 0 },
      dataState: this.props.gridDefaultFilters
        ? this.props.gridDefaultFilters
        : {},
      apiActivityCompleted: this.rawDataPresent ? true : false
    };
    this.loader = this.props.osjsCore.make("oxzion/splash");
    this.child = React.createRef();
    this.refreshHandler = this.refreshHandler.bind(this);
    this.inlineEdit = this.inlineEdit.bind(this);
  }
  _excelExport;
  _grid;

  componentDidMount() {
    $(document).ready(function () {
      $(".k-textbox").attr("placeholder", "Search");
    });
    if (!document.getElementsByClassName("PageRender")) {
      this.gridHeight =
        document.getElementsByClassName("PageRender")[0].clientHeight - 50;
    }
  }

  dataStateChange = (e) => {
    this.setState({
      ...this.state,
      dataState: e.data
    });
  };

  dataRecieved = (data) => {
    this.setState({
      gridData: data,
      apiActivityCompleted: true
    });
  };

  componentWillReceiveProps(props) {
    if (props.gridDefaultFilters) {
      this.setState({ dataState: props.gridDefaultFilters });
    }
    if (props.data) {
      this.setState();
    }
  }

  parseDefaultFilters() {
    var splitUrl = this.props.data.split("?");
    if (splitUrl[1]) {
      apiUrl = splitUrl[0];
      var getUrlParams = decodeURI(splitUrl[1])
        .replace("?", "")
        .split("&")
        .map((param) => param.split("="))
        .reduce((values, [key, value]) => {
          values[key] = value;
          return values;
        }, {});
      if (getUrlParams.filter) {
        try {
          defaultFilters = JSON.parse(getUrlParams.filter);
        } catch (e) {
          console.log(getUrlParams.filter);
          defaultFilters = getUrlParams.filter;
        }
      } else {
        apiUrl = this.props.data;
      }
    }
  }

  createColumns = (columnConfig) => {
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
    columnConfig.map((dataItem, i) => {
      table.push(
        <GridColumn
          cell={
            dataItem.cell
              ? (item) => (
                  <CustomCell
                    cellTemplate={dataItem.cell}
                    dataItem={item.dataItem}
                    type={"cellTemplate"}
                    userProfile={this.userprofile}
                    baseUrl={this.baseUrl}
                  />
                )
              : undefined
          }
          children={dataItem.children ? dataItem.children : undefined}
          className={dataItem.className ? dataItem.className : undefined}
          field={dataItem.field ? dataItem.field : undefined}
          filter={dataItem.filter ? dataItem.filter : "text"}
          filterable={dataItem.filterable}
          filterCell={
            dataItem.filterCell ? CustomFilter(dataItem.filterCell) : undefined
          }
          groupable={dataItem.groupable ? dataItem.groupable : undefined}
          editor={dataItem.editor ? dataItem.editor : undefined}
          editable={dataItem.editable}
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
          sortable={dataItem.sortable ? dataItem.sortable : undefined}
          width={dataItem.width ? dataItem.width : undefined}
          title={dataItem.title ? dataItem.title : undefined}
        />
      );
    });

    this.props.inlineEdit
      ? table.push(
          <GridColumn
            filterable={false}
            key={Math.random() * 20}
            reorderable={false}
            width="175px"
            title={"Actions"}
            cell={InlineComponent(
              this.props.inlineActions,
              this.inlineEdit,
              this.refreshHandler
            )}
          />
        )
      : null;

    return table;
  };

  inlineEdit = (dataItem) => {
    if (this.state.dataState.group) {
      if (this.state.dataState.group.length > 0) {
        var newData = this.state.gridData.data.map((item) => {
          var newItem = item.items.map((item1) => {
            return item1.id === dataItem.id
              ? { ...item1, inEdit: true }
              : item1;
          });
          return {
            items: newItem,
            aggregates: item.aggregates,
            field: item.field,
            value: item.value
          };
        });
      }
    } else {
      var newData = this.state.gridData.data.map((item) => {
        return item.id === dataItem.id ? { ...item, inEdit: true } : item;
      });
    }
    this.setState({
      gridData: { data: newData, total: this.state.gridData.total }
    });
  };

  itemChange = (event) => {
    if (this.state.dataState.group) {
      if (this.state.dataState.group.length > 0) {
        var data = this.state.gridData.data.map((item) => {
          var newItem = item.items.map((item1) => {
            return item1.id === event.dataItem.id
              ? { ...item1, [event.field]: event.value }
              : item1;
          });
          return {
            items: newItem,
            aggregates: item.aggregates,
            field: item.field,
            value: item.value
          };
        });
      }
    } else {
      var data = this.state.gridData.data.map((item) => {
        return item.id === event.dataItem.id
          ? { ...item, [event.field]: event.value }
          : item;
      });
    }
    this.setState({
      gridData: { data: data, total: this.state.gridData.total }
    });
  };

  generateGridToolbar() {
    let gridToolbarContent = [];
    if (typeof this.props.gridToolbar == "string") {
      gridToolbarContent.push(
        <JsxParser
          bindings={{
            item: this.props.parentData,
            moment: moment,
            profile: this.props.userProfile,
            baseUrl: this.props.baseUrl,
            gridData: this.state.gridData.data
          }}
          jsx={this.props.gridToolbar}
        />
      );
    } else if (this.props.gridToolbar) {
      gridToolbarContent.push(this.props.gridToolbar);
    }
    if (this.props.exportToPDF) {
      gridToolbarContent.push(
        <Button
          style={{ right: "10px", float: "right" }}
          primary={true}
          onClick={this.exportPDF}
        >
          Export to PDF
        </Button>
      );
    }
    if (this.props.exportToExcel) {
      gridToolbarContent.push(
        <Button
          style={{ right: "10px", float: "right" }}
          primary={true}
          onClick={() => this.exportExcel(this.props.exportToExcel)}
        >
          Export to Excel
        </Button>
      );
    }
    if (this.props.gridOperations) {
      gridToolbarContent.length == 0
        ? gridToolbarContent.push(<div></div>)
        : null;
      gridToolbarContent.push(
        this.renderListOperations(this.props.gridOperations)
      );
    }
    return gridToolbarContent.length > 0 ? gridToolbarContent : false;
  }

  exportPDF = () => {
    this.loader.show();
    this.gridPDFExport.save(this.state.data, this.loader.destroy());
  };

  exportExcel = (excelConfig) => {
    var gridData = this.state.gridData;
    if (excelConfig.columnConfig) {
      gridData = typeof gridData == "array" ? gridData : gridData.data;
      gridData = gridData.map((item) => {
        var tempItem = { ...item };
        excelConfig.columnConfig.map((column) => {
          if (column.cell) {
            var data = tempItem;
            var _moment = moment;
            var formatDate = (dateTime, dateTimeFormat) => {
              let userTimezone,
                userDateTimeFomat = null;
              userTimezone = this.userProfile.preferences.timezone
                ? this.userProfile.preferences.timezone
                : moment.tz.guess();
              userDateTimeFomat = this.userProfile.preferences.dateformat
                ? this.userProfile.preferences.dateformat
                : "YYYY-MM-DD";
              dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
              return moment(dateTime)
                .utc(dateTime, "YYYY-MM-DD HH:mm:ss")
                .clone()
                .tz(userTimezone)
                .format(userDateTimeFomat);
            };
            var formatDateWithoutTimezone = (dateTime, dateTimeFormat) => {
              let userDateTimeFomat = null;
              userDateTimeFomat = this.userProfile.preferences.dateformat
                ? this.userProfile.preferences.dateformat
                : "YYYY-MM-DD";
              dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
              return moment(dateTime).format(userDateTimeFomat);
            };
            var evalString = column.cell.replace(/moment/g, "_moment");
            tempItem[column.field] = eval("(" + evalString + ")");
          }
        });
        return tempItem;
      });
    }
    console.log(gridData);
    this._excelExport.save(
      gridData,
      excelConfig.columnConfig ? undefined : this._grid.columns
    );
  };

  expandChange = (event) => {
    event.dataItem.expanded = !event.dataItem.expanded;
    this.forceUpdate();
  };

  headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    this.state.gridData.forEach((item) => (item.selected = checked));
    this.forceUpdate();
  };

  refreshHandler = () => {
    this.child.current.triggerGetCall();
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

  selectionChange = (event) => {
    event.dataItem.selected = !event.dataItem.selected;
    this.forceUpdate();
    var selectedItems = [];
    this.state.gridData.data.map((dataItem) => {
      dataItem.selected ? selectedItems.push(dataItem) : null;
    });
    this.props.checkBoxSelection(selectedItems);
  };

  updatePageContent = (config) => {
    let eventDiv = document.getElementsByClassName(
      this.props.appId + "_breadcrumbParent"
    )[0];

    let ev = new CustomEvent("updateBreadcrumb", {
      detail: config,
      bubbles: true
    });
    eventDiv.dispatchEvent(ev);

    let ev2 = new CustomEvent("updatePageView", {
      detail: config.details,
      bubbles: true
    });
    eventDiv.dispatchEvent(ev2);
  };

  renderListOperations = (config) => {
    var operationsList = [];
    var listData = this.state.gridData.data;
    config.actions.map((i) => {
      var profile = this.userprofile;
      let result = eval(i.rule);
      result ? operationsList.push(i) : null;
    });
    if (operationsList.length > 1) {
      return (
        <DropDownButton
          text={config.title ? config.title : "Options"}
          textField="name"
          className="gridOperationDropdown"
          iconClass={config.icon ? config.icon : null}
          onItemClick={(e) => {
            this.updatePageContent(e.item);
          }}
          popupSettings={{ popupClass: "dropDownButton" }}
          items={operationsList}
          primary={true}
          style={{ right: "10px", float: "right" }}
        />
      );
    } else if (operationsList.length == 1) {
      return (
        <Button
          style={{ right: "10px", float: "right" }}
          primary={true}
          onClick={(e) => this.updatePageContent(operationsList[0])}
        >
          {operationsList[0].name}
        </Button>
      );
    }
    return null;
  };

  generatePDFTemplate(pageData) {
    let PDFProps = this.props.exportToPDF;
    return PDFProps.titleTemplate || PDFProps.JSXtemplate ? (
      <div>
        {pageData.pageNum == 1 && PDFProps.titleTemplate ? (
          <div>
            <JsxParser
              bindings={{
                pageData: pageData,
                data: this.props.parentData,
                moment: moment,
                gridData: this.state.gridData.data
              }}
              jsx={PDFProps.titleTemplate}
            />
          </div>
        ) : null}

        {PDFProps.JSXtemplate ? (
          <JsxParser
            bindings={{
              pageData: pageData,
              data: this.props.parentData,
              moment: moment,
              gridData: this.state.gridData.data
            }}
            jsx={PDFProps.JSXtemplate}
          />
        ) : null}
      </div>
    ) : (
      <div />
    );
  }

  render() {
    return (
      <div
        style={this.props.wrapStyle ? this.props.wrapStyle : { height: "100%" }}
        className="GridCustomStyle"
      >
        {this.rawDataPresent ? (
          <DataOperation
            args={this.props.osjsCore}
            gridData={this.props.data}
            total={this.props.data.length}
            dataState={this.state.dataState}
            onDataRecieved={this.dataRecieved}
          />
        ) : (
          <DataLoader
            ref={this.child}
            args={this.props.osjsCore}
            url={this.props.data}
            dataState={this.state.dataState}
            onDataRecieved={this.dataRecieved}
            {...this.props}
          />
        )}

        <Grid
          data={this.state.gridData.data}
          ref={(grid) => {
            this._grid = grid;
          }}
          total={
            this.state.gridData.total
              ? parseInt(this.state.gridData.total)
              : null
          }
          detail={
            this.props.rowTemplate
              ? (dataItem) => (
                  <DetailComponent
                    rowTemplate={this.props.rowTemplate}
                    dataItem={dataItem.dataItem}
                  />
                )
              : undefined
          }
          filterable={this.props.filterable}
          filterOperators={this.props.filterOperators}
          groupable={this.props.groupable}
          style={this.props.gridStyles}
          pageable={this.props.pageable}
          resizable={this.props.resizable}
          reorderable={this.props.reorderable}
          sortable={this.props.sortable}
          scrollable={this.props.scrollable}
          onDataStateChange={this.dataStateChange}
          onExpandChange={this.props.expandable ? this.expandChange : null}
          onHeaderSelectionChange={this.headerSelectionChange}
          onSelectionChange={this.selectionChange}
          onRowClick={(e) => {
            this.props.onRowClick ? this.props.onRowClick(e) : null;
          }}
          selectedField="selected"
          expandField={this.props.expandable ? "expanded" : null}
          {...this.state.dataState}
          editField={this.props.inlineEdit ? "inEdit" : undefined}
          onItemChange={this.itemChange}
        >
          {this.generateGridToolbar() && this.state.apiActivityCompleted ? (
            <GridToolbar>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                {this.generateGridToolbar()}
              </div>
            </GridToolbar>
          ) : null}
          {this.createColumns(this.props.columnConfig)}
          {/* {this.noRecordsJSX()} */}
        </Grid>
        {this.props.exportToPDF ? (
          <GridPDFExport
            pageTemplate={(props) => this.generatePDFTemplate(props)}
            ref={(pdfExport) => (this.gridPDFExport = pdfExport)}
            {...this.props.exportToPDF}
            fileName={
              this.props.exportToPDF.fileNameTemplate
                ? eval(this.props.exportToPDF.fileNameTemplate)
                : undefined
            }
          >
            <Grid
              data={
                this.props.exportToPDF.defaultFilters &&
                this.state.gridData.data &&
                typeof this.state.gridData.data == "array"
                  ? process(
                      this.state.gridData.data,
                      JSON.parse(this.props.exportToPDF.defaultFilters)
                    )
                  : this.state.gridData.data
              }
            >
              {this.createColumns(this.props.exportToPDF.columnConfig)}
            </Grid>
          </GridPDFExport>
        ) : null}
        {this.props.exportToExcel ? (
          <ExcelExport ref={(excelExport) => (this._excelExport = excelExport)}>
            {this.props.exportToExcel.columnConfig
              ? this.props.exportToExcel.columnConfig.map((item) => (
                  <ExcelExportColumn
                    field={item.field}
                    title={item.title}
                    cellOptions={item.cellOptions}
                    locked={item.locked}
                    width={item.width}
                  />
                ))
              : null}
          </ExcelExport>
        ) : null}
      </div>
    );
  }
}

class CustomCell extends GridCell {
  render() {
    var formatDate = (dateTime, dateTimeFormat) => {
      let userTimezone,
        userDateTimeFomat = null;
      userTimezone = this.props.userProfile.preferences.timezone
        ? this.props.userProfile.preferences.timezone
        : moment.tz.guess();
      userDateTimeFomat = this.props.userProfile.preferences.dateformat
        ? this.props.userProfile.preferences.dateformat
        : "YYYY-MM-DD";
      dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
      return moment(dateTime)
        .utc(dateTime, "YYYY-MM-DD HH:mm:ss")
        .clone()
        .tz(userTimezone)
        .format(userDateTimeFomat);
    };
    var formatDateWithoutTimezone = (dateTime, dateTimeFormat) => {
      let userDateTimeFomat = null;
      userDateTimeFomat = this.props.userProfile.preferences.dateformat
        ? this.props.userProfile.preferences.dateformat
        : "YYYY-MM-DD";
      dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
      return moment(dateTime).format(userDateTimeFomat);
    };
    let checkType = typeof this.props.cellTemplate;
    if (checkType == "function") {
      var cellTemplate = this.props.cellTemplate(this.props.dataItem);
      if (this.props.type == "filterTemplate") {
        return <div className="gridActions">{cellTemplate}</div>;
      } else {
        return <td className="gridActions">{cellTemplate}</td>;
      }
    } else if (checkType == "string") {
      return (
        <JsxParser
          bindings={{
            item: this.props.dataItem,
            moment: moment,
            formatDate: formatDate,
            formatDateWithoutTimezone: formatDateWithoutTimezone,
            profile: this.props.userProfile,
            baseUrl: this.props.baseUrl
          }}
          jsx={this.props.cellTemplate}
        />
      );
    }
  }
}

class DetailComponent extends GridDetailRow {
  render() {
    const dataItem = this.props.dataItem;
    return <React.Fragment>{this.props.rowTemplate(dataItem)}</React.Fragment>;
  }
}

OX_Grid.defaultProps = {
  data: [],
  scrollable: "scrollable",
  filterOperators: {
    text: [
      { text: "grid.filterStartsWithOperator", operator: "startswith" },
      { text: "grid.filterContainsOperator", operator: "contains" },
      { text: "grid.filterEqOperator", operator: "eq" },
      { text: "grid.filterNotContainsOperator", operator: "doesnotcontain" },
      { text: "grid.filterNotEqOperator", operator: "neq" },
      { text: "grid.filterEndsWithOperator", operator: "endswith" },
      { text: "grid.filterIsNullOperator", operator: "isnull" },
      { text: "grid.filterIsNotNullOperator", operator: "isnotnull" },
      { text: "grid.filterIsEmptyOperator", operator: "isempty" },
      { text: "grid.filterIsNotEmptyOperator", operator: "isnotempty" }
    ],
    numeric: [
      { text: "grid.filterEqOperator", operator: "eq" },
      { text: "grid.filterNotEqOperator", operator: "neq" },
      { text: "grid.filterGteOperator", operator: "gte" },
      { text: "grid.filterGtOperator", operator: "gt" },
      { text: "grid.filterLteOperator", operator: "lte" },
      { text: "grid.filterLtOperator", operator: "lt" },
      { text: "grid.filterIsNullOperator", operator: "isnull" },
      { text: "grid.filterIsNotNullOperator", operator: "isnotnull" }
    ],
    date: [
      { text: "grid.filterEqOperator", operator: "eq" },
      { text: "grid.filterNotEqOperator", operator: "neq" },
      { text: "grid.filterAfterOrEqualOperator", operator: "gte" },
      { text: "grid.filterAfterOperator", operator: "gt" },
      { text: "grid.filterBeforeOperator", operator: "lt" },
      { text: "grid.filterBeforeOrEqualOperator", operator: "lte" },
      { text: "grid.filterIsNullOperator", operator: "isnull" },
      { text: "grid.filterIsNotNullOperator", operator: "isnotnull" }
    ],
    boolean: [{ text: "grid.filterEqOperator", operator: "eq" }]
  }
};

OX_Grid.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  checkBoxSelection: PropTypes.func,
  columnConfig: PropTypes.array.isRequired,
  filterOperators: PropTypes.object,
  gridDefaultFilters: PropTypes.object,
  gridToolbar: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  gridNoRecords: PropTypes.element,
  gridStyles: PropTypes.object,
  groupable: PropTypes.bool,
  onRowClick: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  osjsCore: PropTypes.object,
  pageable: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  resizable: PropTypes.bool,
  reorderable: PropTypes.bool,
  rowTemplate: PropTypes.func,
  sortable: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  expandable: PropTypes.bool
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

// PDF Processing Kendo
// https://www.telerik.com/kendo-react-ui/components/pdfprocessing/
