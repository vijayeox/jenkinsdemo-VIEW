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
import Swal from "sweetalert2";
import DataLoader from "./components/Grid/DataLoader";
import DataOperation from "./components/Grid/DataOperation";
import CustomFilter from "./components/Grid/CustomFilter";
import "./components/Grid/customStyles.scss";
import InlineComponent from "./components/Grid/InlineComponent";
const util = require('util');
import { Popup } from '@progress/kendo-react-popup';
import { Menu, MenuItem } from '@progress/kendo-react-layout';
import ParameterHandler from "./components/App/ParameterHandler";
import PageNavigation from "./components/PageNavigation";

export default class OX_Grid extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.osjsCore;
    this.baseUrl = this.props.osjsCore
      ? this.props.osjsCore.config("wrapper.url")
      : undefined;
    this.userprofile = this.props.osjsCore
      ? this.props.osjsCore.make("oxzion/profile").get().key
      : undefined;
    this.rawDataPresent = typeof this.props.data == "object" ? true : false;
    this.pageId = this.props.pageId;
    this.appId = this.props.appId;
    this.notif = this.props.notif;
    this.state = {
      showLoader: false,
      gridData: this.rawDataPresent ? this.props.data : { data: [], total: 0 },
      dataState: this.props.gridDefaultFilters
        ? this.props.gridDefaultFilters
        : {},
      contextMenuOpen: false,
      notif: this.notif,
      apiActivityCompleted: this.rawDataPresent ? true : false,
      isTab: this.props.isTab ? this.props.isTab : false,
      actions: this.props.actions?this.props.actions:null,
      menu: null
    };
    this.blurTimeoutRef;
    this.menuWrapperRef;
    this.appNavigationDiv = "navigation_" + this.props.appId;
    this.loader = this.props.osjsCore.make("oxzion/splash");
    this.child = React.createRef();
    this.refreshHandler = this.refreshHandler.bind(this);
    this.inlineEdit = this.inlineEdit.bind(this);
  }
  _excelExport;
  _grid;

  componentDidMount() {
    document.getElementById(this.appNavigationDiv) ? document.getElementById(this.appNavigationDiv).addEventListener("handleGridRefresh",() => this.refreshHandler(),false) : null;
    $(document).ready(function () {
      $(".k-textbox").attr("placeholder", "Search");
    });
    if (!document.getElementsByClassName("PageRender")) {
      this.gridHeight = document.getElementsByClassName("PageRender")[0].clientHeight - 50;
    }
  }

  dataStateChange = (e) => {
    this.setState({ ...this.state, dataState: e.data });
  };

  dataRecieved = (data) => {
    this.setState({ gridData: data, apiActivityCompleted: true });
  };

  componentWillReceiveProps(nextProps) {
    // change to use componentDidUpdate later in future
  // Write different props which when changed we need to trigger a setState
    if (util.inspect(this.props.data, { depth: 2 }) != util.inspect(nextProps.data) || util.inspect(this.props.gridDefaultFilters, {depth: 4}) != util.inspect(nextProps.gridDefaultFilters, {depth: 4}) || util.inspect(this.props.columnConfig) != util.inspect(nextProps.columnConfig)) {
      if (nextProps.gridDefaultFilters) {
        let mergedFilters = {...this.state.dataState,...nextProps.gridDefaultFilters,};
        this.setState({ dataState: mergedFilters });
      }
      // Disable untill there is a use case to do this
      // if (nextProps.data) {
      //   this.setState();
      // }
    }
  }


  parseDefaultFilters() {
    var splitUrl = this.props.data.split("?");
    if (splitUrl[1]) {
      apiUrl = splitUrl[0];
      var getUrlParams = decodeURI(splitUrl[1]).replace("?", "").split("&").map((param) => param.split("=")).reduce((values, [key, value]) => {
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
          cell={dataItem.cell || dataItem.rygRule? (item) => (
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
  
  rowRender = (trElement, dataItem) => {
    const trProps = {
        ...trElement.props,
        onContextMenu: (e) => {
            e.preventDefault();
            this.handleContextMenuOpen(e, dataItem.dataItem);
        }
    };
    return React.cloneElement(trElement, { ...trProps }, trElement.props.children);
}
handleContextMenuOpen = (e, dataItem) => {
  if(this.state.actions){
      this.dataItem = dataItem;
      this.offset = { left: e.clientX, top: e.clientY };
      var actionButtons = [];
      this.setState({
        menu: null
      });
      Object.keys(this.state.actions).map(function (key, index) {
        var action = this.state.actions;
        var string = ParameterHandler.replaceParams(this.appId,action[key].rule, dataItem);
        var _moment = moment;
        var profile = this.userprofile;
        string = string.replace(/moment/g, '_moment');
        var showButton = eval(string);
        var buttonStyles = action[key].icon
          ? {
            width: "auto"
          }
          : {
            width: "auto",
            // paddingTop: "5px",
            color: "white",
            fontWeight: "600"
          };
          const itemRender = (props) => {
            return (
                <div style={{ padding: '5px' }} text={action[key].name}><i style={{marginRight: '5px'}} className={action[key].icon + " manageIcons"}></i>{action[key].name}</div>
            );
        };
        showButton ? actionButtons.push(
            <MenuItem text={action[key].name}  render={itemRender} />
        ): null;
      }, this);
      this.setState({
        menu: actionButtons,
        contextMenuOpen: true
      });
  }
}

  generateGridToolbar() {
    let gridToolbarContent = [];
    if (typeof this.props.gridToolbar == "string") {
      gridToolbarContent.push(
        <div style={{ display: "flex", flexDirection: "row" }}>
          <JsxParser
            bindings={{
              item: this.props.parentData,
              data: this.props.parentData,
              moment: moment,
              profile: this.props.userProfile,
              baseUrl: this.props.baseUrl,
              gridData: this.state.gridData.data
            }}
            jsx={this.props.gridToolbar}
          />
        </div>
      );
    } else if (this.props.gridToolbar) {
      gridToolbarContent.push(this.props.gridToolbar);
    }
    if (this.props.exportToPDF) {
      gridToolbarContent.push(
        <Button
          primary={true}
          onClick={this.exportPDF}
          className={"GridToolBarButton"}
        >
          <i className='fa fa-file-pdf-o'></i>
        </Button>
      );
    }
    if (this.props.exportToExcel) {
      gridToolbarContent.push(
        <Button
          primary={true}
          className={"GridToolBarButton"}
          onClick={() => this.exportExcel(this.props.exportToExcel)}
        >
        <i className='fa fa-file-excel-o'></i>
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
              userTimezone = this.userprofile.preferences.timezone
                ? this.userprofile.preferences.timezone
                : moment.tz.guess();
              userDateTimeFomat = this.userprofile.preferences.dateformat
                ? this.userprofile.preferences.dateformat
                : "YYYY-MM-DD";
              dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
              return moment(dateTime)
                .utc(dateTime, "MM/dd/yyyy HH:mm:ss")
                .clone()
                .tz(userTimezone)
                .format(userDateTimeFomat);
            };
            var formatDateWithoutTimezone = (dateTime, dateTimeFormat) => {
              let userDateTimeFomat = null;
              userDateTimeFomat = this.userprofile.preferences.dateformat
                ? this.userprofile.preferences.dateformat
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
    this.child.current ? this.child.current.triggerGetCall() : this.child.triggerGetCall();
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
    let eventDiv = document.getElementById(this.props.parentDiv);
    let ev2 = new CustomEvent("clickAction", {
      detail: config,
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
          className={"GridToolBarButton"}
        />
      );
    } else if (operationsList.length == 1) {
      return (
        <Button
          title={operationsList[0].name}
          className={"GridToolBarButton"}
          primary={true}
          onClick={(e) => this.updatePageContent(operationsList[0])}
        >
          <i className={operationsList[0].icon}></i>
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
  onPopupOpen = (e,props) => {
    console.log('test');
    console.log(e);
    console.log(props);
    this.menuWrapperRef.querySelector('[tabindex]').focus();
};
onFocusHandler = () => {
  clearTimeout(this.blurTimeoutRef);
  this.blurTimeoutRef = undefined;
};

onBlurTimeout = () => {
  this.setState({
      contextMenuOpen: false
  });

  this.blurTimeoutRef = undefined;
};

onBlurHandler = event => {
  clearTimeout(this.blurTimeoutRef);
  this.blurTimeoutRef = setTimeout(this.onBlurTimeout);
};
async buttonAction(actionCopy, rowData) {
  var action = actionCopy;
  if (action.content){
    action.details = action.content;
  }
  var mergeRowData = this.props.currentRow ? {...this.props.currentRow, ...rowData} : rowData;
  console.log(actionCopy);
  if (action.page_id) {
    PageNavigation.loadPage(this.appId,this.pageId,action.page_id);
  } else if (action.details) {
    var pageDetails = this.state.pageContent;
    var that = this;
    var copyPageContent = [];
    if(rowData.rygRule){
      copyPageContent.push({type: "HTMLViewer" , content: rowData.rygRule, className: "rygBadge"});  
    }
    var checkForTypeUpdate = false;
    var updateBreadcrumb = true;
    var pageId = null;
    if (action.details.length > 0) {
      action.details.every(async (item, index) => {
        if (item.type == "Update") {
          var PageRenderDiv = document.getElementById(this.props.parentDiv);
          this.loader.show(PageRenderDiv ? PageRenderDiv : null);
          checkForTypeUpdate = true;
          const response = await that.updateActionHandler(item, mergeRowData);
          if (response.status == "success") {
            this.loader.destroy();
            if (item.successMessage) {
              Swal.fire({
                icon: "success",
                title: item.successMessage,
                showConfirmButton: true,
              });
            }
            item.params.successNotification ? that.state.notif.current.notify("Success",item.params.successNotification.length > 0 ? item.params.successNotification: "Update Completed","success") : null;
            this.props.postSubmitCallback();
            this.setState({ showLoader: false });
          } else {
            this.loader.destroy();
            Swal.fire({
              icon: "error",
              title: response.message,
              showConfirmButton: true,
            });
            that.setState({
              pageContent: pageDetails,
              showLoader: false,
            });
            return false;
          }
        } else {
          if (item.params && item.params.page_id) {
            pageId = item.params.page_id;
            if (item.params.params) {
              var newParams = ParameterHandler.replaceParams(this.appId,item.params.params,mergeRowData);
              mergeRowData = { ...newParams, ...mergeRowData };
            }
            copyPageContent = [];
          } else {
            var pageContentObj = {};
            pageContentObj = ParameterHandler.replaceParams(this.appId,item, mergeRowData);
            copyPageContent.push(pageContentObj);
          }
        }
      });
      action.updateOnly
        ? null
        : PageNavigation.loadPage(
            this.appId,this.pageId,
            pageId,
            action.icon,
            true,
            action.name,
            mergeRowData,
            copyPageContent
          );
    }
  }
}
updateActionHandler(details, rowData) {
  var that = this;
  return new Promise((resolve) => {
    var queryRoute = ParameterHandler.replaceParams(this.appId,details.params.url, rowData);
    var postData = {};
    try {
      if (details.params.postData) {
        Object.keys(details.params.postData).map((i) => {
          postData[i] = ParameterHandler.replaceParams(this.appId,
            details.params.postData[i],
            rowData
          );
        });
      } else {
        Object.keys(details.params).map((i) => {
          postData[i] = ParameterHandler.replaceParams(this.appId,
            details.params[i],
            rowData
          );
        });
        postData = rowData;
      }
    } catch (error) {
      postData = rowData;
    }
    ParameterHandler.updateCall(
        that.core,that.appId,
        queryRoute,
        postData,
        details.params.disableAppId,
        details.method
      )
      .then((response) => {
        if (details.params.downloadFile && response.status == 200) {
          ParameterHandler.downloadFile(response).then(
              (result) => {
                that.setState({
                  showLoader: false,
                });
                var downloadStatus = result ? "success" : "failed";
                resolve({ status: downloadStatus });
              }
            );
        } else {
          that.setState({
            showLoader: false,
          });
          resolve(response);
        }
      });
  });
}
handleOnSelect = (e) => {
  console.log(e)
  Object.keys(this.state.actions).map(function (key, index) {
    if(this.state.actions[key].name==e.item.text){
      this.state.actions[key].confirmationMessage
      ? Swal.fire({
        title: this.state.actions[key].confirmationMessage,
        confirmButtonText: "Agree",
        confirmButtonColor: "#275362",
        showCancelButton: true,
        cancelButtonColor: "#7b7878",
        target: ".PageRender"
      }).then((result) => {
        result.value ? this.buttonAction(this.state.actions[key],this.dataItem) : null;
      }) : this.state.actions[key].details ? this.buttonAction(this.state.actions[key],this.dataItem) : null;
    }
  }, this);
  this.setState({
    contextMenuOpen: false
  })
}

  render() {
    return (
      <div
        style={this.props.wrapStyle ? this.props.wrapStyle : { height: "100%" }}
        className={
          "GridCustomStyle " +
          (this.props.className ? this.props.className : "")
        }
      >
      <Popup
        offset={this.offset}
        show={this.state.contextMenuOpen}
        open={this.onPopupOpen}
        popupClass={'popup-content'} >
          <div onFocus={this.onFocusHandler}
              onBlur={this.onBlurHandler}
              tabIndex={-1}
              ref={el => (this.menuWrapperRef = el)} >
            <Menu vertical={true} style={{ display: 'inline-block' }} onSelect={this.handleOnSelect}>
              {this.state.menu}
            </Menu>
          </div>
      </Popup>
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
            ref={(r)=>{this.child = r;}}
            args={this.props.osjsCore}
            url={this.props.data}
            dataState={this.state.dataState}
            onDataRecieved={this.dataRecieved}
            {...this.props}
          />
        )}
        <Grid
          rowRender={this.rowRender}
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
              className={"GridToolBar"}
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
              {this.createColumns(
                this.props.exportToPDF.columnConfig
                  ? this.props.exportToPDF.columnConfig
                  : this.props.columnConfig
              )}
            </Grid>
          </GridPDFExport>
        ) : null}
        {this.props.exportToExcel ? (
          <ExcelExport
            ref={(excelExport) => (this._excelExport = excelExport)}
            fileName={
              this.props.exportToExcel.fileNameTemplate
                ? eval(this.props.exportToExcel.fileNameTemplate)
                : undefined
            }
          >
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
        : "MM/dd/yyyy";
      dateTimeFormat ? (userDateTimeFomat = dateTimeFormat) : null;
      return moment(dateTime)
        .utc(dateTime, "MM/dd/yyyy HH:mm:ss")
        .clone()
        .tz(userTimezone)
        .format(userDateTimeFomat);
    };
    var formatDateWithoutTimezone = (dateTime, dateTimeFormat) => {
      let userDateTimeFomat = null;
      userDateTimeFomat = this.props.userProfile.preferences.dateformat
        ? this.props.userProfile.preferences.dateformat
        : "MM/dd/yyyy";
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
    } else if (checkType == "string"  || this.props.dataItem.rygRule) {
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
          jsx={this.props.cellTemplate ? this.props.cellTemplate : this.props.dataItem.rygRule ? this.props.dataItem.rygRule : "<td></td>" }
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
