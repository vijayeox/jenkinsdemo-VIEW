import React from 'react';
import '../App.css';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import { FaBeer, FaArrowLeft, FaSearch } from 'react-icons/fa';


class Group extends React.Component {
  render() {
    return (
      <div>
        <div className="container" id="groupPage">
          <div className="jumbotron" id="set1" >
            <div style={{display:'flex'}}>

              <button id="goBack2" className="btn btn-sq">  <FaArrowLeft /> </button>
              <center>
                <a href="#" className="previous round"></a>
                <h3 className="mainHead">Manage Groups</h3></center>
            </div>
            <div>
              <Row>
                <Col xl={12}>
                  <Card>
                    <CardHeader>
                      <div style={{display:'inline-flex'}}>
                        <h5>Groups List</h5>
                       

                      </div>
                    </CardHeader>
                    <CardBody>
                    
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Name</th>
                          <th scope="col">Manager ID</th>
                          <th scope="col">Participants</th>
                        </tr>
                      </thead>
                      <tbody>

                        <tr>
                          <th scope="row">1</th>
                          <td>Avenger</td>
                          <td>123</td>
                          <td>22</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Justice Leauge</td>
                          <td>213</td>
                          <td>42</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Marvel</td>
                          <td>613</td>
                          <td>32</td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>Dc</td>
                          <td>210</td>
                          <td>12</td>
                        </tr>
                        <tr>
                          <th scope="row">5</th>
                          <td>Formula One</td>
                          <td>214</td>
                          <td>52</td>
                        </tr>
                        <tr>
                          <th scope="row">6</th>
                          <td>lakers</td>
                          <td>211</td>
                          <td>19</td>
                        </tr>
                        <tr>
                          <th scope="row">7</th>
                          <td>Fox River</td>
                          <td>213</td>
                          <td>32</td>
                        </tr>
                        <tr>
                          <th scope="row">8</th>
                          <td>Reactor</td>
                          <td>713</td>
                          <td>42</td>
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


export default Group;
