import { ServiceProvider } from '@osjs/common';
import LocalStorageAdapter from './localStorageAdapter.js';

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
			request: (version, action, params, method,headers,raw) => this.makeRequest(version, action, params, method,headers,raw),
			authenticate: (params) => this.authenticate(params),
			profile:() => this.profile(),
			handleRefresh:() => this.handleRefresh(),
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
	
	handleRefresh() {
		let user = this.core.getUser();
		let core = this.core;
		let refreshflag = false;
		var lsHelper = new LocalStorageAdapter;
		// console.log(user);
		lsHelper.supported();
		if(user["jwt"] != null) {
			// console.log('refresh token to be called now...');
			const rtoken = lsHelper.get('REFRESH_token');
			// console.log(rtoken);
			let jwt = user["jwt"];
            let formData = new FormData();
            formData.append('jwt', jwt);
            formData.append('refresh_token',rtoken["key"])
            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:8080/refreshtoken', false);
            xhr.onload = function () {
              let data = JSON.parse(this.responseText);
              if(data["status"] == "success") {
                  // console.log('refresh api called and token reset');
                  jwt = data["data"]["jwt"];
                  let refresh = data["data"]["refresh_token"];

                  // console.log("user before update");
                  // console.log(user);
                  user["jwt"] = jwt;
                  // console.log(user);
                  core.setUser(user)
                  lsHelper.set('AUTH_token',jwt);
                  lsHelper.set('REFRESH_token',refresh);
                  // console.log('true return now');
                  refreshflag = true;
              } else {
					alert('Session Expired. Redirecting to Login');
					this.core.make('osjs/auth').logout();
				}  
            }
            xhr.send(formData);  

		} else {
			alert('Session Expired. Redirecting to Login');
			this.core.make('osjs/auth').logout();
		}
		return refreshflag;
	}

	// handles all request to OXZion apps
	// version - string
	// action - string
	// params - *
	// method - string
	async makeRequest(version, action, params, method,headers = null,raw = false) {
		let userData = this.core.getUser();
		if (action.charAt(0) == '/')
			action = action.substr(1);
		let urlString = this.baseUrl + action;
		console.log(urlString);
		this.token = userData["jwt"];
		let resp = 'null';
		if(headers != null) {

		}
		try {

			if (method == 'get') {
				let auth = 'Bearer ' + this.token;
				resp = await fetch(urlString, {
					method: method,
					credentials: 'include',
					headers: {
						'Authorization': auth,
						'Content-Type': 'application/json'
					}

				})
				
				if(resp.status == 400 && resp.statusText == 'Bad Request') {
					// fall through to refresh handling
				} else {
					if(raw == true) {
						return resp;
					}
					return resp.json();	
				}
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
				resp = await fetch(urlString, {
					method: method,
					credentials: 'include',
					headers: {
						'Authorization': auth
					},
					body: formData
				})

				if(resp.status == 400 && resp.statusText == 'Bad Request') {
					// fall through to refresh handling
				} else {
					return resp.json();	
				}
			}
			else if (method == 'put') {
				let parameters = params;
				if (typeof parameters === 'string') {
					parameters = JSON.parse(parameters)
				}
				let auth = 'Bearer ' + this.token;
				resp = await fetch(urlString, {
					method: method,
					credentials: 'include',
					headers: new Headers({
						'Authorization': auth,
						'Content-type': 'application/json'
					}),
					body: JSON.stringify(parameters)
				})

				if(resp.status == 400 && resp.statusText == 'Bad Request') {
					// fall through to refresh handling
				} else {
					return resp.json();	
				}
			}
			else if (method == 'delete') {
				let auth = 'Bearer ' + this.token;
				resp = await fetch(urlString, {
					method: method,
					credentials: 'include',
					headers: new Headers({
						'Authorization': auth,
					}),

				})

				if(resp.status == 400 && resp.statusText == 'Bad Request') {
					// fall through to refresh handling
				} else {
					return resp.json();	
				}
			}
			else {
				console.log('Unsupported method.');
			}
			// handling refresh
			// console.log(resp);
			let fooRes = 'Something went wrong...';
			try {
				let refresh = this;
				let foo = async function() {
					let res1 = await resp.json().then(function(res) {
						// console.log(res);
						if(res["status"] == "error" && res["message"] == "Token Invalid.") {
							// console.log("error worked");
							if(refresh.handleRefresh()) {
								// console.log("refresh worked!");
								return new Promise((resolve, reject) => {
									refresh.makeRequest(version, action, params, method,headers,raw)
									.then((res) => resolve(res))
									.catch((res) => reject(res));
									
								});
							} else {
								console.log("refresh failed..");
								alert('Session Expired. Redirecting to Login');
								this.core.make('osjs/auth').logout();
							}
						} else {
							// error not expired token
							return res;
						}
					});
					// console.log(res1);
					return res1;
				}
				fooRes = await foo();

				
			} 
			catch(e) {
				return null;
			}
			// console.log('refresh comes here....?');
			return fooRes;
		}
		catch (e) {
			return Promise.reject(e);
		}
	}

}