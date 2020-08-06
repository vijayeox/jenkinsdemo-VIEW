import {React,Notification,ReactBootstrap ,FormRender} from "oxziongui";
import changePasswordForm from '../public/forms/changePasswordForm.json'
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
     reload : false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.notif = React.createRef();
  }
  async handleSubmit() {
    this.core.make("oxzion/profile").update();
    this.setState({reload : true})
  }

  toggleToolTip(bool_value) {
    this.setState({ tooltipOpen: bool_value })
  }

  init() { }
  render() {
    return (
      <ReactBootstrap.Form  className="confirm-password-form preferenceReactBootstrap.Form">
        <Notification ref={this.notif} />
          <FormRender 
            content = {changePasswordForm}
            core = {this.core}
            route = "/user/me/changepassword"
            postSubmitCallback = { this.handleSubmit }
          />
      </ReactBootstrap.Form>
    );
  }
}

export default ChangePassword;
