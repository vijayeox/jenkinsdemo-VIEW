import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import {name as applicationName} from './metadata.json';
import Pagination from "./pagination"

class DataSource extends React.Component {
  constructor(props) {
    super(props);

    var sampleItems = [...Array(150).keys()].map(i => ({ slNum: (i+1), name: 'Data source ' + (i+1), id: (i+1) }));

    this.core = this.props.args;
    this.state = {
        items: sampleItems,
        pageOfItems: []
    };

    this.onChangePage = this.onChangePage.bind(this);
  }

  onChangePage(pageOfItems) {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  }

  editDataSource(e) {
      console.log(e);
  }

  deleteDataSource(e) {
      console.log(e);
  }

  render() {
    return(
        <div class="data-source full-height">
            <table class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th>Sl. No.</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.pageOfItems.map(item =>
                        <tr>
                            <td class="number">
                                {item.slNum}
                            </td>
                            <td>
                                {item.name} &nbsp;&nbsp;&nbsp;&nbsp;
                                <a class="action-button" onClick={() => this.editDataSource(item.id)}>
                                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                </a>
                                &nbsp;&nbsp;
                                <a class="action-button" onClick={() => this.deleteDataSource(item.id)}>
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </a>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination alignment='right' pageSize={11} items={this.state.items} onChangePage={this.onChangePage} />
        </div>
    );
  }
}
export default DataSource;

