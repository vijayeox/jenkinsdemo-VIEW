import React from 'react';
import $ from 'jquery';
import { name as applicationName } from './metadata.json';
// import DataSource from './dataSource';
import { Query, DataSource } from './GUIComponents'
// import Query from './query';
import Visualization from './visualization';
import Dashboard from './dashboard';
import DashboardEditor from './dashboardEditor';
import { slide as Menu } from 'react-burger-menu';

const SECTION_DATA_SOURCE = 'DS'; //DataSource
const SECTION_QUERY = 'QR'; //QueRy
const SECTION_VISUALIZATION = 'VZ'; //VisualiZation
const SECTION_DASHBOARD = 'DB'; //DashBoard
const SECTION_EDIT_DASHBOARD = 'EDB'; //Edit DashBoard

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      isMenuOpen: false,
      displaySection: SECTION_DASHBOARD,
      sectionData: null,
      title: ''
    };
  }

  switchSection = (section, data) => {
    this.hideMenu();
    this.setState({
      displaySection: section,
      sectionData: data
    });
  }

  editDashboard = (data) => {
    this.switchSection(SECTION_EDIT_DASHBOARD, data);
  }

  hideMenu = () => {
    this.setState({ isMenuOpen: false });
  };

  showMenu = () => {
    this.setState({ isMenuOpen: true });
  };

  handleMenuStateChange = (state) => {
    this.setState({ isMenuOpen: state.isOpen });
    this.showHideMenuElement(state.isOpen);
  }

  //Hack to prevent menu element from showing up when it slides off to left.
  showHideMenuElement = (isOpen) => {
    var menuElement = $('.page-body .bm-menu-wrap');
    if (isOpen) {
      menuElement.show();
    }
    else {
      menuElement.hide();
    }
  }

  setTitle = (title) => {
    this.setState({ title: title });
  }

  componentDidMount() {
    this.showHideMenuElement(false);
  }

  render() {
    let sectionContent;
    switch (this.state.displaySection) {
      case SECTION_DATA_SOURCE:
        sectionContent = <DataSource args={this.core} setTitle={this.setTitle} />;
        break;
      case SECTION_QUERY:
        sectionContent = <Query args={this.core} setTitle={this.setTitle} />;
        break;
      case SECTION_VISUALIZATION:
        sectionContent = <Visualization args={this.core} setTitle={this.setTitle} />;
        break;
      case SECTION_DASHBOARD:
        sectionContent = <Dashboard args={this.core} setTitle={this.setTitle} editDashboard={this.editDashboard} />;
        break;
    }

    return (
      
      <div id="page-body" className="page-body full-width">
        <Menu isOpen={this.state.isMenuOpen} onStateChange={this.handleMenuStateChange}
          disableAutoFocus width="20%"
          outerContainerId="page-body" pageWrapId="page-content">
          <a className="menu-item" onClick={(e) => { this.switchSection(SECTION_DATA_SOURCE, null) }}>
            <i class="fa fa-database" aria-hidden="true"></i> Data Source
                </a>
          <a className="menu-item" onClick={(e) => { this.switchSection(SECTION_QUERY, null) }}>
            <i class="fa fa-search" aria-hidden="true"></i> Query
                </a>
          <a className="menu-item" onClick={(e) => { this.switchSection(SECTION_VISUALIZATION, null) }}>
            <i class="fa fa-eye" aria-hidden="true"></i> Visualization
                </a>
          <a className="menu-item" onClick={(e) => { this.switchSection(SECTION_DASHBOARD, null) }}>
            <i class="fa fa-tasks" aria-hidden="true"></i> Dashboard
                  </a>
        </Menu>
        <div className="page-title full-width">{this.state.title}</div>
        <div className="page-content full-width" id="page-content">
          {sectionContent}
        </div>
      </div>
    );
  }
}

export default Body;

