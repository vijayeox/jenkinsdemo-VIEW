import React from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import { Button, ButtonGroup } from "@trendmicro/react-buttons";
import Dropdown, { MenuItem } from "@trendmicro/react-dropdown";
// Be sure to include styles at some point, probably during your bootstraping
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import Navigation from "./Navigation";
import "./public/css/LeftMenuTemplate.scss";

class LeftMenuTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.params = this.props.params;
    this.config = this.props.config;
    this.state = {
      menus: [],
      selected: "",
      expanded: false
    };
    this.onSelect = this.onSelect.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(expanded) {
    this.setState({ expanded: expanded });
  }

  onSelect(selected) {
    this.setState({ selected: selected, expanded: false });
  }
  menuLoad(menus) {
    this.setState({
      menus: menus
    });
  }
  selectLoad(selected) {
    this.setState({
      selected: selected
    });
  }

  render() {
    const { expanded, selected } = this.state;
    return (
      <div className="LeftMenuTemplate">
        <SideNav
          onSelect={this.onSelect}
          onToggle={this.onToggle}
          expanded={this.state.expanded}
        >
          <SideNav.Toggle />
          <SideNav.Nav selected={selected}>
            {this.state.menus.map((menuitem, index) => {
              return (
                <NavItem eventKey={menuitem} key={index}>
                  <NavIcon>
                    <abbr title={menuitem.name} style={{ cursor: "pointer" }}>
                      <i
                        className={menuitem.icon}
                        name={menuitem.name}
                        style={{ fontSize: "1.5em", verticalAlign: "middle" }}
                      />
                    </abbr>
                  </NavIcon>
                  <NavText style={{ paddingRight: 32 }} name={menuitem.name}>
                    {menuitem.name}
                  </NavText>
                </NavItem>
              );
            })}
          </SideNav.Nav>
        </SideNav>
        <Navigation
          core={this.core}
          params={this.params}
          config={this.config}
          menuLoad={this.menuLoad.bind(this)}
          selectLoad={this.selectLoad.bind(this)}
          onSelect={this.onSelect}
          appId={this.appId}
          selected={this.state.selected}
        />
      </div>
    );
  }
}
export default LeftMenuTemplate;
