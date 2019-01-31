import {ServiceProvider} from '@osjs/common';


export class oxRestClientServiceProvider extends ServiceProvider {

	constructor(core, options = {}) {
	    super(core, options || {});
		this.core = core;
		this.token = null;
	}


	providers() {
		return [
		'oxzion/restClient'
		];
	}

	async init() {
		this.core.instance('oxzion/restClient', () => ({
			request: (version,url,params,method) => this.makeRequest(version,url,params,method),
			authenticate: (params) => this.authenticate(params)
		}));


	}

	// auth wrapper 
	async authenticate(params) {
		try {
			var respData ;
			let url = this.core.config('auth.url');
			const testURL = 'http://localhost/data.json';
			const resp = await fetch(url, {
				method: 'post',
				body: params
			})
			return resp.json();
		}
		catch (e) {}
	}


	// handles all request to OXZion apps
	// version - string
	// action - string
	// params - *
	// method - string
	async makeRequest(version,url,params,method) {
		let userData =  this.core.getUser();
		this.token = userData["jwt"];
		try {
			
			let auth = 'Bearer ' + this.token;
			const resp = await fetch(url,{
				method: method,
				credentials:'include',
				headers: {
			      'Authorization': auth,
      			  'Content-Type': 'application/json'
			    }
				
			})
			// TODO - handle refresh
			return resp.json();			
		}
		catch (e) {
			return Promise.reject(e);
		}
	}

}