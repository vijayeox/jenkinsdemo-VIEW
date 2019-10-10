import React from "react";

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbConfig: []
    };
    this.updateBreadCrumb = this.updateBreadCrumb.bind(this);
  }

  componentDidMount() {
    document
      .getElementsByClassName("breadcrumbParent")[0]
      .addEventListener("updateBreadcrumb", this.updateBreadCrumb, false);
  }

  clearBreadcrumb(){
    this.setState({
      breadcrumbConfig: []
    })
  }

  breadcrumbClick = (currentValue, index) => {
    if (currentValue.content) {
      let ev = new CustomEvent("updatePageView", {
        detail: currentValue.content,
        bubbles: true
      });
      document.getElementsByClassName("breadcrumbParent")[0].dispatchEvent(ev);
    }
    let data = this.state.breadcrumbConfig.slice();
    data.splice(index + 1, data.length);
    this.setState({
      breadcrumbConfig: data
    });
  };

  updateBreadCrumb = e => {
    var data = this.state.breadcrumbConfig;
    data.push(e.detail);
    this.setState({
      breadcrumbConfig: data
    });
  };

  renderBreadcrumbs = () => {
    var content = [];
    this.state.breadcrumbConfig.map((currentValue, index) => {
      var clickable = false;
      if (currentValue.content ) {
        var clickable = true;
        if (this.state.breadcrumbConfig.length == index+1) {
          var clickable = false;
        }
      }
      currentValue.name
        ? content.push(
            <span className="breadcrumbs-item" key={index}>
              {index == "0" ? null : (
                <i className="fas fa-chevron-right seperator"></i>
              )}
              {currentValue.icon ? <i className={currentValue.icon}></i> : null}
              <a
                style={{
                  cursor: clickable ? "pointer" : null
                }}
                onClick={() =>
                  clickable ? this.breadcrumbClick(currentValue, index) : null
                }
              >
                {currentValue.name}
              </a>
            </span>
          )
        : null;
    });
    return content;
  };

  render() {
    return this.state.breadcrumbConfig[0] ? (
      <div className="breadcrumbs">{this.renderBreadcrumbs()}</div>
    ) : null;
  }
}

export default Breadcrumb;
