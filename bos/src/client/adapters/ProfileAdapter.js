import { ServiceProvider } from '@osjs/common';
import LocalStorageAdapter from './localStorageAdapter.js';

export class ProfileServiceProvider extends ServiceProvider {

	constructor(core, options = {}) {
		super(core, options || {});
		this.core = core;
		this.lsHelper = new LocalStorageAdapter;
	}

	providers() {
		return [
			'oxzion/profile'
		];
	}

	init() {
		this.core.instance('oxzion/profile', () => ({
			get: () => this.get(),
			set: () => this.set(),
			update: () => this.update(),
			getAuth:() => this.getAuth()
		}));
	}
	get() {
        if(this.lsHelper.supported() || this.lsHelper.cookieEnabled()){
			if(!this.lsHelper.get("UserInfo")) {
				this.set();
			}
			let userInfo = this.lsHelper.get("UserInfo");
			if(this.lsHelper.get("Metadata")){
				userInfo['metadata'] = this.lsHelper.get("Metadata").key;
			}
			return userInfo;
		}
	}
	set() {
        if(this.lsHelper.supported() || lsHelper.cookieEnabled()){
			if(!this.lsHelper.get("UserInfo")){
				this.getProfile();
				this.getMetadata();
			}
		}
	}
	update(){
		if(this.lsHelper.supported() || lsHelper.cookieEnabled()){
			if(this.lsHelper.get("UserInfo")){
				this.lsHelper.purge("UserInfo");
				this.lsHelper.purge("Metadata");
				const settings = this.core.make('osjs/settings');
				settings.clear("UserInfo");
			}
		}
		this.set();
		this.core.emit("oxzion/profile:updated");
	}
	getProfile(){
        if(this.lsHelper.supported() || lsHelper.cookieEnabled()) {
			let helper = this.core.make("oxzion/restClient");
			let profileInformation = JSON.parse(helper.profile());
			this.lsHelper.set("UserInfo", profileInformation["data"]);
			const data = this.lsHelper.get("UserInfo");
			const settings = this.core.make('osjs/settings');
			settings.set("UserInfo", "key", data.key);
		    settings.set("UserInfo", "timestamp", data.timestamp);
		}
	}
	async getMetadata() {
		let metadata = await this.core.request(this.core.config("packages.manifest"), {}, "json");
		this.lsHelper.set('Metadata', metadata.map(iter => ({type: 'application', ...iter})));
	}
	getAuth(){
		if(this.lsHelper.supported() || lsHelper.cookieEnabled()){
			if(this.lsHelper.get("AUTH_token")){
				return this.lsHelper.get("AUTH_token");
			}
		}
	}
}
