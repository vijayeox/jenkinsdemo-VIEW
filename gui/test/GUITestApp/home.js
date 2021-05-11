import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import GridDemo from "./src/templates/ListingDemo";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.userProfile = this.core.make("oxzion/profile").get();
    this.userProfile = this.userProfile.key;
  }

  componentDidMount() {
    $(document).ready(function() {
      $("#componentsBox").hide();

      $(document).on("click", ".moduleBtn", function() {
        $(".DashBG").fadeOut(), $("#componentsBox").show();
      });

      $(document).on("click", ".moduleBtn", function() {
        $(".DashBG").fadeOut(), $("#componentsBox").show();
      });
    });
  }

  createBlock = () => {
    var appsList = [
      {
        name: "OX_Grid",
        icon: "apps/GUITestApp/table-icon.jpg",
        component: GridDemo
      }
    ];
    let table = [];

    appsList.map((currentValue, index) => {
      table.push(
        <div
          key={index}
          className="moduleBtn"
          onClick={() => {
            ReactDOM.render(
              React.createElement(currentValue.component, {
                args: this.core,
                userProfile: this.userProfile,
                menu: this.showMenu
              }),
              document.getElementById("componentsBox")
            );
          }}
        >
          <div className="block d1">
            <img src={currentValue.icon} style={{ height: "inherit" }} />
          </div>
          <div className="titles">{currentValue.name}</div>
        </div>
      );
    });
    return table;
  };

  render() {
    return (
      <div
        id="admin-outer-container"
        style={{
          backgroundColor: "#ffffff",
          backgroundSize: "cover",
          height: "inherit"
        }}
      >
        <div className="DashBG" style={{ height: "100%" }} id="admin-page-wrap">
          <div className="dashIcons">{this.createBlock()}</div>
        </div>
        <div id="componentsBox" style={{ height: "inherit" }} />
      </div>
    );
  }
}
export default Home;
