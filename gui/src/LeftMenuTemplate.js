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
import Page from "./components/App/Page";
// Be sure to include styles at some point, probably during your bootstraping
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

class LeftMenuTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
    this.state = {
      menus: [],
      selected: "",
      expanded: false
    };

    this.getMenulist().then(response => {
      this.setState({
        menus: response["data"]
      });
    });

    this.onSelect = this.onSelect.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }
  // REMOVE THE HARD CODED APP ID
  async getMenulist() {
    let helper = this.core.make("oxzion/restClient");
    let menulist = await helper.request(
      "v1",
      "/app/" + this.appId + "/menu",
      {},
      "get"
    );
    return menulist;
  }
  onToggle(expanded) {
    this.setState({ expanded: expanded });
  }
  onSelect(selected) {
    this.setState({ selected: selected, expanded: false });
  }

  render() {
    const { expanded, selected } = this.state;
    let selection;
    if (this.state.selected.page_id) {
      selection = (
        <Page
          pageId={this.state.selected.page_id}
          updatePage={this.onSelect}
          config={this.props.config}
          app={this.props.appId}
          core={this.core}
        />
      );
    }
    return (
      <div
        style={{
          height: "100%",
          overflow: "auto"
        }}
      >
        <div
          style={{
            marginLeft: expanded ? 240 : 64,
            padding: "15px 20px 0 20px"
          }}
        >
          {selection}
        </div>
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
                    <i
                      className={menuitem.icon}
                      name={menuitem.name}
                      style={{ fontSize: "1.5em", verticalAlign: "middle" }}
                    />
                  </NavIcon>
                  <NavText style={{ paddingRight: 32 }} name={menuitem.name}>
                    {menuitem.name}
                  </NavText>
                </NavItem>
              );
            })}
          </SideNav.Nav>
        </SideNav>
      </div>
    );
  }
}
export default LeftMenuTemplate;
