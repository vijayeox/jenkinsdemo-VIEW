import React from "react";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { Button, ButtonGroup } from '@trendmicro/react-buttons';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';
import Inbox from './inbox';
import Page from './page';
import Outbox from './outbox';
import Activity from './activity';
import Dashboard from './dashboard';
import PendingPositions from './pendingposts';
import NewPosition from './position';
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class LeftMenuTemplate extends React.Component {
  constructor(props) {
      super(props);
      this.core = this.props.args;
      this.appId = this.props.appId;
      console.log(this.appId);
      console.log(this.core);
      this.state = {
        menus: [],
        selected: '',
        expanded: false
      }

    this.getMenulist().then(response => {
        this.setState({
            menus : response["data"]
        })
      })

      this.onSelect=this.onSelect.bind(this);
      this.onToggle=this.onToggle.bind(this);
      this.navigate=this.navigate.bind(this);
  }
// REMOVE THE HARD CODED APP ID
  async getMenulist() {
    let helper = this.core.make('oxzion/restClient');
    let menulist = await helper.request('v1','/app/'+this.appId+'/menu', {}, 'get' );
    return menulist;
};
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
    let selection;
    console.log(this.state.selected);
    console.log(this.state.selected.name);
    if (this.state.selected.page_id) {
        selection = <Page pageId={this.state.selected.page_id} config={this.props.config} app={this.props.appId} core={this.props.args}/>
    }

    if(this.state.selected === 'Inbox'){
        selection = <Inbox args={this.state.selected} config={this.props.config} core={this.props.args}/>
    }
    else if(this.state.selected === 'Outbox'){
       selection = <Outbox args={this.state.selected} config={this.props.config} core={this.props.args}/>
    }
    else if(this.state.selected === 'Dashboard'){
        selection = <Dashboard args={this.state.selected} config={this.props.config} core={this.props.args}/>
     }
     else if(this.state.selected === 'New Position'){
        selection = <NewPosition args={this.state.selected} config={this.props.config} core={this.props.args}/>
     }
     else if(this.state.selected === 'Pending Positions'){
        selection = <PendingPositions args={this.state.selected} config={this.props.config} core={this.props.args}/>
     }
   
      return (
          <div
               style={{
                    height: '100%',
                    overflow: 'auto'
               }}>
              <div
                  style={{
                      marginLeft: expanded ? 240 : 64,
                      padding: '15px 20px 0 20px'
                  }}
              >   
           {selection}
              </div>
              <SideNav onSelect={this.onSelect} onToggle={this.onToggle}>
                  <SideNav.Toggle />
                  <SideNav.Nav selected={selected}>
                  { this.state.menus.map((menuitem, index) => {
                   return  <NavItem eventKey={menuitem} key={index}>
                          <NavIcon>
                              <i className={menuitem.icon} name={menuitem.name} style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                          </NavIcon>
                          <NavText style={{ paddingRight: 32 }} name={menuitem.name}>
                          {menuitem.name}
                          </NavText>
                    </NavItem>
                  })}
                  </SideNav.Nav>
              </SideNav>
          </div>
    );
  }}
   export default LeftMenuTemplate;