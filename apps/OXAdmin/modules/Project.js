import React from 'react';
import '../public/scss/app.css';
import '../public/scss/kendo.css';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import { FaBeer, FaArrowLeft, FaSearch } from 'react-icons/fa';

class Project extends React.Component {
	render() {
		return (
			<div>
				<div className="container" id="project">
					<div className="jumbotron" id="set1">
						<div style={{ display: 'flex' }}>
							<button className="btn btn-sq" id="goBack3">
								{' '}
								<FaArrowLeft />{' '}
							</button>
							<center>
								<a href="#" className="previous round" />
								<h3 className="mainHead text-center">Manage Projects</h3>
							</center>
						</div>
						<div>
							<Row>
								<Col xl={12}>
									<Card>
										<CardHeader>
											<div style={{ display: 'inline-flex' }}>
												<h5>Projects List</h5>
											</div>
										</CardHeader>
										<CardBody style={{ overflowY: 'scroll', height: '350px' }}>
											{/* <Table responsive hover>

                   
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
                          <td>Oxzion</td>
                          <td>Bharat G</td>
                          <td>User Interface</td>
                          <td>22/4/2019</td>
                        </tr>

                        <tr>
                          <th scope="row">2</th>
                          <td>Database Management</td>
                          <td>Siddhant B</td>
                          <td> Database</td>
                          <td>3/4/2019</td>
                        </tr>

                        <tr>
                          <th scope="row">3</th>
                          <td>Oxzion</td>
                          <td>Shivam B</td>
                          <td>Cloud Computing</td>
                          <td>30/7/2019</td>
                        </tr>

                        <tr>
                          <th scope="row">4</th>
                          <td>Oxzion</td>
                          <td>Prakhar k</td>
                          <td>big Data </td>
                          <td>12/8/2019</td>
                        </tr>

                        <tr>
                          <th scope="row">5</th>
                          <td>Smart Bot</td>
                          <td>Shubham N</td>
                          <td>Artificial Intelligence </td>
                          <td>7/9/2019</td>
                        </tr>

                        <tr>
                          <th scope="row">6</th>
                          <td>Oxzion</td>
                          <td>Karan H</td>
                          <td>Backend Architecture</td>
                          <td>1/4/2019</td>
                        </tr>

                        <tr>
                          <th scope="row">7</th>
                          <td>Oxzion</td>
                          <td>danish S</td>
                          <td>Machine Learning</td>
                          <td>23/4/2019</td>
                        </tr>

                        <tr>
                          <th scope="row">8</th>
                          <td>Oxzion</td>
                          <td>Prajwal k</td>
                          <td>Block Chain</td>
                          <td>17/10/2019</td>
                        </tr>


                      </tbody>
                    </Table> */}
										</CardBody>
									</Card>
								</Col>
							</Row>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Project;
