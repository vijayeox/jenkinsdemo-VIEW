import React from "react";

class RenderButtons extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.core;
    this.appId = this.props.appId;
  }

  createTiles = () => {
    let adminItems = [];
    this.props.content.buttonList.map((currentValue, index) => {
      adminItems.push(
        <div
          key={index}
          className="moduleBtn"
          onClick={() => {
            let p_ev = new CustomEvent("updatePageView", {
              detail: currentValue,
              bubbles: true
            });
            document
              .getElementsByClassName(this.appId + "_breadcrumbParent")[0]
              .dispatchEvent(p_ev);
          }}
        >
          <div className="block">
            {currentValue.icon ? (
              <i className={currentValue.icon}></i>
            ) : (
              currentValue.name
            )}
          </div>
          {currentValue.icon ? (
            <div className="titles">{currentValue.name}</div>
          ) : null}
        </div>
      );
    });
    return adminItems;
  };

  render() {
    return <div className="appButtons">{this.createTiles()}</div>;
  }
}

export default RenderButtons;
