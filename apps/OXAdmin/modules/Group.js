import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FaArrowLeft } from 'react-icons/fa';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faPlusCircle);

import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { orderBy } from '@progress/kendo-data-query';

import { groupData } from './data/groupData';

import DialogContainer from './dialog/DialogContainerGroup';
import cellWithEditing from './cellWithEditing';

class Group extends React.Component {
	state = {
		products: groupData.slice(0, 20),
		productInEdit: undefined,
		sort: [{ field: 'ProductID', dir: 'asc' }],
	};

	edit = dataItem => {
		this.setState({ productInEdit: this.cloneProduct(dataItem) });
	};

	remove = dataItem => {
		const products = this.state.products.slice();
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
			<div id="groupPage">
				<div style={{ display: 'flex', marginBottom: '10px' }}>
					<button id="goBack2" className="btn btn-sq">
						<FaArrowLeft />
					</button>
					<center>
						<h3 className="mainHead">Manage Groups</h3>
					</center>
				</div>

				<Grid
					style={{ height: '475px' }}
					data={orderBy(this.state.products, this.state.sort)}
					sortable
					resizable
					sort={this.state.sort}
					onSortChange={e => {
						this.setState({
							sort: e.sort,
						});
					}}
				>
					<GridToolbar>
						<div>
							<h4>Groups List</h4>
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

					<Column field="ProductID" title="ID" width="70px" />
					<Column field="GroupName" title="Group Name" width="140px" />
					<Column field="ManagerId" title="Manager ID" width="150px" />
					<Column field="Organisation" title="Organisation" width="100px" />
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
			ProductName: '',
			UnitsInStock: 0,
			Discontinued: false,
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

export default Group;
