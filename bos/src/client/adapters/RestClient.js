import { ServiceProvider } from '@osjs/common';


export class RestClientServiceProvider extends ServiceProvider {

	constructor(core, options = {}) {
		super(core, options || {});
		this.core = core;
		this.token = null;
		this.baseUrl = this.core.config('wrapper.url');
		//console.log(this.baseUrl);
	}


	providers() {
		return [
			'oxzion/restClient'
		];
	}

	async init() {
		this.core.instance('oxzion/restClient', () => ({
			request: (version, action, params, method,raw) => this.makeRequest(version, action, params, method,raw),
			authenticate: (params) => this.authenticate(params),
			profile:() => this.profile()
		}));


	}

	// auth wrapper 
	async authenticate(params) {
		try {
			var respData;
			let url = this.baseUrl + 'auth';
			//console.log(url);
			const testURL = this.core.config('auth.url');
			const resp = await fetch(url, {
				method: 'post',
				body: params
			})
			return resp.json();
		}
		catch (e) { }
	}
	// profile wrapper 
	profile(jwt) {
		let userData = this.core.getUser();
		this.token = userData["jwt"];
		try {
			let url = this.baseUrl + 'user/me/m';
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", url,false);
			let auth = 'Bearer ' + this.token;
			xmlHttp.setRequestHeader("content-type", "application/json");
			xmlHttp.setRequestHeader("Authorization", auth);
			xmlHttp.send(null);
			return xmlHttp.responseText;
		}
		catch (e) { }
	}


	// handles all request to OXZion apps
	// version - string
	// action - string
	// params - *
	// method - string
	async makeRequest(version, action, params, method,raw = false) {
		let userData = this.core.getUser();
		if (action.charAt(0) == '/')
			action = action.substr(1);
		let urlString = this.baseUrl + action;
		console.log(urlString);
		this.token = userData["jwt"];
		try {

			if (method == 'get') {
				let auth = 'Bearer ' + this.token;
				const resp = await fetch(urlString, {
					method: method,
					credentials: 'include',
					headers: {
						'Authorization': auth,
						'Content-Type': 'application/json'
					}

				})
				if(raw == true) {
					return resp;
				}
				return resp.json();
			}
			else if (method == 'post') {
				let auth = 'Bearer ' + this.token;
				let parameters = params;
				if (typeof parameters === 'string') {
					parameters = JSON.parse(parameters)
				}
				let formData = new FormData();
				for (var k in parameters) {
					formData.append(k, parameters[k]);
				}
				const resp = await fetch(urlString, {
					method: method,
					credentials: 'include',
					headers: {
						'Authorization': auth
					},
					body: formData
				})

				return resp.json();
			}
			else if (method == 'put') {
				let parameters = params;
				if (typeof parameters === 'string') {
					parameters = JSON.parse(parameters)
				}
				let auth = 'Bearer ' + this.token;
				const resp = await fetch(urlString, {
					method: method,
					credentials: 'include',
					headers: new Headers({
						'Authorization': auth,
						'Content-type': 'application/json'
					}),
					body: JSON.stringify(parameters)
				})

				return resp.json();
			}
			else if (method == 'delete') {
				let auth = 'Bearer ' + this.token;
				const resp = await fetch(urlString, {
					method: method,
					credentials: 'include',
					headers: new Headers({
						'Authorization': auth,
					}),

				})

				return resp.json();
			}
			else {
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