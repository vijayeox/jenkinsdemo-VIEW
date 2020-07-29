const isStorageSupported = storageName => {
	if (storageName in window && window[storageName] && window[storageName].setItem)
	{
		const
	      s = window[storageName],
	      key = 'testLocalStorage_' + window.Math.random();

	    try
	    {
	      s.setItem(key, key);
	      if (key === s.getItem(key))
	      {
	        s.removeItem(key);
	        return true;
	      }
	    }
	    catch (e) {} // eslint-disable-line no-empty
    }

   return false;
};

export default class LocalStorageAdapter {
	
	constructor(){
		this.localStorageExists = false;
		this.useCookies = true;
	}

	// check for local storage option in browser
	supported() {
		const isSupported = isStorageSupported('localStorage');
		if(isSupported) {
			this.localStorageExists = true;
			return true;	
		}
		return false;		
	}

	cookieEnabled() {
		if(window.navigator && window.navigator.cookieEnabled) {
			this.useCookies = true;
			return true;
		}
		else {
			console.log('cookies disabled');
			return false;
		}
	}


	// key - string
	// data - *
	set(key,data) {
		if(this.localStorageExists) {
			try {
					const value = window.localStorage.getItem(key) || null;
						try {
							var obj = { key:data,timestamp: new Date().getTime()}
							window.localStorage.setItem(key,JSON.stringify(obj));
							console.log('local storage set');
							return true;
						}
						catch (e) {
							console.log(e);
						}
				}
				catch (e) {
					console.log(e)
				}
		}
		else if(this.useCookies) {
			console.log('cookie used');
			var cookies = document.cookie;
			var now = new Date();
			now.setTime(now.getTime() + 3 * 3600 * 1000);
			var token =  key + ':' + data + 'expires='+ now.toUTCString() + ';';
			cookies += token;
			document.cookie = cookies;
			return true;
		}
		console.log('storage adapter failed.')
		return false;
	}

	get(key) {
		if(this.localStorageExists) {
			try {
					if(key != null) {
						const data = window.localStorage.getItem(key);
						return JSON.parse(data);
					}
					else
						return null;
				}
				catch (e) {}
		}
		else if(this.useCookies) {
			var cookiestring = document.cookie;
			var cookies = cookiestring.split(';');
			for( var i =0 ;i<cookies.length;i++) {
				var values = cookies[i].split(':');
				if(values[0] == (key)){
					return values[1];
				}
			}
		}
		return null;
	}
	
	purge(key) {
		if(this.localStorageExists) {
			try {
				if(key != null) {
					window.localStorage.removeItem(key);
					console.log('token removed');
				}
				else {
					console.log('invalid operation');
				}
			}
			catch (e) {}
		}
		else if(this.cookieEnabled) {
			try {
				document.cookie = "";
			}
			catch (e) {}
		}
		else {
			console.log('invalid operation');
		}
	}
}
