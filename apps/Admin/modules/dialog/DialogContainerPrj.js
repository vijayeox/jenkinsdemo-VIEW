import {
  React,
  FileUploader,
  Notification,
  KendoReactWindow,
  KendoReactInput,
} from "oxziongui";
import TextareaAutosize from "react-textarea-autosize";
import { GetSingleEntityData, PushData } from "../components/apiCalls";
import { SaveCancel, DropDown } from "../components/index";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      prjInEdit: this.props.dataItem || null,
      managerName: undefined,
      parentProject: this.props.dataItem.parent_id,
    };
    this.notif = React.createRef();
  }

  UNSAFE_componentWillMount() {
    if (this.props.formAction == "put") {
      GetSingleEntityData(
        "organization/" +
          this.props.selectedOrg +
          "/user/" +
          this.props.dataItem.manager_id +
          "/profile"
      ).then((response) => {
        this.setState({
          managerName: {
            id: "111",
            name: response.data.name,
          },
        });
      });
    }
  }

  onDialogInputChange = (event) => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.prjInEdit;
    edited[name] = value;

    this.setState({
      prjInEdit: edited,
    });
  };

  listOnChange = (event, item) => {
    const edited = this.state.prjInEdit;
    edited[item] = event.target.value;
    this.setState({
      prjInEdit: edited,
    });
    item == "manager_id"
      ? this.setState({
          managerName: event.target.value,
        })
      : null;
    item == "parent_id"
      ? this.setState({
          parentProject: event.target.value,
        })
      : null;
  };

  sendData = (e) => {
    e.preventDefault();
    this.notif.current.notify(
      "Uploading Data",
      "Please wait for a few seconds.",
      "default"
    );
    PushData(
      "project",
      this.props.formAction,
      this.props.dataItem.uuid,
      {
        name: this.state.prjInEdit.name,
        description: this.state.prjInEdit.description,
        manager_id: this.state.prjInEdit.manager_id,
        parent_id: this.state.prjInEdit.parent_id,
      },
      this.props.selectedOrg
    ).then((response) => {
      if (response.status == "success") {
        this.props.action(response);
        this.props.cancel();
      } else {
        this.notif.current.notify(
          "Error",
          response.message ? response.message : null,
          "danger"
        );
      }
    });
  };

  render() {
    return (
      <KendoReactWindow.Window onClose={this.props.cancel}>
        <Notification ref={this.notif} />
        <div>
          <form id="prjForm" onSubmit={this.sendData}>
            {this.props.diableField ? (
              <div className="read-only-mode">
                <h5>(READ ONLY MODE)</h5>
                <i class="fa fa-lock"></i>
              </div>
            ) : null}
            <div className="form-group">
              <label className="required-label">Project Name</label>
              <KendoReactInput.Input
                type="text"
                className="form-control"
                name="name"
                maxLength="50"
                value={this.state.prjInEdit.name || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Project Name"
                readOnly={this.props.diableField ? true : false}
                required={true}
              />
            </div>
            <div className="form-group text-area-custom">
              <label className="required-label">Project Description</label>
              <TextareaAutosize
                type="text"
                className="form-control"
                name="description"
                maxLength="200"
                value={this.state.prjInEdit.description || ""}
                onChange={this.onDialogInputChange}
                placeholder="Enter Project Description"
                style={{ marginTop: "5px" }}
                readOnly={this.props.diableField ? true : false}
                required={true}
              />
            </div>
            <div className="form-group">
              <div className="form-row">
                <div className="col-4">
                  <label className="required-label">Project Manager</label>
                  <div>
                    <DropDown
                      args={this.core}
                      mainList={
                        "organization/" + this.props.selectedOrg + "/users"
                      }
                      selectedItem={this.state.managerName}
                      preFetch={true}
                      onDataChange={(event) =>
                        this.listOnChange(event, "manager_id")
                      }
                      required={true}
                      disableItem={this.props.diableField}
                      validationMessage={"Please select a Project Manager."}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <label>Parent Project</label>
                  <div className="parentProjectDropdown">
                    <DropDown
                      args={this.core}
                      mainList={
                        "organization/" + this.props.selectedOrg + "/projects"
                      }
                      selectedItem={this.state.parentProject}
                      preFetch={true}
                      onDataChange={(event) =>
                        this.listOnChange(event, "parent_id")
                      }
                      disableItem={this.props.diableField}
                      validationMessage={"Please select the Parent project."}
                    />
                    <button onClick={(e)=>{
                      e.preventDefault();
                      this.setState({parentProject:null});
                    }} >
                      <i class="fa fa-times-circle" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <SaveCancel
          save="prjForm"
          cancel={this.props.cancel}
          hideSave={this.props.diableField}
        />
      </KendoReactWindow.Window>
    );
  }
}
