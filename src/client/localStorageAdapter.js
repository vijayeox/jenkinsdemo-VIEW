
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
			console.log(this.localStorageExists);
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
					if(value === null) {
						try {
							window.localStorage.setItem(key,data);
							console.log('local storage set');
							return true;
						}
						catch (e) {}
					}
					else {
						console.log('localStorage key already in use');
					}
				}
				catch (e) {}
		}
		else if(this.useCookies) {
			console.log('cookie used');
			var cookies = document.cookie;
			var token =  key + ':' + data + ';';
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
						return data;
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
}
