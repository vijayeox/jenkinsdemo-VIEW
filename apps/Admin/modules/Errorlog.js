import React from "react";
import { TitleBar } from "./components/titlebar";
import {GridTemplate} from "../GUIComponents";
import { DeleteEntry } from "./components/apiCalls";
import DialogContainer from "./dialog/DialogContainerUser";

class Errorlog extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      permission:{
        canAdd: this.props.userProfile.privileges.MANAGE_ORGANIZATION_CREATE,
        canEdit: this.props.userProfile.privileges.MANAGE_ORGANIZATION_WRITE,
        canDelete: this.props.userProfile.privileges.MANAGE_ORGANIZATION_DELETE
      }
    };
    this.child = React.createRef();
  }


  edit = async(dataItem, required) => {
    let helper = this.core.make("oxzion/restClient");
    let response = await helper.request("v1", "errorlog/" + dataItem.id + "/retry", {}, "post");
    return response;
  };

  cancel = () => {
    
  };

  render() {
    return (
      <div style={{ height: "inherit" }}>
        <TitleBar
          title="Manage Errors"
          menu={this.props.menu}
          args={this.core}
        />
        <GridTemplate
          args={this.core}
          ref={this.child}
          config={{
            showToolBar: true,
            title: "Error Logs",
            api: "errorlog",
            column: [
              {
                title: "ID",
                field: "id"
              },
              {
                title: "Type",
                field: "error_type"
              },
              {
                title: "Date Created",
                field: "date_created"
              }
            ]
          }}
          manageGrid={{
            edit: this.edit
          }}
          permission={this.state.permission}
        />
      </div>
    );
  }
}

export default Errorlog;
