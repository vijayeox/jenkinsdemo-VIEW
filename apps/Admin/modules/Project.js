import { React, Notification, MultiSelect, OX_Grid, ReactDOM } from "oxziongui";
import { DeleteEntry } from "./components/apiCalls";
import { TitleBar } from "./components/titlebar";
import DialogContainer from "./dialog/DialogContainerPrj";
import config from "./moduleConfig";

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.loader = this.core.make("oxzion/splash");
    this.adminWindow = document.getElementsByClassName("Window_Admin")[0];
    this.moduleConfig = config[this.props.name];
    this.listConfig = this.moduleConfig.listConfig;
    this.state = {
      itemInEdit: undefined,
      visible: false,
      permission: {
        canAdd: this.props.userProfile.privileges[
          this.moduleConfig.permission.canAdd
        ],
        canEdit: this.props.userProfile.privileges[
          this.moduleConfig.permission.canEdit
        ],
        canDelete: this.props.userProfile.privileges[
          this.moduleConfig.permission.canDelete
        ],
      },
      selectedOrg: this.props.userProfile.orgid,
    };

    this.notif = React.createRef();
    this.OX_Grid = React.createRef();
    this.toggleDialog = this.toggleDialog.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  async pushProjectUsers(dataItem, dataObject) {
    let helper = this.core.make("oxzion/restClient");
    let addProjectUsers = await helper.request(
      "v1",
      "organization/" +
        this.state.selectedOrg +
        "/project/" +
        dataItem +
        "/save",
      {
        userid: dataObject,
      },
      "post"
    );
    return addProjectUsers;
  }

  addUsersToEntity = (dataItem) => {
    this.setState({
      visible: !this.state.visible,
    });
    this.addUsersTemplate = React.createElement(MultiSelect, {
      args: this.core,
      config: {
        dataItem: dataItem,
        title: "Project",
        mainList: "organization/" + this.state.selectedOrg + "/users/list",
        subList: "organization/" + this.state.selectedOrg + "/project",
        members: "Users",
      },
      manage: {
        postSelected: this.sendTheData,
        closeDialog: this.toggleDialog,
      },
    });
  };

  sendTheData = (selectedUsers, item) => {
    var temp1 = selectedUsers;
    var temp2 = [];
    for (var i = 0; i <= temp1.length - 1; i++) {
      var uid = { uuid: temp1[i].uuid };
      temp2.push(uid);
    }
    this.pushProjectUsers(item, temp2).then((response) => {
      this.child.current.refreshHandler(response);
    });
    this.toggleDialog();
  };

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  orgChange = (event) => {
    this.setState({ selectedOrg: event.target.value });
  };

  edit = (dataItem, required) => {
    dataItem = this.cloneItem(dataItem);
    this.setState({
      itemInEdit: dataItem,
    });
    this.inputTemplate = React.createElement(this.moduleConfig.dialogWindow, {
      args: this.core,
      dataItem: dataItem,
      selectedOrg: this.state.selectedOrg,
      cancel: this.cancel,
      formAction: "put",
      action: this.OX_Grid.current.refreshHandler,
      userPreferences: this.props.userProfile.preferences,
      diableField: required.diableField,
    });
  };

  cloneItem(dataItem) {
    return Object.assign({}, dataItem);
  }

  remove = (dataItem) => {
    DeleteEntry(
      "organization/" + this.state.selectedOrg + "/project",
      dataItem.uuid
    ).then((response) => {
      this.child.current.refreshHandler(response);
    });
  };

  cancel = () => {
    this.setState({ itemInEdit: undefined });
  };

  insert = () => {
    this.setState({ itemInEdit: {} });
    this.inputTemplate = React.createElement(this.moduleConfig.dialogWindow, {
      args: this.core,
      dataItem: [],
      selectedOrg: this.state.selectedOrg,
      cancel: this.cancel,
      formAction: "post",
      action: this.OX_Grid.current.refreshHandler,
      userPreferences: this.props.userProfile.preferences,
    });
  };

  prepareColumnData() {
    var columnInfo = [];
    columnInfo = JSON.parse(JSON.stringify(this.listConfig.columnConfig));
    columnInfo.push({
      title: "Actions",
      cell: (e) => this.renderButtons(e, this.listConfig.actions),
      filterCell: {
        type: "empty",
      },
    });
    return columnInfo;
  }

  renderButtons(e, action) {
    var actionButtons = [];
    var that = this;
    Object.keys(action).map(function (key, index) {
      actionButtons.push(
        <abbr title={action[key].title} key={index}>
          <button
            type="button"
            className="btn manage-btn"
            onClick={() => {
              switch (action[key].type) {
                case "edit":
                  that.edit(e, false);
                  break;
                case "assignEntity":
                  that.addUsersToEntity(e);
                  break;
                case "delete":
                  that.remove(e);
                  break;
              }
            }}
          >
            <i className={action[key].icon + " manageIcons"}></i>
          </button>
        </abbr>
      );
    });
    return actionButtons;
  }

  createAddButton() {
    if (this.state.permission.canAdd && this.listConfig.addButton) {
      return (
        <button
          key={2}
          onClick={this.insert}
          className="k-button"
          style={{
            position: "absolute",
            top: "7px",
            right: "10px",
            fontSize: "14px",
            padding: "5px 8px",
          }}
        >
          <i className="fa fa-plus-circle" style={{ fontSize: "20px" }}></i>
          <p style={{ margin: "0px", paddingLeft: "10px" }}>
            {this.listConfig.addButton.title}
          </p>
        </button>
      );
    }
  }

  renderRow(e) {
    return (
      <OX_Grid
        osjsCore={this.core}
        data={"projects"}
        gridToolbar={<h5>{e.name + "-subprojects"}</h5>}
        columnConfig={[
          {
            title: "Name",
            field: "name",
          },
          {
            title: "Description",
            field: "description",
          },
        ]}
      />
    );
  }

  render() {
    return (
      <div style={{ height: "inherit" }}>
        {this.state.visible && this.addUsersTemplate}
        <Notification ref={this.notif} />
        <TitleBar
          title="Manage Projects"
          menu={this.props.menu}
          args={this.core}
          orgChange={this.orgChange}
          orgSwitch={
            this.props.userProfile.privileges.MANAGE_ORGANIZATION_WRITE
              ? true
              : false
          }
        />
        <OX_Grid
          osjsCore={this.core}
          ref={this.OX_Grid}
          rowTemplate={(e) => this.renderRow(e)}
          data={
            "organization/" +
            this.state.selectedOrg +
            "/" +
            this.listConfig.route
          }
          wrapStyle={{
            height: "calc(100% - 72px)",
            margin: "15px",
            position: "relative",
            top: "5px",
          }}
          onRowClick={(e) => this.edit(e.dataItem, false)}
          filterable={true}
          gridDefaultFilters={JSON.parse(this.listConfig.defaultFilters)}
          reorderable={true}
          resizable={true}
          sortable={true}
          groupable={true}
          pageable={{ buttonCount: 3, pageSizes: [10, 20, 30], info: true }}
          columnConfig={this.prepareColumnData()}
          gridToolbar={[
            this.listConfig.toolbarTemplate,
            this.createAddButton(),
          ]}
        />
        {this.state.visible && this.addProjectUsers}
        {this.state.itemInEdit && this.inputTemplate}
      </div>
    );
  }
}

export default Project;
