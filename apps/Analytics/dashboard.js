import React from 'react';
import ReactDOM from 'react-dom';
import {dashboard as section} from './metadata.json';
import Pagination from './pagination'
import osjs from 'osjs';
import Swal from "sweetalert2";
import '../../gui/src/public/css/sweetalert.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.props.setTitle(section.title.en_EN);
        this.state = {
            items: [
//                { slNum: 1, name: 'Dashboard 1', id: 'c6318742-b9f9-4a18-abce-7a7fbbac8c8b' },
//                { slNum: 2, name: 'Dashboard 2', id: 'c6318742-b9f9-4a18-abce-7a7fbbac8c8b' },
//                { slNum: 3, name: 'Dashboard 3', id: 'c6318742-b9f9-4a18-abce-7a7fbbac8c8b' },
//                { slNum: 4, name: 'Dashboard 4', id: 'c6318742-b9f9-4a18-abce-7a7fbbac8c8b' },
//                { slNum: 5, name: 'Dashboard 5', id: null }
            ],
            pageOfItems: []
        };
        this.restClient = osjs.make('oxzion/restClient');
        this.loader = null;
    }

    onChangePage = (pageOfItems) => {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    componentDidMount() {
        if (!this.loader) {
            this.loader = this.core.make('oxzion/splash');
        }
        this.loader.show();
        let thisInstance = this;
        let restResponse = thisInstance.restClient.request('v1', 'analytics/dashboard', {}, 'get');
        function handleNonSuccessResponse(response) {
            console.info(`Received a non-success status from server for URL 'analytics/dashboard'. JSON:${JSON.stringify(response)}.`);
            if (thisInstance.loader) {
                thisInstance.loader.destroy();
            }
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Unexpected error occurred. Please try after some time.'
                });
        }
        restResponse.
            then(function(response) {
console.log('--------------------->>>>');
console.log(response);

                if (response.status !== 'success') {
                    handleNonSuccessResponse(response);
                }
                else {
                    let items = [];
                    for (let i=0; i < response.data.length; i++) {
                        items.push({slNum:i+1, name:response.data[i].name, id:response.data[i].uuid});
                    }
                    thisInstance.setState({
                        items:items
                    });
                }
            }).
            catch(function(response){
                handleNonSuccessResponse(response);
            }).
            finally(function(response){
                if (thisInstance.loader) {
                    thisInstance.loader.destroy();
                }
            });
    }

    render() {
        return(
            <div className="dashboard">
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
                                    <a className="action-button" onClick={() => this.props.editDashboard(item.id)}>
                                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    </a>
                                    &nbsp;&nbsp;
                                    <a className="action-button" onClick={() => this.deleteDashboard(item.id)}>
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

export default Dashboard;

