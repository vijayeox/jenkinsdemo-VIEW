import React from "react";
import ReactDOM from "react-dom";

import "jquery/dist/jquery.js";
import $ from "jquery";
import PreBuiltPackages from "./PreBuiltPackages";
import AdHocApps from "./AdHocApps";
import "./public/js/materialize.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  componentDidMount() {
    $(document).ready(function () {
      $("#componentsBox").hide();

      $(document).on("click", ".moduleBtn", function () {
        $(".DashBG").fadeOut(),
          $("#componentsBox").show();
      });

      $(document).on("click", ".goBack", function () {
        $("#componentsBox").hide(), $(".DashBG").show();
        ReactDOM.render("<div></div>", document.getElementById('componentsBox'));
      });
    });
  }

  createBlock = () => {
    let table = [];
    table.push(<div key="1"><div style={{ display: "inline-grid" }}><div className="block d1" onClick={this.prebuiltappClick}> <img src="apps/Admin/102-production.svg" className="moduleBtn App-logo" /></div> <div className="titles">Prebuilt Apps</div> </div> </div>);
    table.push(<div key="2"><div style={{ display: "inline-grid" }}><div className="block d1" onClick={this.customAppClick}> <img src="apps/Admin/102-production.svg" className="moduleBtn App-logo" /></div> <div className="titles">Custom Apps</div> </div> </div>);
    return table;
  };


  prebuiltappClick = (e) => {
    ReactDOM.render(<PreBuiltPackages args={this.core} />, document.getElementById('componentsBox'));
  }

  customAppClick = (e) => {
    ReactDOM.render(<AdHocApps args={this.core} />, document.getElementById('componentsBox'));
  }


  render() {
    return (<div><div className="DashBG" > <center> <div style={{ height: "-webkit-fill-available", height: "38em", display: "flex" }} ><div className="container"> {this.createBlock()} </div> </div> </center> </div><div id="componentsBox" style={{ paddingBottom: "100px", height: "37em" }}></div> </div >);  }
}
export default App;