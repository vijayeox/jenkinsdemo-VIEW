import React from 'react';
import { dashboard as section } from '../metadata.json';
import Swal from "sweetalert2";
import Notification from './Notification'
import DashboardViewer from './Dashboard'
import DashboardFilter from './DashboardFilter'
import { Button } from 'react-bootstrap'
import '../../gui/src/public/css/sweetalert.css';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import DashboardEditorModal from './components/Modals/DashboardEditorModal'
import DashboardEditor from "./dashboardEditor"
import Select, { createFilter } from 'react-select'
import ReactToPrint from 'react-to-print'
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
    this.state = {
      showModal: false,
      modalType: "",
      modalContent: {},
      flipped: false,
      uuid: this.props.uuid,
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
      exportConfiguration: null
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
    }
    else {
      this.setState({ showModal: true, modalContent: e, modalType: operation, uuid: e.uuid })
    }
  }

  async getDashboardHtmlDataByUuid(uuid) {
    let helper = this.restClient;
    let dashboardStack = this.state.dashboardStack
    let inputs = this.state.inputs !== undefined ? this.state.inputs : undefined;
    let dashData = [];
    let response = await helper.request(
      "v1",
      "analytics/dashboard/" + uuid,
      {},
      "get"
    );
    let dash = response.data.dashboard;
    let dashboardFilter = dash.filter_configuration != "" ? JSON.parse(dash.filter_configuration) : []
    dashData.push({ dashData: response.data });

    let extractedFilterValues = this.extractFilterValues(dashboardFilter);
    let preapredExtractedFilterValue = null
    if (extractedFilterValues && extractedFilterValues.length > 0) {
      preapredExtractedFilterValue = extractedFilterValues[0]
      for (let i = 1; i < extractedFilterValues.length; i++) {
        preapredExtractedFilterValue = this.preparefilter(preapredExtractedFilterValue, extractedFilterValues[i])

      }
    }
    inputs["dashname"] = dash
    dashboardStack.push({ data: dash, drilldownDashboardFilter: preapredExtractedFilterValue })
    this.setState({ dashboardBody: "", inputs, uuid: uuid, dashList: dashData, filterConfiguration: dashboardFilter, dashboardStack: dashboardStack, drilldownDashboardFilter: preapredExtractedFilterValue })
  }

  preparefilter(filter1, filter2) {
    var filter = []
    filter.push(filter1)
    filter.push("AND")
    filter.push(filter2)
    return filter
  }

  extractFilterValues(dashboardFilter) {
    let filterParams = []
    dashboardFilter.map((filter, index) => {
      let filterarray = []
      if (filter["dataType"] == "date") {
        var startDate = filter["startDate"]
        var endDate = null
        if (filter["startDate"] && filter["endDate"]) {
          //convert startDate object to string
          if (typeof startDate !== "string") {
            startDate = filter["startDate"]
            startDate = "date:" + startDate.getFullYear() + "-" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + startDate.getDate()).slice(-2))
          } else if (new Date(startDate)) {
            startDate = new Date(filter["startDate"])
            startDate = "date:" + startDate.getFullYear() + "-" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + startDate.getDate()).slice(-2))
          }

          //single date passed
          if (filter["operator"] === "today") {
            filter["operator"] = "=="
          }
          if (filter["operator"] === "monthly" || filter["operator"] === "yearly") {
            filter["operator"] = "gte&&lte"
          }

          //date range received
          if (filter["operator"] == "gte&&lte" || filter["operator"] === "mtd" || filter["operator"] === "ytd") {
            endDate = filter["endDate"]

            if (filter["operator"] == "gte&&lte") {
              if (typeof endDate !== "string") {
                endDate = "date:" + endDate.getFullYear() + "-" + (("0" + (endDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + endDate.getDate()).slice(-2))
              } else if (new Date(endDate)) {
                endDate = new Date(endDate)
                endDate = "date:" + endDate.getFullYear() + "-" + (("0" + (endDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + endDate.getDate()).slice(-2))
              }
            } else {
              //get current date values
              startDate = new Date()
              endDate = new Date()
              if (filter["operator"] === "mtd") {
                startDate = "date:" + startDate.getFullYear() + "-" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "-" + ("01")
              }
              else if (filter["operator"] === "ytd") {
                startDate = "date:" + startDate.getFullYear() + "-" + ("01") + "-" + ("01")
              }
              endDate = "date:" + endDate.getFullYear() + "-" + (("0" + (endDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + endDate.getDate()).slice(-2))
              // filter["operator"] = "gte&&lte"
            }
            //prepare startDate array
            filterarray.push(filter["field"])
            filterarray.push(">=")
            filterarray.push(startDate)
            filterParams.push(filterarray)


            //prepare endDate array
            filterarray = []
            filterarray.push(filter["field"])
            filterarray.push("<=")
            filterarray.push(endDate)
            filterParams.push(filterarray)
          } else {
            //if date is not a range
            filterarray = []
            filterarray.push(filter["field"])
            filterarray.push(filter["operator"])
            if (typeof startDate !== "string") {
              startDate = filter["startDate"]
              startDate = "date:" + startDate.getFullYear() + "-" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + startDate.getDate()).slice(-2))
            } else if (new Date(startDate)) {
              startDate = new Date(filter["startDate"])
              startDate = "date:" + startDate.getFullYear() + "-" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + startDate.getDate()).slice(-2))
            }
            filterarray.push(startDate)
            filterParams.push(filterarray)

          }
        } else {
          filterarray.push(filter["field"])
          filterarray.push(filter["operator"])
          if (typeof startDate !== "string") {
            startDate = filter["startDate"]
            startDate = "date:" + startDate.getFullYear() + "-" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + startDate.getDate()).slice(-2))
          } else if (new Date(startDate)) {
            startDate = new Date(filter["startDate"])
            startDate = "date:" + startDate.getFullYear() + "-" + (("0" + (startDate.getMonth() + 1)).slice(-2)) + "-" + (("0" + startDate.getDate()).slice(-2))
          }
          filterarray.push(startDate)
          filterParams.push(filterarray)
        }
      } else {
        filterarray.push(filter["field"])
        filterarray.push(filter["operator"])
        filterarray.push(filter["value"]["selected"])
        if (filter["value"].hasOwnProperty("selected")) {
          filterParams.push(filterarray)
        }
      }
    })
    return filterParams
  }

  async fetchDashboards(isRefreshed) {
    let that = this
    let helper = this.restClient;
    let inputs = this.state.inputs !== undefined ? this.state.inputs : undefined;
    let dashboardStack = this.state.dashboardStack

    let response = await helper.request('v1', '/analytics/dashboard?filter=[{"sort":[{"field":"name","dir":"asc"}],"skip":0,"take":0}]', {}, 'get');

    if (response.data.length > 0) {

      that.setState({ dashList: response.data, uuid: '' })
      if (inputs["dashname"] != undefined) {
        //setting value of the dropdown after fetch
        response.data.map(dash => {

          if (dash.name === inputs["dashname"]["name"]) {
            let dashboardFilter = dash.filter_configuration != "" ? JSON.parse(dash.filter_configuration) : []
            inputs["dashname"] = dash
            !isRefreshed && dashboardStack.push({ data: dash, drilldownDashboardFilter: [] })
            that.setState({ inputs, dashList: response.data, uuid: dash.uuid, filterConfiguration: dashboardFilter, exportConfiguration: dash.export_configuration, dashboardStack: dashboardStack })
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
            let extractedFilterValues = this.extractFilterValues(dashboardFilter);
            let preapredExtractedFilterValue = null
            if (extractedFilterValues && extractedFilterValues.length > 0) {
              preapredExtractedFilterValue = extractedFilterValues[0]
              for (let i = 1; i < extractedFilterValues.length; i++) {
                preapredExtractedFilterValue = this.preparefilter(preapredExtractedFilterValue, extractedFilterValues[i])

              }
            }
            !isRefreshed && dashboardStack.push({ data: dash, drilldownDashboardFilter: preapredExtractedFilterValue })
            that.setState({ dashboardBody: "", inputs, dashList: response.data, uuid: dash.uuid, exportConfiguration: dash.export_configuration, filterConfiguration: dashboardFilter, dashboardStack: dashboardStack, drilldownDashboardFilter: preapredExtractedFilterValue })


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
    var element = document.getElementById("dashboard-editor-div");
    element != undefined && element.classList.remove("hide-dash-editor") //fixes dropdown bug in mozilla firefox cused due to charts
    this.setState({ flipped: true, uuid: this.state.uuid, loadEditor: true })
  }

  createDashboard() {
    var element = document.getElementById("dashboard-editor-div");
    element != undefined &&
      element.classList.remove("hide-dash-editor") //fixes dropdown bug in mozilla firefox cused due to charts
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
    if (this.state.dashboardStack.length == 1) {
      dashboardStack = this.state.dashboardStack
      let dashboardFilter = filter
      let extractedFilterValues = this.extractFilterValues(dashboardFilter);
      let preapredExtractedFilterValue = []
      if (extractedFilterValues && extractedFilterValues.length > 1) {
        preapredExtractedFilterValue = extractedFilterValues[0]
        for (let i = 1; i < extractedFilterValues.length; i++) {
          preapredExtractedFilterValue = this.preparefilter(preapredExtractedFilterValue, extractedFilterValues[i])
        }
      }
      dashboardStack[dashboardStack.length - 1]["drilldownDashboardFilter"] = preapredExtractedFilterValue

    }
    if (dashboardStack != null) {
      this.setState({ dashboardFilter: filter, dashboardStack: dashboardStack })
    } else {
      this.setState({ dashboardFilter: filter })
    }
    this.hideFilter()
  }

  getDashboardFilters() {
    if (this.state.filterConfiguration) {
      try {
        let validJson = JSON.parse(this.state.filterConfiguration)
        return validJson
      }
      catch (e) {
        console.error("Invalid json filter found in the database");
        return []
      }
    }
    else {
      return []
    }
  }

  drilldownToDashboard(e, type) {
    //pushing next dashboard details into dashboard stack
    let dashboardStack = this.state.dashboardStack
    let filterConfiguration = this.filterRef.current
    let dashboardTitle = e.drilldownDashboardTitle ? e.drilldownDashboardTitle : ""
    //adding applied filters on dashboard
    if (dashboardStack.length > 0) {
      dashboardStack[dashboardStack.length - 1]["drilldownDashboardFilter"] = e.dashboardFilter ? e.dashboardFilter : []
      dashboardStack[dashboardStack.length - 1]["filterConfiguration"] = (filterConfiguration && filterConfiguration.state.filters) ? filterConfiguration.state.filters : []
      dashboardStack[dashboardStack.length - 1]["filterOptions"] = (filterConfiguration && filterConfiguration.state.applyFilterOption) ? filterConfiguration.state.applyFilterOption : []
    }

    let value = JSON.parse(e.value)
    if (dashboardStack.length > 1) {
      //check for consequent drilldown to same dashboard
      if (dashboardStack[dashboardStack.length - 1]["data"]["uuid"] != value["uuid"])
        dashboardStack.push({ data: value, drilldownDashboardFilter: e.drilldownDashboardFilter, drilldownDashboardTitle: dashboardTitle })
    } else {
      dashboardStack.push({ data: value, drilldownDashboardFilter: e.drilldownDashboardFilter, drilldownDashboardTitle: dashboardTitle })
    }
    this.setState({ dashboardStack: dashboardStack }, () => { this.changeDashboard(e) })
  }


  changeDashboard(event) {
    //defining change dashboard explicitly to support reset dashboard on handle change
    let inputs = {}
    inputs = { ...this.state.inputs }
    let name
    let value
    var element = document.getElementById("dashboard-editor-div");

    value = JSON.parse(event.value)
    let dashboardFilter = value["filter_configuration"] != "" ? JSON.parse(value["filter_configuration"]) : []
    element != undefined && element.classList.add("hide-dash-editor")
    inputs["dashname"] = value

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
      var element = document.getElementById("dashboard-editor-div");
      name = inputName
      value = JSON.parse(event.value)
      element != undefined && element.classList.add("hide-dash-editor")
      //resetting dashboard filters on load
      let dashboardFilterConf = value["filter_configuration"] != "" ? JSON.parse(value["filter_configuration"]) : []
      this.setState({ dashboardFilter: dashboardFilterConf, exportConfiguration: value.export_configuration })
    } else {
      name = event.target.name
      value = event.target.value
    }
    inputs[name] = value
    let dashboardFilter = value["filter_configuration"] != "" ? JSON.parse(value["filter_configuration"]) : []
    let extractedFilterValues = this.extractFilterValues(dashboardFilter);
    let preapredExtractedFilterValue = null
    if (extractedFilterValues && extractedFilterValues.length > 1) {
      preapredExtractedFilterValue = extractedFilterValues[0]
      for (let i = 1; i < extractedFilterValues.length; i++) {
        preapredExtractedFilterValue = this.preparefilter(preapredExtractedFilterValue, extractedFilterValues[i])

      }
    }

    dashboardStack.push({ data: value, drilldownDashboardFilter: preapredExtractedFilterValue, filterConfiguration: dashboardFilter })

    this.setState({ inputs: inputs, uuid: value["uuid"], filterConfiguration: dashboardFilter, showFilter: false, drilldownDashboardFilter: event.drilldownDashboardFilter, dashboardStack: dashboardStack })
  }

  rollupToDashboard() {
    let stack = this.state.dashboardStack
    //removing the last dashboard from stack
    stack.pop()
    if (stack && stack.length > 0) {
      let dashboard = stack[stack.length - 1]
      let event = {}
      event.value = JSON.stringify(dashboard.data)
      event.drilldownDashboardFilter = dashboard.drilldownDashboardFilter
      this.setState({ dashboardStack: stack }, () => { this.changeDashboard(event) })

    }
  }

  getFilterProperty(property) {
    if (this.state.dashboardStack && this.state.dashboardStack.length > 0) {
      if (this.state.dashboardStack[this.state.dashboardStack.length - 1][property])
        return this.state.dashboardStack[this.state.dashboardStack.length - 1][property]
      else
        return this.state[property]
    }
    return this.state[property]
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
      console.log(response.data.result)
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
    return (
      <div ref={this.myRef} className="dashboard">
        <Notification ref={this.notif} />
        <Flippy
          flipDirection="horizontal" // horizontal or vertical
          isFlipped={this.state.flipped}
          flipOnClick={false}
          style={{ width: '100%', height: '100vh' }} /// these are optional style, it is not necessary
        >
          <FrontSide>
            <div id="filter-form-container" className="disappear">
              {Array.isArray(this.state.filterConfiguration) && this.state.filterConfiguration.length &&
                <DashboardFilter
                  ref={this.filterRef}
                  core={this.core}
                  filterMode="APPLY"
                  hideFilterDiv={() => this.hideFilter()}
                  filterConfiguration={this.getFilterProperty("filterConfiguration")}
                  applyFilterOption={this.getFilterProperty("filterOptions")}
                  setDashboardFilter={(filter) => this.applyDashboardFilter(filter)}
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
                          (Array.isArray(this.state.filterConfiguration) && this.state.filterConfiguration.length > 0) &&
                          <Button onClick={() => this.showFilter()} title="Filter OI">
                            <i className="fa fa-filter" aria-hidden="true"></i>
                          </Button>
                        }
                        <ReactToPrint
                          trigger={() => {
                            return <Button title="Print OI">
                              <i className="fa fa-print" aria-hidden="true"></i>
                            </Button>
                          }}
                          content={() => this.dashboardViewerRef}
                        />
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
                    />
                  }

                </div>
              </div>
              :
              <div className="dashboard-viewer-div" style={{ textAlign: "center", fontWeight: "bolder", fontSize: "20px" }}>
                {this.state.dashboardBody}
              </div>
            }
          </FrontSide>
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

                      }
                      else if (status === "") {
                        var element = document.getElementById("dashboard-editor-div");
                        element.classList.add("hide-dash-editor");
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

