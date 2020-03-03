import React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";

export default function CustomFilter(config) {
  return class extends React.Component {
    onChange = event => {
      const hasValue = this.hasValue(event.target.value);
      this.props.onChange({
        value: hasValue ? event.target.value : "",
        operator: hasValue ? "eq" : "",
        syntheticEvent: event.syntheticEvent
      });
    };

    checkFilterType = () => {
      if (config.type == "empty") {
        return <div></div>;
      } else if (config.type == "dropdown") {
        return (
          <React.Fragment>
            <DropDownList
              data={config.listItems}
              onChange={this.onChange}
              value={this.props.value || config.placeholder}
              className="filterDropdown"
            />
            <button
              className="k-button k-button-icon k-clear-button-visible"
              title="Clear"
              disabled={!this.hasValue(this.props.value)}
              onClick={this.onClearButtonClick}
              style={{ marginLeft: "5px" }}
            >
              <span className="k-icon k-i-filter-clear" />
            </button>
          </React.Fragment>
        );
      }
    };

    render() {
      return <div className="k-filtercell">{this.checkFilterType()}</div>;
    }

    hasValue = value => Boolean(value && value !== config.placeholder);

    onClearButtonClick = event => {
      event.preventDefault();
      this.props.onChange({
        value: "",
        operator: "",
        syntheticEvent: event
      });
    };
  };
}

