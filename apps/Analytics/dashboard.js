import React from 'react';
import ReactDOM from 'react-dom';
import { dashboard as section } from './metadata.json';
import osjs from 'osjs';
import Swal from "sweetalert2";
import { OX_Grid, Notification } from './GUIComponents'
import { Button } from 'react-bootstrap'
import Switch from 'react-switch'
import '../../gui/src/public/css/sweetalert.css';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import DashboardEditorModal from '../../gui/src/components/Modals/DashboardEditorModal'
import DashboardEditor from "./dashboardEditor"

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.props.setTitle(section.title.en_EN);
    this.state = {
      showModal: false,
      modalType: "",
      modalContent: {},
      checked: {},
      flipped: false,
      uuid: ""
    };
    this.refresh = React.createRef();
    this.notif = React.createRef();
    this.restClient = osjs.make('oxzion/restClient');
    this.loader = null;
    this.checkedList = {}
  }
  componentWillMount() {
    //set switch respect to activated and deactivated dashboard
    this.setState({ checked: this.checkedList })
  }

  dataSourceOperation = (e, operation) => {
    if (operation === "Delete" || operation === "Activate") {
      this.setState({ showModal: true, modalContent: e, modalType: operation })
    }
    else {
      this.setState({ showModal: true, modalContent: e, modalType: operation, uuid: e.uuid })
    }
  }

  buttonAction(action, item) {
    if (action.name !== undefined) {
      if (action.name === "toggleActivate" && item.isdeleted == "0")
        this.dataSourceOperation(item, "Delete")
      else if (action.name === "toggleActivate" && item.isdeleted == "1")
        this.dataSourceOperation(item, "Activate")
      else if (action.name === "Create") {
        this.setState({ flipped: true, uuid: "" })
      }
      else if (action.name === "Edit") {
        const dashUuid = item.uuid
        this.setState({ uuid: dashUuid, flipped: true })
      }
      else
        this.dataSourceOperation(item, action.name)
    }
  }

  renderButtons(e, action) {
    var actionButtons = [];
    var that = this;
    Object.keys(action).map(function (key, index) {
      var string = this.replaceParams(action[key].rule, e);
      var showButton = eval(string);
      var variant = "primary"
      if (action[key].name === "Activate") {
        variant = "success"
      }
      else if (action[key].name === "Delete") {
        variant = "danger"
      }
      else if (action[key].name === "toggleActivate") {
        this.checkedList[e.name] = showButton //check if the datasource is deleted or not
        showButton = true   //always show the button
      }
      else {
        variant = "primary"
      }
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
      showButton
        ?
        action[key].name === "toggleActivate" ?
          actionButtons.push(
            <abbr title={this.checkedList[e.name] ? "Deactivate" : "Activate"} key={index}>
              <Switch
                id={e.name}
                onChange={() => this.buttonAction(action[key], e)}
                checked={this.state.checked[e.name]}
                onClick={() => this.buttonAction(action[key], e)}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={10}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={33}
                className="react-switch"
              />
            </abbr>
          )
          :
          actionButtons.push(
            <abbr title={action[key].name} key={index}>
              <Button
                primary={true}

                className=" btn manage-btn k-grid-edit-command"
                variant={variant}
                // onClick={() => this.props.editDashboard(e.uuid)}
                onClick={() => that.buttonAction(action[key], e)}
                style={buttonStyles}
              >
                {action[key].icon ? (
                  <i className={action[key].icon + " manageIcons"}></i>
                ) : (
                    action[key].name
                  )}
              </Button>
            </abbr>
          )
        : actionButtons.push(<Button style={{ visibility: "hidden" }}><i className="fa fa-user"></i></Button>)
    }, this);
    return actionButtons;
  }

  replaceParams(route, params) {
    if (!params) {
      return route;
    }
    var regex = /\{\{.*?\}\}/g;
    let m;
    while ((m = regex.exec(route)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        route = route.replace(match, params[match.replace(/\{\{|\}\}/g, "")]);
      });
    }
    return route;
  }
  //functions for OX_Grid
  renderEmpty() {
    return [<React.Fragment key={1} />];
  }
  renderListOperations = config => {
    return (
      <Button
        style={{ right: "10px", float: "right" }}
        primary={true}
        onClick={() => this.buttonAction({ name: config.name })}
      >
        <i class="fa fa-plus" aria-hidden="true"></i> {config.name}
      </Button>
    );
  };
  setTitle(title) {

  }
  render() {
    return (
      <div className="dashboard">
        <Notification ref={this.notif} />
        <Flippy
          flipDirection="horizontal" // horizontal or vertical
          isFlipped={this.state.flipped}
          flipOnClick={false}
          style={{ width: '100%', height: '100vh' }} /// these are optional style, it is not necessary
        >
          <FrontSide>
            <OX_Grid
              ref={this.refresh}
              osjsCore={this.core}
              data={"analytics/dashboard?show_deleted=true"}
              filterable={true}
              reorderable={true}
              sortable={true}
              pageable={true}
              columnConfig={[
                {
                  title: "Name", field: "name"
                },
                {
                  title: "Actions",
                  cell: e =>
                    this.renderButtons(e, [
                      {
                        name: "Edit", rule: "{{isdeleted}}==0", icon: "fa fa-edit"
                      },
                      {
                        name: "toggleActivate", rule: "{{isdeleted}}==0", icon: "fa fa-user"
                      }
                    ]),
                  filterCell: e => this.renderEmpty()
                }
              ]}
              gridToolbar={
                this.renderListOperations({
                  name: "Create",
                  rule: "true"
                })
              }
            />
          </FrontSide>
          <BackSide>
            <DashboardEditor
              args={this.core}
              setTitle={this.setTitle}
              dashboardId={this.state.uuid}
              flipCard={(status) => {
                if (status === "Saved") {
                  //refreshing the ox_grid when saved
                  this.refresh.current.child.current.refresh()
                }
                this.setState({ flipped: false })
              }}
            />
          </BackSide>
        </Flippy>
        <DashboardEditorModal
          osjsCore={this.core}
          modalType={this.state.modalType}
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          content={this.state.modalContent}
          handleChange={(e) => this.handleChange(e)}
          notification={this.notif}
          refreshGrid={this.refresh}
        />
      </div>
    );
  }
}

export default Dashboard;

