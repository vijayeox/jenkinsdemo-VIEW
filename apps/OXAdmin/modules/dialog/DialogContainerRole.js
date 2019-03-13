import React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Validator } from "@progress/kendo-validator-react-wrapper";
import "../../public/scss/kendo.css";
import "@progress/kendo-ui";

export default class DialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      roleInEdit: this.props.dataItem || null,
      visibleDialog: false,
      show:false,
      ReadG: false,
      WriteG:false,
      CreateG:false,
      DeleteG:false,
      ReadO: false,
      WriteO:false,
      CreateO:false,
      DeleteO:false,
      ReadR: false,
      WriteR:false,
      CreateR:false,
      DeleteR:false,
      ReadU: false,
      WriteU:false,
      CreateU:false,
      DeleteU:false,

    };
  }

  componentDidMount() {
    M.updateTextFields();
  }

  async pushData() {
    let helper = this.core.make("oxzion/restClient");
    let roleAddData = await helper.request(
      "v1",
      "/role",
      {
        name: this.state.roleInEdit.name,
        description: this.state.roleInEdit.description,
        show:false
      },
      "post"
    );
    return roleAddData;
  }

  async editRole() {
    let helper = this.core.make("oxzion/restClient");
    let roleEditData = await helper.request(
      "v1",
      "/role/" + this.state.roleInEdit.id,
      {
        name: this.state.roleInEdit.name,
        description: this.state.roleInEdit.description,
        show:false
      },
      "put"
    );
  }

  onDialogInputChange = event => {
    let target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.roleInEdit;
    edited[name] = value;

    this.setState({
      roleInEdit: edited
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.submitData();
  };

  submitData = event => {
    var self = this;
    if (this.props.formAction == "edit") {
      this.editRole();
    } else {
      this.pushData().then(response => {
        var addResponse = response.data.id;
        this.props.action(addResponse);
      });
    }
    this.props.save();
  };

  render() {
    return (
      <Validator>
        <Dialog onClose={this.props.cancel}>
          <div className="row">
            <form className="col s12" onSubmit={this.submitData} id="roleForm">
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="Name"
                    type="text"
                    className="validate"
                    name="name"
                    value={this.state.roleInEdit.name || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="roleName">Role Name</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="roleDescription"
                    type="text"
                    className="validate"
                    name="description"
                    value={this.state.roleInEdit.description || ""}
                    onChange={this.onDialogInputChange}
                    required={true}
                  />
                  <label htmlFor="roleDescription">Description</label>
                </div>
              </div>
               
                <div> PRIVILEGES</div>

              
               <label> Manage Groups </label>
               
            
             <div id="group">
             
              
              
          <label>
            <input type="checkbox"
             name="ReadG"
             checked={this.state.roleInEdit.ReadG || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">R</span>
            </label>
              
              
          <label>
            <input type="checkbox"
             name="WriteG"
             checked={this.state.roleInEdit.WriteG || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">W</span>
            </label>
              
            
              
          <label>
            <input type="checkbox"
             name="CreateG"
             checked={this.state.roleInEdit.CreateG || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">C</span>
            </label>
              
          
              
          <label>
            <input type="checkbox"
             name="DeleteG"
             checked={this.state.roleInEdit.DeleteG || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">D</span>
            </label>
              
            

              </div>
 
 
              <label> Manage Roles </label>
             
             <div id="roles">
             
              
              
          <label>
            <input type="checkbox"
             name="ReadR"
             checked={this.state.roleInEdit.ReadR || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">R</span>
            </label>
              
              
          <label>
            <input type="checkbox"
             name="WriteR"
             checked={this.state.roleInEdit.WriteR || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">W</span>
            </label>
              
            
              
          <label>
            <input type="checkbox"
             name="CreateR"
             checked={this.state.roleInEdit.CreateR || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">C</span>
            </label>
              
          
              
          <label>
            <input type="checkbox"
             name="DeleteR"
             checked={this.state.roleInEdit.DeleteR || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">D</span>
            </label>
              
            

              </div>
 
              <label> Manage Organisation </label>
             
             <div id="abc">
             
              
              
          <label>
            <input type="checkbox"
             name="ReadO"
             checked={this.state.roleInEdit.ReadO || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">R</span>
            </label>
              
              
          <label>
            <input type="checkbox"
             name="WriteO"
             checked={this.state.roleInEdit.WriteO || false}
             onChange={this.onDialogInputChange}
             />
             <span id="def">W</span>
            </label>
              
            
              
          <label>
            <input type="checkbox"
             name="CreateO"
             checked={this.state.roleInEdit.CreateO || false}
             onChange={this.onDialogInputChange}
             />
             <span  id="def">C</span>
            </label>
              
          
              
          <label>
            <input type="checkbox"
             name="DeleteO"
             checked={this.state.roleInEdit.DeleteO || false}
             onChange={this.onDialogInputChange}
             />
             <span  id="def">D</span>
            </label>
              
            

              </div>
 
              <label> Manage Users </label>
             
             <div id="user">
             
              
              
          <label>
            <input type="checkbox"
             name="ReadU"
             checked={this.state.roleInEdit.ReadU || false}
             onChange={this.onDialogInputChange}
             />
             <span  id="def">R</span>
            </label>
              
              
          <label>
            <input type="checkbox"
             name="WriteU"
             checked={this.state.roleInEdit.WriteU || false}
             onChange={this.onDialogInputChange}
             />
             <span  id="def">W</span>
            </label>
              
            
              
          <label>
            <input type="checkbox"
             name="CreateU"
             checked={this.state.roleInEdit.CreateU || false}
             onChange={this.onDialogInputChange}
             />
             <span  id="def">C</span>
            </label>
              
          
              
          <label>
            <input type="checkbox"
             name="DeleteU"
             checked={this.state.roleInEdit.DeleteU || false}
             onChange={this.onDialogInputChange}
             />
             <span  id="def">D</span>
            </label>
              
            

              </div>
 
 
 

             
            </form>
          </div>

          <DialogActionsBar args={this.core}>
            <button className="k-button" onClick={this.props.cancel}>
              Cancel
            </button>
            <button
              className="k-button k-primary"
              type="submit"
              form="roleForm"
            >
              Save
            </button>
          </DialogActionsBar>
        </Dialog>
      </Validator>
    );
  }
}
