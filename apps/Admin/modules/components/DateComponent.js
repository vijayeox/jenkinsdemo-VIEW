import React from "react";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Moment from "moment";

export default class DateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  componentWillMount() {
    if (Moment(this.props.value, "YYYY-MM-DD", true).isValid()) {
      const tempDate = this.props.value;
      const Dateiso = new Moment(tempDate, "YYYY-MM-DD").format();
      const Datekendo = new Date(Dateiso);
      this.setState({ value: Datekendo });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      if (Moment(this.props.value, "YYYY-MM-DD", true).isValid()) {
        const tempDate = this.props.value;
        const Dateiso = new Moment(tempDate, "YYYY-MM-DD").format();
        const Datekendo = new Date(Dateiso);
        this.setState({ value: Datekendo });
      }
    }
  }

  render() {
    return (
      <DatePicker
        format={this.props.format}
        value={this.state.value}
        onChange={this.props.change}
        required={this.props.required}
        disabled={this.props.disabled ? true : false}
      />
    );
  }
}
