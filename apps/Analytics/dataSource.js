import React from 'react';
import ReactDOM from 'react-dom';
import {dataSource as section} from './metadata.json';
import Pagination from './pagination'

class DataSource extends React.Component {
  constructor(props) {
    super(props);

    var sampleItems = [...Array(150).keys()].map(i => ({ slNum: (i+1), name: 'Data source ' + (i+1), id: (i+1) }));

    this.core = this.props.args;
    this.state = {
        items: sampleItems,
        pageOfItems: []
    };

    this.props.setTitle(section.title.en_EN);
    //this.onChangePage = this.onChangePage.bind(this);
  }

  onChangePage = (pageOfItems) => {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  }

  editDataSource = (e) => {
  }

  deleteDataSource = (e) => {
  }

  render() {
    return(
        <div className="data-source">
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Sl. No.</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.pageOfItems.map(item =>
                        <tr key={item.id}>
                            <td className="number">
                                {item.slNum}
                            </td>
                            <td>
                                {item.name} &nbsp;&nbsp;&nbsp;&nbsp;
                                <a className="action-button" onClick={() => this.editDataSource(item.id)}>
                                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                </a>
                                &nbsp;&nbsp;
                                <a className="action-button" onClick={() => this.deleteDataSource(item.id)}>
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                </a>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination alignment="right" pageSize={11} items={this.state.items} onChangePage={this.onChangePage} />
        </div>
    );
  }
}

export default DataSource;

