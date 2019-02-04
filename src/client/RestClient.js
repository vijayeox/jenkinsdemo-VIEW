import {ServiceProvider} from '@osjs/common';


export class RestClientServiceProvider extends ServiceProvider {

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
			
			if(method == 'get')  {
				let auth = 'Bearer ' + this.token;
				const resp = await fetch(url,{
					method: method,
					credentials:'include',
					headers: {
				      'Authorization': auth,
	      			  'Content-Type': 'application/json'
				    }
					
				})

				return resp.json();
			}
			else if(method == 'post') {
				let auth = 'Bearer ' + this.token;
				const resp = await fetch(url,{
					method: method,
					credentials:'include',
					headers: {
				      'Authorization': auth,
				    },
					body: params.data
				})	

				return resp.json();
			}
			else if(method == 'put') {
				let jsonObject = {};
				for (const [key, value]  of params.data.entries()) {
    				jsonObject[key] = value;
				}
				console.log(jsonObject)
				let auth = 'Bearer ' + this.token;
				console.log(params.data)
				const resp = await fetch(url,{
					method: method,
					credentials:'include',
					headers: new Headers({
				      'Authorization': auth,
				      'Content-Type':'application/json'
				    }),
					body: JSON.stringify(jsonObject)
				})	

				return resp.json();
			}
			else if(method == 'delete') {
				let auth = 'Bearer ' + this.token;
				const resp = await fetch(url,{
					method: method,
					credentials:'include',
					headers: new Headers({
				      'Authorization': auth,
				    }),
					
				})

				return resp.json();
			}
			else
			{
				console.log('Unsupported method.');
			}
			// TODO - handle refresh
			return null;			
		}
		catch (e) {
			return Promise.reject(e);
		}
	}

}