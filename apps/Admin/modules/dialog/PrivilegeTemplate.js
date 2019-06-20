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
      privilegeData1: [],
      temp: ["1", "2", "4"],
      sort: []
    };
    this.getPrivilegeData().then(response => {
      var ar = response.data;
      // ar.length = 30;
      this.setState({ privilegeData1: ar });
      //   for (var i = 0; i <= response.data.length - 1; i++) {
      //     if (response.data[i].permission_allowed == 1) {
      //       let privilegeData = { ...this.state.privilegeData };
      //       privilegeData[response.data[i].app_id] = ["1"];
      //       this.setState({ privilegeData: privilegeData });
      //     } else if (response.data[i].permission_allowed == 3) {
      //       let privilegeData = { ...this.state.privilegeData };
      //       privilegeData[response.data[i].app_id] = ["1", "2"];
      //       this.setState({ privilegeData: privilegeData });
      //     } else if (response.data[i].permission_allowed == 7) {
      //       let privilegeData = { ...this.state.privilegeData };
      //       privilegeData[response.data[i].app_id] = ["1", "2", "4"];
      //       this.setState({ privilegeData: privilegeData });
      //     } else if (response.data[i].permission_allowed == 15) {
      //       let privilegeData = { ...this.state.privilegeData };
      //       privilegeData[response.data[i].app_id] = ["1", "2", "4", "8"];
      //       this.setState({ privilegeData: privilegeData });
      //     }
      //   }
    });
  }

  async getPrivilegeData() {
    let helper2 = this.core.make("oxzion/restClient");
    let privilegedata = await helper2.request(
      "v1",
      // "/role/" + this.props.dataItem.id + "/privilege",
      "/privilege",
      {},
      "get"
    );
    return privilegedata;
  }

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    this.props.cancel();
  };

  render() {
    return (
      <Window onClose={this.props.cancel}>
        <Ripple>
          <div
            className="col-10 justify-content-center"
            style={{ display: "contents" }}
          >
            <div className="privilegeGrid">
              <Grid
                data={orderBy(this.state.privilegeData1, this.state.sort)}
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
                      <label>{props.dataItem.name.slice(7)}</label>
                    </td>
                  )}
                />
                <GridColumn title="Permission" field="permission" />
                <GridColumn
                  title="Read"
                  width="80px"
                  cell={props =>
                    props.dataItem.permission_allowed & 1 ? (
                      <td>
                        <div className="privelegeGridcellFix">
                          <Input
                            type="checkbox"
                            id={props.dataItem.name + "_R"}
                            className="k-checkbox"
                          />
                          <label
                            className="k-checkbox-label"
                            htmlFor={props.dataItem.name + "_R"}
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
                    props.dataItem.permission_allowed & 2 ? (
                      <td>
                        <div className="privelegeGridcellFix">
                          <Input
                            type="checkbox"
                            id={props.dataItem.name + "_W"}
                            className="k-checkbox"
                          />
                          <label
                            className="k-checkbox-label"
                            htmlFor={props.dataItem.name + "_W"}
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
                    props.dataItem.permission_allowed & 4 ? (
                      <td>
                        <div className="privelegeGridcellFix">
                          <Input
                            type="checkbox"
                            id={props.dataItem.name + "_C"}
                            className="k-checkbox"
                          />
                          <label
                            className="k-checkbox-label"
                            htmlFor={props.dataItem.name + "_C"}
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
                    props.dataItem.permission_allowed & 8 ? (
                      <td>
                        <div className="privelegeGridcellFix">
                          <Input
                            type="checkbox"
                            id={props.dataItem.name + "_D"}
                            className="k-checkbox"
                          />
                          <label
                            className="k-checkbox-label"
                            htmlFor={props.dataItem.name + "_D"}
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
