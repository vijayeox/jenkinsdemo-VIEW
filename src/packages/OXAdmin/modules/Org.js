import React from 'react';
import '../App.css';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import { FaBeer, FaArrowLeft, FaSearch } from 'react-icons/fa';


class Org extends React.Component {
  render() {
    return (
      <div>
        <div className="container" id="organisation">
          <div className="jumbotron" id="set1" >
            <div style={{display:'flex'}}>

              <button id="goBack" className="btn btn-sq">  <FaArrowLeft /> </button>
              <center>
                <a href="#" className="previous round"></a>
                <h3 className="mainHead">Manage Organisations</h3></center>
            </div>
            <div>
              <Row>
                <Col xl={12}>
                  <Card>
                    <CardHeader>
                      <div style={{ display: 'inline-flex' }}>
                        <h5>Organisations List</h5>
                      </div>
                    </CardHeader>
                    <CardHeader>
                      <div>

                        <input type="text" placeholder="Search for Organisation..."/>

                      </div>
                    </CardHeader>

                    <CardBody style={{overflowY:'scroll',height:'200px'}}>
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Reg. Date</th>
                            <th scope="col">Country</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">1</th>
                            <td>Vantage Agora</td>
                            <td>22/2/2019</td>
                            <td>India</td>
                          </tr>

                          <tr>
                            <th scope="row">2</th>
                            <td>Microsoft</td>
                            <td>2/2/2019</td>
                            <td>Usa</td>
                          </tr>
                          <tr>
                            <th scope="row">3</th>
                            <td>Air Aisia</td>
                            <td>22/4/2019</td>
                            <td>China</td>
                          </tr>

                          <tr>
                            <th scope="row">4</th>
                            <td>Amazon</td>
                            <td>2/10/2019</td>
                            <td>Canada</td>
                          </tr>
                          <tr>
                            <th scope="row">5</th>
                            <td>Flipkart</td>
                            <td>5/2/2019</td>
                            <td>India</td>
                          </tr>
                          <tr>
                            <th scope="row">6</th>
                            <td>Apple</td>
                            <td>27/10/2019</td>
                            <td>South America</td>
                          </tr>
                          <tr>
                            <th scope="row">7</th>
                            <td>Citrix</td>
                            <td>15/8/2019</td>
                            <td>Japan</td>
                          </tr>
                          <tr>
                            <th scope="row">8</th>
                            <td>Cisco</td>
                            <td>29/12/2019</td>
                            <td>India</td>
                          </tr>

                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>

          </div>
        </div>
      </div >
    )
  }
}


export default Org;
