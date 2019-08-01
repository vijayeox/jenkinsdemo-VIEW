    import React from "react";
    import LeftMenuTemplate from "./leftmenutemplate.js";

    class RenderTemplate extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                menus: []
              };
              this.props.menus().then(response => {
                this.setState({
                    menus : response["data"]
                })
              })
        }

        render() {
            return (<LeftMenuTemplate config={this.state.menus} args={this.props.args}/>);
        }
    }
    export default RenderTemplate;