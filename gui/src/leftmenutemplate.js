import React from "react";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { Button, ButtonGroup } from '@trendmicro/react-buttons';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class LeftMenuTemplate extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        selected: 'insurance',
        expanded: false
      }
  }
  
  onToggle(expanded){
    this.setState({ expanded: expanded });
}
  onSelect(selected){
    this.setState({ selected: selected });
}
  navigate(pathname) {
    this.setState({ selected: pathname });
  }

  render() {
    const { expanded ,selected} = this.state;
      return (
          <div>
              <div
                  style={{
                      marginLeft: expanded ? 240 : 64,
                      padding: '15px 20px 0 20px'
                  }}
              >                  
              </div>
              <SideNav onSelect={this.onSelect} onToggle={this.onToggle}>
                  <SideNav.Toggle />
                  <SideNav.Nav selected={selected}>
                    <NavItem eventKey="inbox">
                          <NavIcon>
                              <i className="fa fa-fw fa-download" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                          </NavIcon>
                          <NavText style={{ paddingRight: 32 }} title="Inbox">
                          Inbox
                          </NavText>
                    </NavItem>
                    <NavItem eventKey="outbox">
                          <NavIcon>
                              <i className="fa fa-fw fa-upload" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                          </NavIcon>
                          <NavText style={{ paddingRight: 32 }} title="Outbox">
                          Outbox
                          </NavText>
                    </NavItem>
                    <NavItem eventKey="insurance">
                          <NavIcon>
                              <i className="fa fa-fw fa-cogs" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                          </NavIcon>
                          <NavText style={{ paddingRight: 32 }} title="Insurance Policy">
                          Insurance Policy
                          </NavText>
                    </NavItem>
                  </SideNav.Nav>
              </SideNav>
          </div>
    );
  }}
   export default LeftMenuTemplate;