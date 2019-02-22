import React, { Component } from 'react';

import '../public/scss/app.css';
import '../public/scss/kendo.css';
import { FaArrowLeft } from 'react-icons/fa';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faPlusCircle);

import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';

import { userData } from './data/userData';

import DialogContainer from './dialog/DialogContainerUser';
import cellWithEditing from './cellWithEditing';
import { orderBy } from '@progress/kendo-data-query';

class User extends React.Component {
	constructor(props) {
		super(props);
		this.core = this.props.args;

		this.state = {
			productInEdit: undefined,
			sort: [{ field: 'id', dir: 'desc' }],
			products: [],
		};

		this.getUserData().then(response => {
			this.setState({ products: response.data });
		});
	}

	async getUserData() {
		console.log('inside  the user function');
		let helper = this.core.make('oxzion/restClient');
		let userData = await helper.request('v1', '/user', {}, 'get');
		return userData;
	}

	edit = dataItem => {
		this.setState({ productInEdit: this.cloneProduct(dataItem) });
	};

	remove = dataItem => {
		const products = this.state.products;
		const index = products.findIndex(p => p.ProductID === dataItem.ProductID);
		if (index !== -1) {
			products.splice(index, 1);
			this.setState({
				products: products,
			});
		}
	};

	save = () => {
		const dataItem = this.state.productInEdit;
		const products = this.state.products.slice();

		if (dataItem.ProductID === undefined) {
			products.unshift(this.newProduct(dataItem));
		} else {
			const index = products.findIndex(p => p.ProductID === dataItem.ProductID);
			products.splice(index, 1, dataItem);
		}

		this.setState({
			products: products,
			productInEdit: undefined,
		});
	};

	cancel = () => {
		this.setState({ productInEdit: undefined });
	};

	insert = () => {
		this.setState({ productInEdit: {} });
	};

	render() {
		return (
			<div id="userPage">
				<div style={{ display: 'flex' }}>
					<button id="goBack4" className="btn btn-sq">
						<FaArrowLeft />
					</button>
					<div className="mainHead">
						<h3 className="mainHead">Manage Users</h3>
					</div>
				</div>

				<Grid
					style={{ height: '475px' }}
					data={orderBy(this.state.products, this.state.sort)}
					sortable
					sort={this.state.sort}
					onSortChange={e => {
						this.setState({
							sort: e.sort,
						});
					}}
				>
					<GridToolbar>
						<div>
							<span className="flow-text">Users List</span>
							<button
								onClick={this.insert}
								className="k-button"
								style={{ position: 'absolute', top: '8px', right: '16px' }}
							>
								<FontAwesomeIcon icon="plus-circle" style={{ fontSize: '20px' }} />
								<p style={{ margin: '0px', paddingLeft: '10px' }}>Add User</p>
							</button>
						</div>
					</GridToolbar>
					<Column field="id" title="User ID" width="90px" />
					<Column field="name" title="Name" />
					<Column field="firstname" title="First Name" />
					<Column field="lastname" title="Last Name" />
					<Column title="Edit" width="150px" cell={cellWithEditing(this.edit, this.remove)} />
				</Grid>

				{this.state.productInEdit && (
					<DialogContainer dataItem={this.state.productInEdit} save={this.save} cancel={this.cancel} />
				)}
			</div>
		);
	}

	dialogTitle() {
		return `${this.state.productInEdit.ProductID === undefined ? 'Add' : 'Edit'} product`;
	}
	cloneProduct(product) {
		return Object.assign({}, product);
	}

	newProduct(source) {
		const newProduct = {
			ProductID: this.generateId(),
			Name: '',
			Contact: '',
			Designation: '',
		};

		return Object.assign(newProduct, source);
	}

	generateId() {
		let id = 1;
		this.state.products.forEach(p => {
			id = Math.max((p.ProductID || 0) + 1, id);
		});
		return id;
	}
}

export default User;
