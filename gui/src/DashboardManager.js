import React from 'react';
import { dashboard as section } from '../metadata.json';
import Notification from './Notification'
import DashboardViewer from './Dashboard'
import DashboardFilter from './DashboardFilter'
import { preparefilter, replaceCommonFilters, showDashboard, extractFilterValues } from './DashboardUtils'
import { Button } from 'react-bootstrap'
import '../../gui/src/public/css/sweetalert.css';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import DashboardEditorModal from './components/Modals/DashboardEditorModal'
import DashboardEditor from "./dashboardEditor"
import Select, { createFilter } from 'react-select'
import exportFromJSON from 'export-from-json'
const fileName = 'download'
const exportType = 'xls'

class DashboardManager extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.userProfile = this.core.make("oxzion/profile").get();
    this.filterRef = React.createRef();
    this.props.setTitle(section.title.en_EN);
    this.content = this.props.content;
    var uuid = '';
    if (this.props.uuid) {
      uuid = this.props.uuid;
    }
    if (this.props.content) {
      var content = this.props.content
      if (content && content.uuid) {
        uuid = content.uuid;
      }
    }
    this.state = {
      showModal: false,
      modalType: "",
      modalContent: {},
      flipped: false,
      uuid: uuid,
      dashList: [],
      inputs: {},
      dashboardBody: "",
      loadEditor: false,
      filterConfiguration: [],
      filterOptions: [],
      showFilter: false,
      dashboardFilter: [],
      drilldownDashboardFilter: [],
      hideEdit: this.props.hideEdit,
      dashboardStack: [],
      exportConfiguration: null,
      loadDefaultFilters: false
    };
    this.appId = this.props.app;
    this.proc = this.props.proc;
    this.refresh = React.createRef();
    this.notif = React.createRef();
    this.restClient = this.core.make('oxzion/restClient');
    this.deleteDashboard = this.deleteDashboard.bind(this);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.uuid && this.props.uuid != "" && this.props.uuid != 0) {
      this.getDashboardHtmlDataByUuid(this.props.uuid)
    } else {
      this.fetchDashboards(false)
    }
    this.myRef.current.scrollTo(100, 100);
    if (this.filterRef.current && this.filterRef.current.state.applyFilterOption) {
      this.setState({ filterOptions: this.filterRef.current.state.applyFilterOption })
    }
  }

  async getUserDetails(uuid) {
    let rolesList = await this.restClient.request(
      "v1",
      "organization/" + this.props.selectedOrg + "/user/" + uuid + "/profile",
      {},
      "get"
    );
    return rolesList;
  }

  dashboardOperation = (e, operation) => {
    if (operation === "Delete" || operation === "Activate" || operation === "SetDefault") {
      this.setState({ showModal: true, modalContent: e, modalType: operation })
    } else {
      this.setState({ showModal: true, modalContent: e, modalType: operation, uuid: e.uuid })
    }
  }

  async getDashboardHtmlDataByUuid(uuid) {
    let helper = this.restClient;
    // let dashboardStack = [...this.state.dashboardStack]
    let dashboardStack = JSON.parse(JSON.stringify(this.state.dashboardStack))
    let inputs = this.state.inputs !== undefined ? this.state.inputs : undefined;
    let dashData = [];
    let response = await helper.request(
      "v1",
      "analytics/dashboard/" + uuid,
      {},
      "get"
    );
    let dash = response.data.dashboard;
    let applyFilterOption = []
    let dashboardFilter = dash.filter_configuration != "" ? JSON.parse(dash.filter_configuration) : []
    dashData.push({ dashData: response.data });
    dashboardFilter && dashboardFilter.map((filter, index) => {
      if (!filter.isDefault) {
        // this.state.filters[index]["filterName"] && applyFilterOption.push({ label: this.state.filters[index]["filterName"], value: this.state.filters[index] })
        applyFilterOption.push({ label: filter["filterName"], value: filter })
      }
    })

    let preapredExtractedFilterValue = this.getPreparedExtractedFilterValues(dashboardFilter, "default")
    inputs["dashname"] = dash
    dashboardStack.push({ data: dash, drilldownDashboardFilter: preapredExtractedFilterValue })
    this.setState({ dashboardBody: "", inputs, uuid: uuid, dashList: dashData, filterConfiguration: dashboardFilter, dashboardStack: dashboardStack, drilldownDashboardFilter: preapredExtractedFilterValue, filterOptions: applyFilterOption, loadDefaultFilters: true })
  }

  getPreparedExtractedFilterValues(dashboardFilter, filtermode) {
    filtermode = filtermode || "applied"
    let extractedFilterValues = extractFilterValues(dashboardFilter, [...this.state.dashboardStack], filtermode);
    let preapredExtractedFilterValue = null
    if (extractedFilterValues && extractedFilterValues.length > 0) {
      preapredExtractedFilterValue = extractedFilterValues[0]
      for (let i = 1; i < extractedFilterValues.length; i++) {
        preapredExtractedFilterValue = preparefilter(preapredExtractedFilterValue, extractedFilterValues[i])
      }
    }
    return preapredExtractedFilterValue
  }

  async fetchDashboards(isRefreshed) {
    let that = this
    let helper = this.restClient;
    let inputs = this.state.inputs !== undefined ? this.state.inputs : undefined;
    let dashboardStack = JSON.parse(JSON.stringify(this.state.dashboardStack))
    let response = await helper.request('v1', '/analytics/dashboard?filter=[{"sort":[{"field":"name","dir":"asc"}],"skip":0,"take":0}]', {}, 'get');
    if (response.data.length > 0) {
      that.setState({ dashList: response.data, uuid: '' })
      if (inputs["dashname"] != undefined) {
        //setting value of the dropdown after fetch
        response.data.map(dash => {
          if (dash.name === inputs["dashname"]["name"]) {
            let dashboardFilter = dash.filter_configuration != "" ? JSON.parse(dash.filter_configuration) : []
            inputs["dashname"] = dash
            let preapredExtractedFilterValue = this.getPreparedExtractedFilterValues(dashboardFilter, "default")
            if (!isRefreshed) {
              dashboardStack.push({ data: dash, drilldownDashboardFilter: preapredExtractedFilterValue, filterConfiguration: dashboardFilter })
            } else {
              if (dashboardStack.length > 0) {
                let filterOption = []
                let appliedFilters = []
                dashboardFilter && dashboardFilter.map((filter, index) => {
                  if (!filter.isDefault) {
                    filterOption.push({ label: filter["filterName"], value: filter })
                  } else {
                    appliedFilters.push(filter)
                  }
                })
                //replacing with new filter values after dashboard edit
                dashboardStack[dashboardStack.length - 1]["filterConfiguration"] = appliedFilters
                dashboardStack[dashboardStack.length - 1]["filterOptions"] = filterOption
                dashboardStack[dashboardStack.length - 1]["drilldownDashboardFilter"] = preapredExtractedFilterValue
                dashboardStack[dashboardStack.length - 1]["data"] = dash
              }
            }
            that.setState({ inputs, dashList: response.data, uuid: dash.uuid, filterConfiguration: dashboardFilter, exportConfiguration: dash.export_configuration, dashboardStack: dashboardStack })
            isRefreshed && that.setState({ drilldownDashboardFilter: preapredExtractedFilterValue })
          } else {
            that.setState({ inputs: this.state.inputs })
          }
        })
      } else {
        //setting default dashboard on page load
        response.data.map(dash => {
          if (dash.isdefault === "1") {
            let dashboardFilter = dash.filter_configuration != "" ? JSON.parse(dash.filter_configuration) : []
            // if(dashboardStack.length==0){
            //   dashboardStack.push({ data: dash, drilldownDashboardFilter: dashboardFilter, filterConfiguration: dashboardFilter })
            // }
            inputs["dashname"] = dash
            let applyFilterOption = []
            dashboardFilter && dashboardFilter.map((filter, index) => {
              if (!filter.isDefault) {
                // this.state.filters[index]["filterName"] && applyFilterOption.push({ label: this.state.filters[index]["filterName"], value: this.state.filters[index] })
                applyFilterOption.push({ label: filter["filterName"], value: filter })
              }
            })
            let preapredExtractedFilterValue = this.getPreparedExtractedFilterValues(dashboardFilter, "default")
            !isRefreshed && dashboardStack.push({ data: dash, drilldownDashboardFilter: preapredExtractedFilterValue, filterConfiguration: dashboardFilter, filterOptions: applyFilterOption })

            that.setState({ dashboardBody: "", inputs, dashList: response.data, uuid: dash.uuid, exportConfiguration: dash.export_configuration, filterConfiguration: dashboardFilter, dashboardStack: dashboardStack, drilldownDashboardFilter: preapredExtractedFilterValue, filterOptions: applyFilterOption, loadDefaultFilters: true })
          }
        })
      }
    } else {
      this.setState({ dashboardBody: "NO OI FOUND" })
    }
  }

  setTitle(title) { }

  deleteDashboard() {
    let inputs = { ...this.state.inputs }
    if (inputs["dashname"] != undefined) {
      inputs["dashname"] = undefined
      this.setState({ inputs: {} })
    }
  }

  editDashboard() {
    showDashboard(true)
    this.setState({ flipped: true, uuid: this.state.uuid, loadEditor: true })
  }

  createDashboard() {
    showDashboard(true)
    let inputs = { ...this.state.inputs }
    inputs["dashname"] !== undefined && delete inputs.dashname
    this.setState({ flipped: true, uuid: "", inputs: inputs, loadEditor: true })
  }

  showFilter() {
    this.setState({ showFilter: true }, state => {
      var element = document.getElementById("filter-form-container");
      element.classList.remove("disappear");
      var element = document.getElementById("dashboard-preview-container");
      element.classList.add("disappear");
    })
  }

  hideFilter() {
    this.setState({ showFilter: false })
    var element = document.getElementById("dashboard-preview-container");
    element.classList.remove("disappear");
  }

  applyDashboardFilter(filter) {
    let dashboardStack = null
    let dashboardFilterRef = this.filterRef.current
    let filterOptions = dashboardFilterRef.state.applyFilterOption
    if (this.state.dashboardStack.length == 1) {
      dashboardStack = [...this.state.dashboardStack]
      let dashboardFilter = filter
      let extractedFilterValues = extractFilterValues(dashboardFilter, dashboardStack);
      let preapredExtractedFilterValue = (extractedFilterValues && extractedFilterValues.length == 1) ? extractedFilterValues[0] : []
      if (extractedFilterValues && extractedFilterValues.length > 1) {
        preapredExtractedFilterValue = extractedFilterValues[0]
        for (let i = 1; i < extractedFilterValues.length; i++) {
          preapredExtractedFilterValue = preparefilter(preapredExtractedFilterValue, extractedFilterValues[i])
        }
      }
      dashboardStack[dashboardStack.length - 1]["drilldownDashboardFilter"] = preapredExtractedFilterValue
      dashboardStack[dashboardStack.length - 1]["filterConfiguration"] = filter
      dashboardStack[dashboardStack.length - 1]["filterOptions"] = filterOptions
    } else {
      dashboardStack = [...this.state.dashboardStack]
      dashboardStack[dashboardStack.length - 1]["filterConfiguration"] = filter
      // dashboardStack[dashboardStack.length - 1]["filterOptions"] = filterOptions
    }
    if (dashboardStack != null) {
      this.setState({ dashboardFilter: filter, dashboardStack: dashboardStack, filterConfiguration: filter, filter, filterOptions: filterOptions })
    } else {
      this.setState({ dashboardFilter: filter, filterConfiguration: filterOptions, filterOptions: filterOptions })
    }
    this.hideFilter()
  }

  getDashboardFilters() {
    if (this.state.filterConfiguration) {
      try {
        let validJson = JSON.parse(this.state.filterConfiguration)
        return validJson
      } catch (e) {
        console.error("Invalid json filter found in the database");
        return []
      }
    } else {
      return []
    }
  }

  drilldownToDashboard(e, type) {
    //pushing next dashboard details into dashboard stack
    let dashboardStack = JSON.parse(JSON.stringify(this.state.dashboardStack))
    let filterConfiguration = this.filterRef.current
    let dashboardTitle = e.drilldownDashboardTitle ? e.drilldownDashboardTitle : ""
    //adding applied filters on dashboard
    if (dashboardStack.length > 0) {
      dashboardStack[dashboardStack.length - 1]["drilldownDashboardFilter"] = e.dashboardFilter ? e.dashboardFilter : []
      //filter which are applied on the dashboard
      dashboardStack[dashboardStack.length - 1]["filterConfiguration"] = (filterConfiguration && filterConfiguration.state.filters) ? filterConfiguration.state.filters : []
      //filters which appear in drop down
      // console.log(this.getFilterProperty("filterConfiguration"))
      dashboardStack[dashboardStack.length - 1]["filterOptions"] = this.getOptionalFilters("filterOptions")
      dashboardStack[dashboardStack.length - 1]["widgetFilter"] = e.widgetFilter ? e.widgetFilter : []
    }

    let value = JSON.parse(e.value)
    if (dashboardStack.length > 1) {
      //check for consequent drilldown to same dashboard
      if (dashboardStack[dashboardStack.length - 1]["data"]["uuid"] != value["uuid"])
        dashboardStack.push({ data: value, drilldownDashboardFilter: e.drilldownDashboardFilter, drilldownDashboardTitle: dashboardTitle })
    } else {
      dashboardStack.push({ data: value, drilldownDashboardFilter: e.drilldownDashboardFilter, drilldownDashboardTitle: dashboardTitle })
    }
    this.setState({ dashboardStack: dashboardStack, loadDefaultFilters: false }, () => { this.changeDashboard(e) })
  }

  changeDashboard(event) {
    //defining change dashboard explicitly to support reset dashboard on handle change
    let inputs = {}
    inputs = { ...this.state.inputs }
    let name
    let value
    showDashboard(false)
    value = JSON.parse(event.value)
    let dashboardFilter = value["filter_configuration"] != "" ? JSON.parse(value["filter_configuration"]) : []
    inputs["dashname"] = value
    let optionalFilter = []
    if (this.state.dashboardStack.length > 1) {
      optionalFilter = replaceCommonFilters([...this.state.dashboardStack[this.state.dashboardStack.length - 2]["filterConfiguration"]], dashboardFilter, "filterOptions")
      this.setState({ filterOptions: optionalFilter })
    }
    this.setState({ inputs: inputs, uuid: value["uuid"], filterConfiguration: dashboardFilter, showFilter: false, drilldownDashboardFilter: event.drilldownDashboardFilter })
  }

  handleChange(event, inputName) {
    let inputs = {}
    inputs = { ...this.state.inputs }
    let name
    let value
    // resetting stack on manual change of dashboard
    let dashboardStack = []
    value = JSON.parse(event.value)
    if (inputName && inputName == "dashname") {
      showDashboard(false)
      name = inputName
      value = JSON.parse(event.value)
      //resetting dashboard filters on load
      let dashboardFilterConf = value["filter_configuration"] != "" ? JSON.parse(value["filter_configuration"]) : []
      this.setState({ dashboardFilter: dashboardFilterConf, exportConfiguration: value.export_configuration })
    } else {
      name = event.target.name
      value = event.target.value
    }
    inputs[name] = value
    let dashboardFilter = value["filter_configuration"] != "" ? JSON.parse(value["filter_configuration"]) : []
    let extractedFilterValues = extractFilterValues(dashboardFilter, [...this.state.dashboardStack], "default");
    let preapredExtractedFilterValue = null
    if (dashboardStack.length != 0) {
      if (extractedFilterValues && extractedFilterValues.length > 1) {
        preapredExtractedFilterValue = extractedFilterValues[0]
        for (let i = 1; i < extractedFilterValues.length; i++) {
          preapredExtractedFilterValue = preparefilter(preapredExtractedFilterValue, extractedFilterValues[i])
        }
      }
    }
    dashboardStack.push({ data: value, drilldownDashboardFilter: preapredExtractedFilterValue, filterConfiguration: dashboardFilter })
    this.setState({ inputs: inputs, uuid: value["uuid"], filterConfiguration: dashboardFilter, showFilter: false, drilldownDashboardFilter: event.drilldownDashboardFilter, dashboardStack: dashboardStack, loadDefaultFilters: true })
  }

  // refreshDashboard() {
  //   let dashName = {}
  //   dashName['value'] = JSON.stringify(this.state.inputs.dashname)
  //   dashName['label'] = this.state.inputs.dashname.name
  //   dashName['key'] = this.state.inputs.dashname.uuid
  //   this.handleChange(dashName, "dashname")
  // }

  rollupToDashboard() {
    let stack = [...this.state.dashboardStack]
    //removing the last dashboard from stack
    stack.pop()
    if (stack && stack.length > 0) {
      let dashboard = stack[stack.length - 1]
      let event = {}
      event.value = JSON.stringify(dashboard.data)
      event.drilldownDashboardFilter = dashboard.drilldownDashboardFilter
      this.setState({ dashboardStack: stack, loadDefaultFilters: false }, () => { this.changeDashboard(event) })
    }
  }

  getFilterProperty(property) {
    let appliedFilters = []
    if (this.state.dashboardStack && this.state.dashboardStack.length > 0) {
      if (this.state.dashboardStack[this.state.dashboardStack.length - 1][property]) {
        //executes after the filter is applied in the drilldown dashboard [filterconfiguration in dashboardstack must be set]
        return this.state.dashboardStack[this.state.dashboardStack.length - 1][property]
      } else if (this.state.dashboardStack.length > 1) {
        appliedFilters = replaceCommonFilters([...this.state.dashboardStack[this.state.dashboardStack.length - 2][property]], [...this.state[property]], property)
        // appliedFilters.push(...this.state.dashboardStack[this.state.dashboardStack.length - 2][property])
        // appliedFilters.push(...this.state[property])
        return appliedFilters
      } else
        return this.state[property]
    }
    return this.state[property]
  }

  getOptionalFilters(property) {
    if (this.state.dashboardStack && this.state.dashboardStack.length > 0) {
      if (this.state.dashboardStack[this.state.dashboardStack.length - 1][property]) {
        return this.state.dashboardStack[this.state.dashboardStack.length - 1][property]
      } else if (this.state.dashboardStack.length > 1) {
        let childfilter = []
        if (this.state.filterOptions && this.state.filterOptions.length > 0) {
          childfilter = [...this.state.filterOptions]
        }
        let optionalFilter = replaceCommonFilters([...this.state.dashboardStack[this.state.dashboardStack.length - 2]["filterConfiguration"]], childfilter, property)
        return optionalFilter
      } else
        return [...this.state[property]]
    }
    return [...this.state[property]]
  }

  async exportExcel() {
    let formData = {}
    if (this.state.exportConfiguration != null) {
      let parsedConfiguration = JSON.parse(this.state.exportConfiguration)
      formData["configuration"] = JSON.stringify(parsedConfiguration["configuration"])
      formData["datasource_id"] = parsedConfiguration["datasource_id"]
      formData["filter"] = JSON.stringify(this.state.drilldownDashboardFilter)
    }
    let response = await this.restClient.request('v1', 'analytics/query/preview', formData, 'filepost');
    this.notif.current.notify(
      "Generating Report",
      "Please wait...",
      "warning"
    )
    if (response.status == "success") {
      // console.log(response.data.result)
      let data = response.data.result
      let filename = this.state.inputs["dashname"]["name"]
      exportFromJSON({ data, fileName: filename, exportType })
    } else {
      this.notif.current.notify(
        "Could not fetch data",
        "Please check the export configuration",
        "error"
      )
    }
  }

  render() {
    let containsFilter = (Array.isArray(this.state.filterConfiguration) && this.state.filterConfiguration.length > 0) || (this.getFilterProperty("filterConfiguration").length > 0) || (this.getOptionalFilters("filterOptions").length > 0)
    return (
      <div ref={this.myRef} className="dashboard">
        <Notification ref={this.notif} />
        <Flippy
          flipDirection="horizontal" // horizontal or vertical
          isFlipped={this.state.flipped}
          flipOnClick={false}
          style={{ width: '100%', height: '100vh' }} /// these are optional style, it is not necessary
        >
          <FrontSide /*style={{ marginTop: '-50px' }}*/>
            <div id="filter-form-container" className="disappear">
              {containsFilter &&
                <DashboardFilter
                  ref={this.filterRef}
                  core={this.core}
                  filterMode="APPLY"
                  hideFilterDiv={() => this.hideFilter()}
                  filterConfiguration={this.getFilterProperty("filterConfiguration")}
                  applyFilterOption={this.getOptionalFilters("filterOptions")}
                  setDashboardFilter={(filter) => this.applyDashboardFilter(filter)}
                  dashboardStack={this.state.dashboardStack}
                />
              }
            </div>
            {(this.state.dashList != undefined && this.state.dashList.length > 0) ?
              <div id="dashboard-preview-container">
                <div className="dash-manager-bar">
                  {
                    !this.props.hideEdit && this.userProfile.key.privileges.MANAGE_DASHBOARD_WRITE &&
                    <Select
                      name="dashname"
                      className="react-select-container"
                      placeholder="Select OI"
                      id="dashname"
                      filterOption={createFilter({ ignoreAccents: false })}
                      onChange={(e) => this.handleChange(e, "dashname")}
                      value={JSON.stringify(this.state.inputs["dashname"]) != undefined ? { value: this.state.inputs["dashname"], label: this.state.inputs["dashname"]["name"] } : ""}
                      options={this.state.dashList &&
                        this.state.dashList.map((option, index) => {
                          return {
                            value: JSON.stringify(option),
                            label: option.name,
                            key: option.uuid
                          }
                        })
                      }
                    />
                  }
                  <div className="dash-manager-buttons">
                    {
                      !this.props.hideEdit && this.userProfile.key.privileges.MANAGE_DASHBOARD_WRITE &&
                      <Button onClick={() => this.createDashboard()} title="Add New OI"><i className="fa fa-plus" aria-hidden="true"></i></Button>
                    }
                    {(this.state.uuid !== "" && this.state.inputs["dashname"] != undefined) &&
                      <>
                        {
                          !this.props.hideEdit && this.userProfile.key.privileges.MANAGE_DASHBOARD_WRITE &&
                          <Button onClick={() => this.editDashboard()} title="Edit OI">
                            <i className="fa fa-edit" aria-hidden="true"></i>
                          </Button>
                        }
                        {
                          (this.userProfile.key.privileges.MANAGE_DASHBOARD_DELETE &&
                            this.state.inputs["dashname"]["isdefault"] == "0") &&
                          <Button onClick={() => this.dashboardOperation(this.state.inputs["dashname"], "Delete")} title="Delete OI">
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </Button>
                        }
                        {
                          containsFilter &&
                          <Button onClick={() => this.showFilter()} title="Filter OI">
                            <i className="fa fa-filter" aria-hidden="true"></i>
                          </Button>
                        }
                        {/* {
                          <Button onClick={() => this.refreshDashboard()} title="Refresh OI">
                            <i className="fa fa-refresh" aria-hidden="true"></i>
                          </Button>
                        } */}
                        {/* <ReactToPrint
                          trigger={() => {
                            return <Button title="Print OI">
                              <i className="fa fa-print" aria-hidden="true"></i>
                            </Button>
                          }}
                          content={() => this.dashboardViewerRef}
                        /> */}
                        {this.state.exportConfiguration != null &&
                          <Button onClick={() => this.exportExcel()} title="Export OI"><i className="fas fa-file-export"></i></Button>
                        }
                        {this.userProfile.key.privileges.MANAGE_DASHBOARD_WRITE &&
                          (this.state.inputs["dashname"] != undefined && this.state.inputs["dashname"]["isdefault"] == "0") ?
                          (this.props.hideEdit == false &&
                            <Button
                              onClick={() => this.dashboardOperation(this.state.inputs["dashname"], "SetDefault")}
                              title="Make current OI as default OI"
                            >MAKE DEFAULT
                                </Button>
                          )
                          : (this.props.hideEdit == false &&
                            <Button title="Selected OI is default OI" disabled>Default OI</Button>
                          )
                        }
                      </>
                    }
                  </div>
                </div>

                <div className="dashboard-viewer-div">
                  {
                    this.state.uuid !== "" &&
                    <DashboardViewer
                      drilldownToDashboard={(e, type) => this.drilldownToDashboard(e, type)}
                      ref={el => (this.dashboardViewerRef = el)}
                      key={this.state.uuid}
                      uuid={this.state.uuid}
                      core={this.core}
                      setTitle={this.props.setTitle}
                      proc={this.props.proc}
                      dashboardFilter={this.state.dashboardFilter}
                      applyDashboardFilter={filter => this.applyDashboardFilter(filter)}
                      drilldownDashboardFilter={this.state.drilldownDashboardFilter}
                      dashboardStack={this.state.dashboardStack}
                      rollupToDashboard={() => this.rollupToDashboard()}
                      loadDefaultFilters={this.state.loadDefaultFilters}
                    />
                  }
                </div>
              </div>
              :
              <div className="dashboard-viewer-div" style={{ textAlign: "center", fontWeight: "bolder", fontSize: "20px" }}>
                {this.state.dashboardBody}
              </div>
            }
          </FrontSide >
          <BackSide>
            {this.state.flipped &&
              <div id="dashboard-editor-div">
                {
                  this.state.loadEditor &&
                  <DashboardEditor
                    args={this.core}
                    notif={this.notif}
                    setTitle={this.setTitle}
                    key={this.state.uuid}
                    dashboardId={this.state.uuid}
                    flipCard={(status) => {
                      if (status === "Saved") {
                        //refreshing the dashboardData
                        this.fetchDashboards(true)
                      } else if (status === "") {
                        showDashboard(false)
                      }
                      this.setState({ flipped: false, loadEditor: false })
                    }}
                  />
                }
              </div>
            }
          </BackSide>
        </Flippy>

        <DashboardEditorModal
          osjsCore={this.core}
          modalType={this.state.modalType}
          show={this.state.showModal}
          onHide={() => { this.setState({ showModal: false }) }}
          content={this.state.modalContent}
          notification={this.notif}
          refreshDashboard={() => this.fetchDashboards(true)}
          deleteDashboard={this.deleteDashboard}
        />
      </div>
    );
  }
}

export default DashboardManager;

