import React from 'react';
import { dataSource as section } from '../metadata.json';
import { Button } from 'react-bootstrap'
import OX_Grid from "./OX_Grid"
import Notification from "./Notification"
import DataSourceModal from './components/Modals/DataSourceModal'

class DataSource extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      showModal: false,
      modalType: "",
      modalContent: {}
    };
    this.notif = React.createRef();
    this.props.setTitle(section.title.en_EN);
  }

  dataSourceOperation = (e, operation) => {
    this.setState({ showModal: true, modalContent: e, modalType: operation })
  }

  //functions for OX_Grid
  renderEmpty() {
    return [<React.Fragment key={1} />];
  }

   renderButtons(e, action) {
     
    var actionButtons = [];
    Object.keys(action).map(function (key, index) {
      var string = this.replaceParams(action[key].rule, e);
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
      showButton
        ? actionButtons.push(
          <abbr title={action[key].name} key={index}>
            <Button
              primary={true}
              className=" btn manage-btn k-grid-edit-command"
              onClick={() => this.buttonAction(action[key], e)}
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
        : null;
    }, this);
    return actionButtons;
  }

  renderListOperations = config => {
    return (
      <Button
        style={{ right: "10px", float: "right" }}
        primary={true}
        onClick={() => this.buttonAction({name:config.name})}
      >
       <i class="fa fa-plus" aria-hidden="true"></i> {config.name}
      </Button>
    );
  };


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

  //calling relevant function with respective to action name
  buttonAction(action, item) {
    if (action.name !== undefined)
      this.dataSourceOperation(item, action.name)
  }

  render() {
    return (
      <div className="data-source">
        <Notification ref={this.notif} />
        <OX_Grid
          osjsCore={this.core}
          data={"analytics/datasource"}
          filterable={true}
          reorderable={true}
          sortable={true}
          pageable={true}
          columnConfig={[
            {
              title: "Name",field: "name"
            },
            {
              title: "Actions",
              cell: e =>
                this.renderButtons(e, [
                  {
                    name: "Edit",rule: "true",icon: "fa fa-edit"
                  },
                  {
                    name: "Delete",rule: "true",icon: "fa fa-trash"
                  }
                ]),
              filterCell: e => this.renderEmpty()
            }
          ]}
          // gridToolbar={
          //   this.renderListOperations({
          //     name: "Create",
          //     rule: "true"
          //   })
          // }
        />
        <DataSourceModal
          osjsCore={this.core}
          modalType={this.state.modalType}
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          content={this.state.modalContent}
          handleChange={(e) => this.handleChange(e)}
          notification={this.notif}
        />
      </div>
    );
  }

}

export default DataSource;

