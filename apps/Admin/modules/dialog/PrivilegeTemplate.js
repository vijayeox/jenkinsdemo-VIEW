import React from "react";
import { Window } from "@progress/kendo-react-dialogs";
import { PushData } from "../components/apiCalls";
import { SaveCancel } from "../components/index";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Input } from "@progress/kendo-react-inputs";
import { Ripple } from "@progress/kendo-react-ripple";
import { orderBy } from "@progress/kendo-data-query";

export default class PrivilegeTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      roleInEdit: this.props.dataItem || null,
      masterList: [],
      privilegeData: [],
      sort: []
    };
    this.getPrivilegeData().then(response => {
      this.setState({
        masterList: response.data
      });
      let temp = [];
      for (let i = 0; i < response.data.length; i++) {
        temp[response.data[i].privilege_name] = response.data[i].permission;
      }
      this.setState({
        privilegeData: temp
      });
    });
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
  }

  async getPrivilegeData() {
    let helper2 = this.core.make("oxzion/restClient");
    let privilegedata = await helper2.request(
      "v1",
      "/role/" + this.props.dataItem.id + "/privilege",
      // "/privilege",
      {},
      "get"
    );
    return privilegedata;
  }

  onChangeCheckbox(e) {
    var value = e.target.props;

    console.log(value);
    let privilegeData = { ...this.state.privilegeData };
    if (value.checked == "true") {
      var privilege = 1;
      privilegeData[value.id] = "15";
    } else {
      var privilege = 1;
      switch (value.refs) {
        case "read":
          console.log("its read");
          break;
        case "write":
          console.log("its write");
          break;
        case "create":
          console.log("its create");
          break;
        case "delete":
          console.log("its delete");
          break;
        default:
          console.log("sorry");
      }
      privilegeData[value.id] = "1";
    }
    this.setState({ privilegeData: privilegeData });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    this.props.cancel();
  };

  render() {
    console.log(this.state.privilegeData);
    return (
      <Window onClose={this.props.cancel}>
        <Ripple>
          <div
            className="col-10 justify-content-center"
            style={{ display: "contents" }}
          >
            <div className="privilegeGrid">
              <Grid
                data={orderBy(this.state.masterList, this.state.sort)}
                resizable={true}
                reorderable={true}
                sortable
                sort={this.state.sort}
                onSortChange={e => {
                  this.setState({
                    sort: e.sort
                  });
                }}
                scrollable={"scrollable"}
              >
                <GridColumn title="App Name" field="name" />
                <GridColumn
                  title="Privilege Name"
                  cell={props => (
                    <td>
                      <label>{props.dataItem.privilege_name.slice(7)}</label>
                    </td>
                  )}
                />
                <GridColumn title="Permission" field="permission" />
                <GridColumn
                  title="Read"
                  width="80px"
                  cell={props =>
                    props.dataItem.permission & 1 ? (
                      <td>
                        <div className="privelegeGridcellFix">
                          <Input
                            type="checkbox"
                            refs="read"
                            someData="Its Read"
                            id={props.dataItem.privilege_name}
                            className="k-checkbox"
                            onChange={this.onChangeCheckbox}
                            checked={
                              this.state.privilegeData[
                                props.dataItem.privilege_name
                              ] & 1
                                ? true
                                : false
                            }
                          />
                          <label
                            className="k-checkbox-label"
                            htmlFor={props.dataItem.privilege_name}
                          />
                        </div>
                      </td>
                    ) : (
                      <td />
                    )
                  }
                />
                <GridColumn
                  title="Write"
                  width="80px"
                  cell={props =>
                    props.dataItem.permission & 2 ? (
                      <td>
                        <div className="privelegeGridcellFix">
                          <Input
                            type="checkbox"
                            refs="write"
                            id={props.dataItem.privilege_name}
                            className="k-checkbox"
                            onChange={this.onChangeCheckbox}
                            checked={
                              this.state.privilegeData[
                                props.dataItem.privilege_name
                              ] & 2
                                ? true
                                : false
                            }
                          />
                          <label
                            className="k-checkbox-label"
                            htmlFor={props.dataItem.privilege_name}
                          />
                        </div>
                      </td>
                    ) : (
                      <td />
                    )
                  }
                />
                <GridColumn
                  title="Create"
                  width="80px"
                  cell={props =>
                    props.dataItem.permission & 4 ? (
                      <td>
                        <div className="privelegeGridcellFix">
                          <Input
                            type="checkbox"
                            refs="create"
                            id={props.dataItem.privilege_name}
                            className="k-checkbox"
                            onChange={this.onChangeCheckbox}
                            checked={
                              this.state.privilegeData[
                                props.dataItem.privilege_name
                              ] & 4
                                ? true
                                : false
                            }
                          />
                          <label
                            className="k-checkbox-label"
                            htmlFor={props.dataItem.privilege_name}
                          />
                        </div>
                      </td>
                    ) : (
                      <td />
                    )
                  }
                />
                <GridColumn
                  title="Delete"
                  width="80px"
                  cell={props =>
                    props.dataItem.permission & 8 ? (
                      <td>
                        <div className="privelegeGridcellFix">
                          <Input
                            type="checkbox"
                            refs="delete"
                            id={props.dataItem.privilege_name}
                            className="k-checkbox"
                            onChange={this.onChangeCheckbox}
                            checked={
                              this.state.privilegeData[
                                props.dataItem.privilege_name
                              ] & 8
                                ? true
                                : false
                            }
                          />
                          <label
                            className="k-checkbox-label"
                            htmlFor={props.dataItem.privilege_name}
                          />
                        </div>
                      </td>
                    ) : (
                      <td />
                    )
                  }
                />
              </Grid>
            </div>
            <div style={{ margin: "75px" }} />
          </div>
          <SaveCancel save="roleForm" cancel={this.props.cancel} />
        </Ripple>
      </Window>
    );
  }
}
