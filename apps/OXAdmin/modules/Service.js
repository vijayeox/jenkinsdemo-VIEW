import React from 'react';

class Service extends React.Component {
	constructor(props) {
		console.log(props);
	}

	getUserInfo() {
		let helper = this.core.make('oxzion/restClient');
		let userData = helper.request('v1', '/user', {}, 'get');
		return userData;
	}
}
export default Service;
