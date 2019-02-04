import React from 'react';
import '../App.css';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';

class User extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="jumbotron" id="set1" >
          <center><h1 className="mainHead">Manage Users</h1></center>

          <div>
            <Row>
              <Col xl={12}>
                <Card>
                  <CardHeader style={{ display: 'inline-block' }}>
                    <h5>Users List</h5>
                  </CardHeader>
                  <CardBody>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Name</th>
                          <th scope="col">Designation</th>
                          <th scope="col">Contact No.</th>
                          <th scope="col">Country</th>
                        </tr>
                      </thead>
                      <tbody style={{height: '300px', overflowy: 'scroll'}}>

                        <tr>
                          <th scope="row">1</th>
                          <td>Peter A</td>
                          <td>Software Developer</td>
                          <td> 9128745019</td>
                          <td>India</td>
                        </tr>

                        <tr>
                          <th scope="row">2</th>
                          <td>Sanaya M</td>
                          <td>Bussiness Analyist</td>
                          <td> 7865432981</td>
                          <td>India</td>
                        </tr>

                        <tr>
                          <th scope="row">3</th>
                          <td>Ayushman K</td>
                          <td>Marketing Head</td>
                          <td> 7660981234</td>
                          <td>India</td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>Danish S</td>
                          <td>Human Resource</td>
                          <td> 9876543210</td>
                          <td>India</td>
                        </tr>
                        <tr>
                          <th scope="row">5</th>
                          <td>Rishabh R</td>
                          <td>software Tester</td>
                          <td> 9987643210</td>
                          <td>India</td>
                        </tr>
                        <tr>
                          <th scope="row">6</th>
                          <td>Shubham C</td>
                          <td>Data Scientist</td>
                          <td> 9876543210</td>
                          <td>India</td>
                        </tr>
                        <tr>
                          <th scope="row">7</th>
                          <td>Nesar P</td>
                          <td>Frontend Devloper</td>
                          <td> 9876543210</td>
                          <td>India</td>
                        </tr>
                        <tr>
                          <th scope="row">8</th>
                          <td>Prajwal K</td>
                          <td>Fullstack Developer</td>
                          <td> 9876543210</td>
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
    )
  }
}


export default User;
