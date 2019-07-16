import { ServiceProvider } from '@osjs/common';
import LocalStorageAdapter from './localStorageAdapter.js';

export class BosAdapter extends ServiceProvider {

	constructor(core, options = {}) {
		super(core, options || {});
		this.core = core;
        this.metadata = [];
	}


	providers() {
		return [
			'oxzion/core'
		];
	}

	async init() {
		this.core.on('osjs/core:started', () => {
            var queryString = window.location.search.substr(1);
            console.log(queryString);   
            if (queryString) {

                var queryObj = queryString.split("&").reduce(function(prev, curr, i, arr) {
                    var p = curr.split("=");
                    prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
                    return prev;
                }, {});

                this.core.request(this.core.config('packages.manifest'), {}, 'json')
                .then(metadata => {
                    this.addPackages(metadata);
                    this.launch(queryObj);
                })
                .catch(error => console.error(error));

            }
        });
        this.core.on('osjs/core:booted', () => {
            var queryString = window.location.search.substr(1);
            if (queryString) {
                var queryObj = queryString.split("&").reduce(function(prev, curr, i, arr) {
                    var p = curr.split(":");
                    prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
                    return prev;
                }, {}); 
                var url = window.location.href;
                var arr = url.split("/");
                var result = arr[0] + "//" + arr[2];
                console.log(result);
                if(queryObj){
                    let formData = new FormData();
                    formData.append('uname', queryObj.uname);
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', this.core.config('wrapper.url') + 'sso', false);
                    xhr.onload = function () {
                        let data = JSON.parse(this.responseText);
                                    console.log(data);
                        if (data["status"] == "success") {
                                var lsHelper = new LocalStorageAdapter;
                                if((lsHelper.supported() || lsHelper.cookieEnabled()) && data['data']['jwt'] != null){
                                  lsHelper.set('AUTH_token',data['data']["jwt"]);
                                  lsHelper.set('REFRESH_token',data['data']["refresh_token"]);
                                  lsHelper.set('User',data['data']['username']);
                                  let user = {jwt:data['data']["jwt"],refresh_token:data['data']['refresh_token'], username : data['data']['username']};
                                  // this.core.setUser(user);
                                  window.location = result;
                              } else {
                                window.location = result;
                              }
                        } else {
                            window.location = result;
                        }
                    }
                    xhr.send(formData);
                }
            }
        });

        this.core.on('osjs/core:started', () => {
            var myDate = new Date();
            var hrs = myDate.getHours();
            var greet;
            if (hrs < 12)
                greet = 'Good Morning';
            else if (hrs >= 12 && hrs <= 17)
                greet = 'Good Afternoon';
            else if (hrs >= 17 && hrs <= 24)
                greet = 'Good Evening';
            // console.log(this.core.make('oxzion/profile').get().UserInfo);
            var userDetails = this.core.make('oxzion/profile').get();
            this.core.make('osjs/notification', {  message: 'Hello and '+greet+this.core.make('oxzion/profile').get().userDetails['key']['firstname']+'!'})});
	}

    addPackages(list) {
        if (list instanceof Array) {
            const append = list
            .map(iter => Object.assign({
                type: 'application'
            }, iter));
            this.metadata = [...this.metadata, ...append];
        }
    }

    launch(app) {
        var found = this.metadata.find(pkg => pkg.name === app.app);
        if (found != undefined)
            this.core.make('osjs/packages').launch(app.app, ((app.args) ? app.args : {}), ((app.options) ? app.options : {}));
    }

}