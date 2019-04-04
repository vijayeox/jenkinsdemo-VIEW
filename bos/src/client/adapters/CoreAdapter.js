import { ServiceProvider } from '@osjs/common';

export class CoreAdapter extends ServiceProvider {

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